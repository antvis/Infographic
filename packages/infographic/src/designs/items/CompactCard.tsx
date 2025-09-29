/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Defs, Group, Rect } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { getItemId, getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CompactCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  gap?: number;
}

export const CompactCard: ComponentType<CompactCardProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 200,
      height = 60,
      iconSize = 20,
      gap = 8,
      positionH = 'normal',
      themeColors,
      valueFormatter,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize', 'gap']);

  const value = datum.value;
  const shadowId = getItemId(indexes, 'def', 'compact-shadow');

  const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
  const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
  const textWidth = width - iconSize - 3 * gap;

  return (
    <Group {...restProps}>
      <Defs>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </Defs>

      {/* 背景 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorBgElevated}
        stroke={themeColors.colorBgElevated}
        strokeWidth={1}
        rx={6}
        ry={6}
        filter={`url(#${shadowId})`}
      />

      {/* 左侧色条 */}
      <Rect
        x={0}
        y={0}
        width={3}
        height={height}
        fill={themeColors.colorPrimary}
        rx={1.5}
        ry={1.5}
      />

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={(height - iconSize) / 2}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      {/* 标签 */}
      <ItemLabel
        indexes={indexes}
        x={textStartX}
        y={gap + 2}
        width={textWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        fontSize={12}
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* 数值 */}
      {value !== undefined && (
        <ItemValue
          indexes={indexes}
          x={textStartX}
          y={gap + 18}
          width={textWidth}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
          fontSize={16}
          fontWeight="bold"
          fill={themeColors.colorPrimary}
          value={value}
          formatter={valueFormatter}
        />
      )}

      {/* 描述 */}
      <ItemDesc
        indexes={indexes}
        x={textStartX}
        y={value !== undefined ? gap + 38 : gap + 16}
        width={textWidth}
        alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
        fontSize={10}
        fill={themeColors.colorTextSecondary}
        lineNumber={1}
        wordWrap={true}
      >
        {datum.desc}
      </ItemDesc>
    </Group>
  );
};

registerItem('compact-card', { component: CompactCard });
