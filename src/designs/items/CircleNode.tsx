import tinycolor from 'tinycolor2';
import type { ComponentType } from '../../jsx';
import { Defs, Ellipse, Group } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CircleNodeProps extends BaseItemProps {
  width?: number;
  height?: number;
}

export const CircleNode: ComponentType<CircleNodeProps> = (props) => {
  const [
    {
      indexes,
      datum,
      themeColors,
      positionH = 'normal',
      width = 240,
      height = width,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height']);

  const size = Math.min(width, height);
  const innerCircleSize = size * 0.7;
  const innerCircleOffset = (size - innerCircleSize) / 2;
  const labelSize = (innerCircleSize * Math.sqrt(2)) / 2;
  const labelOffset = (size - labelSize) / 2;

  const base = tinycolor(themeColors.colorPrimary);

  const colorOuterStart = fadeWithWhite(base, 80, 0.2);
  const colorOuterEnd = fadeWithWhite(base, 20, 0.8);

  const colorInnerStart = fadeWithWhite(base, 75, 0.32);
  const colorInnerEnd = fadeWithWhite(base, 45, 0.4);

  const colorText = base.clone().darken(5).toRgbString();

  const outerGradientId = `${themeColors.colorPrimary}-${positionH}-outer`;
  const innerGradientId = `${themeColors.colorPrimary}-${positionH}-inner`;

  const gradientDirection =
    positionH === 'flipped'
      ? { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }
      : { x1: '100%', y1: '0%', x2: '0%', y2: '0%' };

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient id={outerGradientId} {...gradientDirection}>
          <stop offset="0%" stopColor={colorOuterStart} />
          <stop offset="100%" stopColor={colorOuterEnd} />
        </linearGradient>

        <linearGradient id={innerGradientId} {...gradientDirection}>
          <stop offset="0%" stopColor={colorInnerStart} />
          <stop offset="100%" stopColor={colorInnerEnd} />
        </linearGradient>
      </Defs>

      <Ellipse
        width={size}
        height={size}
        fill={`url(#${outerGradientId})`}
        data-element-type="shape"
      />

      <Ellipse
        x={innerCircleOffset}
        y={innerCircleOffset}
        width={innerCircleSize}
        height={innerCircleSize}
        fill={`url(#${innerGradientId})`}
        stroke="#FFFFFF"
        strokeWidth={1}
        data-element-type="shape"
      />

      <ItemLabel
        indexes={indexes}
        x={labelOffset}
        y={labelOffset}
        width={labelSize}
        height={labelSize}
        lineHeight={1.1}
        alignHorizontal="center"
        alignVertical="middle"
        fill={colorText}
        fontWeight="500"
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('circle-node', {
  component: CircleNode,
  composites: ['label'],
});

function fadeWithWhite(
  color: tinycolor.Instance,
  mixPct: number,
  alpha: number,
) {
  return tinycolor.mix(color, '#ffffff', mixPct).setAlpha(alpha).toRgbString();
}
