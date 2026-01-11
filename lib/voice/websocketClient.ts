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
      console.log('🔊 Voice: Connecting WebSocket to:', wsUrl);
      console.log('🔊 Voice: Token exists:', !!this.options.token);
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔊 Voice: WebSocket connected successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = async (event) => {
        console.log('🔊 Voice: Received WebSocket message, type:', typeof event.data);
        
        try {
          // Check if message is binary (audio chunk) or text (JSON message)
          if (event.data instanceof ArrayBuffer) {
            // Binary audio chunk - pass directly to audio handler
            console.log('🔊 Voice: Received binary audio chunk, size:', event.data.byteLength, 'bytes');
            
            if (event.data.byteLength > 0) {
              console.log('🔊 Voice: ✅ Audio data received, passing to audio handler');
              this.options.onAudio?.(event.data);
            } else {
              console.log('❌ Voice: Received empty audio buffer');
            }
          } else if (event.data instanceof Blob) {
            // Handle Blob (some browsers send as Blob)
            console.log('🔊 Voice: Received audio Blob, size:', event.data.size, 'bytes');
            const arrayBuffer = await event.data.arrayBuffer();
            console.log('🔊 Voice: Converted Blob to ArrayBuffer, size:', arrayBuffer.byteLength, 'bytes');
            
            if (arrayBuffer.byteLength > 0) {
              console.log('🔊 Voice: ✅ Audio data ready, passing to audio handler');
              this.options.onAudio?.(arrayBuffer);
            } else {
              console.log('❌ Voice: Received empty audio buffer from Blob');
            }
          } else {
            // Text message - parse as JSON
            console.log('🔊 Voice: Received text message:', event.data);
            const data = JSON.parse(event.data);
            
            if (data.type === 'error') {
              console.error('❌ Voice: Server error:', data.message || data.error);
              this.options.onError?.(new Error(data.message || data.error || 'Unknown error'));
            } else if (data.type === 'speak_start') {
              console.log('🔊 Voice: Voice generation started:', data);
            } else if (data.type === 'speak_complete') {
              console.log('🔊 Voice: Voice generation complete');
            } else if (data.type === 'connected') {
              console.log('🔊 Voice: Voice stream connected:', data);
            } else {
              console.log('🔊 Voice: Received other text message:', data);
            }
          }
        } catch (error) {
          console.error('❌ Voice: Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error: any) => {
        console.error('❌ Voice: WebSocket error:', error);
        console.error('❌ Voice: WebSocket state:', this.ws?.readyState);
        this.options.onError?.(new Error(error?.message || 'WebSocket error'));
      };

      this.ws.onclose = (event) => {
        console.log('🔊 Voice: WebSocket closed, code:', event.code, 'reason:', event.reason);
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