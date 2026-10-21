/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import type { ComponentType, ParsedInfographicOptions } from '../../../../src';
import { Rect, renderSVG } from '../../../../src';
import type { BaseItemProps } from '../../../../src/designs/items';
import { SimpleItem } from '../../../../src/designs/items/SimpleItem';
import type { ListGridProps } from '../../../../src/designs/structures/list-grid';
import { ListGrid } from '../../../../src/designs/structures/list-grid';
import { getThemeColors } from '../../../../src/designs/utils';
import type { ParsedData } from '../../../../src/types';

const Item: ComponentType<
  Omit<BaseItemProps, 'themeColors'> &
    Partial<Pick<BaseItemProps, 'themeColors'>>
> = ({ x = 0, y = 0, datum, indexes, positionV }) => (
  <Rect
    data-test-item={indexes[0]}
    x={x}
    y={y}
    width={datum.width ?? 100}
    height={
      positionV === 'flipped'
        ? (datum.flippedHeight ?? datum.height ?? 40)
        : (datum.height ?? 40)
    }
  />
);

function renderGrid(
  items: ParsedData['items'],
  props: Partial<ListGridProps> = {},
) {
  const data = { items } as ParsedData;
  return new DOMParser().parseFromString(
    renderSVG(
      <ListGrid
        Item={Item}
        Items={[]}
        data={data}
        options={{ data } as ParsedInfographicOptions}
        columns={2}
        {...props}
      />,
    ),
    'image/svg+xml',
  );
}

function numberAttr(element: Element, name: string) {
  return Number(element.getAttribute(name) ?? 0);
}

describe('ListGrid', () => {
  it('keeps optional descriptions clear of the following row', () => {
    const svg = renderGrid(
      [
        { label: 'First' },
        {
          label: 'Second',
          desc: 'Details wrap across two lines inside this item',
        },
        { label: 'Third item' },
        { label: 'Fourth item' },
      ],
      {
        Item: ({ indexes, data, datum, ...props }) => (
          <SimpleItem
            {...props}
            indexes={indexes}
            data={data}
            datum={datum}
            themeColors={getThemeColors({})}
          />
        ),
      },
    );
    const items = svg.querySelector(
      '[data-element-type="items-group"]',
    )!.children;
    const desc = svg.querySelector('[data-element-type="item-desc"]')!;
    const descBottom =
      numberAttr(items[1], 'y') +
      numberAttr(desc.parentElement!, 'y') +
      numberAttr(desc, 'height');

    expect(numberAttr(items[3], 'y') - descBottom).toBe(24);
    expect(svg.documentElement.getAttribute('viewBox')).toBe('0 0 424 124');
    expect(
      svg.querySelectorAll('[data-element-type="item-label"]'),
    ).toHaveLength(4);
  });

  it('uses the tallest item in each row, including later rows', () => {
    const svg = renderGrid([
      { height: 40 },
      { height: 100 },
      { height: 80 },
      { height: 30 },
      { height: 20 },
    ]);
    const items = svg.querySelectorAll('[data-test-item]');

    expect(Array.from(items, (item) => numberAttr(item, 'y'))).toEqual([
      0, 0, 124, 124, 228,
    ]);
  });

  it('keeps columns aligned using widths from every row', () => {
    const svg = renderGrid([
      { width: 40 },
      { width: 30 },
      { width: 100 },
      { width: 80 },
    ]);
    const items = svg.querySelectorAll('[data-test-item]');

    expect(Array.from(items, (item) => numberAttr(item, 'x'))).toEqual([
      0, 124, 0, 124,
    ]);
    const between = svg.querySelector(
      '[data-element-type="btn-add"][data-indexes="1"]',
    )!;
    expect(numberAttr(between, 'x')).toBeGreaterThan(
      numberAttr(items[0], 'x') + numberAttr(items[0], 'width'),
    );
    expect(
      numberAttr(between, 'x') + numberAttr(between, 'width'),
    ).toBeLessThan(numberAttr(items[1], 'x'));
  });

  it('positions action controls using the associated item size', () => {
    const svg = renderGrid([{ width: 40 }, { width: 100, height: 100 }]);
    const remove = svg.querySelector(
      '[data-element-type="btn-remove"][data-indexes="1"]',
    )!;
    const append = svg.querySelector(
      '[data-element-type="btn-add"][data-indexes="2"]',
    )!;

    expect(numberAttr(remove, 'x')).toBe(104);
    expect(numberAttr(remove, 'y')).toBe(100);
    expect(numberAttr(append, 'x')).toBe(166);
    expect(numberAttr(append, 'y')).toBe(40);
  });

  it('measures the same orientation that is rendered', () => {
    const svg = renderGrid(
      [
        { height: 40, flippedHeight: 140 },
        { height: 40, flippedHeight: 100 },
        { height: 40, flippedHeight: 140 },
      ],
      { zigzag: true },
    );
    const items = svg.querySelectorAll('[data-test-item]');

    expect(numberAttr(items[0], 'height')).toBe(40);
    expect(numberAttr(items[1], 'height')).toBe(100);
    expect(numberAttr(items[2], 'y')).toBe(124);
  });

  it('preserves uniform item spacing and partial final rows', () => {
    const svg = renderGrid([{}, {}, {}, {}, {}], { columns: 3 });
    const items = svg.querySelectorAll('[data-test-item]');

    expect(
      Array.from(items, (item) => [
        numberAttr(item, 'x'),
        numberAttr(item, 'y'),
      ]),
    ).toEqual([
      [0, 0],
      [124, 0],
      [248, 0],
      [0, 64],
      [124, 64],
    ]);
    expect(
      svg.querySelectorAll('[data-element-type="btn-remove"]'),
    ).toHaveLength(5);
  });

  it('renders a single item at the origin', () => {
    const svg = renderGrid([{ width: 80, height: 60 }]);
    const item = svg.querySelector('[data-test-item]')!;

    expect(numberAttr(item, 'x')).toBe(0);
    expect(numberAttr(item, 'y')).toBe(0);
    expect(svg.documentElement.getAttribute('viewBox')).toBe('0 0 80 60');
  });

  it('does not try to measure an item when the list is empty', () => {
    const svg = renderGrid([]);

    expect(svg.querySelectorAll('[data-test-item]')).toHaveLength(0);
    expect(
      svg.querySelectorAll('[data-element-type="btn-remove"]'),
    ).toHaveLength(0);
  });
});
