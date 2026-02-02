'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Volume2, VolumeX } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DiscoveryChatProps {
  onComplete?: (data: { name?: string; intent?: string }) => void;
}

export default function DiscoveryChat({ onComplete }: DiscoveryChatProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm EPI, your AI companion. What's your name?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [signupBridgeTriggered, setSignupBridgeTriggered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [capturedData, setCapturedData] = useState<{ name?: string; intent?: string }>({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_EXCHANGES = 3;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  const handleSendMessage = async (userMessage: string) => {
    if (signupBridgeTriggered || isLoading) {
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    let nextCapturedData = { ...capturedData };

    const updateCapturedData = (updates: { name?: string; intent?: string }) => {
      nextCapturedData = { ...nextCapturedData, ...updates };
      setCapturedData(nextCapturedData);
    };

    const clearCapturedName = () => {
      localStorage.removeItem('epi_temp_name');
      const { name, ...rest } = nextCapturedData;
      nextCapturedData = rest;
      setCapturedData(nextCapturedData);
    };

    const persistDiscoveryData = () => {
      if (nextCapturedData.name || nextCapturedData.intent) {
        localStorage.setItem('discovery_data', JSON.stringify(nextCapturedData));
        if (onComplete) {
          onComplete(nextCapturedData);
        }
      }
    };

    try {
      const response = await apiClient.post('/chat/message', {
        mode: 'discovery',
        message: userMessage,
      });
      const responseData = response?.data ?? response;
      const metadata =
        responseData?.metadata ||
        responseData?.meta ||
        responseData?.response_metadata ||
        responseData?.data?.metadata ||
        {};

      const aiResponse =
        responseData?.content ||
        responseData?.response ||
        responseData?.message ||
        responseData?.reply ||
        '';

      const capturedName = metadata?.captured_name || responseData?.captured_name || metadata?.name;
      const capturedIntent = metadata?.captured_intent || responseData?.captured_intent || metadata?.intent;

      if (capturedName && typeof capturedName === 'string') {
        updateCapturedData({ name: capturedName });
        localStorage.setItem('epi_temp_name', capturedName);
      }

      if (capturedIntent && typeof capturedIntent === 'string') {
        updateCapturedData({ intent: capturedIntent });
        localStorage.setItem('epi_temp_intent', capturedIntent);
      }

      const nameCleared =
        metadata?.name_cleared ||
        metadata?.cleared_name ||
        metadata?.invalid_name_format ||
        responseData?.name_cleared ||
        responseData?.invalid_name_format;

      if (nameCleared) {
        clearCapturedName();
      }

      const strikeCount =
        metadata?.non_engagement_strikes ??
        metadata?.strikes ??
        metadata?.strike_count ??
        responseData?.non_engagement_strikes ??
        responseData?.strikes ??
        responseData?.strike_count;

      if (typeof strikeCount === 'number') {
        setShowWarning(strikeCount >= 2);
      }

      const nextExchange = metadata?.exchange_count ?? responseData?.exchange_count;
      if (typeof nextExchange === 'number') {
        setExchangeCount(nextExchange);
      } else {
        setExchangeCount((prev) => prev + 1);
      }

      const signupBridge =
        metadata?.signup_bridge ||
        metadata?.signup_bridge_triggered ||
        metadata?.bridge_to_signup ||
        metadata?.final_signup_bridge ||
        metadata?.failsafe_triggered ||
        responseData?.signup_bridge ||
        responseData?.signup_bridge_triggered ||
        responseData?.failsafe_triggered;

      if (signupBridge) {
        setSignupBridgeTriggered(true);
        setShowWarning(false);
        persistDiscoveryData();
      }

      const fallbackClarification =
        nameCleared && !aiResponse
          ? 'Could you clarify your name so we can get started?'
          : '';

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: aiResponse || fallbackClarification || "Thanks! Let's keep going.",
        },
      ]);
    } catch (error: any) {
      console.error('Discovery chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // Preserve discovery data and redirect to register
    router.push('/register');
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="bg-[#1a102e]/60 backdrop-blur-xl border border-[#7B3FF2]/30 rounded-2xl shadow-2xl shadow-[#7B3FF2]/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border-b border-[#7B3FF2]/30 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Try EPI Now</h3>
              <p className="text-xs text-gray-300">
                {signupBridgeTriggered
                  ? 'Sign up to continue our conversation'
                  : `${Math.max(0, MAX_EXCHANGES - exchangeCount)} message${Math.max(0, MAX_EXCHANGES - exchangeCount) !== 1 ? 's' : ''} left in discovery`
                }
              </p>
            </div>
            
            {/* Voice Toggle */}
            <div className="relative group">
              <button
                onClick={toggleVoice}
                disabled={signupBridgeTriggered}
                className={`p-2 rounded-lg transition-all ${
                  isVoiceEnabled
                    ? 'bg-[#7B3FF2] text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                } ${signupBridgeTriggered ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isVoiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {isVoiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#2d1b4e] border border-[#7B3FF2]/30 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Voice discovery is available for a limited time—sign up for full access
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[280px] max-h-[280px] md:h-[320px] md:max-h-[320px] overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              role={message.role}
              content={message.content}
              isStreaming={false}
            />
          ))}
          {isLoading && (
            <MessageBubble
              role="assistant"
              content="Thinking..."
              isStreaming={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[#7B3FF2]/30 p-3 relative">
          {showWarning && !signupBridgeTriggered && (
            <div className="mb-2 px-3 py-2 text-xs md:text-sm text-[#A78BFA] bg-[#2d1b4e]/60 border border-[#7B3FF2]/40 rounded-lg">
              EPI is having trouble understanding—try being more specific so we can get started!
            </div>
          )}

          {signupBridgeTriggered ? (
            <div className="flex items-center justify-center">
              <button
                onClick={handleSignUp}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-base font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
              >
                Register to Continue
              </button>
            </div>
          ) : (
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder={
                exchangeCount >= MAX_EXCHANGES
                  ? 'Sign up to continue...'
                  : 'Type your message...'
              }
            />
          )}
        </div>
      </div>

      {/* Exchange counter */}
      <div className="text-center mt-3">
        <p className="text-xs text-gray-400">
          {exchangeCount}/{MAX_EXCHANGES} discovery messages used
        </p>
      </div>
    </div>
  );
}
