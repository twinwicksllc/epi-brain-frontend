'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NeuronParticles from '@/components/NeuronParticles';
import Image from 'next/image';

// Force cache invalidation - deployed 2025-01-12

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

export default function Home() {
  const router = useRouter();
  const [displayedText, setDisplayedText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const messages = [
    "Hi, I'm EPI. Want to hear me talk and show you something cool?",
    "I can help you with sales, learning, or even prayer.",
    "I have 9 distinct personalities, each focused on helping you!",
    "Just say my name: EPI."
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

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-12 text-center" aria-labelledby="cta-heading">
          <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 id="cta-heading" className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Life?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users already experiencing the power of AI companionship
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
              aria-label="Start your journey with EPI Brain"
            >
              Start Your Journey
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-5 border-t border-[#7B3FF2]/20">
          <div className="text-gray-400 text-center">
            <p>
              © 2025 EPI Brain. Built with ❤️ by <a href="https://twin-wicks.com" target="_blank" rel="noopener noreferrer" className="text-[#7B3FF2] hover:text-[#A78BFA] transition-colors underline">Twin Wicks Digital Solutions</a>
            </p>
          </div>
        </footer>
      </main>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "EPI Brain",
            "url": "https://epibrain.app",
            "logo": "https://epibrain.app/assets/brain-logo-landing.png",
            "description": "AI-powered life companion platform with 9 specialized personalities",
            "sameAs": [
              "https://twitter.com/epibrain",
              "https://linkedin.com/company/epibrain"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "availableLanguage": "English"
            }
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "EPI Brain",
            "applicationCategory": "Lifestyle, Business, Education",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            },
            "featureList": [
              "9 specialized AI personalities",
              "Semantic memory across conversations",
              "Goal tracking and accountability",
              "Habit formation system",
              "CBT-based psychology support",
              "24/7 availability"
            ]
          })
        }}
      />
    </div>
  );
}