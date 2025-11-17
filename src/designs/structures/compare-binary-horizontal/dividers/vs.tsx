import tinycolor from 'tinycolor2';
import type { ComponentType } from '../../../../jsx';
import { Defs, Ellipse, Group } from '../../../../jsx';
import { DropShadow } from '../../../defs';
import { registerDivider, type DividerProps } from './types';

export const VSDivider: ComponentType<DividerProps> = (props) => {
  const { x, y, colorPrimary, colorBg } = props;

  // 设计时确定的固有尺寸
  const width = 100;
  const height = 100;

  const lightColor = tinycolor(colorPrimary).lighten(20).toString();

  return (
    <Group x={x} y={y} width={width} height={height}>
      <Defs>
        <filter
          id="vs-divider-glow-filter"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
        </filter>
        <DropShadow />
      </Defs>
      <Ellipse
        x={0}
        y={0}
        width={width}
        height={height}
        fill={lightColor}
        filter="url(#vs-divider-glow-filter)"
        opacity={0.6}
      />
      <Ellipse
        x={0}
        y={0}
        width={width}
        height={height}
        fill={colorPrimary}
        data-element-type="shape"
      />
      <text
        x={width / 2}
        y={height / 2}
        fontSize={Math.min(width, height) / 1.5}
        fontWeight="bold"
        fill={colorBg}
        textAnchor="middle"
        dominantBaseline="central"
        filter="url(#drop-shadow)"
      >
        VS
      </text>
    </Group>
  );
};

registerDivider('vs', VSDivider);
