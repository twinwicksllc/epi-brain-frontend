'use client';

import NeuronParticles from '@/components/NeuronParticles';
import { MessageSquare, Brain, TrendingUp } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import WhyChooseEPI from '@/components/WhyChooseEPI';
import Link from 'next/link';
import Image from 'next/image';

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

const modes = [
  {
    id: 'personal_friend',
    name: 'Personal Friend',
    image: '/personalities/personal_companion.jpeg',
    description: 'Your 24/7 companion for emotional support and daily check-ins',
  },
  {
    id: 'sales_agent',
    name: 'Sales Agent',
    image: '/personalities/sales_trainer.jpeg',
    description: 'Master NEBP methodology and practice sales scenarios',
  },
  {
    id: 'student_tutor',
    name: 'Student/Tutor',
    image: '/personalities/student_tutor.jpeg',
    description: 'Personalized learning with performance tracking and grading',
  },
  {
    id: 'kids_learning',
    name: 'Kids Learning',
    image: '/personalities/kids_companion.jpeg',
    description: 'Fun, interactive learning for young minds',
  },
  {
    id: 'christian_companion',
    name: 'Christian Companion',
    image: '/personalities/christian_companion.jpeg',
    description: 'Prayer support, Bible study, and spiritual guidance',
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    image: '/personalities/customer_service.jpeg',
    description: 'Practice difficult scenarios and de-escalation techniques',
  },
  {
    id: 'psychology_expert',
    name: 'Psychology Expert',
    image: '/personalities/psychology_expert.jpeg',
    description: 'Emotional intelligence and stress management support',
  },
  {
    id: 'business_mentor',
    name: 'Business Mentor',
    image: '/personalities/business_mentor.jpeg',
    description: 'Strategic guidance for business growth and success',
  },
  {
    id: 'weight_loss_coach',
    name: 'Weight Loss Coach',
    image: '/personalities/weight_coach.jpeg',
    description: 'Personalized fitness and nutrition guidance',
  },
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

        {/* Modes Grid */}
        <section className="container mx-auto px-6 py-12" aria-labelledby="modes-heading">
          <h2 id="modes-heading" className="text-3xl font-bold text-white text-center mb-12">
            Choose Your AI Personality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {modes.map((mode) => (
              <article
                key={mode.id}
                className="relative overflow-hidden rounded-xl border border-[#7B3FF2]/20 hover:border-[#7B3FF2] transition-all hover:shadow-lg hover:shadow-[#7B3FF2]/30 cursor-pointer group aspect-[3/4]"
              >
                {/* Background Image */}
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={mode.image}
                    alt={`${mode.name} AI Personality`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a102e] via-[#1a102e]/60 to-transparent" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end items-center text-center p-6">
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {mode.name}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {mode.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#7B3FF2]/20 to-transparent" />
                </div>
              </article>
            ))}
          </div>
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
