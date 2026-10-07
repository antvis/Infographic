import { describe, expect, it } from 'vitest';
import {
  applyLayoutDirection,
  toPhysicalPadding,
} from '../../../src/renderer/rtl';
import type { TextHorizontalAlign } from '../../../src/types';
import { createElement, createTextElement } from '../../../src/utils';
import { getTextEntity } from '../../../src/utils/text';

const mirror = (pivotX: number) => `matrix(-1 0 0 1 ${2 * pivotX} 0)`;

function createSVG(viewBox = '0 0 200 100') {
  const svg = createElement<SVGSVGElement>('svg', { viewBox });
  svg.append(createElement('defs'), createElement('rect', { width: 10 }));
  return svg;
}

function createText(align: TextHorizontalAlign) {
  return createTextElement('Hello', {
    x: '10',
    y: '0',
    width: '40',
    height: '20',
    'data-horizontal-align': align,
  });
}

const rtl = { direction: 'rtl' } as const;

describe('applyLayoutDirection', () => {
  it.each([undefined, 'ltr'] as const)(
    'leaves the SVG untouched for direction %s',
    (direction) => {
      const svg = createSVG();
      svg.append(createText('LEFT'));
      const before = svg.outerHTML;

      applyLayoutDirection(svg, { direction });

      expect(svg.outerHTML).toBe(before);
    },
  );

  it('wraps every root child in one group mirrored about the viewBox centre', () => {
    const svg = createSVG('20 0 200 100');
    const children = Array.from(svg.children);

    applyLayoutDirection(svg, rtl);

    expect(svg.children).toHaveLength(1);
    const wrapper = svg.firstElementChild!;
    expect(wrapper.tagName).toBe('g');
    expect(wrapper.getAttribute('transform')).toBe(mirror(120));
    expect(Array.from(wrapper.children)).toEqual(children);
  });

  it('pivots on options.viewBox when one is set', () => {
    const svg = createSVG('0 0 200 100');

    applyLayoutDirection(svg, { ...rtl, viewBox: '0 0 600 100' });

    expect(svg.firstElementChild!.getAttribute('transform')).toBe(mirror(300));
  });

  it.each([
    ['LEFT', 'right', 'right'],
    ['CENTER', 'center', 'center'],
    ['RIGHT', 'left', 'left'],
  ] as const)(
    'flips a %s foreignObject text back in place with mirrored physical alignment',
    (align, textAlign, justifyContent) => {
      const svg = createSVG();
      const text = createText(align);
      svg.append(text);

      applyLayoutDirection(svg, rtl);

      const entity = getTextEntity(text)!;
      expect(text.getAttribute('transform')).toBe(mirror(30));
      expect(entity.style.textAlign).toBe(textAlign);
      expect(entity.style.justifyContent).toBe(justifyContent);
      expect(entity.getAttribute('dir')).toBe('auto');
    },
  );

  it.each([
    ['start', 'end'],
    ['middle', 'middle'],
    ['end', 'start'],
    [null, 'end'],
  ])(
    'flips an SVG text with anchor %s about its anchor and swaps it to %s',
    (anchor, expected) => {
      const svg = createSVG();
      const text = createElement('text', { x: 15, y: 5 });
      if (anchor) text.setAttribute('text-anchor', anchor);
      svg.append(text);

      applyLayoutDirection(svg, rtl);

      expect(text.getAttribute('transform')).toBe(mirror(15));
      expect(text.getAttribute('text-anchor')).toBe(expected);
      expect(text.style.getPropertyValue('unicode-bidi')).toBe('plaintext');
    },
  );

  it('appends the flip after an existing transform', () => {
    const svg = createSVG();
    const text = createElement('text', { transform: 'rotate(-15 65 40)' });
    svg.append(text);

    applyLayoutDirection(svg, rtl);

    expect(text.getAttribute('transform')).toBe(
      `rotate(-15 65 40) ${mirror(0)}`,
    );
  });

  it('flips item icons and illustrations, not their clipped group or other uses', () => {
    const svg = createSVG();
    const icon = createElement('use', {
      'data-element-type': 'item-icon',
      x: 10,
      width: 20,
    });
    const illusGroup = createElement('g', {
      'data-element-type': 'illus-group',
    });
    const illus = createElement('use', {
      'data-element-type': 'illus',
      x: 50,
      width: 100,
    });
    illusGroup.append(illus);
    const button = createElement('use', { href: '#btn-add', width: 10 });
    svg.append(icon, illusGroup, button);

    applyLayoutDirection(svg, rtl);

    expect(icon.getAttribute('transform')).toBe(mirror(20));
    expect(illus.getAttribute('transform')).toBe(mirror(100));
    expect(illusGroup.hasAttribute('transform')).toBe(false);
    expect(button.hasAttribute('transform')).toBe(false);
  });

  it.each(['defs', 'symbol', 'clipPath'])(
    'leaves text inside %s alone',
    (container) => {
      const svg = createSVG();
      const parent = createElement(container);
      const text = createElement('text', { x: 5 });
      parent.append(text);
      svg.append(parent);

      applyLayoutDirection(svg, rtl);

      expect(text.hasAttribute('transform')).toBe(false);
      expect(text.hasAttribute('text-anchor')).toBe(false);
    },
  );
});

describe('toPhysicalPadding', () => {
  it('swaps left and right in RTL only', () => {
    expect(toPhysicalPadding([1, 2, 3, 4], 'rtl')).toEqual([1, 4, 3, 2]);
    expect(toPhysicalPadding([1, 2, 3, 4], 'ltr')).toEqual([1, 2, 3, 4]);
    expect(toPhysicalPadding([1, 2, 3, 4], undefined)).toEqual([1, 2, 3, 4]);
  });
});
