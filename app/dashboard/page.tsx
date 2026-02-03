"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ConversationSidebar from "@/components/ConversationSidebar";
import ModeSelector from "@/components/ModeSelector";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import VoiceToggle from "@/components/VoiceToggle";
import VoiceErrorToast from "@/components/VoiceErrorToast";
import { authApi, chatApi, modesApi, userApi } from "@/lib/api/client";
import { VoiceManager } from "@/lib/voice/VoiceManager";
import { Message, Conversation, ClarityMetrics } from "@/types";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<string>("personal_friend");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState<string>("female");
  const [voiceStats, setVoiceStats] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentDepth, setCurrentDepth] = useState<number>(0);
  const [depthEnabled, setDepthEnabled] = useState<boolean>(true);
  const voiceManagerRef = useRef<VoiceManager | null>(null);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [siloName, setSiloName] = useState<string>("EPI Brain");
  const [currentPhase, setCurrentPhase] = useState<"discovery" | "strategy" | "action" | null>(null);
  const [clarityMetrics, setClarityMetrics] = useState<ClarityMetrics | null>(null);
  const [capturedIntentUsed, setCapturedIntentUsed] = useState(false);

  // Calculate background gradient based on depth
  const getDepthGradient = (depth: number) => {
    const lightPurple = { r: 167, g: 139, b: 250 }; // #A78BFA
    const darkPurple = { r: 107, g: 70, b: 193 }; // #6B46C1
    const ratio = Math.min(Math.max(depth, 0), 1);
    const r = Math.round(lightPurple.r + (darkPurple.r - lightPurple.r) * ratio);
    const g = Math.round(lightPurple.g + (darkPurple.g - lightPurple.g) * ratio);
    const b = Math.round(lightPurple.b + (darkPurple.b - lightPurple.b) * ratio);
    return `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, rgb(${r - 20}, ${g - 20}, ${b - 20}) 100%)`;
  };

  useEffect(() => {
    // Check authentication and load user data
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    // Fetch user profile with phase and clarity metrics
    const loadUserProfile = async () => {
      try {
        const profile = await userApi.getProfileWithMetrics();
        console.log("User profile loaded:", profile);
        
        if (profile) {
          setUser(profile);
          
          // Set phase from profile
          if (profile.current_phase) {
            setCurrentPhase(profile.current_phase);
            console.log("Current phase:", profile.current_phase);
          }
          
          // Set clarity metrics from profile
          if (profile.clarity_metrics) {
            setClarityMetrics(profile.clarity_metrics);
            console.log("Clarity metrics:", profile.clarity_metrics);
          }
          
          // Store user data in localStorage for quick access
          localStorage.setItem("user_data", JSON.stringify(profile));
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();

    // Load silo context from localStorage
    const savedSiloName = localStorage.getItem("epi_silo_name");
    if (savedSiloName) {
      setSiloName(savedSiloName);
    }

    // Check for captured intent from discovery session (context continuity)
    const capturedIntent = localStorage.getItem("captured_intent");
    
    // Check for discovery data from homepage (for backwards compatibility)
    const discoveryData = localStorage.getItem("discovery_data");
    const tempName = localStorage.getItem("epi_temp_name");
    const tempIntent = localStorage.getItem("epi_temp_intent");
    
    if (!capturedIntentUsed && (capturedIntent || tempIntent || discoveryData)) {
      try {
        let name = tempName;
        let intent = tempIntent || capturedIntent;
        
        // Fallback to discovery_data if new format not available
        if (!intent && discoveryData) {
          const data = JSON.parse(discoveryData);
          name = name || data.name;
          intent = intent || data.intent;
        }
        
        console.log("Context continuity - using captured intent:", { name, intent });
        
        if (name || intent) {
          // Prime the first authenticated message with captured intent
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content: `Welcome back${name ? `, ${name}` : ''}! I remember you were interested in ${intent || 'exploring EPI'}. Let's continue from where we left off!`,
              timestamp: new Date().toISOString(),
            }
          ]);
          setCapturedIntentUsed(true);
        }
        
        // Clear the discovery data after using it
        localStorage.removeItem("discovery_data");
        localStorage.removeItem("captured_intent");
        localStorage.removeItem("epi_temp_name");
        localStorage.removeItem("epi_temp_intent");
      } catch (e) {
        console.error("Error processing captured intent:", e);
      }
    }

    setIsLoading(false);

    // Load conversations
    loadConversations();

    // Initialize voice manager
    if (!voiceManagerRef.current) {
      voiceManagerRef.current = new VoiceManager();
      setIsVoiceAvailable(true);
    }

    // Load voice stats
    loadVoiceStats();
  }, [router]);

  useEffect(() => {
    if (currentConversationId) {
      loadConversation(currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    if (currentMode) {
      loadVoiceStats();
    }
  }, [currentMode]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      console.log("Loading conversations...");
      const response = await chatApi.getConversations();
      console.log("Conversations response:", response);
      
      // chatApi.getConversations() already returns response.data, which is the conversations array
      if (response && Array.isArray(response)) {
        console.log("Found conversations:", response.length);
        setConversations(response);
        
        // Load the most recent conversation if available
        if (response.length > 0) {
          const latest = response[0];
          console.log("Loading latest conversation:", latest.id);
          setCurrentConversationId(latest.id);
        }
      } else {
        console.log("No conversations found or invalid response structure");
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      console.log('Loading conversation:', conversationId);
      const response = await chatApi.getConversation(conversationId);
      console.log('Conversation response:', response);
      
      if (response) {
        setMessages(response.messages || []);
        if (response.depth) {
          setCurrentDepth(response.depth);
        }
        // Set the mode from the conversation
        if (response.mode) {
          setCurrentMode(response.mode);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const loadVoiceStats = async () => {
    try {
      const response = await authApi.getVoiceStats();
      console.log("Voice stats loaded:", response.data);
      setVoiceStats(response.data);
    } catch (error: any) {
      console.error("Error loading voice stats:", error);
      console.error("Voice stats error details:", error.response?.data || error.message);
      
      // Set default stats if API fails
      const userTier = user?.tier || "free";
      const isUnlimited = userTier === "pro" || userTier === "enterprise";
      
      setVoiceStats({
        tier: userTier,
        daily_usage: 0,
        daily_limit: isUnlimited ? 999999 : 10,
        remaining: isUnlimited ? "unlimited" : 10,
        total_usage: 0,
        voice_model: "eleven_multilingual_v2",
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      depth: currentDepth,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAiThinking(true); // Start brain animation

    try {
      console.log("Sending message:", { mode: currentMode, message: content, conversationId: currentConversationId });
      
      // Add a minimum 1-second delay to ensure animation is visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await chatApi.sendMessage(currentMode, content, currentConversationId || undefined);
      
      console.log("Received response:", response);

      const aiMessage: Message = {
        id: response.message_id || Date.now().toString(),
        role: "assistant",
        content: response.content || response.response || "",
        timestamp: response.created_at || new Date().toISOString(),
        depth: response.depth || currentDepth,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsAiThinking(false); // Stop brain animation

      // Update conversation ID if this is a new conversation
      if (response.conversation_id && response.conversation_id !== currentConversationId) {
        setCurrentConversationId(response.conversation_id);
        // Reload conversations to update the list
        loadConversations();
      }

      // Update depth if provided
      if (response.depth !== undefined) {
        setCurrentDepth(response.depth);
      }

      // Trigger TTS if voice is enabled
      if (isVoiceEnabled && aiMessage.content) {
        console.log("🎤 Voice: Triggering TTS for AI response");
        console.log("🎤 Voice: Using voice model:", voiceManagerRef.current?.getVoiceModel(currentMode, selectedVoiceGender));
        console.log("🎤 Voice: Speaking content:", aiMessage.content.substring(0, 50) + "...");
        
        try {
          await voiceManagerRef.current?.speak(
            aiMessage.content,
            currentMode,
            selectedVoiceGender
          );
          setVoiceError(null); // Clear any previous errors
        } catch (error: any) {
          console.error("Voice error:", error);
          setVoiceError(error?.message || "Failed to generate voice. Please try again.");
        }
      }

    } catch (error: any) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.response?.data || error.message);
      console.error("Error code:", error.code);
      console.error("Error name:", error.name);
      
      let errorDetails = "Unknown error";
      
      if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        errorDetails = "Network connection failed. Please check your internet connection and try again.";
      } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorDetails = "Request timed out. The server took too long to respond.";
      } else if (error.response?.status === 401) {
        errorDetails = "Authentication failed. Please log in again.";
      } else if (error.response?.status === 403) {
        errorDetails = "Access denied. You don't have permission for this action.";
      } else if (error.response?.status === 500) {
        errorDetails = "Server error. Please try again in a moment.";
      } else if (error.response?.data?.detail) {
        errorDetails = error.response.data.detail;
      } else if (error.message) {
        errorDetails = error.message;
      }
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${errorDetails}`,
        timestamp: new Date().toISOString(),
        depth: currentDepth,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsAiThinking(false); // Stop brain animation on error
    }
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setCurrentDepth(0);
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await chatApi.deleteConversation(conversationId);
      
      // Update local state
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      
      // If we deleted the current conversation, clear messages
      if (conversationId === currentConversationId) {
        setCurrentConversationId(null);
        setMessages([]);
        setCurrentDepth(0);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    console.log(`🔊 Enabling voice for mode: ${mode}`);
    setIsVoiceEnabled(false); // Reset voice when changing mode
  };

  const handleVoiceToggle = async (enabled: boolean) => {
    console.log(`🔊 Voice toggle changed: ${enabled}`);
    setIsVoiceEnabled(enabled);
    
    if (enabled) {
      console.log(`🔊 Getting voice stats...`);
      await loadVoiceStats();
    }
  };

  const handleVoiceGenderChange = (gender: string) => {
    setSelectedVoiceGender(gender);
    if (voiceManagerRef.current) {
      voiceManagerRef.current.setGender(gender);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <VoiceErrorToast error={voiceError} onClose={() => setVoiceError(null)} />
      
      <div
        className="flex h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e]"
        style={{
          background: depthEnabled ? getDepthGradient(currentDepth) : undefined,
          transition: "background 1s ease-in-out",
        }}
      >
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoading={isAiThinking}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
          currentMode={currentMode}
          onModeChange={handleModeChange}
          isVoiceEnabled={isVoiceEnabled}
          onVoiceToggle={handleVoiceToggle}
          selectedVoiceGender={selectedVoiceGender}
          onVoiceGenderChange={handleVoiceGenderChange}
          voiceStats={voiceStats}
          isVoiceAvailable={isVoiceAvailable}
          siloName={siloName}
          currentPhase={currentPhase}
          clarityMetrics={clarityMetrics}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/60 py-20">
                <p className="text-lg">Start a conversation with your AI companion</p>
                <p className="text-sm mt-2">Select a mode and type a message below</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  currentDepth={currentDepth}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-[#7B3FF2]/20">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!currentMode}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
    </>
  );
}