"use client";

import { Volume2, VolumeX } from "lucide-react";

interface VoiceToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  currentMode: string;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
  voiceStats: any;
}

export default function VoiceToggle({
  isEnabled,
  onToggle,
  currentMode,
  selectedGender,
  onGenderChange,
  voiceStats,
}: VoiceToggleProps) {
  const getDisplayText = () => {
    if (!voiceStats || voiceStats.daily_usage === undefined) {
      return "Loading...";
    }
    
    const { tier, daily_usage, remaining } = voiceStats;
    
    // If remaining is "unlimited", show that
    if (remaining === "unlimited" || remaining === null) {
      return `${daily_usage}/unlimited`;
    }
    
    // Otherwise show "X/limit"
    const limit = voiceStats.daily_limit || 10;
    return `${daily_usage}/${limit}`;
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
          isEnabled ? "bg-[#7B3FF2]" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
            isEnabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>

      <div className="flex items-center space-x-2">
        {isEnabled ? (
          <Volume2 className="w-5 h-5 text-[#A78BFA]" />
        ) : (
          <VolumeX className="w-5 h-5 text-white/60" />
        )}
        
        <span className="text-sm text-white/90 font-medium">
          {getDisplayText()}
        </span>
      </div>

      {/* Gender Selector */}
      <select
        value={selectedGender}
        onChange={(e) => onGenderChange(e.target.value)}
        disabled={!isEnabled}
        className="px-2 py-1 text-sm bg-[#2d1b4e] border border-[#7B3FF2]/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#7B3FF2] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
    </div>
  );
}