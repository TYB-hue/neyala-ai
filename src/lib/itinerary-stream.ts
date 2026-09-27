// SSE events can span network chunks, including the middle of a UTF-8 character.
export async function readItineraryStream(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || `Unable to generate itinerary (${response.status}).`);
  }
  const reader = response.body?.getReader();
  if (!reader) throw new Error('The server returned an empty response.');
  const decoder = new TextDecoder();
  let buffer = '';
  function parseEvent(event: string) {
    const payload = event.split(/\r?\n/).filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    if (!payload) return null;
    let data;
    try { data = JSON.parse(payload); } catch { throw new Error('The server returned an invalid stream response.'); }
    if (data.status === 'error') throw new Error(data.error || 'Itinerary generation failed.');
    if (data.status === 'completed') {
      if (!data.data?.destination || !Array.isArray(data.data.itineraries) || !data.data.itineraries.length) throw new Error('The server returned an invalid itinerary.');
      return data.data;
    }
    return null;
  }
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let match;
      while ((match = /\r?\n\r?\n/.exec(buffer))) {
        const result = parseEvent(buffer.slice(0, match.index));
        buffer = buffer.slice(match.index + match[0].length);
        if (result) return result;
      }
      if (done) {
        const result = parseEvent(buffer);
        if (result) return result;
        throw new Error('The connection ended before the itinerary was ready. Please try again.');
      }
    }
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
