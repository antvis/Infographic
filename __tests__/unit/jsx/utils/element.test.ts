import { describe, expect, it } from 'vitest';
import type { JSXElement, JSXNode, RenderableNode } from '../../../../src';
import { Fragment } from '../../../../src';
import {
  nodeToElements,
  nodeToRenderableNodes,
} from '../../../../src/jsx//utils';

describe('element utils', () => {
  describe('nodeToElements', () => {
    it('should extract JSXElements from a JSXNode', () => {
      const element: JSXElement = {
        type: 'div',
        props: { id: 'test' },
      };

      const result = nodeToElements(element);
      expect(result).toEqual([element]);
    });

    it('should extract JSXElements from an array of mixed nodes', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };
      const nodes: JSXNode = [element1, 'text', 42, element2, true, null];

      const result = nodeToElements(nodes);
      expect(result).toEqual([element1, element2]);
    });

    it('should return empty array for primitive values', () => {
      expect(nodeToElements('text')).toEqual([]);
      expect(nodeToElements(42)).toEqual([]);
      expect(nodeToElements(true)).toEqual([]);
      expect(nodeToElements(null)).toEqual([]);
      expect(nodeToElements(undefined)).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(nodeToElements([])).toEqual([]);
    });

    it('should handle nested arrays', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };
      const nestedNodes: JSXNode = [element1, ['text', element2, [42, true]]];

      const result = nodeToElements(nestedNodes);
      expect(result).toEqual([element1, element2]);
    });

    it('should filter out non-JSXElement objects', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const notElement = { someOtherProperty: 'value' };
      const nodes: JSXNode = [element, notElement as any];

      const result = nodeToElements(nodes);
      expect(result).toEqual([element]);
    });
  });

  describe('nodeToRenderableNodes', () => {
    it('should collect renderable nodes from a single JSXElement', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const result = nodeToRenderableNodes(element);
      expect(result).toEqual([element]);
    });

    it('should collect renderable nodes from primitive values', () => {
      expect(nodeToRenderableNodes('text')).toEqual(['text']);
      expect(nodeToRenderableNodes(42)).toEqual([42]);
    });

    it('should skip null, undefined, and boolean values', () => {
      expect(nodeToRenderableNodes(null)).toEqual([]);
      expect(nodeToRenderableNodes(undefined)).toEqual([]);
      expect(nodeToRenderableNodes(true)).toEqual([]);
      expect(nodeToRenderableNodes(false)).toEqual([]);
    });

    it('should collect from arrays recursively', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const nodes: JSXNode = [element, 'text', 42, null, undefined, true];

      const result = nodeToRenderableNodes(nodes);
      expect(result).toEqual([element, 'text', 42]);
    });

    it('should handle deeply nested arrays', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };
      const nestedNodes: JSXNode = [
        element1,
        ['text', [element2, 42], [[null, 'nested']]],
      ];

      const result = nodeToRenderableNodes(nestedNodes);
      expect(result).toEqual([element1, 'text', element2, 42, 'nested']);
    });

    it('should accumulate results in the provided array', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const existingResult: RenderableNode[] = ['existing'];

      const result = nodeToRenderableNodes(element, existingResult);
      expect(result).toBe(existingResult);
      expect(result).toEqual(['existing', element]);
    });

    it('should handle mixed content types', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const nodes: JSXNode = [
        'start',
        element,
        42,
        ['middle', null, 'text'],
        'end',
      ];

      const result = nodeToRenderableNodes(nodes);
      expect(result).toEqual(['start', element, 42, 'middle', 'text', 'end']);
    });

    it('should handle empty arrays', () => {
      expect(nodeToRenderableNodes([])).toEqual([]);
    });

    it('should handle arrays with only falsy values', () => {
      const nodes: JSXNode = [null, undefined, false, true];
      expect(nodeToRenderableNodes(nodes)).toEqual([]);
    });

    it('should preserve object references for JSXElements', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const result = nodeToRenderableNodes(element);
      expect(result[0]).toBe(element);
    });

    it('should handle very deeply nested structures', () => {
      const element: JSXElement = { type: 'div', props: {} };
      const deeplyNested: JSXNode = [[[[[element]]]]];

      const result = nodeToRenderableNodes(deeplyNested);
      expect(result).toEqual([element]);
    });

    it('should handle fragments correctly', () => {
      const fragmentNode: JSXElement = {
        type: Fragment,
        props: { children: ['text', { type: 'span', props: {} }] },
      };

      const result = nodeToRenderableNodes(fragmentNode);
      expect(result).toEqual(['text', { type: 'span', props: {} }]);
    });

    it('should handle empty fragments', () => {
      const fragmentNode: JSXElement = {
        type: Fragment,
        props: { children: null },
      };

      const result = nodeToRenderableNodes(fragmentNode);
      expect(result).toEqual([]);
    });

    it('should handle fragments with multiple children', () => {
      const fragmentNode: JSXElement = {
        type: Fragment,
        props: {
          children: ['text', { type: 'div', props: {} }, 42, null, true],
        },
      };

      const result = nodeToRenderableNodes(fragmentNode);
      expect(result).toEqual(['text', { type: 'div', props: {} }, 42]);
    });

    it('should handle fragments with nested arrays', () => {
      const fragmentNode: JSXElement = {
        type: Fragment,
        props: {
          children: [
            'start',
            [{ type: 'div', props: {} }, null],
            'end',
            [42, true],
          ],
        },
      };

      const result = nodeToRenderableNodes(fragmentNode);
      expect(result).toEqual(['start', { type: 'div', props: {} }, 'end', 42]);
    });
  });
});
