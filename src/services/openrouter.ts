import type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  StreamChunk,
  OpenRouterModel,
  OpenRouterError,
} from '@/types/chat';

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get credit balance and usage information
   */
  async getCredits(): Promise<{ balance: number; usage: number; limit: number }> {
    try {
      const response = await fetch(`${OPENROUTER_API_BASE}/auth/key`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      return {
        balance: data.data?.limit || 0,
        usage: data.data?.usage || 0,
        limit: data.data?.limit || 0,
      };
    } catch (error) {
      console.error('Error fetching credits:', error);
      return { balance: 0, usage: 0, limit: 0 };
    }
  }

  /**
   * Send chat completion request (non-streaming)
   */
  async createChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Lavagna AI',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error: OpenRouterError = await response.json();
      throw new Error(error.error.message || 'API request failed');
    }

    return response.json();
  }

  /**
   * Send chat completion request with streaming
   */
  async createStreamingChatCompletion(
    request: ChatCompletionRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Lavagna AI',
        },
        body: JSON.stringify({ ...request, stream: true }),
      });

      if (!response.ok) {
        const error: OpenRouterError = await response.json();
        throw new Error(error.error.message || 'API request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const chunk: StreamChunk = JSON.parse(data);
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              console.error('Failed to parse chunk:', e);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
}

// Curated list of popular models
export const POPULAR_MODELS: OpenRouterModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: "Anthropic's most intelligent model",
    pricing: { prompt: '3.00', completion: '15.00' },
    context_length: 200000,
  },
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Most capable Claude model for complex tasks',
    pricing: { prompt: '15.00', completion: '75.00' },
    context_length: 200000,
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient Claude model',
    pricing: { prompt: '0.25', completion: '1.25' },
    context_length: 200000,
  },
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: "OpenAI's most capable model",
    pricing: { prompt: '10.00', completion: '30.00' },
    context_length: 128000,
  },
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and affordable OpenAI model',
    pricing: { prompt: '0.50', completion: '1.50' },
    context_length: 16385,
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    description: "Google's advanced AI model",
    pricing: { prompt: '0.125', completion: '0.375' },
    context_length: 32760,
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    description: 'Fast and efficient Gemini model',
    pricing: { prompt: '0.075', completion: '0.30' },
    context_length: 1000000,
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
    description: 'Powerful European AI model',
    pricing: { prompt: '4.00', completion: '12.00' },
    context_length: 128000,
  },
  {
    id: 'mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B',
    description: 'Efficient mixture-of-experts model',
    pricing: { prompt: '0.24', completion: '0.24' },
    context_length: 32768,
  },
  {
    id: 'meta-llama/llama-3-70b-instruct',
    name: 'Llama 3 70B',
    description: "Meta's open-source model",
    pricing: { prompt: '0.59', completion: '0.79' },
    context_length: 8192,
  },
];
