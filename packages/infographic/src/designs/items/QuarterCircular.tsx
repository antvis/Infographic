/** @jsxImportSource @antv/infographic-jsx */
import {
  ComponentType,
  Ellipse,
  getElementBounds,
  Group,
  Path,
  Text,
} from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel, ShapesGroup } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface QuarterCircularProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  circleRadius?: number;
}

export const QuarterCircular: ComponentType<QuarterCircularProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 280,
      height = 120,
      iconSize = 30,
      circleRadius = 80,
      positionH = 'normal',
      positionV = 'normal',
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize', 'circleRadius']);

  // 圆的质心
  const CIRCLE_MASS = (4 * circleRadius) / (3 * Math.PI);

  // 配置参数
  const LINE_WIDTH = 2;
  const DOT_RADIUS = 4;
  const VALUE_SIZE = 28;
  const CARD_Y = 20;
  const CARD_CONTENT_Y = CARD_Y + 20;
  const LABEL_Y = CARD_Y;
  const DESC_Y_OFFSET = 8;
  const DECORATION_VERTICAL_SPACING = 35;
  const DECORATION_HORIZONTAL_SPACING = 40;
  const DECORATION_END_SPACING = 30;

  // 序号（使用 indexes 的第一个值 + 1）
  const indexStr = String(indexes[0] + 1).padStart(2, '0');

  // 根据 positionH 调整布局
  const isFlipped = positionH === 'flipped';
  const isCentered = positionH === 'center';

  // 根据 positionV 调整布局
  const isVFlipped = positionV === 'flipped';

  // 计算装饰线的坐标
  const getDecorationCoords = () => {
    if (isFlipped) {
      // 右对齐（镜像布局）
      return {
        diagonalStartX: width - DOT_RADIUS,
        diagonalStartY: isVFlipped
          ? height - DECORATION_VERTICAL_SPACING
          : DECORATION_VERTICAL_SPACING,
        diagonalEndX: width - DECORATION_HORIZONTAL_SPACING,
        diagonalEndY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
        topLineStartX: width - DECORATION_HORIZONTAL_SPACING,
        topLineEndX: CIRCLE_MASS,
        topLineY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
      };
    } else if (isCentered) {
      // 居中对齐
      const totalContentWidth =
        width - circleRadius - DECORATION_HORIZONTAL_SPACING;
      const centerOffset = (width - totalContentWidth) / 2;
      return {
        diagonalStartX: centerOffset + DOT_RADIUS,
        diagonalStartY: isVFlipped
          ? height - DECORATION_VERTICAL_SPACING
          : DECORATION_VERTICAL_SPACING,
        diagonalEndX: centerOffset + DECORATION_HORIZONTAL_SPACING,
        diagonalEndY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
        topLineStartX: centerOffset + DECORATION_HORIZONTAL_SPACING,
        topLineEndX: centerOffset + totalContentWidth - CIRCLE_MASS,
        topLineY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
      };
    } else {
      // 默认左对齐
      return {
        diagonalStartX: DOT_RADIUS,
        diagonalStartY: isVFlipped
          ? height - DECORATION_VERTICAL_SPACING
          : DECORATION_VERTICAL_SPACING,
        diagonalEndX: DECORATION_HORIZONTAL_SPACING,
        diagonalEndY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
        topLineStartX: DECORATION_HORIZONTAL_SPACING,
        topLineEndX: width - CIRCLE_MASS,
        topLineY: isVFlipped ? height - DOT_RADIUS : DOT_RADIUS,
      };
    }
  };

  // 计算内容区域的坐标
  const getContentCoords = () => {
    if (isFlipped) {
      // 右对齐（镜像布局）
      const contentX = circleRadius + 10;
      const contentWidth = width - contentX - DECORATION_HORIZONTAL_SPACING;
      return {
        valueX: width - DECORATION_END_SPACING,
        contentX,
        contentWidth,
        circleX: 0,
        circleY: isVFlipped ? 0 : height,
        iconX: CIRCLE_MASS - iconSize / 2,
      };
    } else if (isCentered) {
      // 居中对齐
      const totalContentWidth =
        width - circleRadius - DECORATION_HORIZONTAL_SPACING;
      const centerOffset = (width - totalContentWidth) / 2;
      return {
        valueX: centerOffset,
        contentX: centerOffset + DECORATION_HORIZONTAL_SPACING,
        contentWidth: totalContentWidth - circleRadius - 10,
        circleX: centerOffset + totalContentWidth,
        circleY: isVFlipped ? 0 : height,
        iconX: centerOffset + totalContentWidth - CIRCLE_MASS - iconSize / 2,
      };
    } else {
      // 默认左对齐
      return {
        valueX: 0,
        contentX: DECORATION_HORIZONTAL_SPACING,
        contentWidth: width - DECORATION_HORIZONTAL_SPACING - circleRadius - 10,
        circleX: width,
        circleY: isVFlipped ? 0 : height,
        iconX: width - CIRCLE_MASS - iconSize / 2,
      };
    }
  };

  // 获取坐标值
  const decorationCoords = getDecorationCoords();
  const contentCoords = getContentCoords();

  // 计算图标Y坐标
  const iconY = isVFlipped
    ? CIRCLE_MASS - iconSize / 2
    : height - CIRCLE_MASS - iconSize / 2;

  // 获取文本尺寸
  const labelBounds = getElementBounds(
    <ItemLabel indexes={indexes} width={contentCoords.contentWidth}>
      {datum.label}
    </ItemLabel>,
  );

  const descY = LABEL_Y + labelBounds.height + DESC_Y_OFFSET;

  // 生成1/4圆路径
  const getQuarterCirclePath = () => {
    const { circleX, circleY } = contentCoords;

    if (isFlipped) {
      return isVFlipped
        ? `M ${circleX} ${circleY} L ${circleX} ${circleY + circleRadius} A ${circleRadius} ${circleRadius} 0 0 0 ${circleX + circleRadius} ${circleY} Z`
        : `M ${circleX} ${circleY} L ${circleX} ${circleY - circleRadius} A ${circleRadius} ${circleRadius} 0 0 1 ${circleX + circleRadius} ${circleY} Z`;
    } else {
      return isVFlipped
        ? `M ${circleX} ${circleY} L ${circleX} ${circleY + circleRadius} A ${circleRadius} ${circleRadius} 0 0 1 ${circleX - circleRadius} ${circleY} Z`
        : `M ${circleX} ${circleY} L ${circleX} ${circleY - circleRadius} A ${circleRadius} ${circleRadius} 0 0 0 ${circleX - circleRadius} ${circleY} Z`;
    }
  };

  return (
    <Group {...restProps} width={width} height={height}>
      {/* 装饰线条组 */}
      <ShapesGroup>
        {/* 左侧对角线 */}
        <Path
          d={`M ${decorationCoords.diagonalStartX} ${decorationCoords.diagonalStartY} L ${decorationCoords.diagonalEndX} ${decorationCoords.diagonalEndY}`}
          stroke={themeColors.colorPrimary}
          strokeWidth={LINE_WIDTH}
          fill="none"
        />

        {/* 顶部横线 */}
        <Path
          d={`M ${decorationCoords.topLineStartX} ${decorationCoords.topLineY} L ${decorationCoords.topLineEndX} ${decorationCoords.topLineY}`}
          stroke={themeColors.colorPrimary}
          strokeWidth={LINE_WIDTH}
          fill="none"
        />

        {/* 左侧圆点 */}
        <Ellipse
          x={decorationCoords.diagonalStartX - DOT_RADIUS}
          y={decorationCoords.diagonalStartY - DOT_RADIUS}
          width={DOT_RADIUS * 2}
          height={DOT_RADIUS * 2}
          fill={themeColors.colorPrimary}
        />

        {/* 顶部终点圆点 */}
        <Ellipse
          x={decorationCoords.topLineEndX - DOT_RADIUS}
          y={decorationCoords.topLineY - DOT_RADIUS}
          width={DOT_RADIUS * 2}
          height={DOT_RADIUS * 2}
          fill={themeColors.colorPrimary}
        />
      </ShapesGroup>

      {/* 内容组 */}
      <Group>
        {/* 序号 */}
        <Text
          x={contentCoords.valueX}
          y={CARD_CONTENT_Y}
          fontSize={VALUE_SIZE}
          fontWeight="bold"
          fill={themeColors.colorPrimary}
          width={40}
        >
          {indexStr}
        </Text>

        {/* 1/4 圆背景 */}
        <Path
          d={getQuarterCirclePath()}
          fill={themeColors.colorPrimary}
          data-element-type="shape"
        />

        {/* 图标 */}
        {datum.icon && (
          <ItemIcon
            indexes={indexes}
            x={contentCoords.iconX}
            y={iconY}
            size={iconSize}
            fill={themeColors.colorWhite}
          />
        )}

        {/* 标题 */}
        {datum.label && (
          <ItemLabel
            indexes={indexes}
            x={contentCoords.contentX}
            y={LABEL_Y}
            width={contentCoords.contentWidth}
            fontWeight="bold"
            fill={themeColors.colorText}
          >
            {datum.label}
          </ItemLabel>
        )}

        {/* 描述 */}
        {datum.desc && (
          <ItemDesc
            indexes={indexes}
            x={contentCoords.contentX}
            y={descY}
            width={contentCoords.contentWidth}
            fill={themeColors.colorTextSecondary}
          >
            {datum.desc}
          </ItemDesc>
        )}
      </Group>
    </Group>
  );
};

registerItem('quarter-circular', {
  component: QuarterCircular,
  composites: ['icon', 'label', 'desc'],
});
