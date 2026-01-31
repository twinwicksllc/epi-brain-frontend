'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NeuronParticles from '@/components/NeuronParticles';
import DiscoveryChat from '@/components/DiscoveryChat';

// Force cache invalidation - deployed 2025-01-12

export default function Home() {
  const router = useRouter();

  console.log('Home component rendering');

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

        {/* Hero Section with Discovery Chat */}
        <section className="container mx-auto px-6 py-6 text-center" aria-labelledby="hero-heading">
          <div className="mb-6">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo - AI Life Companion"
              className="mx-auto w-[180px] h-[180px] object-contain"
              width="180"
              height="180"
            />
          </div>
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white mb-3">
            EPI Brain
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] bg-clip-text text-transparent">
              Life Companion
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of AI conversation. Try it now—no signup required.
          </p>

          {/* Embedded Discovery Chat */}
          <div className="mb-8">
            <DiscoveryChat />
          </div>

          <div className="text-sm text-gray-400 max-w-2xl mx-auto">
            <p>
              Already have an account?{' '}
              <button
                onClick={handleSignIn}
                className="text-[#7B3FF2] hover:text-[#A78BFA] underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}