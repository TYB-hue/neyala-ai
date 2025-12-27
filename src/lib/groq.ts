import { getGroqKeyManager } from './groq-key-manager';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Legacy export for backward compatibility
const keyManager = getGroqKeyManager();
const groq = keyManager.getCurrentClient();

export default groq;

/**
 * Get Groq chat completion with automatic key rotation on token limit
 * @param messages - Array of chat messages
 * @param retryCount - Internal retry counter (don't set manually)
 * @param keySwitchAttempts - Internal key switch counter (don't set manually)
 * @returns Promise with completion response
 */
export async function getGroqChatCompletion(
  messages: ChatMessage[], 
  retryCount = 0,
  keySwitchAttempts = 0
) {
  const maxRetries = 3; // Reduced from 5 to 3 to conserve API tokens
  const maxKeySwitches = 10; // Prevent infinite loops
  const baseDelay = 5000; // 5 seconds base delay
  
  const keyManager = getGroqKeyManager();
  const client = keyManager.getCurrentClient();
  
  if (!client) {
    throw new Error('No Groq API keys configured. Please set GROQ_API_KEY in .env.local');
  }
  
  try {
    return await client.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 3000,
      top_p: 0.9,
    });
  } catch (error: unknown) {
    // Check for API key errors first (don't retry, don't switch keys)
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      if (status === 401) {
        const errorMessage = (error && typeof error === 'object' && 'message' in error) 
          ? (error as { message: string }).message 
          : '';
        if (errorMessage.includes('api key') || errorMessage.includes('unauthorized') || errorMessage.includes('authentication')) {
          throw new Error('Invalid GROQ_API_KEY. Please check your API key in .env.local and restart the server.');
        }
        throw new Error('Authentication failed with Groq API. Please check your API key configuration.');
      }
    }
    
    // Check for daily token limit - switch to next key automatically
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as { message: string }).message;
      if (errorMessage.includes('tokens per day') || errorMessage.includes('TPD') || errorMessage.includes('Please try again in')) {
        // Try to switch to next available key
        if (keySwitchAttempts < maxKeySwitches && keyManager.switchToNextKey('Daily token limit reached')) {
          console.log(`Switching to backup API key (attempt ${keySwitchAttempts + 1}/${maxKeySwitches})`);
          // Retry with new key immediately (no delay needed)
          return getGroqChatCompletion(messages, 0, keySwitchAttempts + 1);
        }
        
        // All keys exhausted or too many switch attempts
        if (keyManager.areAllKeysExhausted()) {
          throw new Error('All Groq API keys have reached their daily token limit. Please try again tomorrow or add more API keys.');
        }
        
        // Extract wait time if available
        const waitTimeMatch = errorMessage.match(/try again in ([\d]+)m([\d.]+)s/);
        let waitMessage = `All available Groq API keys have reached their daily token limit (${keyManager.getAvailableKeyCount()} keys available). Please try again later.`;
        if (waitTimeMatch) {
          const minutes = waitTimeMatch[1];
          waitMessage = `All available Groq API keys have reached their daily token limit. Please try again in ${minutes} minutes, or add more API keys.`;
        }
        throw new Error(waitMessage);
      }
    }
    
    // Handle rate limit errors with exponential backoff (don't switch keys for rate limits)
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      if (status === 429 && retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff: 5s, 10s, 20s
        console.log(`Rate limit hit, retrying in ${delay/1000}s (attempt ${retryCount + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return getGroqChatCompletion(messages, retryCount + 1, keySwitchAttempts);
      }
    }
    
    // Re-throw the error if it's not a rate limit or we've exhausted retries
    throw error;
  }
}
