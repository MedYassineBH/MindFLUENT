import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const GEMINI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  // We'll determine the correct model name dynamically
  apiUrl: 'https://generativelanguage.googleapis.com/v1',
};

// Function to list available models
async function listAvailableModels() {
  try {
    const response = await fetch(
      `${GEMINI_CONFIG.apiUrl}/models?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.status}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

// Function to get the correct model name
async function getCorrectModelName() {
  const availableModels = await listAvailableModels();
  console.log('Available models:', availableModels);
  
  // Look for a model that supports generateContent
  const suitableModel = availableModels.find((model: { name: string; supportedGenerationMethods?: string[] }) => 
    model.name && 
    model.supportedGenerationMethods?.includes('generateContent')
  );
  
  if (!suitableModel) {
    throw new Error('No suitable model found that supports generateContent');
  }
  
  return suitableModel.name;
}

export async function generateGeminiChatCompletion(
  messages: ChatCompletionMessageParam[],
  maxTokens = 1000,
  onStream?: (chunk: string) => void
) {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    // Get the correct model name
    const modelName = await getCorrectModelName();
    console.log('Using model:', modelName);

    // Format messages for Gemini
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `${GEMINI_CONFIG.apiUrl}/models/${modelName}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      role: 'assistant',
      content: data.candidates[0]?.content?.parts[0]?.text || '',
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

export async function testGeminiConnection() {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      return { 
        success: false, 
        message: 'Gemini API key is not configured' 
      };
    }

    // Get the correct model name
    const modelName = await getCorrectModelName();
    console.log('Using model:', modelName);

    const response = await fetch(
      `${GEMINI_CONFIG.apiUrl}/models/${modelName}:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{ text: 'Hello!' }],
          }],
          generationConfig: {
            maxOutputTokens: 50,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return { success: true, message: 'Gemini API connection successful' };
  } catch (error) {
    console.error('Gemini connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 