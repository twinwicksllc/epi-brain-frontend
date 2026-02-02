import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance for public/unauthenticated requests
export const publicApiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - DO NOT add auth headers for public client
publicApiClient.interceptors.request.use(
  (config) => {
    // Explicitly do NOT add auth headers
    console.log('Public API client - request to:', config.url, '(no auth)');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
publicApiClient.interceptors.response.use(
  (response) => {
    console.log('Public API client - success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('Public API client - error:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

// Public Chat API for discovery mode
export const publicChatApi = {
  sendMessage: async (mode: string, message: string) => {
    const response = await publicApiClient.post('/chat/message', {
      mode,
      message,
    });
    return response.data;
  },
};