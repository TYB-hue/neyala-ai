import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY
});

export default groq;

export async function getGroqChatCompletion(messages: any[], retryCount = 0) {
  const maxRetries = 3;
  const baseDelay = 1000; // 1 second base delay
  
  try {
    return await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Lower temperature for more consistent, factual responses
      max_tokens: 3000, // Increased for more detailed responses
      top_p: 0.9, // Add top_p for better response quality
    });
  } catch (error: any) {
    // Handle rate limit errors with exponential backoff
    if (error.status === 429 && retryCount < maxRetries) {
      const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
      console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return getGroqChatCompletion(messages, retryCount + 1);
    }
    
    // Re-throw the error if it's not a rate limit or we've exhausted retries
    throw error;
  }
}
