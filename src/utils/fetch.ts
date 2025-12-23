type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

interface CachedResponseEntry {
  body: ArrayBuffer;
  init: ResponseInit;
}

const nativeFetch: FetchFunction =
  typeof globalThis.fetch === 'function'
    ? (globalThis.fetch as FetchFunction).bind(globalThis)
    : ((() =>
        Promise.reject(
          new Error('fetch is not supported by the runtime'),
        )) as FetchFunction);

const responseCache = new Map<string, CachedResponseEntry>();
const pendingRequests = new Map<string, Promise<CachedResponseEntry>>();

function buildCacheKey(request: Request) {
  return `${request.method}:${request.url}`;
}

function buildResponse(entry: CachedResponseEntry) {
  return new Response(entry.body.slice(0), entry.init);
}

async function fetchAndCache(request: Request, key: string) {
  try {
    const response = await nativeFetch(request);
    const body = await response.arrayBuffer();
    const entry: CachedResponseEntry = {
      body,
      init: {
        status: response.status,
        statusText: response.statusText,
        headers: Array.from(response.headers.entries()),
      },
    };

    if (response.ok) {
      responseCache.set(key, entry);
    }

    return entry;
  } finally {
    pendingRequests.delete(key);
  }
}

export async function fetchWithCache(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const request = new Request(input, init);
  if (request.method !== 'GET') {
    return nativeFetch(request);
  }

  const key = buildCacheKey(request);

  if (responseCache.has(key)) {
    return buildResponse(responseCache.get(key)!);
  }

  let pending = pendingRequests.get(key);
  if (!pending) {
    pending = fetchAndCache(request, key);
    pendingRequests.set(key, pending);
  }

  const entry = await pending;
  return buildResponse(entry);
}
