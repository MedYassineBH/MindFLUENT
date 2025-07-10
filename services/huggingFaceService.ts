import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const HUGGING_FACE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY,
  model: 'facebook/blenderbot-400M-distill', // Smaller, more accessible model
  apiUrl: 'https://api-inference.huggingface.co/models',
};

export async function generateHuggingFaceChatCompletion(
  messages: ChatCompletionMessageParam[],
  maxTokens = 1000,
  onStream?: (chunk: string) => void
) {
  try {
    if (!HUGGING_FACE_CONFIG.apiKey) {
      throw new Error('Hugging Face API key is not configured');
    }

    // Format messages for BlenderBot
    const conversationHistory = messages.map(msg => msg.content).join('\n');
    const lastMessage = messages[messages.length - 1].content;

    const response = await fetch(
      `${HUGGING_FACE_CONFIG.apiUrl}/${HUGGING_FACE_CONFIG.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            text: lastMessage,
            past_user_inputs: messages
              .filter(msg => msg.role === 'user')
              .map(msg => msg.content),
            generated_responses: messages
              .filter(msg => msg.role === 'assistant')
              .map(msg => msg.content),
          },
          parameters: {
            max_length: maxTokens,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      role: 'assistant',
      content: data.generated_text || '',
    };
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to generate response. Please try again.'
    );
  }
}

export async function testHuggingFaceConnection() {
  try {
    if (!HUGGING_FACE_CONFIG.apiKey) {
      return { 
        success: false, 
        message: 'Hugging Face API key is not configured' 
      };
    }

    const response = await fetch(
      `${HUGGING_FACE_CONFIG.apiUrl}/${HUGGING_FACE_CONFIG.model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            text: "Hello!",
            past_user_inputs: [],
            generated_responses: [],
          },
          parameters: {
            max_length: 50,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    return { success: true, message: 'Hugging Face API connection successful' };
  } catch (error) {
    console.error('Hugging Face connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 