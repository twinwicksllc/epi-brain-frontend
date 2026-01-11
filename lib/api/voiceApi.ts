import { apiClient } from './client';

export interface VoiceStats {
  total_characters: number;
  total_requests: number;
  total_cost: number;
  today_characters: number;
  today_requests: number;
  today_cost: number;
  limit?: number;
  remaining?: number;
}

export interface AvailableVoices {
  [mode: string]: {
    male: string;
    female: string;
  };
}

class VoiceApi {
  async getVoiceStats(): Promise<VoiceStats> {
    console.log('🔊 Voice API: Getting voice stats...');
    try {
      const response = await apiClient.get('/voice/stats');
      console.log('🔊 Voice API: Stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Voice API: Error getting stats:', error);
      throw error;
    }
  }

  async getAvailableVoices(): Promise<AvailableVoices> {
    const response = await apiClient.get('/voice/available-voices');
    return response.data;
  }
}

export const voiceApi = new VoiceApi();
export default voiceApi;