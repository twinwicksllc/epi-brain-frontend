'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  isMuted: boolean;
  onToggleMute?: () => void;
}

export default function AudioVisualizer({ isPlaying, isMuted, onToggleMute }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [barHeights, setBarHeights] = useState<number[]>([]);

  // Initialize bar heights
  useEffect(() => {
    const numBars = 20;
    setBarHeights(new Array(numBars).fill(0));
  }, []);

  // Animate bars when playing
  useEffect(() => {
    const animate = () => {
      if (!canvasRef.current || !isPlaying || isMuted) {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw bars
      const numBars = 20;
      const barWidth = canvas.width / numBars - 2;
      
      for (let i = 0; i < numBars; i++) {
        // Generate random height for visual effect
        const targetHeight = Math.random() * canvas.height * 0.8;
        const currentHeight = barHeights[i] || 0;
        const newHeight = currentHeight + (targetHeight - currentHeight) * 0.3;

        const newHeights = [...barHeights];
        newHeights[i] = newHeight;
        setBarHeights(newHeights);

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - newHeight, 0, canvas.height);
        gradient.addColorStop(0, '#A78BFA');
        gradient.addColorStop(1, '#7B3FF2');

        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * (barWidth + 2),
          (canvas.height - newHeight) / 2,
          barWidth,
          newHeight
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying && !isMuted) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isMuted, barHeights]);

  // Reset bars when not playing
  useEffect(() => {
    if (!isPlaying || isMuted) {
      setBarHeights(new Array(20).fill(0));
    }
  }, [isPlaying, isMuted]);

  return (
    <div className="relative flex items-center gap-2">
      {/* Mute button */}
      {onToggleMute && (
        <button
          onClick={onToggleMute}
          className={`
            p-2 rounded-lg transition-all duration-300
            ${isMuted 
              ? 'text-[#A78BFA]/40 hover:text-[#A78BFA]' 
              : 'text-[#A78BFA] hover:text-white'
            }
          `}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Audio visualizer */}
      <div className="relative h-8 w-32">
        <canvas
          ref={canvasRef}
          width={128}
          height={32}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}