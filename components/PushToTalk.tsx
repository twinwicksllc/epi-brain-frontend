'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface PushToTalkProps {
  isVoiceEnabled: boolean;
  onTranscriptChange: (transcript: string) => void;
  onTranscriptComplete: (transcript: string) => void;
  voiceManager: any;
  onLayerChange?: (layer: 'sensing' | 'synthesizing' | 'idle') => void;
}

export default function PushToTalk({
  isVoiceEnabled,
  onTranscriptChange,
  onTranscriptComplete,
  onLayerChange,
  voiceManager,
}: PushToTalkProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const isSpacebarPressedRef = useRef(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isVoiceEnabled) return;

    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).trim();
        setCurrentTranscript(fullTranscript);
        onTranscriptChange(fullTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isSpacebarPressedRef.current && !isMobile) {
          // Restart if spacebar still held
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
        } else {
          setIsListening(false);
          if (currentTranscript) {
            onTranscriptComplete(currentTranscript);
            setCurrentTranscript('');
          }
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceEnabled, isMobile]);

  useEffect(() => {
    if (!isVoiceEnabled || isMobile) return;

    // Desktop: Spacebar PTT
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isSpacebarPressedRef.current) {
        // Check if user is not typing in an input/textarea
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        e.preventDefault();
        isSpacebarPressedRef.current = true;
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isSpacebarPressedRef.current) {
        e.preventDefault();
        isSpacebarPressedRef.current = false;
        stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVoiceEnabled, isMobile]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
      onLayerChange?.('sensing'); // Signal NEBP sensing layer
    } catch (e) {
      console.error('Error starting recognition:', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
      onLayerChange?.('idle'); // Return to idle state
    } catch (e) {
      console.error('Error stopping recognition:', e);
    }
  };

  const handleMobileToggle = () => {
    if (!isMobile) return;

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isVoiceEnabled) return null;

  return (
    <>
      {/* Mobile: Large Tap-to-Toggle Button */}
      {isMobile && (
        <button
          onClick={handleMobileToggle}
          className={`
            fixed bottom-24 right-6 z-50
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-300
            shadow-lg
            ${isListening 
              ? 'bg-red-500 animate-pulse shadow-red-500/50' 
              : 'bg-[#7B3FF2] shadow-purple-500/50'
            }
          `}
          style={{
            background: isListening 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #7B3FF2 0%, #6B46C1 100%)',
          }}
        >
          {isListening ? (
            <Mic className="w-8 h-8 text-white" />
          ) : (
            <MicOff className="w-8 h-8 text-white" />
          )}
        </button>
      )}

      {/* Desktop: Spacebar Indicator */}
      {!isMobile && isListening && (
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-500/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-red-400/30">
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-medium">Listening... (Release Spacebar to send)</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
