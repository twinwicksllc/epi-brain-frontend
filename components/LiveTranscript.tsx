'use client';

import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';

interface LiveTranscriptProps {
  transcript: string;
  isListening: boolean;
}

export default function LiveTranscript({ transcript, isListening }: LiveTranscriptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isListening || transcript) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

  if (!visible) return null;

  return (
    <div 
      className={`
        transition-all duration-300 ease-in-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div 
        className="
          relative mb-3 p-4 rounded-2xl
          backdrop-blur-md
          border border-white/10
          shadow-xl
          overflow-hidden
        "
        style={{
          background: 'linear-gradient(135deg, rgba(123, 63, 242, 0.2) 0%, rgba(107, 70, 193, 0.2) 100%)',
        }}
      >
        {/* Animated gradient border effect */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: 'linear-gradient(135deg, #7B3FF2 0%, #A78BFA 50%, #7B3FF2 100%)',
            backgroundSize: '200% 200%',
            animation: isListening ? 'gradient-shift 2s ease infinite' : 'none',
            filter: 'blur(10px)',
            zIndex: -1,
          }}
        />

        <div className="flex items-start space-x-3">
          {isListening && (
            <Mic className="w-5 h-5 text-[#A78BFA] mt-0.5 flex-shrink-0 animate-pulse" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-white/60 mb-1 font-medium">
              {isListening ? 'EPI is hearing...' : 'Transcript'}
            </div>
            <div className="text-white text-sm leading-relaxed">
              {transcript || 'Start speaking...'}
              {isListening && <span className="inline-block w-1 h-4 ml-1 bg-[#A78BFA] animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: isListening ? '0 0 30px rgba(167, 139, 250, 0.3), inset 0 0 20px rgba(167, 139, 250, 0.1)' : 'none',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}
