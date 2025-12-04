import { describe, expect, it } from 'vitest';
import { getEventTarget } from '../../../../src/editor/utils/event';

describe('getEventTarget', () => {
  it('returns null when element is missing', () => {
    expect(getEventTarget(null)).toBeNull();
  });

  it('detects text containers when the span receives the event', () => {
    const textElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'foreignObject',
    );
    const span = document.createElement('span');
    textElement.appendChild(span);

    expect(getEventTarget(span as any)).toBe(textElement);
  });

  it('returns icon group when an icon child is targeted', () => {
    const iconGroup = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g',
    );
    iconGroup.dataset.elementType = 'item-icon-group';

    const iconChild = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    iconGroup.appendChild(iconChild);

    expect(getEventTarget(iconChild as any)).toBe(iconGroup);
  });
});
