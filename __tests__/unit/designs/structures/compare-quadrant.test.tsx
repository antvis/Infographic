/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import {
  Rect,
  renderSVG,
  type ParsedInfographicOptions,
} from '../../../../src';
import type { BaseStructureProps } from '../../../../src/designs/structures';
import { Quadrant } from '../../../../src/designs/structures/compare-quadrant';
import type { ParsedData } from '../../../../src/types';

const Item: BaseStructureProps['Item'] = ({
  x = 0,
  y = 0,
  datum,
  indexes,
  positionH,
}) => (
  <Rect
    data-quadrant-item={indexes[0]}
    x={x}
    y={y}
    width={Number(datum.width) + (positionH === 'flipped' ? 20 : 0)}
    height={Number(datum.height)}
  />
);

function render(
  items: Array<{ width: number; height: number }>,
  dimensions = {},
) {
  const data = { items } as unknown as ParsedData;
  const svg = renderSVG(
    <Quadrant
      Item={Item}
      Items={[]}
      data={data}
      options={{ data } as ParsedInfographicOptions}
      {...dimensions}
    />,
  );
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

function itemBounds(doc: Document) {
  return [...doc.querySelectorAll('[data-quadrant-item]')].map((el) => ({
    x: Number(el.getAttribute('x')),
    y: Number(el.getAttribute('y')),
    width: Number(el.getAttribute('width')),
    height: Number(el.getAttribute('height')),
  }));
}

const varied = [
  { width: 80, height: 40 },
  { width: 160, height: 120 },
  { width: 100, height: 200 },
  { width: 40, height: 60 },
];

describe('Quadrant item bounds', () => {
  it('sizes all quadrants to contain their largest rendered item', () => {
    const doc = render(varied);
    // The flipped second item is 180px wide, so each quadrant is 200x220.
    const bounds = itemBounds(doc);
    bounds.forEach((b, index) => {
      const left = (index % 2) * 200;
      const top = Math.floor(index / 2) * 220;
      expect(b.x).toBeGreaterThanOrEqual(left + 10);
      expect(b.y).toBeGreaterThanOrEqual(top + 10);
      expect(b.x + b.width).toBeLessThanOrEqual(left + 190);
      expect(b.y + b.height).toBeLessThanOrEqual(top + 210);
    });
  });

  it('centers each item using its own dimensions and rendered orientation', () => {
    const bounds = itemBounds(render(varied));
    expect(bounds.map((b) => [b.x + b.width / 2, b.y + b.height / 2])).toEqual([
      [100, 110],
      [300, 110],
      [100, 330],
      [300, 330],
    ]);
  });

  it('preserves explicit quadrant dimensions while centering variable items', () => {
    const bounds = itemBounds(
      render(varied, { quadrantWidth: 300, quadrantHeight: 250 }),
    );
    expect(bounds.map((b) => [b.x + b.width / 2, b.y + b.height / 2])).toEqual([
      [150, 125],
      [450, 125],
      [150, 375],
      [450, 375],
    ]);
  });

  it('only measures and renders the first four data items', () => {
    const doc = render([...varied, { width: 10000, height: 10000 }]);
    const bounds = itemBounds(doc);
    expect(bounds).toHaveLength(4);
    expect(bounds[0].x + bounds[0].width / 2).toBe(100);
  });

  it('keeps the existing padding for identical rendered dimensions', () => {
    const PlainItem: BaseStructureProps['Item'] = ({ x = 0, y = 0 }) => (
      <Rect data-quadrant-item="same" x={x} y={y} width={80} height={40} />
    );
    const data = { items: [{}, {}, {}, {}] } as ParsedData;
    const doc = new DOMParser().parseFromString(
      renderSVG(
        <Quadrant
          Item={PlainItem}
          Items={[]}
          data={data}
          options={{ data } as ParsedInfographicOptions}
        />,
      ),
      'image/svg+xml',
    );
    expect(itemBounds(doc).map(({ x, y }) => [x, y])).toEqual([
      [10, 10],
      [110, 10],
      [10, 70],
      [110, 70],
    ]);
  });

  it('does not render placeholder items for empty data', () => {
    expect(itemBounds(render([]))).toEqual([]);
  });
});
