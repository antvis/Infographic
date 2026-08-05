/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import type { ComponentType, ParsedInfographicOptions } from '../../../../src';
import { Rect, renderSVG } from '../../../../src';
import type { BaseItemProps } from '../../../../src/designs/items';
import { ChartWordCloud } from '../../../../src/designs/structures/chart-wordcloud';
import type { ParsedData } from '../../../../src/types';

const Item: ComponentType<
  Omit<BaseItemProps, 'themeColors'> &
    Partial<Pick<BaseItemProps, 'themeColors'>>
> = ({ x = 0, y = 0 }) => <Rect x={x} y={y} width={20} height={10} />;

describe('ChartWordCloud', () => {
  it('tags each word with its datum index, not the font-size sort position', () => {
    // Values are intentionally out of order: the size-sort (desc) renders
    // Banana, Cherry, Apple, but data-indexes must stay 1, 2, 0 (the original
    // item indices) so the editor routes edits to the correct datum.
    const data = {
      items: [
        { label: 'Apple', value: 10 },
        { label: 'Banana', value: 50 },
        { label: 'Cherry', value: 30 },
      ],
    } as ParsedData;
    const options = {
      data,
      themeConfig: {
        colorBg: '#ffffff',
        colorPrimary: '#1677ff',
      },
    } as ParsedInfographicOptions;

    const svg = renderSVG(
      <ChartWordCloud
        Item={Item}
        Items={[]}
        data={data}
        options={options}
        enableRotate={false}
      />,
    );

    const dataIndexFor = (label: string): string | undefined => {
      const re = new RegExp(
        `data-indexes="([^"]*)"[^>]*>(?:<[^>]*>)*\\s*${label}\\s*<`,
      );
      return svg.match(re)?.[1];
    };

    expect(dataIndexFor('Banana')).toBe('1');
    expect(dataIndexFor('Cherry')).toBe('2');
    expect(dataIndexFor('Apple')).toBe('0');
  });
});
