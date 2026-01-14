'use client';

import { useState, useEffect } from 'react';
import { modesApi } from '@/lib/api/client';
import { ChevronDown } from 'lucide-react';

interface Mode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface ModeSelectorProps {
  currentMode: string;
  onModeChange: (modeId: string) => void;
}

const MODE_ICONS: { [key: string]: string } = {
  personal_friend: '👋',
  sales_agent: '💼',
  student_tutor: '📚',
  kids_learning: '🎨',
  christian_companion: '✝️',
  customer_service: '🎧',
  psychology_expert: '🧠',
  business_mentor: '📈',
  weight_loss_coach: '💪',
};

const MODE_NAMES: { [key: string]: string } = {
  personal_friend: 'Personal Friend',
  sales_agent: 'Sales Agent',
  student_tutor: 'Student/Tutor',
  kids_learning: 'Kids Learning',
  christian_companion: 'Christian Companion',
  customer_service: 'Customer Service',
  psychology_expert: 'Psychology Expert',
  business_mentor: 'Business Mentor',
  weight_loss_coach: 'Weight Loss Coach',
};

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modes, setModes] = useState<Mode[]>([]);

  useEffect(() => {
    loadModes();
    // Retry loading modes after 2 seconds if it fails
    const retryTimer = setTimeout(() => {
      if (modes.length === 0) {
        loadModes();
      }
    }, 2000);
    return () => clearTimeout(retryTimer);
  }, []);

  const loadModes = async () => {
    // Use fallback modes by default (avoids API call issues in Codespaces)
    const fallbackModes = Object.keys(MODE_NAMES).map(id => ({
      id,
      name: MODE_NAMES[id],
      description: '',
      icon: MODE_ICONS[id],
    }));
    
    setModes(fallbackModes);
    
    // Try to load from API in background (optional enhancement)
    try {
      const data = await modesApi.getModes();
      setModes(data);
    } catch (error) {
      // Silently fail - we already have fallback modes loaded
      console.log('Using fallback modes (API unavailable)');
    }
  };

  const currentModeName = MODE_NAMES[currentMode] || 'Personal Friend';
  const currentModeIcon = MODE_ICONS[currentMode] || '👋';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#2d1b4e]/60 backdrop-blur-md hover:bg-[#3d2b5e]/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] border border-[#7B3FF2]/30 rounded-lg transition-all duration-300"
      >
        <span className="text-2xl">{currentModeIcon}</span>
        <span className="text-white font-medium">{currentModeName}</span>
        <ChevronDown
          size={20}
          className={`text-[#A78BFA] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-[#2d1b4e]/80 backdrop-blur-md border border-[#7B3FF2]/30 rounded-lg shadow-2xl z-20 max-h-96 overflow-y-auto">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 p-4 hover:bg-[#3d2b5e]/60 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 text-left ${
                  currentMode === mode.id ? 'bg-[#7B3FF2]/20 shadow-[0_0_10px_rgba(123,63,242,0.3)]' : ''
                }`}
              >
                <span className="text-2xl flex-shrink-0">{MODE_ICONS[mode.id]}</span>
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">
                    {MODE_NAMES[mode.id] || mode.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {mode.description || `Chat with ${MODE_NAMES[mode.id]}`}
                  </p>
                </div>
                {currentMode === mode.id && (
                  <div className="w-2 h-2 bg-[#7B3FF2] rounded-full flex-shrink-0 mt-2" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}