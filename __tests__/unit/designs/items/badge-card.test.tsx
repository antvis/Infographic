/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import { getElementBounds } from '../../../../src';
import { BadgeCard } from '../../../../src/designs/items/BadgeCard';
import type { ThemeColors } from '../../../../src/themes';
import type { ItemDatum, ParsedData } from '../../../../src/types';

const themeColors: ThemeColors = {
  colorPrimary: '#ce422b',
  colorBg: '#ffffff',
  colorWhite: '#ffffff',
  isDarkMode: false,
  colorPrimaryBg: '#ce422b1a',
  colorText: '#262626',
  colorTextSecondary: '#5a5a5a',
  colorPrimaryText: '#ffffff',
  colorBgElevated: '#ffffff',
};

const LONG_DESC =
  'Collections implement IntoIterator to produce iterators via into_iter, iter, or iter_mut.';
const SHORT_DESC = 'Store closures as struct fields.';

const makeData = (items: ItemDatum[]): ParsedData => ({ items });

// 卡片背景 Rect 是 Group 的第一个 shape，覆盖范围即卡片高度
const getCardHeight = (data: ParsedData, index = 0) =>
  getElementBounds(
    <BadgeCard
      indexes={[index]}
      datum={data.items[index]}
      data={data}
      themeColors={themeColors}
    />,
  ).height;

describe('BadgeCard', () => {
  it('grows tall enough to contain a description that wraps past two lines', () => {
    const data = makeData([{ label: 'Iterator Basics', desc: LONG_DESC }]);

    // descY(48) + 3 行 × 1.2 × 12 = 48 + 44 + gap(8) = 100
    expect(getCardHeight(data)).toBe(100);
  });

  it('keeps the compact height for descriptions that fit in two lines', () => {
    const data = makeData([{ label: 'Closure in Struct', desc: SHORT_DESC }]);

    // descY(48) + 2 行 × 1.2 × 12 = 48 + 29 + gap(8) = 85
    expect(getCardHeight(data)).toBe(85);
  });

  it('gives every item the same height so grid cells stay aligned', () => {
    const data = makeData([
      { label: 'Closure in Struct', desc: SHORT_DESC },
      { label: 'Iterator Basics', desc: LONG_DESC },
    ]);

    // 首项 desc 较短，但高度必须按整批最长的 desc 统一
    expect(getCardHeight(data, 0)).toBe(getCardHeight(data, 1));
    expect(getCardHeight(data, 0)).toBe(100);
  });

  it('falls back to the compact height when no item has a description', () => {
    const data = makeData([{ label: 'Closure Basics' }]);

    expect(getCardHeight(data)).toBe(80);
  });

  it('respects an explicitly provided height', () => {
    const data = makeData([{ label: 'Iterator Basics', desc: LONG_DESC }]);

    expect(
      getElementBounds(
        <BadgeCard
          indexes={[0]}
          datum={data.items[0]}
          data={data}
          themeColors={themeColors}
          height={120}
        />,
      ).height,
    ).toBe(120);
  });

  it('reserves two lines when the datum is not one of data.items', () => {
    // sequence-interaction 的泳道标题即如此：datum 由结构临时拼装，不在 data.items 中
    const data = makeData([{ label: 'Node' }]);

    expect(
      getElementBounds(
        <BadgeCard
          indexes={[0]}
          datum={{ label: 'Lane', desc: LONG_DESC }}
          data={data}
          themeColors={themeColors}
        />,
      ).height,
    ).toBe(85);
  });
});
