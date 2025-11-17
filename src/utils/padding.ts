import type { Padding, ParsedPadding } from '../types';

export function parsePadding(padding: Padding | undefined): ParsedPadding {
  if (!padding) return [0, 0, 0, 0];
  if (typeof padding === 'number') {
    return [padding, padding, padding, padding];
  }
  if (padding.length === 1) {
    return [padding[0], padding[0], padding[0], padding[0]];
  }
  if (padding.length === 2) {
    return [padding[0], padding[1], padding[0], padding[1]];
  }
  if (padding.length === 3) {
    return [padding[0], padding[1], padding[2], padding[1]];
  }
  if (padding.length === 4) {
    return [padding[0], padding[1], padding[2], padding[3]];
  }
  return [0, 0, 0, 0];
}
