import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY
});

export default groq;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getGroqChatCompletion(messages: ChatMessage[], retryCount = 0) {
  const maxRetries = 5; // Increased from 3 to 5
  const baseDelay = 5000; // Increased from 1 second to 5 seconds base delay
  
  try {
return await groq.chat.completions.create({
  messages,
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
  max_tokens: 3000,
  top_p: 0.9,
});
  } catch (error: unknown) {
    // Check for daily token limit first (don't retry, just throw with clear message)
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as { message: string }).message;
      if (errorMessage.includes('tokens per day') || errorMessage.includes('TPD') || errorMessage.includes('Please try again in')) {
        // Extract wait time if available
        const waitTimeMatch = errorMessage.match(/try again in ([\d]+)m([\d.]+)s/);
        let waitMessage = 'Daily token limit reached. Please try again later or upgrade your Groq plan.';
        if (waitTimeMatch) {
          const minutes = waitTimeMatch[1];
          waitMessage = `Daily token limit reached. Please try again in ${minutes} minutes, or upgrade your Groq plan for higher limits.`;
        }
        throw new Error(waitMessage);
      }
    }
    
    // Handle rate limit errors with exponential backoff
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;
      if (status === 429 && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff: 5s, 10s, 20s, 40s, 80s
      console.log(`Rate limit hit, retrying in ${delay/1000}s (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return getGroqChatCompletion(messages, retryCount + 1);
    }
    
    // Re-throw the error if it's not a rate limit or we've exhausted retries
    throw error;
  }
  }
}
