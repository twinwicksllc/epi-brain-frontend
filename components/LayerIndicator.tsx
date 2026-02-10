'use client';

import { useEffect, useState } from 'react';
import { Brain, Sparkles, AlertCircle } from 'lucide-react';

export type NEBPLayer = 'idle' | 'sensing' | 'synthesizing';

interface LayerMetadata {
  reasoning_time?: number; // milliseconds spent in Reasoning core
  buffer_time?: number;    // milliseconds spent in Buffer layer
  parsing_time?: number;   // milliseconds for parsing
  total_time?: number;     // total synthesis time
  buffer_dominant?: boolean; // true if buffer time > reasoning time
}

interface LayerIndicatorProps {
  layer: NEBPLayer;
  metadata?: LayerMetadata;
  className?: string;
}

export default function LayerIndicator({ layer, metadata, className = '' }: LayerIndicatorProps) {
  const [pulseKey, setPulseKey] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  // Reset animation when layer changes
  useEffect(() => {
    if (layer !== 'idle') {
      setPulseKey(prev => prev + 1);
    }
  }, [layer]);

  // Detect if Buffer is dominating over Reasoning
  useEffect(() => {
    if (metadata?.buffer_time && metadata?.reasoning_time) {
      const isBufferDominant = metadata.buffer_time > metadata.reasoning_time;
      setShowWarning(isBufferDominant);
      
      if (isBufferDominant) {
        console.warn(
          '[Layer Indicator] Buffer dominance detected:',
          `Buffer: ${metadata.buffer_time}ms > Reasoning: ${metadata.reasoning_time}ms`
        );
      }
    }
  }, [metadata]);

  if (layer === 'idle') {
    return null;
  }

  const isSensing = layer === 'sensing';
  const isSynthesizing = layer === 'synthesizing';

  const renderMetadata = () => {
    if (!metadata || isSensing) return null;
    
    return (
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-white/80 bg-[#1a0f3c]/80 backdrop-blur-sm border border-[#7B3FF2]/30 rounded px-2 py-1 pointer-events-none">
        {metadata.reasoning_time !== undefined && metadata.buffer_time !== undefined ? (
          <>
            <div>Reasoning: {metadata.reasoning_time}ms</div>
            <div>Buffer: {metadata.buffer_time}ms</div>
            {metadata.buffer_dominant && (
              <div className="text-yellow-400 font-semibold">⚠ Buffer Dominant</div>
            )}
          </>
        ) : metadata.total_time !== undefined ? (
          <div>Synthesis: {metadata.total_time}ms</div>
        ) : null}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 relative ${className}`}>
      {renderMetadata()}
      
      <div className={`relative flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border backdrop-blur-sm ${
        showWarning 
          ? 'border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
          : 'border-[#7B3FF2]/30'
      }`}>
        {/* Animated pulse ring */}
        <div
          key={pulseKey}
          className="absolute inset-0 rounded-full border-2 animate-ping"
          style={{
            borderColor: isSensing ? '#A78BFA' : showWarning ? '#EABB08' : '#7B3FF2',
            animationDuration: '1.5s',
          }}
        />

        {/* Icon */}
        <div className="relative z-10">
          {isSensing ? (
            <Brain className="w-5 h-5 text-[#A78BFA] animate-pulse" />
          ) : showWarning ? (
            <AlertCircle className="w-5 h-5 text-yellow-400 animate-pulse" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#7B3FF2] animate-pulse" />
          )}
        </div>

        {/* Label */}
        <span className="relative z-10 text-sm font-medium text-white/90">
          {isSensing ? 'Sensing...' : showWarning ? 'Synthesizing (Buffer)' : 'Synthesizing...'}
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
