/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import type { ComponentType, ParsedInfographicOptions } from '../../../../src';
import { Rect, renderSVG } from '../../../../src';
import type { BaseItemProps } from '../../../../src/designs/items';
import { ChartLine } from '../../../../src/designs/structures/chart-line';
import type { ParsedData } from '../../../../src/types';
import { minifySvg } from '../../../utils';

const Item: ComponentType<
  Omit<BaseItemProps, 'themeColors'> &
    Partial<Pick<BaseItemProps, 'themeColors'>>
> = ({ x = 0, y = 0 }) => <Rect x={x} y={y} width={20} height={10} />;

describe('ChartLine', () => {
  it('renders a single terminal area stop for the fading gradient', () => {
    const data = {
      items: [{ value: 10 }, { value: 20 }, { value: 15 }],
      xTitle: 'Month',
      yTitle: 'Value',
    } as ParsedData;
    const options = {
      data,
      themeConfig: {
        colorBg: '#ffffff',
        colorPrimary: '#1677ff',
      },
    } as ParsedInfographicOptions;

    const svg = minifySvg(
      renderSVG(
        <ChartLine Item={Item} Items={[]} data={data} options={options} />,
      ),
    );

    expect(svg.match(/stop-opacity="0.04"/g) ?? []).toHaveLength(1);
  });
});
