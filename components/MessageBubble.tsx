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
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#7B3FF2] to-[#A78BFA] flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 transition-all duration-500 text-sm ${
          isUser
            ? 'bg-[#7B3FF2] text-white'
            : 'bg-[#2d1b4e] text-white border'
        }`}
        style={{ borderColor }}
      >
        <div className="whitespace-pre-wrap break-words">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-[#7B3FF2] ml-1 animate-pulse" />
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7B3FF2] flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
}