import { VoiceStreamClient, VoiceStreamOptions } from './websocketClient';
import AudioPlayer from './audioPlayer';

export interface VoiceOptions {
  token: string;
  mode: string;
  voiceModel: string;
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: Error) => void;
}

export class VoiceManager {
  private wsClient: VoiceStreamClient | null = null;
  private audioPlayer: AudioPlayer;
  private isEnabled = false;
  private currentOptions: VoiceOptions | null = null;
  private isPlaying = false;

  constructor() {
    this.audioPlayer = new AudioPlayer();
  }

  enable(options: VoiceOptions): void {
    this.isEnabled = true;
    this.currentOptions = options;
    
    // Initialize WebSocket client
    this.wsClient = new VoiceStreamClient({
      token: options.token,
      mode: options.mode,
      voiceModel: options.voiceModel,
      onAudio: (audioData) => {
        this.handleAudio(audioData);
      },
      onError: (error) => {
        console.error('Voice error:', error);
        options.onError?.(error);
      },
      onClose: () => {
        console.log('Voice WebSocket closed');
      }
    });
    
    // Connect to WebSocket
    this.wsClient.connect();
  }

  disable(): void {
    this.isEnabled = false;
    this.currentOptions = null;
    
    // Stop audio
    this.audioPlayer.stop();
    
    // Close WebSocket
    if (this.wsClient) {
      this.wsClient.close();
      this.wsClient = null;
    }
  }

  updateVoiceModel(voiceModel: string): void {
    if (this.currentOptions) {
      this.currentOptions.voiceModel = voiceModel;
    }
  }

  async speak(text: string, mode: string): Promise<void> {
    if (!this.isEnabled || !this.currentOptions) {
      return;
    }

    // Stop any currently playing audio
    this.audioPlayer.stop();

    // Send text to WebSocket
    if (this.wsClient) {
      this.wsClient.sendMessage(text, mode, this.currentOptions.voiceModel);
    }
  }

  stop(): void {
    this.audioPlayer.stop();
  }

  private async handleAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      this.isPlaying = true;
      this.currentOptions?.onAudioStart?.();
      
      await this.audioPlayer.playAudio(audioData);
      
      this.isPlaying = false;
      this.currentOptions?.onAudioEnd?.();
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      this.currentOptions?.onError?.(error as Error);
    }
  }

  isVoiceEnabled(): boolean {
    return this.isEnabled;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying || this.audioPlayer.isCurrentlyPlaying();
  }

  getQueueLength(): number {
    return this.audioPlayer.getQueueLength();
  }

  destroy(): void {
    this.disable();
    this.audioPlayer.destroy();
  }
}

export default VoiceManager;