import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  console.error('NEXT_PUBLIC_OPENAI_API_KEY is not set in environment variables');
}

// Create a single instance of the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  dangerouslyAllowBrowser: true, // Enable browser usage
});

// Function to count tokens in a message (approximate)
function countTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10, // Maximum requests per minute
  windowMs: 60 * 1000, // 1 minute window
  requests: [] as number[], // Timestamp of requests
};

// Check rate limit
function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove old requests
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    time => now - time < RATE_LIMIT.windowMs
  );
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  RATE_LIMIT.requests.push(now);
  return true;
}

// Test connection function
export async function testConnection() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello!' }],
      model: 'gpt-4o-mini',
      max_tokens: 5,
    });
    return { success: true, message: 'API connection successful' };
  } catch (error) {
    console.error('API connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Enhanced chat completion function with streaming support
export async function generateChatCompletion(
  messages: ChatCompletionMessageParam[],
  maxTokens = 1000,
  onStream?: (chunk: string) => void
) {
  try {
    // Check if API key is available
    if (!openai.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Check rate limit
    if (!checkRateLimit()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Count total tokens in the conversation
    const totalTokens = messages.reduce((acc, msg) => {
      if (typeof msg.content === 'string') {
        return acc + countTokens(msg.content);
      }
      return acc;
    }, 0);

    if (totalTokens > 4000) {
      throw new Error('Conversation too long. Please start a new chat.');
    }

    if (onStream) {
      // Streaming response
      const stream = await openai.chat.completions.create({
        messages,
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: Math.min(maxTokens, 4000 - totalTokens),
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        onStream(content);
      }

      return {
        role: 'assistant',
        content: fullResponse,
      };
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        messages,
        model: 'gpt-4o-mini',
        temperature: 0.7,
        max_tokens: Math.min(maxTokens, 4000 - totalTokens),
      });

      return completion.choices[0].message;
    }
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to generate response. Please try again.'
    );
  }
} 