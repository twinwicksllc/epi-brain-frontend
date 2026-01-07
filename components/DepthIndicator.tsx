'use client';

import { Brain } from 'lucide-react';

interface DepthIndicatorProps {
  depth: number | null;
  enabled: boolean;
}

export default function DepthIndicator({ depth, enabled }: DepthIndicatorProps) {
  if (!enabled || depth === null) {
    return null;
  }

  // Depth is 0.0 to 1.0, convert to percentage
  const depthPercent = Math.round(depth * 100);
  
  // Get depth level label
  const getDepthLevel = (d: number) => {
    if (d < 0.25) return 'Surface';
    if (d < 0.5) return 'Shallow';
    if (d < 0.75) return 'Deep';
    return 'Profound';
  };

  const depthLevel = getDepthLevel(depth);
  
  // Color gradient based on depth
  const getDepthColor = (d: number) => {
    // Light purple to dark purple gradient
    const r = Math.round(167 - (167 - 107) * d); // 167 -> 107
    const g = Math.round(139 - (139 - 70) * d); // 139 -> 70
    const b = Math.round(250 - (250 - 193) * d); // 250 -> 193
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#2d1b4e]/60 backdrop-blur-md rounded-lg border border-[#7B3FF2]/30 hover:border-[#A78BFA]/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300">
      <Brain size={18} className="text-[#A78BFA]" />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Depth</span>
          <span className="text-sm font-semibold text-white" style={{ color: getDepthColor(depth) }}>
            {depthLevel} ({depthPercent}%)
          </span>
        </div>
        <div className="w-24 h-1.5 bg-[#1a0a2e]/50 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${depthPercent}%`,
              backgroundColor: getDepthColor(depth),
            }}
          />
        </div>
      </div>
    </div>
  );
}