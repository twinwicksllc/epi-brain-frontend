'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import NeuronParticles from '@/components/NeuronParticles';
import { Paperclip, Search, BookOpen, Mic, Heart } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const handleVoice = () => {
    // Handle voice input
    console.log('Voice button clicked');
  };

  const handleAttach = () => {
    console.log('Attach clicked');
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleStudy = () => {
    console.log('Study clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />
      
      <main className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-end items-center">
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-6 py-2.5 text-white text-sm font-medium hover:text-purple-300 transition-colors"
              aria-label="Log in to your account"
            >
              Log in
            </button>
            <button
              onClick={handleSignUp}
              className="px-6 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Sign up for free"
            >
              Sign up for free
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 text-center flex flex-col items-center justify-center min-h-[calc(100vh-120px)]" aria-labelledby="hero-heading">
          <div className="mb-4">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo"
              className="mx-auto w-[210px] h-[210px] object-contain"
              width="210"
              height="210"
            />
          </div>
          
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white mb-4">
            EPI Brain
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-16">
            <span className="font-semibold">Voice + Emotional Intelligence.</span> Ask anything.
          </p>

          {/* Search Input Box */}
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything"
                className="flex-1 px-4 py-3 text-gray-900 text-lg bg-transparent border-none outline-none placeholder:text-gray-500"
              />
              <button
                onClick={handleVoice}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                aria-label="Use voice input"
              >
                <Mic className="w-5 h-5" />
                <span>Voice</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleAttach}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Attach files"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-sm font-medium">Attach</span>
              </button>
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Search</span>
              </button>
              <button
                onClick={handleStudy}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Study mode"
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Study</span>
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className="flex flex-col items-center justify-center gap-1 mt-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span>By messaging EPI Brain, you agree to our</span>
                <a href="/terms" className="underline hover:text-gray-900">Terms</a>
                <span>and have read our</span>
                <a href="/privacy" className="underline hover:text-gray-900">Privacy Policy</a>
              </div>
              <div className="text-xs text-gray-600">
                <a href="/use-cases" className="underline hover:text-gray-900">
                  Learn more about EPI Brain HERE!
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
