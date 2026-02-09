'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [discoveryData, setDiscoveryData] = useState<{ name?: string; intent?: string } | null>(null);
  const [contextMode, setContextMode] = useState<string | null>(null);
  const [contextConversationId, setContextConversationId] = useState<string | null>(null);

  useEffect(() => {
    // Read search params and other client-side only operations
    const getSearchParams = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const conversationId = params.get('conversation_id');
        
        if (mode) setContextMode(mode);
        if (conversationId) setContextConversationId(conversationId);
      }
    };
    
    getSearchParams();
    
    // Load discovery data from localStorage using new keys
    const tempName = localStorage.getItem('epi_temp_name');
    const tempIntent = localStorage.getItem('epi_temp_intent');
    
    if (tempName || tempIntent) {
      const data = {
        name: tempName || undefined,
        intent: tempIntent || undefined
      };
      setDiscoveryData(data);
      
      // Pre-fill form fields
      if (tempName) setFullName(tempName);
      if (tempIntent) setPrimaryGoal(tempIntent);
    } else {
      // Fallback to old discovery_data format for compatibility
      const data = localStorage.getItem('discovery_data');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setDiscoveryData(parsed);
          if (parsed.name) setFullName(parsed.name);
          if (parsed.intent) setPrimaryGoal(parsed.intent);
        } catch (e) {
          console.error('Failed to parse discovery data:', e);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest<{ access_token: string; refresh_token: string; user?: any | null }>(
        '/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      
      const tokenData = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        token: response.access_token,
      };

      Object.entries(tokenData).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Preserve conversation context from homepage guest session
      if (contextConversationId) {
        localStorage.setItem('conversation_id', contextConversationId);
        console.log('[Register] Preserved conversation context:', contextConversationId);
      }
      
      // If user was in discovery mode, preserve that too
      if (contextMode === 'discovery') {
        sessionStorage.setItem('resumeDiscoveryMode', 'true');
        console.log('[Register] Will resume discovery mode after login');
      }
      
      // Keep discovery data for the dashboard to use
      // It will be cleared after the first dashboard load
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img
            src="/assets/brain-logo-landing.png"
            alt="EPI Brain Logo"
            className="mx-auto w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          {discoveryData?.name ? (
            <p className="text-gray-300">
              Welcome back, <span className="text-[#7B3FF2] font-semibold">{discoveryData.name}</span>! Let's continue your journey.
            </p>
          ) : (
            <p className="text-gray-400">Start your AI-powered journey today</p>
          )}
        </div>

        <div className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e] border border-[#7B3FF2]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7B3FF2]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-300 mb-2">
                Primary Goal
              </label>
              <input
                id="primaryGoal"
                type="text"
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e] border border-[#7B3FF2]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7B3FF2]"
                placeholder="e.g., Sales training, Personal growth"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e] border border-[#7B3FF2]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7B3FF2]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e] border border-[#7B3FF2]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7B3FF2]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a0a2e] border border-[#7B3FF2]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7B3FF2]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-[#7B3FF2] hover:text-[#A78BFA] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}