'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { Send, Volume2, VolumeX } from 'lucide-react';

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
  const [showSignUpOverlay, setShowSignUpOverlay] = useState(false);
  const [failsafeTriggered, setFailsafeTriggered] = useState(false);
  const [capturedData, setCapturedData] = useState<{ name?: string; intent?: string }>({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const MAX_EXCHANGES = 3;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (userMessage: string) => {
    if (exchangeCount >= MAX_EXCHANGES || failsafeTriggered) {
      return;
    }

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Simulate AI response based on context
    // In a real implementation, this would be an API call that returns metadata
    setTimeout(() => {
      let aiResponse = '';
      let responseMetadata: { failsafe_triggered?: boolean } = {};
      const currentExchange = exchangeCount + 1;

      // Simulate failsafe detection (in real implementation, this comes from API)
      // Example: if user sends off-topic message, backend returns failsafe_triggered: true
      const isOffTopic = userMessage.toLowerCase().includes('weather') || 
                         userMessage.toLowerCase().includes('recipe') ||
                         userMessage.toLowerCase().includes('sports');
      
      if (isOffTopic) {
        responseMetadata.failsafe_triggered = true;
      }

      if (currentExchange === 1) {
        // First exchange - capture name
        const name = userMessage.trim();
        setCapturedData((prev) => ({ ...prev, name }));
        // Immediately save to localStorage with new key
        localStorage.setItem('epi_temp_name', name);
        aiResponse = `Nice to meet you, ${name}! What brings you here today? Are you looking for help with sales, learning, personal growth, or something else?`;
      } else if (currentExchange === 2) {
        // Second exchange - capture intent
        const intent = userMessage.trim();
        setCapturedData((prev) => ({ ...prev, intent }));
        // Immediately save to localStorage with new key
        localStorage.setItem('epi_temp_intent', intent);
        aiResponse = `Great! I can definitely help you with ${intent}. I have specialized AI personalities for different needs - from sales training to personal companionship to learning support. Want to explore more?`;
      } else if (currentExchange === 3) {
        // Third exchange - trigger sign up
        aiResponse = `That's wonderful! To continue our conversation and unlock all 9 AI personalities with full features, please sign up for free.`;
        setShowSignUpOverlay(true);
        
        // Store data in localStorage for registration flow (keep both formats for compatibility)
        const discoveryData = { ...capturedData, intent: userMessage.trim() };
        localStorage.setItem('discovery_data', JSON.stringify(discoveryData));
        
        if (onComplete) {
          onComplete(discoveryData);
        }
      }

      // Check for failsafe in metadata
      if (responseMetadata.failsafe_triggered) {
        aiResponse = `I appreciate your interest! However, I'm specifically designed to help you discover how EPI can support your personal and professional growth. To explore all my capabilities and have deeper conversations, please sign up for free.`;
        setFailsafeTriggered(true);
        setShowSignUpOverlay(true);
        setIsLoading(false);
        
        // Store any captured data
        if (capturedData.name || capturedData.intent) {
          localStorage.setItem('discovery_data', JSON.stringify(capturedData));
        }
        
        setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
        return;
      }

      setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
      setExchangeCount(currentExchange);
      setIsLoading(false);
    }, 800);
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
        <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border-b border-[#7B3FF2]/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Try EPI Now</h3>
              <p className="text-sm text-gray-300">
                {failsafeTriggered 
                  ? 'Sign up to continue our conversation'
                  : `${MAX_EXCHANGES - exchangeCount} message${MAX_EXCHANGES - exchangeCount !== 1 ? 's' : ''} left in discovery`
                }
              </p>
            </div>
            
            {/* Voice Toggle */}
            <div className="relative group">
              <button
                onClick={toggleVoice}
                disabled={showSignUpOverlay}
                className={`p-2 rounded-lg transition-all ${
                  isVoiceEnabled
                    ? 'bg-[#7B3FF2] text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                } ${showSignUpOverlay ? 'opacity-50 cursor-not-allowed' : ''}`}
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
        <div className="h-[400px] overflow-y-auto p-6 space-y-4">
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
        <div className="border-t border-[#7B3FF2]/30 p-4 relative">
          {showSignUpOverlay && (
            <div className="absolute inset-0 bg-[#1a102e]/95 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center p-6">
                <h4 className="text-xl font-semibold text-white mb-3">
                  Ready to Continue?
                </h4>
                <p className="text-gray-300 mb-6">
                  Sign up free to unlock all features and personalities
                </p>
                <button
                  onClick={handleSignUp}
                  className="px-8 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
                >
                  Sign Up to Continue
                </button>
              </div>
            </div>
          )}
          
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || showSignUpOverlay || failsafeTriggered}
            placeholder={
              failsafeTriggered || showSignUpOverlay
                ? 'Sign up to continue our conversation'
                : exchangeCount >= MAX_EXCHANGES
                ? 'Sign up to continue...'
                : 'Type your message...'
            }
          />
        </div>
      </div>

      {/* Exchange counter */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-400">
          {exchangeCount}/{MAX_EXCHANGES} discovery messages used
        </p>
      </div>
    </div>
  );
}
