import type { TextElement } from '../../types';
import { getTextSpan } from './recognize';

export function getTextContent(text: TextElement): string {
  return getTextSpan(text)?.innerText || '';
}
