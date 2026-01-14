/**
 * Voice Manager - Simplified to use HTTP instead of WebSocket
 * 
 * This version uses OpenAI's HTTP API instead of Deepgram WebSocket
 * Much more reliable and simpler implementation
 */

import { voiceHTTPClient } from './VoiceHTTPClient';
import { AudioPlayer } from './AudioPlayer';

export class VoiceManager {
  private audioPlayer: AudioPlayer;
  private isPlaying: boolean = false;
  private queue: Array<{text: string, personality: string, gender: string}> = [];
  private isProcessingQueue: boolean = false;

  constructor() {
    this.audioPlayer = new AudioPlayer();
  }

  /**
   * Get voice model for personality and gender
   * Maps to OpenAI voices internally on the backend
   */
  getVoiceModel(personality: string, gender: string): string {
    return `${personality}-${gender}`;
  }

  /**
   * Set voice gender preference
   */
  setGender(gender: string): void {
    console.log(`🔊 Voice: Gender set to ${gender}`);
    // Voice model is now handled by backend, this is just for logging
  }

  /**
   * Speak text using HTTP TTS
   */
  async speak(text: string, personality: string, gender: string): Promise<void> {
    console.log('🔊 VoiceManager: Starting speech generation');
    console.log('🔊 VoiceManager: Text length:', text.length);
    console.log('🔊 VoiceManager: Personality:', personality);
    console.log('🔊 VoiceManager: Gender:', gender);

    // Add to queue
    this.queue.push({ text, personality, gender });
    
    // Process queue
    this.processQueue();
  }

  /**
   * Process the voice queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.queue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      try {
        console.log('🔊 VoiceManager: Processing queued item');
        
        // Generate audio via HTTP
        const audioBlob = await voiceHTTPClient.speakText(
          item.text,
          item.personality,
          item.gender
        );

        console.log('🔊 VoiceManager: Audio generated, playing...');
        
        // Play audio
        await this.audioPlayer.play(audioBlob);
        
        console.log('🔊 VoiceManager: Playback complete');
        
      } catch (error) {
        console.error('🔊 VoiceManager: Error processing item:', error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Stop current playback and clear queue
   */
  stop(): void {
    this.audioPlayer.stop();
    this.queue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Check if currently playing
   */
  isActive(): boolean {
    return this.audioPlayer.isPlaying() || this.queue.length > 0;
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.audioPlayer.pause();
  }

  /**
   * Resume playback
   */
  resume(): void {
    this.audioPlayer.resume();
  }
}