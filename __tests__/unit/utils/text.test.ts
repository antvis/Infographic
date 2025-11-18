import { beforeEach, describe, expect, it } from 'vitest';
import { createTextElement } from '../../../src/utils/text';

describe('text', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('createTextElement', () => {
    it('should create text element with basic attributes', () => {
      const textElement = createTextElement('Hello World', {
        id: 'test-text',
        x: '10',
        y: '20',
        width: '100',
        height: '30',
      });

      expect(textElement.tagName).toBe('foreignObject');
      expect(textElement.getAttribute('id')).toBe('test-text');
      expect(textElement.getAttribute('x')).toBe('10');
      expect(textElement.getAttribute('y')).toBe('20');
      expect(textElement.getAttribute('width')).toBe('100');
      expect(textElement.getAttribute('height')).toBe('30');
      expect(textElement.getAttribute('data-element-type')).toBe('text');
    });

    it('should create span child with text content', () => {
      const textElement = createTextElement('Test Text', {
        width: '100',
        height: '30',
      });

      const span = textElement.querySelector('span');
      expect(span).toBeTruthy();
      expect(span?.textContent).toBe('Test Text');
    });

    it('should apply text styles to span', () => {
      const textElement = createTextElement('Styled Text', {
        width: '100',
        height: '30',
        fill: 'red',
        'font-size': 18,
        'font-family': 'Arial',
        'line-height': 1.2,
        'letter-spacing': 1,
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.color).toBe('red');
      expect(span.style.fontSize).toBe('18px');
      expect(span.style.fontFamily).toBe('Arial');
      expect(span.style.lineHeight).toBe('1.2');
      expect(span.style.letterSpacing).toBe('1px');
    });

    it('should handle horizontal alignment', () => {
      const leftAligned = createTextElement('Left', {
        width: '100',
        height: '30',
        'text-alignment': 'LEFT CENTER',
      });
      const leftSpan = leftAligned.querySelector('span') as HTMLSpanElement;
      expect(leftSpan.style.textAlign).toBe('left');
      expect(leftSpan.style.justifyContent).toBe('flex-start');

      const centerAligned = createTextElement('Center', {
        width: '100',
        height: '30',
        'text-alignment': 'CENTER CENTER',
      });
      const centerSpan = centerAligned.querySelector('span') as HTMLSpanElement;
      expect(centerSpan.style.textAlign).toBe('center');
      expect(centerSpan.style.justifyContent).toBe('center');

      const rightAligned = createTextElement('Right', {
        width: '100',
        height: '30',
        'text-alignment': 'RIGHT CENTER',
      });
      const rightSpan = rightAligned.querySelector('span') as HTMLSpanElement;
      expect(rightSpan.style.textAlign).toBe('right');
      expect(rightSpan.style.justifyContent).toBe('flex-end');
    });

    it('should handle vertical alignment', () => {
      const topAligned = createTextElement('Top', {
        width: '100',
        height: '30',
        'text-alignment': 'CENTER TOP',
      });
      const topSpan = topAligned.querySelector('span') as HTMLSpanElement;
      expect(topSpan.style.alignContent).toBe('flex-start');
      expect(topSpan.style.alignItems).toBe('flex-start');

      const centerAligned = createTextElement('Center', {
        width: '100',
        height: '30',
        'text-alignment': 'CENTER MIDDLE',
      });
      const centerSpan = centerAligned.querySelector('span') as HTMLSpanElement;
      expect(centerSpan.style.alignContent).toBe('center');
      expect(centerSpan.style.alignItems).toBe('center');

      const bottomAligned = createTextElement('Bottom', {
        width: '100',
        height: '30',
        'text-alignment': 'CENTER BOTTOM',
      });
      const bottomSpan = bottomAligned.querySelector('span') as HTMLSpanElement;
      expect(bottomSpan.style.alignContent).toBe('flex-end');
      expect(bottomSpan.style.alignItems).toBe('flex-end');
    });

    it('should set default horizontal and vertical alignment', () => {
      const textElement = createTextElement('Default', {
        width: '100',
        height: '30',
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.textAlign).toBe('left');
      expect(span.style.justifyContent).toBe('flex-start');
      expect(span.style.alignContent).toBe('flex-start');
      expect(span.style.alignItems).toBe('flex-start');
    });

    it('should apply common span styles', () => {
      const textElement = createTextElement('Test', {
        width: '100',
        height: '30',
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.width).toBe('100%');
      expect(span.style.height).toBe('100%');
      expect(span.style.display).toBe('flex');
      expect(span.style.flexWrap).toBe('wrap');
      expect(span.style.wordBreak).toBe('break-word');
      // expect(span.style.userSelect).toBe('none');
      expect(span.style.overflow).toBe('visible');
    });

    it('should handle stroke width attribute', () => {
      const textElement = createTextElement('Stroke Text', {
        width: '100',
        height: '30',
        'stroke-width': 2,
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.strokeWidth).toBe('2px');
    });

    it('should set foreignObject overflow to visible', () => {
      const textElement = createTextElement('Test', {
        width: '100',
        height: '30',
      });

      expect(textElement.getAttribute('overflow')).toBe('visible');
    });
  });
});
