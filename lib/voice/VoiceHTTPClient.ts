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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
    
    // Construct base URL, avoiding double prefix
    const normalizedUrl = apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
    this.baseURL = normalizedUrl.includes(`/api/${apiVersion}`)
      ? normalizedUrl
      : `${normalizedUrl}/api/${apiVersion}`;
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
      const response = await fetch(`${this.baseURL}/voice/generate`, {
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

  /**
   * Stream speech generation with ElevenLabs
   * Begins speaking as soon as first audio chunks arrive
   */
  async* streamSpeech(
    textStream: AsyncIterable<string>,
    personality: string,
    gender: string
  ): AsyncGenerator<Blob> {
    console.log('🔊 Voice: Starting streaming TTS with ElevenLabs');
    
    let accumulatedText = '';
    const CHUNK_THRESHOLD = 15; // Send to TTS after this many characters (words)
    
    for await (const textChunk of textStream) {
      accumulatedText += textChunk;
      
      // Check if we have enough text to generate audio (roughly a phrase)
      if (accumulatedText.length >= CHUNK_THRESHOLD) {
        const textToSpeak = accumulatedText.trim();
        
        if (textToSpeak) {
          console.log('🔊 Voice: Generating audio chunk for:', textToSpeak.substring(0, 50) + '...');
          
          try {
            // Generate audio for this text chunk
            const audioBlob = await this.generateSpeech({
              text: textToSpeak,
              personality,
              gender,
              model: 'eleven_turbo_v2', // Use Turbo for ultra-low latency
              output_format: 'mp3',
            });
            
            console.log('🔊 Voice: Yielding audio chunk, size:', audioBlob.size);
            yield audioBlob;
            
            // Reset accumulator
            accumulatedText = '';
          } catch (error) {
            console.error('🔊 Voice: Error generating audio chunk:', error);
            // Continue with next chunk even if one fails
          }
        }
      }
    }
    
    // Generate final chunk if any text remains
    if (accumulatedText.trim()) {
      console.log('🔊 Voice: Generating final audio chunk');
      try {
        const audioBlob = await this.generateSpeech({
          text: accumulatedText.trim(),
          personality,
          gender,
          model: 'eleven_turbo_v2',
          output_format: 'mp3',
        });
        yield audioBlob;
      } catch (error) {
        console.error('🔊 Voice: Error generating final audio chunk:', error);
      }
    }
    
    console.log('🔊 Voice: Streaming TTS complete');
  }

  /**
   * Transcribe audio using Whisper V3 Turbo
   * Optimized for near-instant transcription
   */
  async transcribeAudio(audioBlob: Blob): Promise<string> {
    console.log('🎤 Voice: Transcribing audio with Whisper V3 Turbo');
    console.log('🎤 Voice: Audio size:', audioBlob.size, 'bytes');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-large-v3-turbo');

      const response = await fetch(`${this.baseURL}/voice/transcribe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎤 Voice: Transcription error:', response.status, errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('🎤 Voice: Transcription result:', result);
      
      return result.text || result.transcription || '';

    } catch (error) {
      console.error('🎤 Voice: Error transcribing audio:', error);
      throw error;
    }
  }
}

// Singleton instance
export const voiceHTTPClient = new VoiceHTTPClient();