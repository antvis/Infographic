import { describe, expect, it } from 'vitest';
import type { JSXElement, JSXNode } from '../../../../src';
import { getRenderableChildrenOf } from '../../../../src/jsx//utils';

describe('getRenderableChildrenOf', () => {
  describe('处理 null/undefined/boolean 值', () => {
    it('为 null 返回空数组', () => {
      const result = getRenderableChildrenOf(null);
      expect(result).toEqual([]);
    });

    it('为 undefined 返回空数组', () => {
      const result = getRenderableChildrenOf(undefined);
      expect(result).toEqual([]);
    });

    it('为 true 返回空数组', () => {
      const result = getRenderableChildrenOf(true);
      expect(result).toEqual([]);
    });

    it('为 false 返回空数组', () => {
      const result = getRenderableChildrenOf(false);
      expect(result).toEqual([]);
    });
  });

  describe('处理基础类型', () => {
    it('为字符串返回包含该字符串的数组', () => {
      const result = getRenderableChildrenOf('hello');
      expect(result).toEqual(['hello']);
    });

    it('为数字返回包含该数字的数组', () => {
      const result = getRenderableChildrenOf(42);
      expect(result).toEqual([42]);
    });

    it('为空字符串返回包含该空字符串的数组', () => {
      const result = getRenderableChildrenOf('');
      expect(result).toEqual(['']);
    });

    it('为数字 0 返回包含 0 的数组', () => {
      const result = getRenderableChildrenOf(0);
      expect(result).toEqual([0]);
    });
  });

  describe('处理数组', () => {
    it('扁平化简单数组', () => {
      const input: JSXNode[] = ['hello', 42, 'world'];
      const result = getRenderableChildrenOf(input);
      expect(result).toEqual(['hello', 42, 'world']);
    });

    it('过滤掉数组中的 null/undefined/boolean 值', () => {
      const input: JSXNode[] = [
        'hello',
        null,
        true,
        42,
        undefined,
        false,
        'world',
      ];
      const result = getRenderableChildrenOf(input);
      expect(result).toEqual(['hello', 42, 'world']);
    });

    it('处理嵌套数组', () => {
      const input: JSXNode[] = ['hello', ['nested', 42], 'world'];
      const result = getRenderableChildrenOf(input);
      expect(result).toEqual(['hello', 'nested', 42, 'world']);
    });

    it('处理深度嵌套数组', () => {
      const input: JSXNode[] = ['a', ['b', ['c', ['d']], 'e'], 'f'];
      const result = getRenderableChildrenOf(input);
      expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    });

    it('处理空数组', () => {
      const result = getRenderableChildrenOf([]);
      expect(result).toEqual([]);
    });

    it('处理只包含 null/undefined/boolean 的数组', () => {
      const input: JSXNode[] = [null, undefined, true, false];
      const result = getRenderableChildrenOf(input);
      expect(result).toEqual([]);
    });
  });

  describe('处理 JSX 对象', () => {
    it('处理没有 children 的 JSX 元素', () => {
      const jsxElement: JSXElement = {
        type: 'div',
        props: { className: 'test' },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual([]);
    });

    it('处理有字符串 children 的 JSX 元素', () => {
      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          className: 'test',
          children: 'hello world',
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['hello world']);
    });

    it('处理有数字 children 的 JSX 元素', () => {
      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: 42,
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual([42]);
    });

    it('处理有数组 children 的 JSX 元素', () => {
      const childElement: JSXElement = {
        type: 'span',
        props: { children: 'child' },
      };

      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: ['hello', childElement, 'world'],
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['hello', childElement, 'world']);
    });

    it('处理有 JSX 元素 children 的 JSX 元素', () => {
      const childElement: JSXElement = {
        type: 'span',
        props: { children: 'nested' },
      };

      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: childElement,
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual([childElement]);
    });

    it('过滤 JSX 元素 children 中的 null/undefined/boolean', () => {
      const childElement: JSXElement = {
        type: 'span',
        props: {},
      };

      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: [
            'hello',
            null,
            childElement,
            true,
            'world',
            undefined,
            false,
          ],
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['hello', childElement, 'world']);
    });

    it('处理没有 props 的 JSX 元素', () => {
      const jsxElement = {
        type: 'div',
      } as JSXElement;
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual([]);
    });
  });

  describe('复杂场景', () => {
    it('处理复杂嵌套结构', () => {
      const deepChild: JSXElement = {
        type: 'em',
        props: { children: 'emphasized' },
      };

      const nestedElement: JSXElement = {
        type: 'span',
        props: {
          children: ['text', deepChild, null, 123],
        },
      };

      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: [
            'start',
            nestedElement,
            ['array', 'content'],
            undefined,
            'end',
          ],
        },
      };

      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual([
        'start',
        nestedElement,
        'array',
        'content',
        'end',
      ]);
    });

    it('处理混合类型的复杂数组', () => {
      const element1: JSXElement = { type: 'div', props: {} };
      const element2: JSXElement = { type: 'span', props: {} };

      const input: JSXNode = [
        'string1',
        42,
        element1,
        [null, 'string2', [true, element2, false], 'string3'],
        undefined,
        123,
      ];

      const result = getRenderableChildrenOf(input);
      expect(result).toEqual([
        'string1',
        42,
        element1,
        'string2',
        element2,
        'string3',
        123,
      ]);
    });

    it('处理带有 key 的 JSX 元素', () => {
      const jsxElement: JSXElement = {
        type: 'div',
        props: {
          children: 'content',
        },
        key: 'unique-key',
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['content']);
    });
  });

  describe('边界情况', () => {
    it('处理非常深的嵌套', () => {
      // 创建一个 10 层深的嵌套数组
      let nested: JSXNode = 'deep';
      for (let i = 0; i < 10; i++) {
        nested = [nested];
      }

      const result = getRenderableChildrenOf(nested);
      expect(result).toEqual(['deep']);
    });

    it('处理大数组', () => {
      const largeArray: JSXNode[] = Array.from(
        { length: 1000 },
        (_, i) => `item${i}`,
      );
      const result = getRenderableChildrenOf(largeArray);
      expect(result).toHaveLength(1000);
      expect(result[0]).toBe('item0');
      expect(result[999]).toBe('item999');
    });

    it('处理函数作为 JSX 类型', () => {
      const ComponentFunction = () => {
        return {} as any;
      };
      const jsxElement: JSXElement = {
        type: ComponentFunction,
        props: {
          children: 'function component',
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['function component']);
    });

    it('处理 Symbol 作为 JSX 类型', () => {
      const symbolType = Symbol('test');
      const jsxElement: JSXElement = {
        type: symbolType,
        props: {
          children: 'symbol component',
        },
      };
      const result = getRenderableChildrenOf(jsxElement);
      expect(result).toEqual(['symbol component']);
    });
  });
});
