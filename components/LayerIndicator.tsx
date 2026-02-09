'use client';

import { useEffect, useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

export type NEBPLayer = 'idle' | 'sensing' | 'synthesizing';

interface LayerIndicatorProps {
  layer: NEBPLayer;
  className?: string;
}

export default function LayerIndicator({ layer, className = '' }: LayerIndicatorProps) {
  const [pulseKey, setPulseKey] = useState(0);

  // Reset animation when layer changes
  useEffect(() => {
    if (layer !== 'idle') {
      setPulseKey(prev => prev + 1);
    }
  }, [layer]);

  if (layer === 'idle') {
    return null;
  }

  const isSensing = layer === 'sensing';
  const isSynthesizing = layer === 'synthesizing';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 backdrop-blur-sm">
        {/* Animated pulse ring */}
        <div
          key={pulseKey}
          className="absolute inset-0 rounded-full border-2 animate-ping"
          style={{
            borderColor: isSensing ? '#A78BFA' : '#7B3FF2',
            animationDuration: '1.5s',
          }}
        />

        {/* Icon */}
        <div className="relative z-10">
          {isSensing ? (
            <Brain className="w-5 h-5 text-[#A78BFA] animate-pulse" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#7B3FF2] animate-pulse" />
          )}
        </div>

        {/* Label */}
        <span className="relative z-10 text-sm font-medium text-white/90">
          {isSensing ? 'Sensing...' : 'Synthesizing...'}
        </span>

        {/* Animated dots */}
        <div className="relative z-10 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-white/60"
              style={{
                animation: 'bounce 1.4s infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
