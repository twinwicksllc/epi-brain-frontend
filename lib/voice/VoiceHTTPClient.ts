/**
 * Voice HTTP Client - Simple HTTP-based TTS using OpenAI API
 * 
 * Replaces complex WebSocket implementation with simple HTTP POST
 * Much more reliable and easier to maintain
 */

import { authApi } from '../api/client';

export interface VoiceGenerateRequest {
  text: string;
  personality: string;
  gender: string;
  model?: string;
  output_format?: string;
  instructions?: string;
}

export class VoiceHTTPClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  /**
   * Generate speech using HTTP POST
   * Returns audio as blob
   */
  async generateSpeech(request: VoiceGenerateRequest): Promise<Blob> {
    console.log('🔊 Voice: Generating speech via HTTP POST');
    console.log('🔊 Voice: Request:', {
      textLength: request.text.length,
      personality: request.personality,
      gender: request.gender,
    });

    try {
      const response = await fetch(`${this.baseURL}/api/v1/voice/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔊 Voice: HTTP error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      console.log('🔊 Voice: Received audio response');
      
      const audioBlob = await response.blob();
      console.log('🔊 Voice: Audio blob size:', audioBlob.size, 'bytes');
      
      return audioBlob;

    } catch (error) {
      console.error('🔊 Voice: Error generating speech:', error);
      throw error;
    }
  }

  /**
   * Generate speech for personality with default settings
   */
  async speakText(text: string, personality: string, gender: string): Promise<Blob> {
    return this.generateSpeech({
      text,
      personality,
      gender,
      model: 'eleven_multilingual_v2',
      output_format: 'mp3',
    });
  }
}

// Singleton instance
export const voiceHTTPClient = new VoiceHTTPClient();