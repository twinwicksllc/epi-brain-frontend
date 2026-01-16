"use client";

import { useState, useEffect } from "react";

interface BrainLogoProps {
  isLoading: boolean;
}

export default function BrainLogo({ isLoading }: BrainLogoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-[120px] h-[120px] bg-[#7B3FF2]/20 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6">
      {isLoading ? (
        <video
          src="/assets/animated-brain.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[120px] h-[120px] object-cover rounded-full"
          aria-label="AI is thinking"
        />
      ) : (
        <img
          src="/assets/brain-static.png"
          alt="EPI Brain Logo"
          className="w-[120px] h-[120px] object-cover rounded-full transition-opacity duration-300 hover:opacity-80"
        />
      )}
    </div>
  );
}