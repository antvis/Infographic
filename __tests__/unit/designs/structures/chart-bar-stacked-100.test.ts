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
    expect(() =>
      normalizeStackedBarRows(categories, [
        {
          label: 'A',
          children: [
            { id: 'a', value: Number.MAX_VALUE },
            { id: 'b', value: Number.MAX_VALUE },
          ],
        },
      ]),
    ).toThrow('invalid total');
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

  it('wraps long legend labels onto another line', async () => {
    const firstLabel = '研发与产品设计投入分类说明'.repeat(3);
    const secondLabel = '市场与运营推广投入分类说明'.repeat(3);
    const svg =
      await renderToString(`infographic chart-bar-stacked-100-plain-text
data
  categories
    - id a
      label ${firstLabel}
    - id b
      label ${secondLabel}
  values
    - label 团队 A
      children
        - id a
          value 1
        - id b
          value 1`);

    const document = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const texts = Array.from(document.querySelectorAll('text'));
    const getLegendY = (label: string) => {
      const text = texts.find((element) => element.textContent === label);
      const transform = text?.parentElement?.getAttribute('transform');
      return Number(transform?.match(/translate\([^,]+,\s*([^)]+)\)/)?.[1]);
    };

    expect(getLegendY(secondLabel)).toBeGreaterThan(getLegendY(firstLabel));
  });
});
