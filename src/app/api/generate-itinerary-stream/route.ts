import { apiError, errorInfo, readJson } from '@/lib/api-response';
import { itineraryRequestSchema } from '@/lib/itinerary-request';
import { generateItinerary } from '@/lib/itinerary-service';
export async function POST(request: Request) {
  try {
    const input = await readJson(request, itineraryRequestSchema);
    const abort = new AbortController();
    const onAbort = () => abort.abort();
    if (request.signal.aborted) abort.abort();
    request.signal.addEventListener('abort', onAbort, { once: true });
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (data: unknown) => { if (!abort.signal.aborted) controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)); };
        try {
          send({ status: 'started', message: 'Starting itinerary generation...' });
          send({ status: 'generating', message: 'Creating your personalized itinerary...' });
          const data = await generateItinerary(input, abort.signal);
          send({ status: 'completed', data });
        } catch (error) {
          const info = errorInfo(error);
          send({ status: 'error', error: info.error, code: info.code, httpStatus: info.status });
        } finally {
          request.signal.removeEventListener('abort', onAbort);
          if (!abort.signal.aborted) controller.close();
        }
      },
      cancel() { abort.abort(); request.signal.removeEventListener('abort', onAbort); },
    });
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform', 'X-Accel-Buffering': 'no' } });
  } catch (error) { return apiError(error); }
}
