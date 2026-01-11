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
          // Check if message is binary (audio chunk) or text (JSON message)
          if (event.data instanceof ArrayBuffer) {
            // Binary audio chunk - pass directly to audio handler
            console.log('Received binary audio chunk, size:', event.data.byteLength, 'bytes');
            this.options.onAudio?.(event.data);
          } else if (event.data instanceof Blob) {
            // Handle Blob (some browsers send as Blob)
            console.log('Received audio Blob, size:', event.data.size, 'bytes');
            const arrayBuffer = await event.data.arrayBuffer();
            console.log('Converted Blob to ArrayBuffer, size:', arrayBuffer.byteLength, 'bytes');
            this.options.onAudio?.(arrayBuffer);
          } else {
            // Text message - parse as JSON
            const data = JSON.parse(event.data);
            
            if (data.type === 'error') {
              this.options.onError?.(new Error(data.message || data.error || 'Unknown error'));
            } else if (data.type === 'speak_start') {
              console.log('Voice generation started:', data);
            } else if (data.type === 'speak_complete') {
              console.log('Voice generation complete');
            } else if (data.type === 'connected') {
              console.log('Voice stream connected:', data);
            } else {
              console.log('Received text message:', data);
            }
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