import pako from 'pako';

/**
 * Compress syntax string to base64 URL-safe string
 */
export function compressToBase64(text: string): string {
  try {
    const compressed = pako.deflate(text, {level: 9});
    const base64 = btoa(
      String.fromCharCode.apply(null, Array.from(compressed))
    );
    // Make URL safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Compression error:', e);
    return '';
  }
}

/**
 * Decompress base64 URL-safe string to syntax string
 */
export function decompressFromBase64(base64: string): string {
  try {
    // Restore URL-unsafe characters
    const restored = base64.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    const padded = restored + '=='.slice(0, (4 - (restored.length % 4)) % 4);

    const binaryString = atob(padded);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decompressed = pako.inflate(bytes, {to: 'string'});
    return decompressed;
  } catch (e) {
    console.error('Decompression error:', e);
    return '';
  }
}

/**
 * Generate shareable URL with compressed content
 */
export function generateShareUrl(syntax: string): string {
  const compressed = compressToBase64(syntax);
  if (!compressed) return '';

  const url = new URL(window.location.href);
  // Add pako: prefix to indicate compression method
  url.searchParams.set('content', `pako:${compressed}`);
  return url.toString();
}

/**
 * Extract content from URL parameters
 */
export function extractContentFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const contentParam = params.get('content');

  if (!contentParam) return null;

  // Check for pako: prefix
  if (contentParam.startsWith('pako:')) {
    const compressed = contentParam.slice(5); // Remove 'pako:' prefix
    return decompressFromBase64(compressed);
  }

  return decodeURIComponent(contentParam);
}
