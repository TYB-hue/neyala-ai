import { getGroqKeyManager } from './groq-key-manager';
import { ApiError } from './api-response';
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string; }
export default getGroqKeyManager().getCurrentClient();

// Keep the model configurable; access varies between Groq projects.
export async function getGroqChatCompletion(messages: ChatMessage[], options: { signal?: AbortSignal; json?: boolean; maxTokens?: number } = {}) {
  const client = getGroqKeyManager().getCurrentClient();
  if (!client) throw new ApiError(503, 'AI_NOT_CONFIGURED', 'Itinerary generation is temporarily unavailable.');
  try {
    return await client.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
      temperature: 0.3,
      max_tokens: options.maxTokens || 12000,
      ...(options.json ? { response_format: { type: 'json_object' as const } } : {}),
    }, { signal: options.signal, timeout: 90000, maxRetries: 1 });
  } catch (error: any) {
    if (options.signal?.aborted || /abort|timeout/i.test(error?.name || '')) throw new ApiError(504, 'AI_TIMEOUT', 'Itinerary generation timed out. Please try again.');
    if (error?.status === 429) throw new ApiError(429, 'AI_RATE_LIMIT', 'Itinerary generation is busy. Please wait a minute before trying again.');
    if ([401, 403, 404].includes(error?.status)) throw new ApiError(503, 'AI_CONFIGURATION', 'The itinerary service is unavailable. The administrator needs to check its API key and model access.');
    throw new ApiError(502, 'AI_UPSTREAM_ERROR', 'The itinerary provider could not complete the request. Please try again.');
  }
}
