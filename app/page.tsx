'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import NeuronParticles from '@/components/NeuronParticles';
import HomepageSidebar from '@/components/HomepageSidebar';
import { useGlobalSidebar } from '@/components/GlobalSidebarProvider';
import VaultView from '@/components/VaultView';
import { Paperclip, Search, BookOpen, Mic } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { isCollapsed, toggleCollapse } = useGlobalSidebar();
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [recentChats, setRecentChats] = useState<Array<{ id: string; title?: string }>>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Array<{ id?: string; role?: string; content?: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    let active = true;

    const verifyLogin = async () => {
      try {
        const userProfile = await apiRequest<{ name?: string; first_name?: string; email?: string }>('/users/me', { method: 'GET' });
        if (active) {
          setIsLoggedIn(true);
          // Extract user's first name or full name
          const displayName = userProfile.first_name || userProfile.name || userProfile.email || 'User';
          setUserName(displayName);
          fetchRecentChats();
          const storedConversationId = localStorage.getItem('conversation_id');
          if (storedConversationId) {
            setCurrentConversationId(storedConversationId);
            fetchConversation(storedConversationId);
          }
        }
      } catch (error) {
        if (active) {
          setIsLoggedIn(false);
          setUserName(null);
        }
      }
    };

    verifyLogin();

    return () => {
      active = false;
    };
  }, []);

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const handleVoice = async () => {
    if (!inputValue.trim()) {
      showToast('Enter a message to synthesize.', 'error');
      return;
    }

    setIsSynthesizing(true);
    try {
      await apiRequest('/voice/synthesize', {
        method: 'POST',
        body: JSON.stringify({ text: inputValue.trim() }),
      });
      showToast('Voice synthesis requested.', 'success');
    } catch (error: any) {
      showToast(error?.message || 'Voice synthesis failed.', 'error');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Preparing file upload:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', 'default');
    if (inputValue.trim()) {
      formData.append('message', inputValue.trim());
    }

    console.log('Multipart form ready for POST /chat/message (send when ready):', formData);
    event.target.value = '';
    showToast('File ready for upload. Submit the conversation to send it.', 'success');
  };

  const handleDiscoveryToggle = () => {
    setIsDiscoveryMode((prev) => {
      const next = !prev;
      showToast(next ? 'Discovery mode enabled' : 'Discovery mode disabled', 'success');
      return next;
    });
  };

  const handleSearch = () => {
    handleDiscoveryToggle();
  };

  const handleStudy = () => {
    setIsVaultOpen(true);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    setIsSending(true);

    const endpoint = isDiscoveryMode ? '/chat/search' : '/chat/message';
    const payload: Record<string, string | boolean> = {
      mode: isDiscoveryMode ? 'discovery' : 'default',
      message: inputValue.trim(),
      is_homepage_session: true,
    };
    if (currentConversationId) {
      payload.conversation_id = currentConversationId;
    }

    try {
      const response = await apiRequest<{
        conversation_id?: string;
        conversationId?: string;
        messages?: Array<{ id?: string; role?: string; content?: string }>;
      }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const conversationId = response.conversation_id || response.conversationId;
      if (conversationId) {
        localStorage.setItem('conversation_id', conversationId);
        setCurrentConversationId(conversationId);
      }
      if (response.messages) {
        setConversationMessages(response.messages);
      }
      showToast(isDiscoveryMode ? 'Discovery search sent.' : 'Message sent.', 'success');
      setInputValue('');
      fetchRecentChats();
    } catch (error: any) {
      showToast(error?.message || 'Failed to send message.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const fetchRecentChats = async () => {
    try {
      const data = await apiRequest<Array<{ id: string; title?: string }>>('/chat/conversations', {
        method: 'GET',
      });
      setRecentChats(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load recent chats', error);
    }
  };

  const fetchConversation = async (conversationId: string) => {
    try {
      const data = await apiRequest<{ messages?: Array<{ id?: string; role?: string; content?: string }> }>(
        `/chat/conversations/${conversationId}`,
        { method: 'GET' }
      );
      if (data.messages) {
        setConversationMessages(data.messages);
      } else {
        setConversationMessages([]);
      }
    } catch (error) {
      console.error('Failed to load conversation', error);
      setConversationMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      {/* Global Slim Rail Sidebar */}
      <HomepageSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        recentChats={recentChats}
        onSelectChat={(chatId) => {
          setCurrentConversationId(chatId);
          localStorage.setItem('conversation_id', chatId);
          fetchConversation(chatId);
        }}
        onNewChat={() => {
          setCurrentConversationId(null);
          setConversationMessages([]);
          setInputValue('');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NeuronParticles />
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 max-w-md rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-green-500/90 border-green-400 text-white'
                : 'bg-red-500/90 border-red-400 text-white'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        )}
        
        <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="container mx-auto px-6 py-4 flex justify-between items-center z-20 relative">
          {isLoggedIn && userName && (
            <div className="flex items-center gap-3">
              {/* Glowing green dot indicator */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              </div>
              <span className="text-sm font-medium text-white/90">
                Welcome back, <span className="text-[#A78BFA] font-semibold">{userName}</span>
              </span>
            </div>
          )}
          {!isLoggedIn && (
            <div className="text-sm font-medium text-white/70">
              Guest Mode
            </div>
          )}
          
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 text-white text-sm font-medium hover:text-purple-300 transition-colors"
                aria-label="Go to dashboard"
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-6 py-2.5 text-white text-sm font-medium hover:text-purple-300 transition-colors"
                aria-label="Log in to your account"
              >
                Log in
              </button>
            )}
            <button
              onClick={handleSignUp}
              className="px-6 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Sign up for free"
            >
              Sign up for free
            </button>
          </nav>
        </header>

        <section
          className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto"
          aria-labelledby="hero-heading"
        >
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex items-center justify-center">
              <img
                src="/assets/brain-logo-landing.png"
                alt="EPI Brain Logo"
                className="w-[180px] h-[180px] object-contain"
                width="180"
                height="180"
              />
            </div>

            <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-2 text-center">
              EPI Brain
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 text-center">
              <span className="font-semibold">Voice + Emotional Intelligence.</span> Ask anything.
            </p>

            <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-5 py-5">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSending) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything"
                className="flex-1 px-4 py-3 text-gray-900 text-lg bg-transparent border-none outline-none placeholder:text-gray-500"
              />
              <button
                onClick={handleVoice}
                disabled={isSynthesizing}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Use voice input"
              >
                <Mic className="w-5 h-5" />
                <span>{isSynthesizing ? 'Working...' : 'Voice'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
              <button
                onClick={handleAttach}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-purple-600 rounded-lg transition-colors"
                aria-label="Attach files"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-sm font-medium">Attach</span>
              </button>
              <button
                onClick={handleSearch}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDiscoveryMode
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'text-gray-600 hover:text-white hover:bg-purple-600'
                }`}
                aria-pressed={isDiscoveryMode}
                aria-label="Toggle Discovery Mode"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isDiscoveryMode ? 'Discovery On' : 'Discovery Mode'}
                </span>
              </button>
              <button
                onClick={handleStudy}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-purple-600 rounded-lg transition-colors"
                aria-label="Study mode"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Study</span>
              </button>
            </div>

            {conversationMessages.length > 0 && (
              <div className="mt-4 text-left max-h-64 overflow-y-auto border border-gray-200/70 rounded-lg p-3 bg-white/60">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Conversation</div>
                <div className="space-y-2">
                  {conversationMessages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`p-2 rounded-lg text-sm ${msg.role === 'assistant' ? 'bg-purple-50 text-gray-900' : 'bg-gray-100 text-gray-800'}`}
                    >
                      <span className="font-semibold mr-2 text-xs uppercase text-gray-500">{msg.role || 'user'}</span>
                      <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelected} />

            <div className="flex flex-col items-center justify-center gap-1 mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span>By messaging EPI Brain, you agree to our</span>
                <a href="/legal#tos" className="underline hover:text-gray-900">
                  Terms
                </a>
                <span>and have read our</span>
                <a href="/legal#privacy" className="underline hover:text-gray-900">
                  Privacy Policy
                </a>
              </div>
              <div className="text-xs text-gray-600">
                <a href="/use-cases" className="underline hover:text-gray-900">
                  Learn more about EPI Brain HERE!
                </a>
              </div>
            </div>
            </div>
            </div>
        </section>

        {isVaultOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="w-full max-w-4xl rounded-2xl bg-white/95 p-6 shadow-2xl relative">
              <button
                onClick={() => setIsVaultOpen(false)}
                className="absolute top-4 right-4 text-sm text-gray-600 hover:text-gray-900"
                aria-label="Close vault modal"
              >
                Close
              </button>
              <VaultView isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
            </div>
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
