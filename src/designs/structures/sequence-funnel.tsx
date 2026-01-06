/**
 * 序列漏斗结构（SequenceFunnel）
 * 用途：
 * - 在左侧渲染分层漏斗形状（倒置梯形堆叠），右侧渲染对应的 item 卡片与图标
 * - 形状上宽下窄，底部平滑（梯形），卡片背景插入漏斗下方
 */
import roundPolygon, { getSegments } from 'round-polygon';
import tinycolor from 'tinycolor2';
import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Group, Point, Polygon, Rect } from '../../jsx';
import { BtnsGroup, ItemIcon, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

// SequenceFunnel 的可配置属性
export interface SequenceFunnelProps extends BaseStructureProps {
  gap?: number;
  width?: number;
  funnelWidth?: number;
  itemHeight?: number;
  // 新增：底部宽度比例（0~1），控制漏斗底部的收窄程度，避免变成尖角
  // 默认为 0.2 (即底部宽度是顶部的 20%)
  minBottomRatio?: number;
}

export const SequenceFunnel: ComponentType<SequenceFunnelProps> = (props) => {
  const {
    Title,
    Item,
    data,
    gap = 10,
    width = 700,
    funnelWidth,
    itemHeight = 60,
    minBottomRatio = 0.25, // 默认底部保留 25% 的宽度，形成梯形
    options,
  } = props;
  
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
      </FlexLayout>
    );
  }

  const radius = 6;
  const themeColors = getThemeColors(options.themeConfig);
  const iconSize = 32;

  const itemElements: JSXElement[] = [];
  const funnelElements: JSXElement[] = [];
  const backgroundElements: JSXElement[] = [];
  const iconElements: JSXElement[] = [];

  // 计算各区域尺寸
  const actualFunnelWidth = funnelWidth ?? width * 0.55; // 稍微调窄一点漏斗，给右侧留更多空间
  const itemAreaWidth = width - actualFunnelWidth;

  // 漏斗层高度
  const funnelLayerHeight = itemHeight * 1.25;
  const totalHeight =
    items.length * funnelLayerHeight + (items.length - 1) * gap;

  // 计算底部的最小像素宽度
  const minFunnelPixelWidth = actualFunnelWidth * minBottomRatio;

  items.forEach((item, index) => {
    const indexes = [index];
    
    // 获取颜色
    const color = getPaletteColor(options, [index]) || themeColors.colorPrimary;

    // 1. 计算当前层的梯形形状
    // 使用线性插值，从 actualFunnelWidth 收缩到 minFunnelPixelWidth
    const { points, topWidth, bottomWidth } = calculateTrapezoidSegment(
      actualFunnelWidth,
      minFunnelPixelWidth,
      funnelLayerHeight,
      gap,
      items.length,
      index,
    );

    // 圆角处理
    const rounded = roundPolygon(points, radius);
    const segments = getSegments(rounded, 'AMOUNT', 10);

    // 坐标计算
    const funnelCenterX = actualFunnelWidth / 2;
    const funnelY = index * (funnelLayerHeight + gap);

    // 2. 背景与 Item 的位置计算
    // 在漏斗（倒梯形）中，顶边（topWidth）总是比底边（bottomWidth）宽
    // 所以右侧边缘的最外点是 topWidth 的一半
    const rightTopX = funnelCenterX + topWidth / 2;
    
    // 定义重叠量：背景要插入漏斗下方多少像素
    const overlapDist = 25; 
    // 定义文字与漏斗边缘的间距
    const textGap = 15;

    // 背景卡片：
    // X 轴起点：从漏斗最宽处向左回缩 overlapDist，形成“插入”效果
    const backgroundX = rightTopX - overlapDist;
    // 宽度：填满剩余空间，但要补上左侧回缩的距离
    const backgroundWidth = itemAreaWidth + overlapDist - 10; // -10 用于右侧留白
    const backgroundYOffset = (funnelLayerHeight - itemHeight) / 2;
    const backgroundY = funnelY + backgroundYOffset;

    // 文本内容 (Item)：
    // X 轴起点：不应该跟着背景向左缩，而应该在漏斗边缘右侧，避免被漏斗遮挡
    const itemX = rightTopX + textGap;
    const itemWidth = backgroundWidth - overlapDist - textGap;
    const itemY = backgroundY;

    // 图标位置
    const iconX = funnelCenterX - iconSize / 2;
    const iconY = funnelY + funnelLayerHeight / 2 - iconSize / 2;

    // 渲染顺序 1: 背景 (最底层)
    backgroundElements.push(
      <Rect
        x={backgroundX}
        y={backgroundY}
        width={backgroundWidth}
        height={itemHeight}
        ry="8" // 背景圆角稍微大一点，显得柔和
        fill={tinycolor(color).setAlpha(0.1).toRgbString()} // 使用当前主题色的浅色背景
        data-element-type="shape"
      />,
    );

    // 渲染顺序 2: 漏斗形状 (中间层，覆盖在背景左侧之上)
    const funnelColorId = `${color}-funnel-${index}`;
    funnelElements.push(
      <Defs>
        <linearGradient id={funnelColorId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color={tinycolor(color).lighten(10).toString()} />
          <stop offset="100%" stop-color={color} />
        </linearGradient>
      </Defs>,
      <Polygon
        points={segments}
        fill={`url(#${funnelColorId})`}
        y={funnelY}
        data-element-type="shape"
        // 添加轻微阴影效果增加层次感（可选，依赖环境支持 filter）
        style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.15))' }}
      />,
    );

    // 渲染顺序 3: 图标 (顶层)
    iconElements.push(
      <ItemIcon
        indexes={indexes}
        x={iconX}
        y={iconY}
        size={iconSize}
        fill="#fff"
      />,
    );

    // 渲染顺序 4: 文本内容 (顶层)
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        width={itemWidth}
        height={itemHeight}
        positionV="middle"
      />,
    );
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={width} height={totalHeight}>
        {/* 背景最先渲染，位于底部 */}
        <Group>{backgroundElements}</Group>
        {/* 漏斗覆盖在背景之上 */}
        <Group>{funnelElements}</Group>
        {/* 图标和文字在最上层 */}
        <Group>{iconElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup />
      </Group>
    </FlexLayout>
  );
};

// 计算梯形分段逻辑
function calculateTrapezoidSegment(
  maxWidth: number,
  minWidth: number,
  layerHeight: number,
  gap: number,
  counts: number,
  index: number,
) {
  const centerX = maxWidth / 2;
  
  // 整个视觉组件的总高度
  const totalHeight = counts * layerHeight + (counts - 1) * gap;

  // 当前层顶部和底部的 Y 坐标（相对于总高度）
  const currentTopY = index * (layerHeight + gap);
  const currentBottomY = currentTopY + layerHeight;

  // 线性插值计算宽度
  // Width = MaxWidth - (MaxWidth - MinWidth) * (Y / TotalHeight)
  const widthDiff = maxWidth - minWidth;
  
  const topWidth = maxWidth - widthDiff * (currentTopY / totalHeight);
  const bottomWidth = maxWidth - widthDiff * (currentBottomY / totalHeight);

  // 生成四个顶点 (梯形)
  const p1: Point = { x: centerX - topWidth / 2, y: 0 };           // 左上
  const p2: Point = { x: centerX + topWidth / 2, y: 0 };           // 右上
  const p3: Point = { x: centerX + bottomWidth / 2, y: layerHeight }; // 右下
  const p4: Point = { x: centerX - bottomWidth / 2, y: layerHeight }; // 左下

  return { points: [p1, p2, p3, p4], topWidth, bottomWidth };
}

// 注册
registerStructure('sequence-funnel', {
  component: SequenceFunnel,
  composites: ['title', 'item'],
});