import { describe, expect, it } from 'vitest';
import { getTypes } from '../../../src/utils/get-types';

describe('getTypes', () => {
  it('generates type definition with nested items and comments', () => {
    const result = getTypes({
      structure: ['title', 'item'],
      items: [
        ['label', 'value'],
        ['label', 'icon'],
      ],
    });

    expect(result).toMatchInlineSnapshot(`
"type InfographicType = {
  /** 信息图标题 */
  title: string;
  /** 信息图描述 */
  desc: string;
  /** 信息图的内容项 */
  items: Array<{
    /** 项目标签文本 */
    label: string;
    /** 项目数值内容 */
    value: number;
    /** 子级项目（多层结构） */
    children: Array<{
      /** 项目标签文本 */
      label: string;
      /** 项目图标 */
      icon: string;
    }>;
  }>;
}"
    `);
  });

  it('omits sections that are not declared in structure', () => {
    const result = getTypes({
      structure: [],
      items: [],
    });

    expect(result).toBe('type InfographicType = {\n}');
  });
});
