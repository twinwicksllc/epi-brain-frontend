'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { getVoiceForMode, isModeVoiceEnabled } from '@/lib/voice/types';
import { voiceApi } from '@/lib/api/voiceApi';
import { VoiceManager, VoiceOptions } from '@/lib/voice/voiceManager';

interface VoiceToggleProps {
  mode: string;
  token: string;
  gender: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
  onVoiceEnabled?: (enabled: boolean) => void;
}

export default function VoiceToggle({ 
  mode, 
  token, 
  gender, 
  onGenderChange, 
  onVoiceEnabled 
}: VoiceToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceStats, setVoiceStats] = useState<{ remaining?: number; limit?: number } | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Voice manager instance (singleton)
  const voiceManagerRef = useRef<VoiceManager | null>(null);

  // Initialize voice manager
  useEffect(() => {
    if (!voiceManagerRef.current) {
      voiceManagerRef.current = new VoiceManager();
    }

    return () => {
      if (voiceManagerRef.current) {
        voiceManagerRef.current.destroy();
        voiceManagerRef.current = null;
      }
    };
  }, []);

  // Load voice stats
  useEffect(() => {
    const loadStats = async () => {
      if (isEnabled && token) {
        try {
          const stats = await voiceApi.getVoiceStats();
          setVoiceStats({
            remaining: stats.remaining,
            limit: stats.limit
          });
        } catch (error) {
          console.error('Failed to load voice stats:', error);
        }
      }
    };

    loadStats();
  }, [isEnabled, token]);

  // Toggle voice
  const toggleVoice = async () => {
    const voiceEnabled = !isEnabled;
    
    // Check if mode is disabled
    if (voiceEnabled && !isModeVoiceEnabled(mode)) {
      setShowError(true);
      setErrorMessage('Voice is not available for this mode');
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);

    try {
      if (voiceEnabled) {
        // Check voice stats
        const stats = await voiceApi.getVoiceStats();
        setVoiceStats({
          remaining: stats.remaining,
          limit: stats.limit
        });

        if (stats.remaining !== undefined && stats.remaining <= 0) {
          setShowError(true);
          setErrorMessage('Voice limit reached for today');
          setTimeout(() => setShowError(false), 3000);
          setIsLoading(false);
          return;
        }

        // Enable voice
        const voiceModel = getVoiceForMode(mode, gender)?.id || 'aura-asteria-en';
        
        const options: VoiceOptions = {
          token,
          mode,
          voiceModel,
          onAudioStart: () => {
            console.log('Audio started');
          },
          onAudioEnd: () => {
            console.log('Audio ended');
          },
          onError: (error) => {
            console.error('Voice error:', error);
            setShowError(true);
            setErrorMessage(error.message);
            setTimeout(() => setShowError(false), 3000);
          }
        };

        voiceManagerRef.current?.enable(options);
      } else {
        // Disable voice
        voiceManagerRef.current?.disable();
      }

      setIsEnabled(voiceEnabled);
      onVoiceEnabled?.(voiceEnabled);
    } catch (error) {
      console.error('Failed to toggle voice:', error);
      setShowError(true);
      setErrorMessage('Failed to enable voice');
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Update voice model when gender changes
  useEffect(() => {
    if (isEnabled && voiceManagerRef.current) {
      const voiceModel = getVoiceForMode(mode, gender)?.id || 'aura-asteria-en';
      voiceManagerRef.current.updateVoiceModel(voiceModel);
    }
  }, [gender, mode, isEnabled]);

  return (
    <div className="relative">
      {/* Error tooltip */}
      {showError && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50">
          {errorMessage}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
        </div>
      )}

      {/* Voice toggle button */}
      <button
        onClick={toggleVoice}
        disabled={isLoading || !isModeVoiceEnabled(mode)}
        className={`
          relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
          ${isEnabled 
            ? 'bg-[#7B3FF2] text-white shadow-[0_0_15px_rgba(123,63,242,0.4)] hover:shadow-[0_0_20px_rgba(123,63,242,0.6)]' 
            : 'bg-[#2d1b4e]/60 text-[#A78BFA] hover:bg-[#2d1b4e]/80 hover:text-[#A78BFA]'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${!isModeVoiceEnabled(mode) ? 'opacity-40 cursor-not-allowed' : ''}
        `}
        title={isEnabled ? 'Disable voice' : 'Enable voice'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        
        <span className="text-xs font-medium">
          {isLoading ? 'Loading...' : isEnabled ? 'Voice On' : 'Voice Off'}
        </span>

        {/* Voice stats indicator */}
        {isEnabled && voiceStats && voiceStats.remaining !== undefined && (
          <span className="ml-1 text-xs opacity-80">
            ({voiceStats.remaining}/{voiceStats.limit})
          </span>
        )}
      </button>
    </div>
  );
}