'use client';

import { useRouter } from 'next/navigation';
import NeuronParticles from '@/components/NeuronParticles';
import { MessageSquare, Briefcase, BookOpen, Palette, Cross, Headphones, Brain, TrendingUp, Dumbbell } from 'lucide-react';

// Force cache invalidation - deployed 2025-01-12

// Force cache invalidation - deployed 2025-01-12

const modes = [
  {
    id: 'personal_friend',
    name: 'Personal Friend',
    icon: MessageSquare,
    description: 'Your 24/7 companion for emotional support and daily check-ins',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'sales_agent',
    name: 'Sales Agent',
    icon: Briefcase,
    description: 'Master NEBP methodology and practice sales scenarios',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'student_tutor',
    name: 'Student/Tutor',
    icon: BookOpen,
    description: 'Personalized learning with performance tracking and grading',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'kids_learning',
    name: 'Kids Learning',
    icon: Palette,
    description: 'Fun, interactive learning for young minds',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'christian_companion',
    name: 'Christian Companion',
    icon: Cross,
    description: 'Prayer support, Bible study, and spiritual guidance',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    icon: Headphones,
    description: 'Practice difficult scenarios and de-escalation techniques',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'psychology_expert',
    name: 'Psychology Expert',
    icon: Brain,
    description: 'Emotional intelligence and stress management support',
    color: 'from-purple-500 to-blue-500',
  },
  {
    id: 'business_mentor',
    name: 'Business Mentor',
    icon: TrendingUp,
    description: 'Strategic guidance for business growth and success',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'weight_loss_coach',
    name: 'Weight Loss Coach',
    icon: Dumbbell,
    description: 'Personalized fitness and nutrition guidance',
    color: 'from-green-500 to-teal-500',
  },
];

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
      
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8 flex justify-end items-center">
          <button
            onClick={handleSignIn}
            className="px-6 py-2 bg-transparent border border-[#7B3FF2] text-white rounded-lg hover:bg-[#7B3FF2] transition-colors"
          >
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo"
              className="mx-auto w-[230px] h-[230px] object-contain"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
            EPI Brain
          </h1>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] bg-clip-text text-transparent">
              Life Companion
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Experience 9 distinct AI personalities designed to enhance your life, business, and personal growth.
            Available 24/7 to support, guide, and inspire you.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
          >
            Get Started Free
          </button>
        </section>

        {/* Modes Grid */}
        <section className="container mx-auto px-6 py-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Choose Your AI Personality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-6 hover:border-[#7B3FF2] transition-all hover:shadow-lg hover:shadow-[#7B3FF2]/20 cursor-pointer group"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${mode.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    {mode.name}
                  </h4>
                  <p className="text-gray-400">
                    {mode.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-[#7B3FF2]" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Real-time Conversations</h4>
              <p className="text-gray-400">Experience natural, flowing conversations with instant AI responses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-[#7B3FF2]" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">9 Unique Personalities</h4>
              <p className="text-gray-400">Switch between specialized AI modes tailored to your needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7B3FF2]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-[#7B3FF2]" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Track Your Progress</h4>
              <p className="text-gray-400">Monitor your growth and achievements across all interactions</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Life?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users already experiencing the power of AI companionship
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-[#7B3FF2]/20">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 EPI Brain. Built with ❤️ by TwinWicks LLC</p>
          </div>
        </footer>
      </div>
    </div>
  );
}