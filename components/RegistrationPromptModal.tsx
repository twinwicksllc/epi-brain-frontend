'use client';

import { Sparkles, ArrowRight, X } from 'lucide-react';

interface RegistrationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
}

export default function RegistrationPromptModal({ isOpen, onClose, onRegister }: RegistrationPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative p-8 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Ready to Go Deeper?</h2>
          </div>
          <p className="text-purple-100 text-sm">
            You've reached your free trial limit. Sign up now to unlock unlimited conversations and all AI personalities.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Unlimited Conversations</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Chat with all 9 AI personalities without limits</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Memory & Context</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AI remembers your preferences and goals</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Goal Tracking</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Set goals and get accountability support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onRegister}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all font-medium text-lg shadow-lg hover:shadow-xl"
          >
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </div>
  );
}