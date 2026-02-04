'use client';

import { useState } from 'react';
import { Plus, X, FileText, Briefcase, MessageSquare } from 'lucide-react';

interface FloatingActionButtonProps {
  onNewNote: () => void;
  onSalesMode: () => void;
  onMessageAdmin: () => void;
}

export default function FloatingActionButton({
  onNewNote,
  onSalesMode,
  onMessageAdmin,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'note',
      label: 'New Note',
      icon: FileText,
      emoji: '📝',
      onClick: () => {
        onNewNote();
        setIsOpen(false);
      },
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'sales',
      label: 'Sales Mode',
      icon: Briefcase,
      emoji: '💼',
      onClick: () => {
        onSalesMode();
        setIsOpen(false);
      },
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'admin',
      label: 'Message Admin',
      icon: MessageSquare,
      emoji: '✉️',
      onClick: () => {
        onMessageAdmin();
        setIsOpen(false);
      },
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Only - Hidden on Desktop */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        {/* Action Buttons */}
        <div className={`
          absolute bottom-20 right-0
          flex flex-col-reverse gap-3
          transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}>
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`
                group relative
                w-14 h-14 rounded-full
                flex items-center justify-center
                backdrop-blur-md
                border border-white/20
                shadow-lg
                transition-all duration-300
                hover:scale-110 active:scale-95
                bg-gradient-to-br ${action.color}
              `}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <span className="text-2xl">{action.emoji}</span>
              
              {/* Tooltip */}
              <div className={`
                absolute right-16 top-1/2 -translate-y-1/2
                px-3 py-2 rounded-lg
                bg-black/90 backdrop-blur-sm
                border border-white/10
                whitespace-nowrap
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                pointer-events-none
              `}>
                <span className="text-white text-sm font-medium">{action.label}</span>
              </div>

              {/* Glow effect */}
              <div className={`
                absolute inset-0 rounded-full
                bg-gradient-to-br ${action.color}
                opacity-0 group-hover:opacity-30
                blur-xl
                transition-opacity duration-300
              `} />
            </button>
          ))}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative
            w-16 h-16 rounded-full
            flex items-center justify-center
            transition-all duration-300
            shadow-xl
            ${isOpen ? 'rotate-45 bg-red-500' : 'rotate-0'}
          `}
          style={{
            background: isOpen 
              ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
              : 'linear-gradient(135deg, #7B3FF2 0%, #6B46C1 100%)',
            boxShadow: isOpen
              ? '0 10px 40px rgba(239, 68, 68, 0.4)'
              : '0 10px 40px rgba(123, 63, 242, 0.4)',
          }}
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Plus className="w-8 h-8 text-white" />
          )}

          {/* Pulse animation when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{
                background: 'linear-gradient(135deg, #7B3FF2 0%, #6B46C1 100%)',
              }}
            />
          )}
        </button>
      </div>
    </>
  );
}
