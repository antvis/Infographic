import { beforeAll, describe, expect, it } from 'vitest';
import {
  isBtnAdd,
  isBtnRemove,
  isBtnsGroup,
  isDesc,
  isEditArea,
  isIllus,
  isItemDesc,
  isItemIcon,
  isItemIllus,
  isItemLabel,
  isItemValue,
  isShape,
  isShapesGroup,
  isText,
  isTitle,
} from '../../../src/utils/recognizer';

function createMockElement(
  type?: string,
  tagName = 'g',
  indexes?: number[],
): SVGElement {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    tagName,
  );
  if (type) element.setAttribute('data-element-type', type);
  if (indexes) element.setAttribute('data-indexes', indexes.join(','));
  return element;
}

describe('recognizer', () => {
  beforeAll(() => {
    if (typeof global.SVGTextElement === 'undefined') {
      global.SVGTextElement = class SVGTextElement {} as any;
    }
  });
  describe('isTitle', () => {
    it('should recognize title element', () => {
      expect(isTitle(createMockElement('title'))).toBe(true);
      expect(isTitle(createMockElement('not-title'))).toBe(false);
      expect(isTitle(createMockElement(''))).toBe(false);
    });
  });

  describe('isDesc', () => {
    it('should recognize desc element', () => {
      expect(isDesc(createMockElement('desc'))).toBe(true);
      expect(isDesc(createMockElement('not-desc'))).toBe(false);
    });
  });

  describe('isShape', () => {
    it('should recognize shape elements', () => {
      expect(isShape(createMockElement('shape'))).toBe(true);
      expect(isShape(createMockElement('not-shape'))).toBe(false);
    });
  });

  describe('isIllus', () => {
    it('should recognize illus elements', () => {
      expect(isIllus(createMockElement('illus'))).toBe(true);
      expect(isIllus(createMockElement('not-illus'))).toBe(false);
    });
  });

  describe('isText', () => {
    it('should recognize text elements by tag name', () => {
      expect(isText(createMockElement('any-id', 'text'))).toBe(true);
      expect(isText(createMockElement('any-id', 'g'))).toBe(false);
    });
  });

  describe('isShapesGroup', () => {
    it('should recognize shape group elements', () => {
      expect(isShapesGroup(createMockElement('shapes-group'))).toBe(true);
      expect(isShapesGroup(createMockElement('not-shapes'))).toBe(false);
    });
  });

  describe('isItemIcon', () => {
    it('should recognize item icon elements', () => {
      expect(isItemIcon(createMockElement('item-icon'))).toBe(true);
      expect(
        isItemIcon(createMockElement('item-icon', 'rect', [0, 1, 2])),
      ).toBe(true);
      expect(isItemIcon(createMockElement('item-icon', 'rect', [0]))).toBe(
        true,
      );
      expect(isItemIcon(createMockElement('not-item-icon'))).toBe(false);
    });
  });

  describe('isItemLabel', () => {
    it('should recognize item label elements', () => {
      expect(isItemLabel(createMockElement('item-label'))).toBe(true);
      expect(isItemLabel(createMockElement('item-label', 'g', [0, 1, 2]))).toBe(
        true,
      );
      expect(isItemLabel(createMockElement('not-item-label'))).toBe(false);
    });
  });

  describe('isItemDesc', () => {
    it('should recognize item desc elements', () => {
      expect(isItemDesc(createMockElement('item-desc'))).toBe(true);
      expect(isItemDesc(createMockElement('item-desc', 'g', [0, 1, 2]))).toBe(
        true,
      );
      expect(isItemDesc(createMockElement('not-item-desc'))).toBe(false);
    });
  });

  describe('isItemValue', () => {
    it('should recognize item value elements', () => {
      expect(isItemValue(createMockElement('item-value'))).toBe(true);
      expect(isItemValue(createMockElement('item-value', 'g', [0, 1, 2]))).toBe(
        true,
      );
      expect(isItemValue(createMockElement('not-item-value'))).toBe(false);
    });
  });

  describe('isItemIllus', () => {
    it('should recognize item illus elements', () => {
      expect(isItemIllus(createMockElement('item-illus'))).toBe(true);
      expect(isItemIllus(createMockElement('item-illus', 'g', [0, 1, 2]))).toBe(
        true,
      );
      expect(isItemIllus(createMockElement('not-item-illus'))).toBe(false);
    });
  });

  describe('isEditArea', () => {
    it('should recognize edit area element', () => {
      expect(isEditArea(createMockElement('edit-area'))).toBe(true);
      expect(isEditArea(createMockElement('not-edit-area'))).toBe(false);
    });
  });

  describe('isBtnsGroup', () => {
    it('should recognize btns group element', () => {
      expect(isBtnsGroup(createMockElement('btns-group'))).toBe(true);
      expect(isBtnsGroup(createMockElement('not-btns-group'))).toBe(false);
    });
  });

  describe('isBtnAdd', () => {
    it('should recognize btn add elements', () => {
      expect(isBtnAdd(createMockElement('btn-add', 'g', [0]))).toBe(true);
      expect(isBtnAdd(createMockElement('not-btn-add'))).toBe(false);
    });
  });

  describe('isBtnRemove', () => {
    it('should recognize btn remove elements', () => {
      expect(isBtnRemove(createMockElement('btn-remove', 'g', [0]))).toBe(true);
      expect(isBtnRemove(createMockElement('btn-remove', 'g', [0, 1, 2]))).toBe(
        true,
      );
      expect(isBtnRemove(createMockElement('not-btn-remove'))).toBe(false);
    });
  });
});
