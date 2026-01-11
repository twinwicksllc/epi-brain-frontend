// WebSocket client for Deepgram voice streaming
import { WebSocket } from 'partysocket';

export interface VoiceStreamOptions {
  token: string;
  mode: string;
  voiceModel: string;
  onTranscript?: (text: string) => void;
  onAudio?: (audioData: ArrayBuffer) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export class VoiceStreamClient {
  private ws: WebSocket | null = null;
  private options: VoiceStreamOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 1000;

  constructor(options: VoiceStreamOptions) {
    this.options = options;
  }

  connect(): void {
    try {
      const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('http', 'ws')}/api/v1/voice/stream?token=${this.options.token}`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Voice WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'audio') {
            // Convert base64 to ArrayBuffer
            const audioData = this.base64ToArrayBuffer(data.audio);
            this.options.onAudio?.(audioData);
          } else if (data.type === 'error') {
            this.options.onError?.(new Error(data.error));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error: any) => {
        console.error('WebSocket error:', error);
        this.options.onError?.(new Error(error?.message || 'WebSocket error'));
      };

      this.ws.onclose = () => {
        console.log('Voice WebSocket closed');
        this.options.onClose?.();
        
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
            this.connect();
          }, this.reconnectDelay);
        }
      };
    } catch (error) {
      console.error('Error connecting to voice WebSocket:', error);
      this.options.onError?.(error as Error);
    }
  }

  sendMessage(text: string, mode: string, voiceModel: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'speak',
      text,
      personality: mode,
      gender: voiceModel.includes('-M') ? 'male' : 'female'
    }));
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export default VoiceStreamClient;