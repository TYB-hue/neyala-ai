import OpenAI from 'openai';
import getConfig from 'next/config';

// Helper function to check if we're on the server side
const isServer = typeof window === 'undefined';

// Get server-side runtime config
const { serverRuntimeConfig } = getConfig();

// Helper function to validate API key
const validateApiKey = (): string => {
  if (!serverRuntimeConfig?.DEEPSEEK_API_KEY && isServer) {
    throw new Error(`
DeepSeek API key is missing. Please:
1. Create a .env.local file in your project root
2. Add: DEEPSEEK_API_KEY=your_api_key_here
3. Restart your development server
    `);
  }
  return serverRuntimeConfig?.DEEPSEEK_API_KEY || '';
};

// Create DeepSeek client only on server side
const createDeepSeekClient = () => {
  if (!isServer) {
    return null;
  }

  const apiKey = validateApiKey();
  
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com/v1',
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  });
};

const deepseek = createDeepSeekClient();

// Helper function to verify the client is properly configured
export const verifyDeepSeekSetup = async () => {
  if (!isServer) {
    return { 
      valid: false, 
      error: 'DeepSeek client can only be used on the server side' 
    };
  }

  if (!serverRuntimeConfig?.DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is not configured');
    return { 
      valid: false, 
      error: 'API key not configured. Please add DEEPSEEK_API_KEY to your .env.local file' 
    };
  }

  if (!deepseek) {
    return {
      valid: false,
      error: 'DeepSeek client failed to initialize'
    };
  }

  try {
    // Test the API key with a simple request
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "system", content: "Test message" }],
      max_tokens: 5
    });
    
    if (response) {
      console.log('DeepSeek API key verified successfully');
      return { valid: true };
    } else {
      return { 
        valid: false, 
        error: 'API key validation failed - no response from DeepSeek' 
      };
    }
  } catch (error: any) {
    console.error('DeepSeek API key validation failed:', error);
    return { 
      valid: false, 
      error: error.message || 'API key validation failed' 
    };
  }
}

export default deepseek; 