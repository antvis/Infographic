import { describe, expect, it } from 'vitest';
import type { JSXElement, JSXNode } from '../../../../src/jsx/types';
import { getRenderableChildrenOf } from '../../../../src/jsx/utils';

describe('children utils', () => {
  describe('getRenderableChildrenOf', () => {
    it('should return empty array for null', () => {
      expect(getRenderableChildrenOf(null)).toEqual([]);
    });

    it('should return empty array for undefined', () => {
      expect(getRenderableChildrenOf(undefined)).toEqual([]);
    });

    it('should return empty array for boolean values', () => {
      expect(getRenderableChildrenOf(true)).toEqual([]);
      expect(getRenderableChildrenOf(false)).toEqual([]);
    });

    it('should return array with the element itself for primitive values', () => {
      expect(getRenderableChildrenOf('text')).toEqual(['text']);
      expect(getRenderableChildrenOf(42)).toEqual([42]);
      expect(getRenderableChildrenOf(0)).toEqual([0]);
    });

    it('should return flattened children from arrays', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };
      const arrayNode: JSXNode = [element1, 'text', 42, element2];

      const result = getRenderableChildrenOf(arrayNode);
      expect(result).toEqual([element1, 'text', 42, element2]);
    });

    it('should extract children from JSXElement props', () => {
      const child1: JSXElement = { type: 'span', props: {} };
      const child2 = 'text content';
      const element: JSXElement = {
        type: 'div',
        props: {
          className: 'container',
          children: [child1, child2, 42],
        },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([child1, child2, 42]);
    });

    it('should handle single child in props.children', () => {
      const child: JSXElement = { type: 'span', props: {} };
      const element: JSXElement = {
        type: 'div',
        props: {
          children: child,
        },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([child]);
    });

    it('should return empty array for JSXElement without children', () => {
      const element: JSXElement = {
        type: 'div',
        props: {},
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([]);
    });

    it('should return empty array for JSXElement with null/undefined children', () => {
      const element1: JSXElement = {
        type: 'div',
        props: { children: null },
      };
      const element2: JSXElement = {
        type: 'div',
        props: { children: undefined },
      };

      expect(getRenderableChildrenOf(element1)).toEqual([]);
      expect(getRenderableChildrenOf(element2)).toEqual([]);
    });

    it('should handle deeply nested arrays', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };
      const nestedArray: JSXNode = [element1, ['text', [element2, 42]], 'end'];

      const result = getRenderableChildrenOf(nestedArray);
      expect(result).toEqual([element1, 'text', element2, 42, 'end']);
    });

    it('should filter out boolean, null, and undefined from arrays', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const arrayWithFalsy: JSXNode = [
        element,
        null,
        undefined,
        true,
        false,
        'text',
        42,
      ];

      const result = getRenderableChildrenOf(arrayWithFalsy);
      expect(result).toEqual([element, 'text', 42]);
    });

    it('should handle mixed content in props.children', () => {
      const child1: JSXElement = { type: 'span', props: {} };
      const element: JSXElement = {
        type: 'div',
        props: {
          children: [child1, 'text', null, 42, undefined, true],
        },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([child1, 'text', 42]);
    });

    it('should handle empty arrays', () => {
      expect(getRenderableChildrenOf([])).toEqual([]);

      const elementWithEmptyChildren: JSXElement = {
        type: 'div',
        props: { children: [] },
      };
      expect(getRenderableChildrenOf(elementWithEmptyChildren)).toEqual([]);
    });

    it('should preserve object references', () => {
      const child: JSXElement = { type: 'span', props: {} };
      const element: JSXElement = {
        type: 'div',
        props: { children: child },
      };

      const result = getRenderableChildrenOf(element);
      expect(result[0]).toBe(child);
    });

    it('should handle JSXElement with other props besides children', () => {
      const child: JSXElement = { type: 'span', props: {} };
      const element: JSXElement = {
        type: 'div',
        props: {
          id: 'test',
          className: 'container',
          onClick: () => {},
          children: child,
        },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([child]);
    });

    it('should handle string children in props', () => {
      const element: JSXElement = {
        type: 'div',
        props: { children: 'Hello World' },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual(['Hello World']);
    });

    it('should handle number children in props', () => {
      const element: JSXElement = {
        type: 'div',
        props: { children: 123 },
      };

      const result = getRenderableChildrenOf(element);
      expect(result).toEqual([123]);
    });
  });
});
