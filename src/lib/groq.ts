import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "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" 
});

export default groq;

export async function getGroqChatCompletion(messages: any[]) {
  return groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 2000,
  });
} 