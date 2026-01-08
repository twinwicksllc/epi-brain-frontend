// Audio player utilities for Deepgram TTS
export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;
  private currentBuffer: AudioBuffer | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    try {
      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      this.audioQueue.push(audioBuffer);
      
      // Start playing if not already playing
      if (!this.isPlaying) {
        this.playNext();
      }
    } catch (error) {
      console.error('Error decoding audio:', error);
      throw error;
    }
  }

  private async playNext(): Promise<void> {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioBuffer = this.audioQueue.shift()!;
    this.currentBuffer = audioBuffer;

    try {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      
      return new Promise<void>((resolve, reject) => {
        this.sourceNode!.onended = () => {
          this.playNext().then(resolve).catch(reject);
        };
        
        this.sourceNode!.onerror = (error) => {
          this.isPlaying = false;
          reject(error);
        };
        
        this.sourceNode!.start(0);
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  stop(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (error) {
        // Already stopped
      }
      this.sourceNode = null;
    }
    
    this.audioQueue = [];
    this.isPlaying = false;
    this.currentBuffer = null;
  }

  pause(): void {
    if (this.sourceNode && this.isPlaying) {
      try {
        this.sourceNode.stop();
      } catch (error) {
        // Already stopped
      }
    }
    this.isPlaying = false;
  }

  resume(): void {
    if (!this.isPlaying && (this.audioQueue.length > 0 || this.currentBuffer)) {
      // Add current buffer back to queue
      if (this.currentBuffer) {
        this.audioQueue.unshift(this.currentBuffer);
        this.currentBuffer = null;
      }
      this.playNext();
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getQueueLength(): number {
    return this.audioQueue.length;
  }

  destroy(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export default AudioPlayer;