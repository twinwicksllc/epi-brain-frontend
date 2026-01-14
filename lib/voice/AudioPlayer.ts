/**
 * Audio Player - Simplified for blob playback
 * 
 * Plays audio blobs from HTTP TTS requests
 */

export class AudioPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private isPlayingState: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupEventListeners();
    }
  }

  private setupEventListeners(): void {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('ended', () => {
      console.log('🔊 AudioPlayer: Playback ended');
      this.isPlayingState = false;
    });

    this.audioElement.addEventListener('error', (e) => {
      console.error('🔊 AudioPlayer: Playback error', e);
      this.isPlayingState = false;
    });

    this.audioElement.addEventListener('play', () => {
      console.log('🔊 AudioPlayer: Started playing');
      this.isPlayingState = true;
    });
  }

  /**
   * Play audio from blob
   */
  async play(audioBlob: Blob): Promise<void> {
    if (!this.audioElement) {
      throw new Error('Audio element not initialized');
    }

    console.log('🔊 AudioPlayer: Playing audio blob, size:', audioBlob.size, 'bytes');

    try {
      // Create object URL from blob
      const audioUrl = URL.createObjectURL(audioBlob);
      this.audioElement.src = audioUrl;

      // Play audio
      await this.audioElement.play();
      
      // Clean up object URL after playing
      this.audioElement.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      }, { once: true });

      console.log('🔊 AudioPlayer: ✅ Audio playing - you should hear sound now!');
      
    } catch (error) {
      console.error('🔊 AudioPlayer: Error playing audio:', error);
      throw error;
    }
  }

  /**
   * Stop playback
   */
  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlayingState = false;
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlayingState = false;
    }
  }

  /**
   * Resume playback
   */
  resume(): void {
    if (this.audioElement) {
      this.audioElement.play();
    }
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.isPlayingState;
  }

  /**
   * Destroy audio element
   */
  destroy(): void {
    this.stop();
    this.audioElement = null;
  }
}

export default AudioPlayer;