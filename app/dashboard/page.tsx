"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { authApi, chatApi, modesApi, userApi } from "@/lib/api/client";
import { ModeSelector } from "@/components/ModeSelector";
import { ConversationSidebar } from "@/components/ConversationSidebar";
import { ChatInput } from "@/components/ChatInput";
import { MessageBubble } from "@/components/MessageBubble";
import { VoiceToggle } from "@/components/VoiceToggle";
import { getDepthGradient } from "@/lib/utils/depthColors";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  mode: string;
  created_at: Date;
  updated_at: Date;
  message_count: number;
}

interface AI_MODE {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  system_prompt: string;
  is_default?: boolean;
}

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentMode, setCurrentMode] = useState<AI_MODE | null>(null);
  const [availableModes, setAvailableModes] = useState<AI_MODE[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [currentDepth, setCurrentDepth] = useState(0.0);
  const [depthEnabled, setDepthEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadAvailableModes();
      loadConversations();
      // Close sidebar by default on mobile
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  }, [user, isLoading, router]);

  const loadAvailableModes = async () => {
    try {
      const modes = await modesApi.getModes();
      setAvailableModes(modes);
      const defaultMode = modes.find((mode: AI_MODE) => mode.is_default);
      if (defaultMode) {
        setCurrentMode(defaultMode);
      }
    } catch (error) {
      console.error("Failed to load modes:", error);
    }
  };

  const loadConversations = async () => {
    try {
      const convs = await chatApi.getConversations();
      setConversations(convs);
      
      // Load the most recent conversation if no conversation is selected
      if (convs.length > 0 && !currentConversationId) {
        loadConversation(convs[0].id);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const conversationData = await chatApi.getConversation(conversationId);
      setMessages(conversationData.messages || []);
      setCurrentConversationId(conversationId);
      setCurrentDepth(conversationData.current_depth || 0.0);
      setDepthEnabled(conversationData.depth_enabled || false);
      // Close sidebar on mobile after selecting conversation
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversation = await chatApi.createConversation({
        title: "New Chat",
        mode: currentMode?.id || "personal_friend",
      });
      
      setConversations([newConversation, ...conversations]);
      loadConversation(newConversation.id);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await chatApi.deleteConversation(conversationId);
      
      setConversations(conversations.filter(conv => conv.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
        setCurrentDepth(0.0);
        setDepthEnabled(false);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentMode) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSendingMessage(true);

    try {
      // For streaming, we'll use a simplified version for now
      const response = await chatApi.sendMessage(
        currentMode.id,
        content,
        currentConversationId || undefined
      );

      if (response.response) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: response.response,
          role: "assistant",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        setCurrentDepth(response.current_depth || 0.0);

        // Update conversation in list
        if (response.conversation) {
          setConversations(prev => 
            prev.map(conv => 
              conv.id === response.conversation.id 
                ? { ...conv, ...response.conversation }
                : conv
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const bgGradient = getDepthGradient(currentDepth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-[#2d1b4e]/80 backdrop-blur-md border-b border-[#7B3FF2]/30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-white">EPI Brain</h1>
            </div>
            <div className="flex items-center gap-2">
              <VoiceToggle />
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#7B3FF2] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-72px)] relative">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <ConversationSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          onNewConversation={createNewConversation}
          onDeleteConversation={deleteConversation}
        />

        {/* Main Content - Full width on mobile */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto px-4 py-6 transition-all duration-1000"
            style={{
              background: bgGradient,
              minHeight: '400px'
            }}
          >
            {isLoadingMessages ? (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading conversation...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-white">
                <h2 className="text-2xl font-semibold mb-4">Welcome to EPI Brain</h2>
                <p className="text-lg opacity-80">
                  {currentMode ? `Chat with ${currentMode.name}` : "Select a mode to start chatting"}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <MessageBubble
                    key={`${message.id}-${index}`}
                    message={message}
                    isUser={message.role === "user"}
                    currentDepth={currentDepth}
                  />
                ))}
                {streamingMessage && (
                  <MessageBubble
                    message={{
                      id: "streaming",
                      content: streamingMessage,
                      role: "assistant",
                      timestamp: new Date(),
                    }}
                    isUser={false}
                    currentDepth={currentDepth}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="bg-[#2d1b4e]/80 backdrop-blur-md border-t border-[#7B3FF2]/30 px-4 py-4">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSendMessage={sendMessage}
                isLoading={isSendingMessage}
                placeholder={
                  currentMode
                    ? `Message ${currentMode.name}...`
                    : "Select a mode to start chatting..."
                }
                disabled={!currentMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}