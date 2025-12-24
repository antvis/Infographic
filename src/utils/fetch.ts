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

const CACHE_MAX_ENTRIES = 1024;

class BoundedMap<K, V> {
  private readonly inner = new Map<K, V>();

  constructor(private readonly maxEntries: number) {}

  get(key: K) {
    const entry = this.inner.get(key);
    if (entry === undefined) return undefined;
    this.inner.delete(key);
    this.inner.set(key, entry);
    return entry;
  }

  set(key: K, value: V) {
    if (this.inner.has(key)) {
      this.inner.delete(key);
    }
    this.inner.set(key, value);
    if (this.inner.size > this.maxEntries) {
      const oldestKey = this.inner.keys().next().value;
      if (oldestKey !== undefined) {
        this.inner.delete(oldestKey);
      }
    }
    return this;
  }

  has(key: K) {
    return this.inner.has(key);
  }

  delete(key: K) {
    return this.inner.delete(key);
  }

  clear() {
    this.inner.clear();
  }
}

const responseCache = new BoundedMap<string, CachedResponseEntry>(
  CACHE_MAX_ENTRIES,
);
const pendingRequests = new BoundedMap<string, Promise<CachedResponseEntry>>(
  CACHE_MAX_ENTRIES,
);

function buildHeadersKey(request: Request) {
  const entries = Array.from(request.headers.entries());
  if (entries.length === 0) return '';

  entries.sort(([nameA], [nameB]) =>
    nameA.toLowerCase().localeCompare(nameB.toLowerCase()),
  );

  return entries
    .map(([name, value]) => `${name.toLowerCase()}:${value}`)
    .join('|');
}

function buildCacheKey(request: Request) {
  const headersKey = buildHeadersKey(request);
  return headersKey
    ? `${request.method}:${request.url}:${headersKey}`
    : `${request.method}:${request.url}`;
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
