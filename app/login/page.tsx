'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiRequest<{ access_token: string; refresh_token: string; user?: any | null }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      );
      
      // Store tokens efficiently
      const tokenData = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        token: response.access_token
      };
      
      // Batch localStorage operations
      Object.entries(tokenData).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      
      // Store user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        // Create minimal user object if not provided
        const user = {
          id: email,
          email: email,
          name: email.charAt(0).toUpperCase(), // Use first letter of email as name
          tier: 'FREE'
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      console.log('Login successful, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue your journey</p>
        </div>

        <div className="bg-[#2d1b4e] border border-[#7B3FF2]/20 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-[#7B3FF2] to-[#A78BFA] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#7B3FF2]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#7B3FF2] hover:text-[#A78BFA] font-medium">
                Sign up
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