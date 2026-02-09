'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api/client';
import { 
  Users, 
  MessageSquare, 
  Volume2, 
  ArrowUpDown,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface UsageStats {
  user_id: string;
  email: string;
  plan_tier: string;
  total_tokens: number;
  total_voice_minutes: number;
  conversation_count: number;
  last_active: string;
  created_at: string;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [stats, setStats] = useState<UsageStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof UsageStats>('total_tokens');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    checkAdminAuth();
    loadStats();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    // In production, verify admin role from user data
  };

  const loadStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.getUsageStats();
      setStats(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error loading usage stats:', error);
      if (error.response?.status === 401) {
        setError(
          'Admin API key is not configured or invalid. Please check environment variables and ensure NEXT_PUBLIC_ADMIN_API_KEY is set correctly.'
        );
      } else if (error.response?.status === 403) {
        setError(
          'Your admin API key does not have sufficient permissions to access this resource. Please contact your system administrator.'
        );
      } else if (error.response?.status) {
        setError(`Error loading analytics: ${error.response.statusText} (${error.response.status})`);
      } else {
        setError('Failed to load analytics. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof UsageStats) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortedStats = () => {
    let filtered = [...stats];

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(stat => stat.plan_tier === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return filtered;
  };

  const getTotalStats = () => {
    return {
      totalUsers: stats.length,
      totalTokens: stats.reduce((sum, s) => sum + s.total_tokens, 0),
      totalVoiceMinutes: stats.reduce((sum, s) => sum + s.total_voice_minutes, 0),
      totalConversations: stats.reduce((sum, s) => sum + s.conversation_count, 0),
    };
  };

  const totals = getTotalStats();
  const sortedStats = getSortedStats();

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      basic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      pro: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      enterprise: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };
    return colors[plan.toLowerCase()] || colors.free;
  };

  return (
    <div className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      {/* Simple Header for Admin */}
      <header className="bg-[#2d1b4e]/80 backdrop-blur-md border-b border-[#7B3FF2]/30 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <h1 className="text-xl font-bold text-white cursor-pointer hover:text-[#A78BFA] transition-colors">
                EPI Brain - Admin
              </h1>
            </Link>
            <Link 
              href="/dashboard"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <TrendingUp className="w-10 h-10 mr-3 text-[#A78BFA]" />
            Admin Analytics
          </h1>
          <p className="text-white/60">Monitor user activity and platform usage</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-600 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A78BFA]" />
          </div>
        ) : (
          <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Users',
              value: totals.totalUsers.toLocaleString(),
              icon: Users,
              color: 'from-blue-500 to-blue-600',
            },
            {
              label: 'Total Tokens',
              value: totals.totalTokens.toLocaleString(),
              icon: MessageSquare,
              color: 'from-purple-500 to-purple-600',
            },
            {
              label: 'Voice Minutes',
              value: totals.totalVoiceMinutes.toFixed(1),
              icon: Volume2,
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Conversations',
              value: totals.totalConversations.toLocaleString(),
              icon: MessageSquare,
              color: 'from-pink-500 to-pink-600',
            },
          ].map((card, index) => (
            <div
              key={index}
              className="relative p-6 rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(123, 63, 242, 0.1) 0%, rgba(107, 70, 193, 0.1) 100%)',
              }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 rounded-full blur-2xl`} />
              <card.icon className="w-8 h-8 text-[#A78BFA] mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-sm text-white/60">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'free', 'basic', 'pro', 'enterprise'].map(plan => (
            <button
              key={plan}
              onClick={() => setFilter(plan)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${filter === plan
                  ? 'bg-[#7B3FF2] text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                }
              `}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div 
          className="rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 63, 242, 0.05) 0%, rgba(107, 70, 193, 0.05) 100%)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {[
                    { field: 'email' as keyof UsageStats, label: 'User' },
                    { field: 'plan_tier' as keyof UsageStats, label: 'Plan' },
                    { field: 'total_tokens' as keyof UsageStats, label: 'Tokens' },
                    { field: 'total_voice_minutes' as keyof UsageStats, label: 'Voice (min)' },
                    { field: 'conversation_count' as keyof UsageStats, label: 'Conversations' },
                    { field: 'last_active' as keyof UsageStats, label: 'Last Active' },
                  ].map(column => (
                    <th
                      key={column.field}
                      onClick={() => handleSort(column.field)}
                      className="px-6 py-4 text-left text-sm font-semibold text-white/90 cursor-pointer hover:text-[#A78BFA] transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{column.label}</span>
                        <ArrowUpDown className={`w-4 h-4 transition-opacity ${
                          sortField === column.field ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                        }`} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A78BFA]" />
                      </div>
                    </td>
                  </tr>
                ) : sortedStats.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-white/60">
                      No usage data available
                    </td>
                  </tr>
                ) : (
                  sortedStats.map((stat, index) => (
                    <tr
                      key={stat.user_id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white/90">
                        {stat.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium border
                          ${getPlanBadgeColor(stat.plan_tier)}
                        `}>
                          {stat.plan_tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90 font-mono">
                        {stat.total_tokens.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90 font-mono">
                        {stat.total_voice_minutes.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/90 font-mono">
                        {stat.conversation_count}
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {new Date(stat.last_active).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
