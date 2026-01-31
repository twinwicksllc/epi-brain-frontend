'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NeuronParticles from '@/components/NeuronParticles';

// Force cache invalidation - deployed 2025-01-12

export default function Home() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const messages = [
    "Hi, I'm EPI. Want to hear me talk and show you something cool?",
    "What's your name?",
    "What brings you here today?",
    "I can help you with anything like sales, learning, or even prayer.",
    "Just sign in and let's get started."
  ];

  console.log('Home component rendering');
  useEffect(() => {
    const currentMessage = messages[messageIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNext = 500;

    if (!isDeleting && displayedText === currentMessage) {
      // Finished typing, pause then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === '') {
      // Finished deleting, move to next message
      setIsDeleting(false);
      setMessageIndex((prev) => (prev + 1) % messages.length);
      const timeout = setTimeout(() => {}, pauseBeforeNext);
      return () => clearTimeout(timeout);
    }

    // Type or delete one character
    const timeout = setTimeout(() => {
      setDisplayedText(
        isDeleting
          ? currentMessage.substring(0, displayedText.length - 1)
          : currentMessage.substring(0, displayedText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, messageIndex]);

  const handleSignIn = () => {
    console.log('Sign in button clicked, navigating to /login');
    router.push('/login');
  };

  const handleGetStarted = () => {
    console.log('Get started button clicked, navigating to /register');
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />
      
      <main className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-6 flex justify-end items-center">
          <nav aria-label="Main navigation" className="flex items-center gap-3">
            <a
              href="/use-cases"
              className="px-6 py-2 bg-transparent border border-[#7B3FF2] text-white rounded-lg hover:bg-[#7B3FF2] transition-colors"
              aria-label="View EPI Brain use cases"
            >
              Use Cases
            </a>
            <button
              onClick={handleSignIn}
              className="px-6 py-2 bg-transparent border border-[#7B3FF2] text-white rounded-lg hover:bg-[#7B3FF2] transition-colors"
              aria-label="Sign in to your account"
            >
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-6 text-center" aria-labelledby="hero-heading">
          <div className="mb-6">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo - AI Life Companion"
              className="mx-auto w-[230px] h-[230px] object-contain"
              width="230"
              height="230"
            />
          </div>
          <h1 id="hero-heading" className="text-6xl md:text-7xl font-bold text-white mb-4">
            EPI Brain
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] bg-clip-text text-transparent">
              Life Companion
            </span>
          </h2>
          <div className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed h-16 flex items-center justify-center">
            <p className="min-h-[2em]">
              {displayedText}
              <span className="inline-block w-0.5 h-6 bg-[#7B3FF2] ml-1 animate-pulse"></span>
            </p>
          </div>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
            aria-label="Get started for free"
          >
            Get Started Free
          </button>
        </section>

      </main>
    </div>
  );
}