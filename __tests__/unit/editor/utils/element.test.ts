import { describe, expect, it } from 'vitest';
import { getIndexesFromElement } from '../../../../src/editor/utils/element';

describe('getIndexesFromElement', () => {
  it('returns indexes from a regular element dataset', () => {
    const element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect',
    );
    element.setAttribute('data-indexes', '0,2,4');

    expect(getIndexesFromElement(element as any)).toEqual([0, 2, 4]);
  });

  it('reads indexes from the icon entity when provided an icon element', () => {
    const iconGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g',
    );
    iconGroup.dataset.elementType = 'item-icon-group';
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('data-indexes', '1,3');
    iconGroup.appendChild(use);

    expect(getIndexesFromElement(iconGroup as any)).toEqual([1, 3]);
  });
});
