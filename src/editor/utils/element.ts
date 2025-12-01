import type { Element } from '../../types';

export function getIndexesFromElement(element: Element): number[] {
  return element.dataset.indexes?.split(',').map(Number) || [];
}
