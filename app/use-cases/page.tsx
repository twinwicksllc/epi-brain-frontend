'use client';

import NeuronParticles from '@/components/NeuronParticles';
import { MessageSquare, Brain, TrendingUp, Users, Target, Lock, Clock, Zap } from 'lucide-react';
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
    title: "9 Unique Personalities",
    description: "Switch between specialized AI modes tailored to your needs"
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your growth and achievements across all interactions"
  }
];

const detailedFeatures = [
  {
    icon: Users,
    title: "9 Specialized Personalities",
    description: "Unlike generic AI chatbots, EPI Brain offers 9 distinct personalities specifically trained for different life areas - business, learning, fitness, mental health, faith, and more."
  },
  {
    icon: Brain,
    title: "Semantic Memory Across Conversations",
    description: "Our AI remembers important details across all your conversations while maintaining privacy. Context-aware responses that evolve with you."
  },
  {
    icon: Target,
    title: "Accountability & Goal Tracking",
    description: "Built-in goal setting, habit tracking, and accountability systems. Your AI companion helps you stay on track and celebrates your progress."
  },
  {
    icon: Clock,
    title: "24/7 Instant Availability",
    description: "No appointment needed. Your AI companion is always ready to help, whether it's 3 AM business strategy or midnight emotional support."
  },
  {
    icon: Lock,
    title: "Privacy-First Approach",
    description: "Your conversations are secure and private. Full control over your memory settings and data. Safety layers for sensitive topics."
  },
  {
    icon: Zap,
    title: "Adaptive Personality System",
    description: "AI adapts its tone and approach based on your preferences, conversation depth, and current state. Support that evolves with you."
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
            Discover how EPI Brain's 9 AI personalities can transform every aspect of your life
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

        {/* Detailed Features */}
        <section className="container mx-auto px-6 py-20" aria-labelledby="detailed-features-heading">
          <h2 id="detailed-features-heading" className="text-4xl font-bold text-white text-center mb-6">
            Detailed Features
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Explore the comprehensive capabilities that make EPI Brain your ultimate AI companion
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {detailedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-8 hover:border-[#7B3FF2] transition-all hover:shadow-lg hover:shadow-[#7B3FF2]/20 group"
                >
                  <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="text-[#7B3FF2]" size={32} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center" aria-labelledby="cta-heading">
          <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience the power of 9 specialized AI personalities designed for your success
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
          <div className="text-center text-gray-400">
            <p>© 2025 EPI Brain. Built with ❤️ by <a href="https://twin-wicks.com" target="_blank" rel="noopener noreferrer" className="text-[#7B3FF2] hover:text-[#A78BFA] transition-colors underline">Twin Wicks Digital Solutions</a></p>
          </div>
        </footer>
      </main>
    </div>
  );
}
