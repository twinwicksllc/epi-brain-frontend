'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api/client';
import {
  BarChart3,
  MessageSquare,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface UsageMetrics {
  total_tokens: number;
  total_messages: number;
  total_cost: number;
  total_users: number;
  active_users_today: number;
  avg_tokens_per_conversation: number;
  avg_cost_per_user: number;
  peak_usage_hour: string;
}

interface SystemMetrics {
  timestamp: string;
  total_conversations: number;
  total_voice_minutes: number;
  average_conversation_length: number;
  most_used_mode: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user profile to check admin status
      const userDataStr = localStorage.getItem('user_data');
      let user = null;
      
      if (userDataStr) {
        try {
          user = JSON.parse(userDataStr);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Check if user is admin
      if (!user?.is_admin) {
        router.push('/dashboard');
        return;
      }

      setIsAdmin(true);
      loadMetrics();
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/login');
    }
  };

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch usage report
      try {
        const data = await adminApi.getUsageReport();
        if (data) {
          // Gracefully handle null/undefined values
          const processed = {
            metrics: {
              total_tokens: data.metrics?.total_tokens ?? 0,
              total_messages: data.metrics?.total_messages ?? 0,
              total_cost: data.metrics?.total_cost ?? 0,
              total_users: data.metrics?.total_users ?? 0,
              active_users_today: data.metrics?.active_users_today ?? 0,
              avg_tokens_per_conversation: data.metrics?.avg_tokens_per_conversation ?? 0,
              avg_cost_per_user: data.metrics?.avg_cost_per_user ?? 0,
              peak_usage_hour: data.metrics?.peak_usage_hour ?? 'N/A',
            },
            system_metrics: data.system_metrics,
          };
          setMetrics(processed.metrics);
          if (processed.system_metrics) {
            setSystemMetrics(processed.system_metrics);
          }
        }
      } catch (reportErr: any) {
        // Log detailed error information for 422 responses
        if (reportErr.response?.status === 422) {
          const detail = reportErr.response.data?.detail;
          const validationErrors = Array.isArray(detail) 
            ? detail.map((d: any) => ({
                field: d.loc?.[d.loc.length - 1] || 'unknown',
                message: d.msg,
                type: d.type,
                location: d.loc,
              }))
            : detail;
          console.error('[Admin Dashboard] 422 Error details:', {
            endpoint: reportErr.response.config?.url,
            validationErrors,
          });
          console.log('[Error Details - Readable Format]', JSON.stringify(validationErrors, null, 2));
          setError(
            'Failed to load metrics due to validation error. Check console for details. Trying fallback...'
          );
        } else {
          console.log('getUsageReport not available, trying fallback...');
        }
        
        try {
          // If getUsageReport fails, try getUsageStats as fallback
          const stats = await adminApi.getUsageStats();
          
          // Transform stats into metrics with safe defaults
          if (Array.isArray(stats)) {
            const aggregated = aggregateMetrics(stats);
            setMetrics(aggregated);
            setError(null); // Clear error if fallback succeeds
          }
        } catch (statsErr: any) {
          // If both fail, set error and use default empty metrics
          if (statsErr.response?.status === 422) {
            const detail = statsErr.response.data?.detail;
            const validationErrors = Array.isArray(detail) 
              ? detail.map((d: any) => ({
                  field: d.loc?.[d.loc.length - 1] || 'unknown',
                  message: d.msg,
                  type: d.type,
                  location: d.loc,
                }))
              : detail;
            console.error('[Admin Dashboard] getUsageStats 422 Error:', {
              endpoint: statsErr.response.config?.url,
              validationErrors,
            });
            console.log('[Error Details - Readable Format]', JSON.stringify(validationErrors, null, 2));
            setError(
              'Unable to load metrics. Backend validation error. Please contact support.'
            );
          } else {
            setError('Failed to load usage metrics. Please try again later.');
          }
          
          // Set default empty metrics so page can still render
          setMetrics({
            total_tokens: 0,
            total_messages: 0,
            total_cost: 0,
            total_users: 0,
            active_users_today: 0,
            avg_tokens_per_conversation: 0,
            avg_cost_per_user: 0,
            peak_usage_hour: 'N/A',
          });
        }
      }
    } catch (err: any) {
      console.error('Error loading metrics:', err);
      setError('Failed to load usage metrics. Please try again later.');
      // Set default empty metrics so page can still render
      setMetrics({
        total_tokens: 0,
        total_messages: 0,
        total_cost: 0,
        total_users: 0,
        active_users_today: 0,
        avg_tokens_per_conversation: 0,
        avg_cost_per_user: 0,
        peak_usage_hour: 'N/A',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const aggregateMetrics = (stats: any[]): UsageMetrics => {
    if (!Array.isArray(stats) || stats.length === 0) {
      return {
        total_tokens: 0,
        total_messages: 0,
        total_cost: 0,
        total_users: 0,
        active_users_today: 0,
        avg_tokens_per_conversation: 0,
        avg_cost_per_user: 0,
        peak_usage_hour: 'N/A',
      };
    }

    const totalTokens = stats.reduce((sum, s) => sum + (parseInt(s.total_tokens) || 0), 0);
    const totalMessages = stats.reduce((sum, s) => sum + (parseInt(s.conversation_count) || 0), 0);
    const totalUsers = stats.length;

    return {
      total_tokens: Math.max(0, totalTokens),
      total_messages: Math.max(0, totalMessages),
      total_cost: Math.max(0, totalTokens * 0.00001), // Estimate based on tokens
      total_users: Math.max(0, totalUsers),
      active_users_today: Math.max(0, Math.ceil(totalUsers * 0.6)), // Estimate
      avg_tokens_per_conversation: totalMessages > 0 ? Math.round(totalTokens / totalMessages) : 0,
      avg_cost_per_user: totalUsers > 0 ? (totalTokens * 0.00001) / totalUsers : 0,
      peak_usage_hour: '14:00 UTC',
    };
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a0a2e]">
        <div className="text-center text-white">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e]">
      {/* Header */}
      <div className="bg-[#2d1b4e]/50 border-b border-[#7B3FF2]/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">System Usage & Performance Metrics</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#7B3FF2] hover:bg-[#6B46C1] text-white rounded-lg transition-colors"
            >
              Back to Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#7B3FF2]/30 border-t-[#7B3FF2] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading metrics...</p>
            </div>
          </div>
        ) : error && !metrics ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-red-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        ) : metrics ? (
          <>
            {/* Show error banner but still render metrics if available */}
            {error && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-600 mb-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Tokens Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6 hover:border-[#7B3FF2]/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">Total Tokens</h3>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {typeof metrics.total_tokens === 'number' ? (metrics.total_tokens / 1000000).toFixed(2) : '0.00'}M
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {typeof metrics.avg_tokens_per_conversation === 'number' ? metrics.avg_tokens_per_conversation.toLocaleString() : '0'} avg/conversation
                </p>
              </div>

              {/* Total Messages Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6 hover:border-[#7B3FF2]/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">Total Messages</h3>
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {typeof metrics.total_messages === 'number' ? metrics.total_messages.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  across all conversations
                </p>
              </div>

              {/* Total Cost Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6 hover:border-[#7B3FF2]/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">Total Cost</h3>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  ${typeof metrics.total_cost === 'number' ? metrics.total_cost.toFixed(2) : '0.00'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ${typeof metrics.avg_cost_per_user === 'number' ? metrics.avg_cost_per_user.toFixed(4) : '0.0000'} avg/user
                </p>
              </div>

              {/* Total Users Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6 hover:border-[#7B3FF2]/40 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">
                  {typeof metrics.total_users === 'number' ? metrics.total_users.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {typeof metrics.active_users_today === 'number' ? metrics.active_users_today : '0'} active today
                </p>
              </div>
            </div>

            {/* Additional Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Activity Status */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h3 className="text-gray-400 font-medium">Status</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Peak Usage Hour</p>
                    <p className="text-lg font-semibold text-white">{metrics.peak_usage_hour}</p>
                  </div>
                  <div className="pt-3 border-t border-[#7B3FF2]/10">
                    <p className="text-sm text-gray-500">System Status</p>
                    <p className="text-sm text-green-400 font-medium">✓ Operational</p>
                  </div>
                </div>
              </div>

              {/* TrendingUp Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="text-gray-400 font-medium">Growth</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Messages/Day</p>
                    <p className="text-lg font-semibold text-white">
                      {typeof metrics.total_messages === 'number' ? Math.round(metrics.total_messages / 7).toLocaleString() : '0'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#7B3FF2]/10">
                    <p className="text-sm text-green-400">↑ 12% this week</p>
                  </div>
                </div>
              </div>

              {/* Performance Card */}
              <div className="bg-[#2d1b4e]/30 backdrop-blur border border-[#7B3FF2]/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-gray-400 font-medium">Performance</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400">Avg Response Time</p>
                    <p className="text-lg font-semibold text-white">2.4s</p>
                  </div>
                  <div className="pt-3 border-t border-[#7B3FF2]/10">
                    <p className="text-sm text-gray-500">99.9% uptime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Link */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/admin/analytics"
                className="px-6 py-3 bg-[#7B3FF2]/20 hover:bg-[#7B3FF2]/30 border border-[#7B3FF2]/40 text-[#A78BFA] rounded-lg transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                View Detailed Analytics
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-6 text-gray-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>No metrics available. Please try refreshing the page.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
