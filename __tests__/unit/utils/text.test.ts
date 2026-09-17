import { beforeEach, describe, expect, it } from 'vitest';
import { getElementRole, setElementRole } from '../../../src/utils';
import {
  createTextElement,
  getTextElementProps,
  getTextEntity,
  getTextStyle,
  updateTextElement,
} from '../../../src/utils/text';

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
      setElementRole(textElement, 'text');

      expect(textElement.tagName).toBe('foreignObject');
      expect(textElement.getAttribute('id')).toBe('test-text');
      expect(textElement.getAttribute('x')).toBe('10');
      expect(textElement.getAttribute('y')).toBe('20');
      expect(textElement.getAttribute('width')).toBe('100');
      expect(textElement.getAttribute('height')).toBe('30');
      expect(getElementRole(textElement)).toBe('text');
    });

    it('should create entity child with text content', () => {
      const textElement = createTextElement('Test\nText', {
        width: '100',
        height: '30',
      });

      const entity = getTextEntity(textElement);
      expect(entity).toBeTruthy();
      expect(entity?.innerText).toBe('Test\nText');
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
        'word-spacing': 2,
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.color).toBe('red');
      expect(span.style.fontSize).toBe('18px');
      expect(span.style.fontFamily).toBe('Arial');
      expect(span.style.lineHeight).toBe('1.2');
      expect(span.style.letterSpacing).toBe('1px');
      expect(span.style.wordSpacing).toBe('2px');
    });

    it('should handle horizontal alignment', () => {
      const leftAligned = createTextElement('Left', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'LEFT',
        'data-vertical-align': 'MIDDLE',
      });
      const leftSpan = leftAligned.querySelector('span') as HTMLSpanElement;
      expect(leftSpan.style.textAlign).toBe('left');
      expect(leftSpan.style.justifyContent).toBe('flex-start');

      const centerAligned = createTextElement('Center', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'CENTER',
        'data-vertical-align': 'MIDDLE',
      });
      const centerSpan = centerAligned.querySelector('span') as HTMLSpanElement;
      expect(centerSpan.style.textAlign).toBe('center');
      expect(centerSpan.style.justifyContent).toBe('center');

      const rightAligned = createTextElement('Right', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'RIGHT',
        'data-vertical-align': 'MIDDLE',
      });
      const rightSpan = rightAligned.querySelector('span') as HTMLSpanElement;
      expect(rightSpan.style.textAlign).toBe('right');
      expect(rightSpan.style.justifyContent).toBe('flex-end');
    });

    it('should handle vertical alignment', () => {
      const topAligned = createTextElement('Top', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'CENTER',
        'data-vertical-align': 'TOP',
      });
      const topSpan = topAligned.querySelector('span') as HTMLSpanElement;
      expect(topSpan.style.alignContent).toBe('flex-start');
      expect(topSpan.style.alignItems).toBe('flex-start');

      const centerAligned = createTextElement('Center', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'CENTER',
        'data-vertical-align': 'MIDDLE',
      });
      const centerSpan = centerAligned.querySelector('span') as HTMLSpanElement;
      expect(centerSpan.style.alignContent).toBe('center');
      expect(centerSpan.style.alignItems).toBe('center');

      const bottomAligned = createTextElement('Bottom', {
        width: '100',
        height: '30',
        'data-horizontal-align': 'CENTER',
        'data-vertical-align': 'BOTTOM',
      });
      const bottomSpan = bottomAligned.querySelector('span') as HTMLSpanElement;
      expect(bottomSpan.style.alignContent).toBe('flex-end');
      expect(bottomSpan.style.alignItems).toBe('flex-end');
    });

    it('should not set default horizontal and vertical alignment', () => {
      const textElement = createTextElement('Default', {
        width: '100',
        height: '30',
      });

      const span = textElement.querySelector('span') as HTMLSpanElement;
      expect(span.style.textAlign).toBe('');
      expect(span.style.justifyContent).toBe('');
      expect(span.style.alignContent).toBe('');
      expect(span.style.alignItems).toBe('');
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

describe('text spacing', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('getTextStyle spacing normalization', () => {
    it('should treat bare numbers and numeric strings as pixels', () => {
      const style = getTextStyle({
        'letter-spacing': 1.5,
        'word-spacing': '2',
      });

      expect(style.letterSpacing).toBe('1.5px');
      expect(style.wordSpacing).toBe('2px');
    });

    it('should keep CSS lengths with an explicit unit untouched', () => {
      const style = getTextStyle({
        'letter-spacing': '0.5em',
        'word-spacing': '  3pt  ',
      });

      expect(style.letterSpacing).toBe('0.5em');
      expect(style.wordSpacing).toBe('3pt');
    });

    it('should keep an explicit zero rather than dropping it', () => {
      const style = getTextStyle({ 'letter-spacing': 0, 'word-spacing': 0 });

      expect(style.letterSpacing).toBe('0px');
      expect(style.wordSpacing).toBe('0px');
    });

    it('should omit spacing that was not provided', () => {
      const style = getTextStyle({});

      expect(style.letterSpacing).toBeUndefined();
      expect(style.wordSpacing).toBeUndefined();
    });

    it('should skip null spacing instead of throwing', () => {
      const style = getTextStyle({
        'letter-spacing': null,
        'word-spacing': null,
      } as any);

      expect(style.letterSpacing).toBeUndefined();
      expect(style.wordSpacing).toBeUndefined();
    });
  });

  describe('updateTextElement measurement', () => {
    it('should measure the element when width and height are missing', () => {
      const textElement = createTextElement('Measured', {
        width: '100',
        height: '30',
      });
      textElement.removeAttribute('width');
      textElement.removeAttribute('height');

      updateTextElement(textElement, {
        textContent: 'Measured',
        attributes: { 'font-size': 16, 'line-height': 1.5 },
      });

      expect(Number(textElement.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(textElement.getAttribute('height'))).toBeGreaterThan(0);
    });

    it('should widen the measured box as letter spacing grows', () => {
      const measure = (letterSpacing: number) => {
        const textElement = createTextElement('Spacing', {
          width: '100',
          height: '30',
        });
        textElement.removeAttribute('width');
        textElement.removeAttribute('height');
        updateTextElement(textElement, {
          textContent: 'Spacing',
          attributes: { 'font-size': 16, 'letter-spacing': letterSpacing },
        });
        return Number(textElement.getAttribute('width'));
      };

      expect(measure(10)).toBeGreaterThan(measure(0));
    });

    it('should keep an explicitly sized element unmeasured', () => {
      const textElement = createTextElement('Sized', {
        width: '120',
        height: '40',
      });

      updateTextElement(textElement, {
        textContent: 'Sized',
        attributes: { width: '120', height: '40', 'font-size': 16 },
      });

      expect(textElement.getAttribute('width')).toBe('120');
      expect(textElement.getAttribute('height')).toBe('40');
    });
  });

  describe('getTextElementProps spacing round-trip', () => {
    it('should read spacing back off the entity', () => {
      const textElement = createTextElement('Round trip', {
        width: '100',
        height: '30',
        'letter-spacing': 2,
        'word-spacing': '0.25em',
      });

      const { attributes } = getTextElementProps(textElement);

      expect(attributes?.['letter-spacing']).toBe('2px');
      expect(attributes?.['word-spacing']).toBe('0.25em');
    });

    it('should omit spacing when the entity has none', () => {
      const textElement = createTextElement('No spacing', {
        width: '100',
        height: '30',
      });

      const { attributes } = getTextElementProps(textElement);

      expect(attributes?.['letter-spacing']).toBeUndefined();
      expect(attributes?.['word-spacing']).toBeUndefined();
    });
  });
});
