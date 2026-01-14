'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface VoiceErrorToastProps {
  error: string | null;
  onClose: () => void;
}

export default function VoiceErrorToast({ error, onClose }: VoiceErrorToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md bg-red-500/90 backdrop-blur-md border border-red-400 rounded-lg shadow-lg p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">Voice Error</h4>
          <p className="text-white/90 text-sm">{error}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}