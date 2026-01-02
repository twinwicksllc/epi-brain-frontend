'use client';

import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  currentDepth?: number | null;
}

export default function MessageBubble({ role, content, isStreaming, currentDepth }: MessageBubbleProps) {
  const isUser = role === 'user';

  // Get bubble border color based on depth (for assistant messages only)
  const getBorderColor = (depth: number | null | undefined) => {
    if (isUser || depth === null || depth === undefined) {
      return 'border-[#7B3FF2]/20';
    }
    
    // Darker border for deeper conversations
    const opacity = 0.2 + (depth * 0.3); // 0.2 to 0.5
    return `rgba(123, 63, 242, ${opacity})`;
  };

  const borderColor = getBorderColor(currentDepth);

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#7B3FF2] to-[#A78BFA] flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-2xl px-6 py-4 transition-all duration-500 ${
          isUser
            ? 'bg-[#7B3FF2] text-white'
            : 'bg-[#2d1b4e] text-white border'
        }`}
        style={{ borderColor }}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-[#7B3FF2] ml-1 animate-pulse" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7B3FF2] flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
}