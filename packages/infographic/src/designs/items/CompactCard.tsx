/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Defs, Group, Rect } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
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
  const hasValue = value !== undefined && value !== null;
  const shadowId = 'compact-shadow';

  const iconX = positionH === 'flipped' ? width - gap - iconSize : gap;
  const textStartX = positionH === 'flipped' ? gap : iconSize + 2 * gap;
  const textWidth = width - iconSize - 3 * gap;

  // 为 Label 和 Value 分配空间
  const labelWidth = hasValue ? textWidth * 0.8 : textWidth;
  const valueWidth = hasValue ? textWidth * 0.2 : 0;

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
        data-element-type="shape"
      />

      {/* 侧边色条 */}
      <Rect
        x={positionH === 'flipped' ? width - 3 : 0}
        y={0}
        width={3}
        height={height}
        fill={themeColors.colorPrimary}
        rx={1.5}
        ry={1.5}
        data-element-type="shape"
      />

      {/* 图标 */}
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={(height - iconSize) / 2}
        size={iconSize}
        fill={themeColors.colorPrimary}
      />

      <FlexLayout
        x={textStartX}
        y={gap}
        width={textWidth}
        height={height - gap * 2}
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* 标签和数值所在行 */}
        <FlexLayout
          width={textWidth}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* 标签 - 始终左对齐 */}
          <ItemLabel
            indexes={indexes}
            width={labelWidth}
            alignHorizontal="left"
            fontSize={12}
            fill={themeColors.colorText}
          >
            {datum.label}
          </ItemLabel>
          {/* 数值 - 始终右对齐 */}
          {hasValue && (
            <ItemValue
              indexes={indexes}
              width={valueWidth}
              alignHorizontal="right"
              fontSize={12}
              fontWeight="bold"
              fill={themeColors.colorPrimary}
              value={value}
              formatter={valueFormatter}
            />
          )}
        </FlexLayout>
        {/* 描述 - 第二行 */}
        <ItemDesc
          indexes={indexes}
          width={textWidth}
          alignHorizontal="left"
          alignVertical="middle"
          fontSize={10}
          fill={themeColors.colorTextSecondary}
          lineNumber={2}
          wordWrap={true}
        >
          {datum.desc}
        </ItemDesc>
      </FlexLayout>
    </Group>
  );
};

registerItem('compact-card', {
  component: CompactCard,
  composites: ['icon', 'label', 'value', 'desc'],
});
