// Bound external photo lookups so unavailable providers cannot hang requests.
export function limitedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const timeout = AbortSignal.timeout(8000);
  return fetch(input, { ...init, signal: init.signal ? AbortSignal.any([init.signal, timeout]) : timeout });
}
