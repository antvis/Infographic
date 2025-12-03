import type { Element } from '../../types';
import { isIconElement } from '../../utils';
import { getIconEntity } from './icon';

export function getIndexesFromElement(element: Element): number[] {
  return (
    getElementEntity(element)?.dataset.indexes?.split(',').map(Number) || []
  );
}

function getElementEntity(element: Element) {
  if (isIconElement(element)) return getIconEntity(element);
  return element;
}
