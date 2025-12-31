import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const PROXY_API_URL = '/api/proxy'; // Local proxy as fallback

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create proxy axios instance as fallback
export const proxyApiClient = axios.create({
  baseURL: PROXY_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for proxy client to add auth token
proxyApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${PROXY_API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return proxyApiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
    // Always use proxy for GitHub Codespaces to avoid CORS issues
    console.log('Using proxy for registration...');
    const proxyResponse = await proxyApiClient.post('/auth/register', {
      email,
      password,
      voice_preference: 'none',
    });
    return proxyResponse.data;
  },

  login: async (email: string, password: string) => {
    const response = await proxyApiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    await proxyApiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Chat API
export const chatApi = {
  sendMessage: async (message: string, conversationId?: string, mode: string = 'personal_friend') => {
    const response = await proxyApiClient.post('/chat/message', {
      message,
      conversation_id: conversationId,
      mode,
    });
    return response.data;
  },

  getConversations: async () => {
    const response = await proxyApiClient.get('/chat/conversations');
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await proxyApiClient.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },

  deleteConversation: async (conversationId: string) => {
    await proxyApiClient.delete(`/chat/conversations/${conversationId}`);
  },
};

// User API
export const userApi = {
  getProfile: async () => {
    const response = await proxyApiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await proxyApiClient.put('/users/me', data);
    return response.data;
  },

  getUsage: async () => {
    const response = await proxyApiClient.get('/users/me/usage');
    return response.data;
  },
};

// Modes API
export const modesApi = {
  getAvailableModes: async () => {
    const response = await proxyApiClient.get('/modes');
    return response.data;
  },

  getModeDetails: async (modeId: string) => {
    const response = await proxyApiClient.get(`/modes/${modeId}`);
    return response.data;
  },

  switchMode: async (modeId: string) => {
    const response = await proxyApiClient.post('/modes/switch', null, {
      params: { mode_id: modeId },
    });
    return response.data;
  },
};