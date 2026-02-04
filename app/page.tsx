'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import NeuronParticles from '@/components/NeuronParticles';
import VaultView from '@/components/VaultView';
import { Paperclip, Search, BookOpen, Mic } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { PanelLeft } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDiscoveryMode, setIsDiscoveryMode] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        await apiRequest('/users/me', { method: 'GET' });
        if (active) {
          setIsLoggedIn(true);
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
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />
      {isSidebarOpen && (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#120a24]/95 border-r border-white/10 z-30 backdrop-blur-xl shadow-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-white text-sm font-semibold">Recent Chats</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white/70 hover:text-white text-xs"
              aria-label="Close recent chats"
            >
              Close
            </button>
          </div>
          <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-56px)]">
            {recentChats.length === 0 && (
              <div className="text-white/60 text-sm">No recent chats.</div>
            )}
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setCurrentConversationId(chat.id);
                  localStorage.setItem('conversation_id', chat.id);
                  fetchConversation(chat.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border border-white/5 hover:border-[#7B3FF2]/60 hover:bg-white/5 transition-colors text-sm text-white truncate ${
                  currentConversationId === chat.id ? 'border-[#7B3FF2]/80 bg-[#7B3FF2]/10' : ''
                }`}
              >
                {chat.title || 'Untitled conversation'}
              </button>
            ))}
          </div>
        </aside>
      )}
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
      
      <main className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-4 flex justify-end items-center">
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
          className="container mx-auto px-6 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-90px)]"
          aria-labelledby="hero-heading"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle recent chats"
              className="p-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
            >
              <PanelLeft className="w-5 h-5 text-white" />
            </button>
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo"
              className="w-[210px] h-[210px] object-contain"
              width="210"
              height="210"
            />
          </div>

          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            EPI Brain
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-16">
            <span className="font-semibold">Voice + Emotional Intelligence.</span> Ask anything.
          </p>

          <div className="w-full max-w-[52rem] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-5 py-5">
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
  );
}
