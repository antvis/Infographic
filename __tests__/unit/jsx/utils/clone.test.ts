import { describe, expect, it } from 'vitest';
import type { JSXElement } from '../../../../src/jsx//types';
import { cloneElement } from '../../../../src/jsx//utils';

describe('clone utils', () => {
  describe('cloneElement', () => {
    it('should create a deep clone of JSXElement', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {
          x: 10,
          y: 20,
          width: 100,
          height: 50,
          fill: 'red',
        },
        key: 'test-key',
      };

      const cloned = cloneElement(element);

      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
    });

    it('should merge additional props when provided', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {
          x: 10,
          y: 20,
          fill: 'red',
        },
      };

      const additionalProps = {
        width: 100,
        height: 50,
        fill: 'blue', // This should override the original fill
      };

      const cloned = cloneElement(element, additionalProps);

      expect(cloned).toEqual({
        type: 'rect',
        props: {
          x: 10,
          y: 20,
          fill: 'blue',
          width: 100,
          height: 50,
        },
      });
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
    });

    it('should clone element with function type', () => {
      const MockComponent = () => ({ type: 'div', props: {} });
      const element: JSXElement = {
        type: MockComponent,
        props: {
          someProp: 'value',
        },
      };

      const cloned = cloneElement(element);

      expect(cloned.type).toBe(MockComponent);
      expect(cloned.props).toEqual(element.props);
      expect(cloned.props).not.toBe(element.props);
    });

    it('should clone element with children', () => {
      const element: JSXElement = {
        type: 'g',
        props: {
          transform: 'translate(10,20)',
          children: [
            {
              type: 'rect',
              props: { width: 50, height: 50 },
            },
            {
              type: 'circle',
              props: { r: 25 },
            },
          ],
        },
      };

      const cloned = cloneElement(element);

      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
      expect(cloned.props.children).toBe(element.props.children); // shallow clone, children reference is preserved
    });

    it('should handle element with empty props', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {},
      };

      const cloned = cloneElement(element);

      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
    });

    it('should handle element with nested object props', () => {
      const element: JSXElement = {
        type: 'text',
        props: {
          style: {
            fontSize: 16,
            color: 'blue',
          },
          position: { x: 10, y: 20 },
        },
      };

      const cloned = cloneElement(element);

      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
      expect(cloned.props.style).toBe(element.props.style); // shallow clone, nested objects share references
      expect(cloned.props.position).toBe(element.props.position);
    });

    it('should handle element with null/undefined props', () => {
      const element: JSXElement = {
        type: 'rect',
        props: {
          fill: null,
          stroke: undefined,
          width: 100,
        },
      };

      const cloned = cloneElement(element);

      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
      expect(cloned.props).not.toBe(element.props);
      expect(cloned.props.fill).toBeNull();
      expect(cloned.props.stroke).toBeUndefined();
      expect(cloned.props.width).toBe(100);
    });

    it('should preserve all additional properties', () => {
      const element: JSXElement = {
        type: 'rect',
        props: { width: 100, children: [] },
        key: 'unique-key',
      };

      const cloned = cloneElement(element);

      expect(cloned.key).toBe('unique-key');
      expect(cloned.props.children).toEqual([]);
      expect(cloned.props.children).toBe(element.props.children); // reference preserved for non-props
    });

    it('should handle string type', () => {
      const element: JSXElement = {
        type: 'circle',
        props: {
          cx: 50,
          cy: 50,
          r: 25,
        },
      };

      const cloned = cloneElement(element);

      expect(cloned.type).toBe('circle');
      expect(cloned).toEqual(element);
      expect(cloned).not.toBe(element);
    });
  });
});
