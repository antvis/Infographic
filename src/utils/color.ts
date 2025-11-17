import { parse, wcagLuminance } from 'culori';

export function hasColor(fill?: string | null): boolean {
  if (!fill) return false;
  const normalizedFill = fill.trim().toLowerCase();
  if (
    normalizedFill === 'none' ||
    normalizedFill === 'transparent' ||
    normalizedFill === ''
  ) {
    return false;
  }
  return true;
}

export function isDarkColor(color: string): boolean {
  const c = parse(color);
  if (!c) return false;
  const luminance = wcagLuminance(c);
  return luminance < 0.5;
}
