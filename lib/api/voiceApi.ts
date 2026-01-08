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
    const response = await apiClient.get('/voice/stats');
    return response.data;
  }

  async getAvailableVoices(): Promise<AvailableVoices> {
    const response = await apiClient.get('/voice/available-voices');
    return response.data;
  }
}

export const voiceApi = new VoiceApi();
export default voiceApi;