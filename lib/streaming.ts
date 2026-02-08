// Streaming utilities for Server-Sent Events (SSE)

export interface StreamMessage {
  type: 'token' | 'done' | 'error';
  content?: string;
  error?: string;
}

export async function* streamChatResponse(
  message: string,
  conversationId: string | undefined,
  mode: string
): AsyncGenerator<StreamMessage> {
  const token = localStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if token exists (for authenticated users)
  // Guest users will have requests sent without Authorization header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/proxy/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      mode,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    yield {
      type: 'error',
      error: error.detail || 'Failed to send message',
    };
    return;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    yield {
      type: 'error',
      error: 'Failed to read response stream',
    };
    return;
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        yield { type: 'done' };
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            yield { type: 'done' };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.error) {
              yield {
                type: 'error',
                error: parsed.error,
              };
            } else if (parsed.content) {
              yield {
                type: 'token',
                content: parsed.content,
              };
            }
          } catch (e) {
            // Skip invalid JSON
            console.warn('Failed to parse SSE data:', data);
          }
        }
      }
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : 'Stream error',
    };
  } finally {
    reader.releaseLock();
  }
}

// Fallback: Simulate streaming for non-streaming responses
export async function* simulateStreaming(fullResponse: string): AsyncGenerator<StreamMessage> {
  const words = fullResponse.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i] + (i < words.length - 1 ? ' ' : '');
    yield {
      type: 'token',
      content: word,
    };
    
    // Small delay to simulate typing
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  
  yield { type: 'done' };
}