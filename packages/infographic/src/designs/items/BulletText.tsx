/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Ellipse, Group } from '@antv/infographic-jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface BulletTextProps extends BaseItemProps {
  width?: number;
  bulletSize?: number;
  bulletType?: 'circle' | 'none';
  fontSize?: number;
}

/**
 * 圆点+文字列表项组件
 */
export const BulletText: ComponentType<BulletTextProps> = (props) => {
  const [
    {
      indexes,
      datum,
      width = 300,
      height = 30,
      bulletSize = 5,
      bulletType = 'circle',
      fontSize = 14,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'bulletSize',
    'bulletType',
    'fontSize',
    'itemBackgroundAlpha',
  ]);

  const textColor = themeColors.colorPrimary;

  const bulletX = 40;
  const bulletGap = bulletType !== 'none' ? bulletSize + 12 : 0;
  const textX = bulletX + bulletGap;
  const contentY = fontSize / 2;
  const textWidth = width - 2 * bulletX - bulletGap;

  return (
    <Group {...restProps}>
      {bulletType === 'circle' && (
        <Ellipse
          x={bulletX}
          y={contentY}
          width={bulletSize}
          height={bulletSize}
          fill={textColor}
        />
      )}

      <ItemLabel
        {...restProps}
        x={textX}
        y={contentY - fontSize / 2}
        indexes={indexes}
        width={textWidth}
        height={height}
        fill={textColor}
        fontSize={14}
        fontWeight="regular"
        alignHorizontal="left"
        alignVertical="top"
      >
        {datum.label || datum.desc}
      </ItemLabel>
    </Group>
  );
};

registerItem('bullet-text', {
  component: BulletText,
  values: ['label'],
});
