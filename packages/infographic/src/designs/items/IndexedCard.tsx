import { ComponentType, getElementBounds, Group } from '../../jsx';

// 根据需要选择性导入原子组件和类型
import { Rect, Text } from '../../jsx';

// 根据需要选择性导入封装组件
import { ItemDesc, ItemLabel } from '../components';

import tinycolor from 'tinycolor2';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

// -----------------------------------------------------------------------------------
// 1. Props 接口定义
// -----------------------------------------------------------------------------------

export interface IndexedCardProps extends BaseItemProps {
  /** 卡片宽度 */
  width?: number;
  /** 卡片圆角半径 */
  borderRadius?: number;
  /** 内部边距 */
  padding?: number;
  /** 标题分隔线高度 */
  separatorHeight?: number;
  /** 序号字体大小 */
  indexFontSize?: number;
  /** 标签字体大小 */
  labelFontSize?: number;
  /** 元素间距 */
  gap?: number;
}

// -----------------------------------------------------------------------------------
// 2. 组件实现
// -----------------------------------------------------------------------------------

export const IndexedCard: ComponentType<IndexedCardProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 200,
      borderRadius = 12,
      padding = 16,
      separatorHeight = 2,
      indexFontSize = 20,
      labelFontSize = 16,
      gap = 8,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, [
    'width',
    'height',
    'borderRadius',
    'padding',
    'separatorHeight',
    'indexFontSize',
    'labelFontSize',
    'gap',
  ]);

  // 1. 数据处理
  const indexNumber = indexes[0] + 1;
  const indexStr = String(indexNumber).padStart(2, '0');
  const showLabel = datum.label !== undefined;
  const showDesc = datum.desc !== undefined;

  // 2. 颜色计算
  const separatorColor = tinycolor
    .mix(themeColors.colorPrimary, themeColors.colorWhite, 40)
    .toHexString();
  const cardBgColor = themeColors.colorBgElevated || themeColors.colorWhite;

  // 3. 布局计算优化
  const contentWidth = width - 2 * padding;

  // 3.1 序号元素尺寸计算
  const indexBounds = getElementBounds(
    <Text fontSize={indexFontSize} fontWeight="bold">
      {indexStr}
    </Text>,
  );

  // 3.2 标签元素尺寸计算（考虑可用宽度）
  const labelAvailableWidth = contentWidth - indexBounds.width - gap;
  const labelBounds = showLabel
    ? getElementBounds(
        <ItemLabel
          indexes={indexes}
          width={labelAvailableWidth}
          fontSize={labelFontSize}
          fontWeight="bold"
          x={indexFontSize}
        >
          {datum.label}
        </ItemLabel>,
      )
    : { width: 0, height: 0 };

  // 3.3 描述元素尺寸计算
  const descBounds = showDesc
    ? getElementBounds(
        <ItemDesc
          indexes={indexes}
          width={contentWidth}
          fontSize={14}
          lineHeight={1.5}
          wordWrap={true}
        >
          {datum.desc}
        </ItemDesc>,
      )
    : { width: 0, height: 0 };

  // 3.4 动态内容高度计算
  const titleRowHeight = Math.max(indexBounds.height, labelBounds.height);
  const contentHeight =
    padding * 2 + // 上下内边距
    titleRowHeight + // 标题行高度
    (showLabel || showDesc ? gap : 0) + // 标题后间距
    separatorHeight + // 分隔线高度
    (showDesc ? gap : 0) + // 分隔线后间距
    descBounds.height; // 描述高度

  // 4. 组件结构
  return (
    <Group {...restProps} width={width} height={contentHeight}>
      {/* 4.1 背景圆角卡片 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={contentHeight}
        rx={borderRadius}
        ry={borderRadius}
        fill={cardBgColor}
        stroke={tinycolor(cardBgColor).darken(5).toHexString()}
        strokeWidth={0.5}
        data-element-type="shape"
      />

      {/* 4.2 内容区域 */}
      <Group x={padding} y={padding}>
        {/* 标题行 */}
        <Group x={0} y={0}>
          {/* 序号 */}
          <Text
            x={0}
            y={0}
            fontSize={indexFontSize}
            fontWeight="bold"
            fill={themeColors.colorPrimary}
            alignVertical="top"
          >
            {indexStr}
          </Text>

          {/* 标签 */}
          {showLabel && (
            <ItemLabel
              indexes={indexes}
              x={indexFontSize + gap}
              y={0}
              width={labelAvailableWidth}
              fontSize={labelFontSize}
              fontWeight="bold"
              fill={themeColors.colorTextSecondary}
              alignVertical="top"
            >
              {datum.label}
            </ItemLabel>
          )}
        </Group>

        {/* 分隔线 */}
        <Rect
          x={0}
          y={titleRowHeight + gap}
          width={contentWidth}
          height={separatorHeight}
          fill={separatorColor}
          data-element-type="shape"
        />

        {/* 描述文本 */}
        {showDesc && (
          <ItemDesc
            indexes={indexes}
            x={0}
            y={titleRowHeight + gap + separatorHeight + gap}
            width={contentWidth}
            fontSize={14}
            lineHeight={1.5}
            wordWrap={true}
            fill={themeColors.colorTextSecondary}
          >
            {datum.desc}
          </ItemDesc>
        )}
      </Group>
    </Group>
  );
};

registerItem('indexed-card', {
  component: IndexedCard,
  composites: ['label', 'desc'],
});
