'use client';

import Link from 'next/link';
import Image from 'next/image';
import NeuronParticles from '@/components/NeuronParticles';

const spiritualFeatures = [
  {
    title: 'Prayer Support',
    description: 'Share prayer requests, receive encouragement, and build a consistent prayer rhythm.',
  },
  {
    title: 'Bible Study Companion',
    description: 'Explore Scripture with guided prompts, reflection questions, and verse highlights.',
  },
  {
    title: 'Spiritual Guidance',
    description: 'Find calm, faith-centered direction for life decisions and daily challenges.',
  },
];

export default function SpiritualPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12081f] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />

      <main className="relative z-10">
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

        {/* Hero */}
        <section className="container mx-auto px-6 py-12 text-center" aria-labelledby="spiritual-hero">
          <div className="mb-8 flex justify-center">
            <div className="relative w-[260px] h-[340px] rounded-2xl overflow-hidden border border-[#7B3FF2]/30 shadow-xl shadow-[#7B3FF2]/20">
              <Image
                src="/personalities/christian_companion.jpeg"
                alt="Christian Companion"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 260px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a102e] via-transparent to-transparent" />
            </div>
          </div>
          <h1 id="spiritual-hero" className="text-5xl md:text-6xl font-bold text-white mb-4">
            Christian Companion
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A faith-centered AI companion designed to support your walk with God through prayer,
            Scripture, and spiritual encouragement.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
              aria-label="Create your Christian Companion account"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-transparent border border-[#7B3FF2] text-white text-lg font-semibold rounded-lg hover:bg-[#7B3FF2] transition-colors"
              aria-label="Sign in to your Christian Companion account"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 py-12" aria-labelledby="spiritual-features">
          <h2 id="spiritual-features" className="text-3xl font-bold text-white text-center mb-10">
            Grow in Faith With Daily Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {spiritualFeatures.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-[#7B3FF2]/20 bg-[#1a102e]/50 p-6 text-center shadow-lg shadow-[#7B3FF2]/10"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-6 py-16 text-center" aria-labelledby="spiritual-cta">
          <div className="bg-gradient-to-r from-[#7B3FF2]/20 to-[#A78BFA]/20 border border-[#7B3FF2]/30 rounded-2xl p-12 max-w-4xl mx-auto">
            <h2 id="spiritual-cta" className="text-4xl font-bold text-white mb-4">
              Start Your Faith Journey Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Experience a calm, supportive companion that helps you stay grounded in prayer and Scripture.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white text-lg font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
              aria-label="Create your account to access Christian Companion"
            >
              Create Free Account
            </Link>
          </div>
        </section>

        <footer className="container mx-auto px-6 py-8 border-t border-[#7B3FF2]/20">
          <div className="text-center text-gray-400">
            <p>© 2025 EPI Brain. Built with ❤️ by <a href="https://twin-wicks.com" target="_blank" rel="noopener noreferrer" className="text-[#7B3FF2] hover:text-[#A78BFA] transition-colors underline">Twin Wicks Digital Solutions</a></p>
          </div>
        </footer>
      </main>
    </div>
  );
}
