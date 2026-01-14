'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSendMessage, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type your message...'}
        disabled={disabled}
        rows={1}
        className="w-full px-6 py-4 pr-14 bg-[#2d1b4e]/60 backdrop-blur-md border border-[#7B3FF2]/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-[#A78BFA]/50 focus:shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:border-[#A78BFA]/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] resize-none max-h-40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      />
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="absolute right-3 bottom-3 p-2 bg-[#7B3FF2] hover:bg-[#6B46C1] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-all duration-300"
      >
        <Send size={20} className="text-white" />
      </button>
    </form>
  );
}