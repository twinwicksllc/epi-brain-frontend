'use client';

import NeuronParticles from '@/components/NeuronParticles';
import { MessageSquare, Brain, TrendingUp } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import WhyChooseEPI from '@/components/WhyChooseEPI';
import Link from 'next/link';

const coreFeatures = [
  {
    icon: MessageSquare,
    title: "Real-time Conversations",
    description: "Experience natural, flowing conversations with instant AI responses"
  },
  {
    icon: Brain,
    title: "Adaptive AI Support",
    description: "Get tailored assistance that matches your context and goals"
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your growth and achievements across all interactions"
  }
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />
      
      <main className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8 flex justify-between items-center">
          <Link
            href="/"
            className="text-white hover:text-[#A78BFA] transition-colors font-semibold"
          >
            ← Back to Home
          </Link>
          <nav aria-label="Main navigation">
            <Link
              href="/login"
              className="px-6 py-2 bg-transparent border border-[#7B3FF2] text-white rounded-lg hover:bg-[#7B3FF2] transition-colors"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 text-center" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-5xl md:text-6xl font-bold text-white mb-6">
            EPI Brain Use Cases & Features
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how EPI Brain adapts to elevate your daily work, learning, and personal goals
          </p>
        </section>

        {/* Core Features Overview */}
        <section className="container mx-auto px-6 py-16" aria-labelledby="core-features-heading">
          <h2 id="core-features-heading" className="text-4xl font-bold text-white text-center mb-12">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-[#7B3FF2]" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose EPI Brain Section */}
        <WhyChooseEPI />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center" aria-labelledby="cta-heading">
          <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience guided AI support designed around your goals
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
              aria-label="Start your journey with EPI Brain"
            >
              Start Your Journey
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-[#7B3FF2]/20">
          <div className="text-center text-gray-400 space-y-2">
            <p>
              © 2025 EPI Brain. Built with ❤️ by <a href="https://twin-wicks.com" target="_blank" rel="noopener noreferrer" className="text-[#7B3FF2] hover:text-[#A78BFA] transition-colors underline">Twin Wicks Digital Solutions</a>
            </p>
            <p>
              <Link href="/spiritual" className="text-[#7B3FF2] hover:text-[#A78BFA] transition-colors underline">
                Christian Companion
              </Link>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
