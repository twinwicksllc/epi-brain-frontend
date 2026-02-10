import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Construct base URL, avoiding double prefix
const normalizedBaseUrl = API_URL.replace(/\/+$/, ''); // Remove trailing slashes
const apiBaseURL = normalizedBaseUrl.includes(`/api/${API_VERSION}`)
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/${API_VERSION}`;

// Create axios instance
export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('Request interceptor - token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request interceptor - adding auth header for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response interceptor - success:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.log('Response interceptor - error:', error.config?.url, error.response?.status, error.response?.data);
    console.log('Full error object:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack?.substring(0, 200)
    });
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Don't try to refresh for voice API (it has different auth issues)
      if (originalRequest.url?.includes('/voice/')) {
        console.log('Skipping refresh for voice API endpoint - using original error');
        return Promise.reject(error);
      }

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log('Token refresh failed, clearing tokens and redirecting to login');
        // Only clear auth tokens, not entire localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getVoiceStats: async () => {
    const response = await apiClient.get('/voice/stats');
    return response.data;
  },
};

// Chat API
export const chatApi = {
  sendMessage: async (mode: string, message: string, conversationId?: string) => {
    console.log('chatApi.sendMessage called with:', { mode, message, conversationId });
    const response = await apiClient.post('/chat/message', {
      mode,
      message,
      conversation_id: conversationId,
    });
    console.log('chatApi.sendMessage response:', response.data);
    return response.data;
  },

  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  deleteConversation: async (conversationId: string) => {
    const response = await apiClient.delete(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  getConversationDepth: async (conversationId: string) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/depth`);
    return response.data;
  },
};

// Modes API
export const modesApi = {
  getModes: async () => {
    const response = await apiClient.get('/modes');
    return response.data;
  },

  getMode: async (modeId: string) => {
    const response = await apiClient.get(`/modes/${modeId}`);
    return response.data;
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  getProfileWithMetrics: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },

  getUsage: async () => {
    const response = await apiClient.get('/users/me/usage');
    return response.data;
  },
};

// Assistant Tools API
export const assistantToolsApi = {
  createNote: async (data: { title?: string; content: string; type?: string }) => {
    const response = await apiClient.post('/assistant-tools/notes', data);
    return response.data;
  },

  getNotes: async () => {
    const response = await apiClient.get('/assistant-tools/notes');
    return response.data;
  },

  getNote: async (noteId: string) => {
    const response = await apiClient.get(`/assistant-tools/notes/${noteId}`);
    return response.data;
  },

  deleteNote: async (noteId: string) => {
    const response = await apiClient.delete(`/assistant-tools/notes/${noteId}`);
    return response.data;
  },

  sendInternalMessage: async (data: { message: string; priority?: string }) => {
    const response = await apiClient.post('/assistant-tools/internal-message', data);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  getUsageStats: async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get('/admin/usage', {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('[Admin API 401 Error] Missing or invalid admin key:', {
          status: error.response.status,
          statusText: error.response.statusText,
          message: 'Admin API key is missing or not configured',
        });
      } else if (error.response?.status === 403) {
        console.error('[Admin API 403 Error] Admin key is forbidden/invalid:', {
          status: error.response.status,
          statusText: error.response.statusText,
          message: 'The provided admin key is invalid or has insufficient permissions',
        });
      }
      throw error;
    }
  },

  getUserUsage: async (userId: string) => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get(`/admin/usage/${userId}`, {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('[Admin API 401 Error] Missing or invalid admin key:', {
          status: error.response.status,
          statusText: error.response.statusText,
          userId,
          message: 'Admin API key is missing or not configured',
        });
      } else if (error.response?.status === 403) {
        console.error('[Admin API 403 Error] Admin key is forbidden/invalid:', {
          status: error.response.status,
          statusText: error.response.statusText,
          userId,
          message: 'The provided admin key is invalid or has insufficient permissions',
        });
      }
      throw error;
    }
  },

  getUsageReport: async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get('/admin/usage/report', {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.error('[Admin API 401 Error] Missing or invalid admin key:', {
          status: error.response.status,
          statusText: error.response.statusText,
          message: 'Admin API key is missing or not configured',
        });
      } else if (error.response?.status === 403) {
        console.error('[Admin API 403 Error] Admin key is forbidden/invalid:', {
          status: error.response.status,
          statusText: error.response.statusText,
          message: 'The provided admin key is invalid or has insufficient permissions',
        });
      }
      throw error;
    }
  },

  // Voice-specific admin endpoints
  getVoiceStatsToday: async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get('/admin/voice-stats/today', {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      console.error('[Admin API Error] getVoiceStatsToday failed:', error);
      throw error;
    }
  },

  getVoiceStatsMonth: async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get('/admin/voice-stats/month', {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      console.error('[Admin API Error] getVoiceStatsMonth failed:', error);
      throw error;
    }
  },

  getVoiceProjection: async () => {
    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY;
      if (!adminKey) {
        console.error('[Admin API Error] NEXT_PUBLIC_ADMIN_API_KEY is not configured');
        throw new Error('Admin API key is not configured');
      }
      const response = await apiClient.get('/admin/voice-stats/projection', {
        params: { admin_key: adminKey },
      });
      return response.data;
    } catch (error: any) {
      console.error('[Admin API Error] getVoiceProjection failed:', error);
      throw error;
    }
  },
};