'use client';

import { useState } from 'react';
import { User, UserCircle } from 'lucide-react';
import { getVoiceForMode } from '@/lib/voice/types';

interface GenderSelectorProps {
  mode: string;
  gender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  disabled?: boolean;
}

export default function GenderSelector({ 
  mode, 
  gender, 
  onGenderChange,
  disabled = false
}: GenderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const maleVoice = getVoiceForMode(mode, 'male');
  const femaleVoice = getVoiceForMode(mode, 'female');

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
          ${disabled 
            ? 'opacity-40 cursor-not-allowed bg-[#2d1b4e]/40 text-[#A78BFA]/50' 
            : 'bg-[#2d1b4e]/60 text-[#A78BFA] hover:bg-[#2d1b4e]/80 hover:text-[#A78BFA] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] cursor-pointer'
          }
        `}
      >
        {gender === 'male' ? (
          <>
            <User className="w-4 h-4" />
            <span className="text-xs font-medium">Male</span>
            <span className="text-xs opacity-60">({maleVoice?.name || 'Default'})</span>
          </>
        ) : (
          <>
            <UserCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Female</span>
            <span className="text-xs opacity-60">({femaleVoice?.name || 'Default'})</span>
          </>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-[#2d1b4e]/95 backdrop-blur-md border border-[#7B3FF2]/30 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Male option */}
            <button
              onClick={() => {
                onGenderChange('male');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                ${gender === 'male' 
                  ? 'bg-[#7B3FF2]/20 text-[#A78BFA] border-l-2 border-[#7B3FF2]' 
                  : 'text-[#A78BFA]/80 hover:bg-[#7B3FF2]/10 hover:text-[#A78BFA]'
                }
              `}
            >
              <User className="w-4 h-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Male</span>
                <span className="text-xs opacity-60">{maleVoice?.name || 'Default'}</span>
                {maleVoice?.description && (
                  <span className="text-xs opacity-40 mt-0.5">{maleVoice.description}</span>
                )}
              </div>
            </button>

            {/* Female option */}
            <button
              onClick={() => {
                onGenderChange('female');
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 transition-all duration-200
                ${gender === 'female' 
                  ? 'bg-[#7B3FF2]/20 text-[#A78BFA] border-l-2 border-[#7B3FF2]' 
                  : 'text-[#A78BFA]/80 hover:bg-[#7B3FF2]/10 hover:text-[#A78BFA]'
                }
              `}
            >
              <UserCircle className="w-4 h-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">Female</span>
                <span className="text-xs opacity-60">{femaleVoice?.name || 'Default'}</span>
                {femaleVoice?.description && (
                  <span className="text-xs opacity-40 mt-0.5">{femaleVoice.description}</span>
                )}
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}