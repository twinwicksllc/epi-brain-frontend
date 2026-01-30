'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api/client';
import { Lock } from 'lucide-react';
import NeuronParticles from '@/components/NeuronParticles';
import Image from 'next/image';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  subscribed_personalities: string[];
  is_admin: boolean;
}

interface Personality {
  id: string;
  name: string;
  image: string;
  description: string;
}

const personalities: Personality[] = [
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

export default function ConsolePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setUserProfile(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to load your profile. Please try again.');
      
      // Redirect to login if unauthorized
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const isPersonalityUnlocked = (personalityId: string): boolean => {
    if (!userProfile) return false;
    
    // Admins have access to all personalities
    if (userProfile.is_admin) return true;
    
    // Check if personality is in subscribed list
    return userProfile.subscribed_personalities.includes(personalityId);
  };

  const handlePersonalityClick = (personalityId: string) => {
    if (isPersonalityUnlocked(personalityId)) {
      router.push(`/chat?mode=${personalityId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
        <NeuronParticles />
        
        <main className="relative z-10">
          {/* Header Skeleton */}
          <header className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-10 w-48 bg-white/10 rounded-lg mb-2 animate-pulse"></div>
                <div className="h-6 w-64 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </header>

          {/* Skeleton Grid */}
          <section className="container mx-auto px-6 py-12">
            <div className="h-8 w-64 bg-white/10 rounded-lg mb-8 animate-pulse"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-white/20 backdrop-blur-md bg-white/5 p-6 animate-pulse"
                >
                  {/* Icon skeleton */}
                  <div className="w-16 h-16 rounded-xl bg-white/10 mb-4"></div>
                  
                  {/* Title skeleton */}
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
                  
                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded"></div>
                    <div className="h-4 w-5/6 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
        <NeuronParticles />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl max-w-md">
            <div className="text-red-400 text-xl mb-4">{error}</div>
            <button
              onClick={fetchUserProfile}
              className="px-6 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all duration-300 transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] relative overflow-hidden">
      <NeuronParticles />
      
      <main className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8 flex justify-end items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/20 text-white rounded-lg hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300"
          >
            Dashboard
          </button>
        </header>

        {/* Hero Section with Logo */}
        <section className="container mx-auto px-6 py-8 text-center">
          <div className="mb-6">
            <img
              src="/assets/brain-logo-landing.png"
              alt="EPI Brain Logo - AI Life Companion"
              className="mx-auto w-[180px] h-[180px] object-contain"
              width="180"
              height="180"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Console
          </h1>
          <p className="text-xl text-[#E0D7FF] mb-2">
            Welcome back, {userProfile?.name || userProfile?.email}
            {userProfile?.is_admin && (
              <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full">
                Admin
              </span>
            )}
          </p>
        </section>

        {/* Personalities Grid */}
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-8">
            Select Your AI Personality
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {personalities.map((personality) => {
              const isUnlocked = isPersonalityUnlocked(personality.id);
              
              return (
                <div
                  key={personality.id}
                  onClick={() => handlePersonalityClick(personality.id)}
                  className={`
                    relative overflow-hidden group rounded-xl border border-white/20 backdrop-blur-md transition-all duration-300 aspect-[3/4]
                    ${isUnlocked
                      ? 'hover:shadow-[0_0_30px_rgba(123,63,242,0.4)] hover:border-[#7B3FF2]/50 cursor-pointer'
                      : 'grayscale opacity-50 hover:opacity-70 cursor-default'
                    }
                  `}
                >
                  {/* Background Image */}
                  <div className={`absolute inset-0 transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-105' : ''}`}>
                    <Image
                      src={personality.image}
                      alt={`${personality.name} AI Personality`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a102e] via-[#1a102e]/60 to-transparent" />

                  {/* Locked Badge */}
                  {!isUnlocked && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                      <Lock size={12} className="text-white/70" />
                      <span className="text-xs text-white/70 font-semibold">Locked</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end items-center text-center p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {personality.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      isUnlocked ? 'text-[#E0D7FF]' : 'text-gray-400'
                    }`}>
                      {personality.description}
                    </p>

                    {isUnlocked && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-gradient-to-r from-[#7B3FF2] to-[#3B82F6] bg-clip-text text-transparent">Click to start</span>
                        <span className="text-[#7B3FF2]">→</span>
                      </div>
                    )}

                    {!isUnlocked && (
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push('/pricing');
                          }}
                          className="w-full px-4 py-2 bg-gradient-to-r from-[#7B3FF2] to-[#3B82F6] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all transform hover:scale-105"
                        >
                          View Plans
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Hover Glow Effect for unlocked cards */}
                  {isUnlocked && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#7B3FF2]/20 to-transparent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info message for locked personalities */}
          {!userProfile?.is_admin && (
            <div className="mt-12 max-w-3xl mx-auto text-center">
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(123,63,242,0.2)]">
                <Lock size={32} className="text-[#A78BFA] mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Unlock More Personalities
                </h3>
                <p className="text-[#E0D7FF] mb-4">
                  Upgrade your subscription to access all AI personalities and unlock their full potential.
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="px-6 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#3B82F6] text-white rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all duration-300 transform hover:scale-105"
                >
                  View Pricing
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
