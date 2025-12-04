import type { Element } from '../../types';
import { getIconEntity, isIconElement } from '../../utils';

export function getIndexesFromElement(element: Element): number[] {
  return (
    getElementEntity(element)?.dataset.indexes?.split(',').map(Number) || []
  );
}

function getElementEntity(element: Element) {
  if (isIconElement(element)) return getIconEntity(element);
  return element;
}
