import { describe, expect, it } from 'vitest';
import { normalizeStackedBarRows } from '../../../../src/designs/structures/chart-bar-stacked-100';
import { renderToString } from '../../../../src/ssr';

const categories = [
  { id: 'a', label: '研发' },
  { id: 'b', label: '设计' },
  { id: 'c', label: '运营' },
];

describe('chart-bar-stacked-100', () => {
  it('normalizes raw values per row and preserves category order', () => {
    const rows = [
      {
        label: '团队 A',
        children: [
          { id: 'b', value: 1 },
          { id: 'a', value: 3 },
        ],
      },
      { label: '团队 B', children: [] },
    ];
    const result = normalizeStackedBarRows(categories, rows);

    expect(result[0].total).toBe(4);
    expect(result[0].segments).toEqual([
      { id: 'a', value: 3, percent: 75 },
      { id: 'b', value: 1, percent: 25 },
      { id: 'c', value: 0, percent: 0 },
    ]);
    expect(result[1].segments.map((segment) => segment.percent)).toEqual([
      0, 0, 0,
    ]);
    expect(rows[0].children[0].value).toBe(1);
  });

  it('rejects invalid categories and values', () => {
    const rows = [{ label: 'A', children: [{ id: 'a', value: 1 }] }];
    expect(() => normalizeStackedBarRows([], rows)).toThrow();
    expect(() =>
      normalizeStackedBarRows([categories[0], categories[0]], rows),
    ).toThrow();
    expect(() =>
      normalizeStackedBarRows(categories, [
        { label: 'A', children: [{ id: 'unknown', value: 1 }] },
      ]),
    ).toThrow();
    expect(() =>
      normalizeStackedBarRows(categories, [
        { label: 'A', children: [{ id: 'a', value: -1 }] },
      ]),
    ).toThrow();
    expect(() =>
      normalizeStackedBarRows(categories, [
        {
          label: 'A',
          children: [
            { id: 'a', value: 1 },
            { id: 'a', value: 2 },
          ],
        },
      ]),
    ).toThrow();
  });

  it('parses the template and exports normalized labels to SVG', async () => {
    const svg =
      await renderToString(`infographic chart-bar-stacked-100-plain-text
data
  title 团队构成
  categories
    - id a
      label 研发
    - id b
      label 设计
  values
    - label 团队 A
      children
        - id a
          value 3
        - id b
          value 1
    - label 团队 B
      children
        - id a
          value 0
        - id b
          value 0`);

    expect(svg).toContain('<svg');
    expect(svg).toContain('75.0%');
    expect(svg).toContain('25.0%');
    expect(svg).toContain('No Data');
    expect(svg).toContain('研发');
    expect(svg).toContain('设计');
  });
});
