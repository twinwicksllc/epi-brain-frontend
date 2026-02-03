'use client';

import { useRouter } from 'next/navigation';
import NeuronParticles from '@/components/NeuronParticles';
import SiloedDiscoveryChat from '@/components/SiloedDiscoveryChat';

export default function SalesPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  const handleGetStarted = () => {
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
              More Information
            </a>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-transparent border border-[#7B3FF2] text-white rounded-lg hover:bg-[#7B3FF2] transition-colors"
              aria-label="Register for free"
            >
              Register for Free
            </button>
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
        <section className="container mx-auto px-6 py-4 text-center" aria-labelledby="hero-heading">
          <div className="mb-4">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Sales Tutor Logo"
              className="mx-auto w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-contain"
              width="180"
              height="180"
            />
          </div>
          <h1 id="hero-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            EPI Sales Tutor
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] bg-clip-text text-transparent">
              Sales Coach
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Master sales techniques, practice objection handling, and close more deals—no signup required to try.
          </p>

          {/* Embedded Discovery Chat with Sales Context */}
          <div className="mb-6">
            <SiloedDiscoveryChat />
          </div>

          <div className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">
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
