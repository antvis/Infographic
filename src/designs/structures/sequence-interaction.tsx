import type { ComponentType, JSXElement } from '../../jsx';
import {
  Defs,
  getElementBounds,
  Group,
  Path,
  Polygon,
  Rect,
  Text,
} from '../../jsx';
import type { RelationEdgeDatum } from '../../types';
import { BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

/**
 * 泳道内的节点数据
 */
export interface InteractionChildDatum {
  id: string;
  label?: string;
  desc?: string;
  icon?: string;
}

/**
 * 泳道数据（顶层item）
 * label 作为泳道标题
 * children 作为泳道内的节点列表
 */
export interface InteractionLaneDatum {
  label: string;
  desc?: string;
  icon?: string;
  children?: InteractionChildDatum[];
}

/**
 * 交互流程的数据结构
 * items: 泳道列表，每个泳道有 label 和 children
 * relations: 节点间的关系
 */
export interface InteractionFlowData {
  title?: string;
  desc?: string;
  items?: InteractionLaneDatum[];
  relations?: RelationEdgeDatum[];
}

export interface SequenceInteractionProps extends BaseStructureProps {
  /** 泳道之间的水平间距 */
  laneGap?: number;
  /** 节点之间的垂直间距 */
  nodeGap?: number;
  /** 生命线宽度 */
  lifelineWidth?: number;
  /** 消息箭头的线宽 */
  arrowWidth?: number;
  /** 是否显示生命线 */
  showLifeline?: boolean;
  /** 内边距 */
  padding?: number;
  /** 箭头类型 */
  arrowType?: 'arrow' | 'triangle';
  /** 是否显示泳道标题 */
  showLaneHeader?: boolean;
  /** 泳道标题高度 */
  laneHeaderHeight?: number;
  /** 连线样式：实线或虚线 */
  edgeStyle?: 'solid' | 'dashed';
  /** 是否开启动画 */
  animated?: boolean;
  /** 连线颜色模式：纯色或渐变 */
  edgeColorMode?: 'solid' | 'gradient';
}

const DEFAULT_LANE_GAP = 350;
const DEFAULT_NODE_GAP = 80;
const DEFAULT_LIFELINE_WIDTH = 2;
const DEFAULT_ARROW_WIDTH = 2;
const DEFAULT_PADDING = 40;
const DEFAULT_LANE_HEADER_HEIGHT = 60;

export const SequenceInteractionFlow: ComponentType<
  SequenceInteractionProps
> = (props) => {
  const {
    Title,
    Item,
    data,
    laneGap = DEFAULT_LANE_GAP,
    nodeGap = DEFAULT_NODE_GAP,
    lifelineWidth = DEFAULT_LIFELINE_WIDTH,
    arrowWidth = DEFAULT_ARROW_WIDTH,
    showLifeline = true,
    padding = DEFAULT_PADDING,
    arrowType = 'triangle',
    showLaneHeader = true,
    laneHeaderHeight = DEFAULT_LANE_HEADER_HEIGHT,
    edgeStyle = 'solid',
    animated = false,
    edgeColorMode = 'gradient',
    options,
  } = props;

  const flowData = data as InteractionFlowData;
  const { title, desc, items = [], relations = [] } = flowData;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  // 空状态处理
  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <Text
            x={0}
            y={0}
            width={200}
            height={40}
            fontSize={14}
            alignHorizontal="center"
            alignVertical="middle"
          >
            暂无数据
          </Text>
        </Group>
      </FlexLayout>
    );
  }

  // 获取主题颜色
  const themeColors = getThemeColors(options.themeConfig, options);
  const colorText = themeColors?.colorText ?? '#333333';
  const colorBg = themeColors?.colorBg ?? '#ffffff';
  const colorBorder = themeColors?.colorTextSecondary ?? '#e0e0e0';

  // 泳道列表（每个顶层item是一个泳道）
  const lanes = items as InteractionLaneDatum[];

  // 计算最大行数（所有泳道中children最多的数量），至少为1
  const maxRows = Math.max(
    1,
    ...lanes.map((lane) => lane.children?.length ?? 0),
  );

  // 创建节点ID到位置的映射
  interface NodeLayout {
    x: number;
    y: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    laneIndex: number;
    rowIndex: number;
  }
  const nodeLayoutById = new Map<string, NodeLayout>();

  // 测量Item尺寸
  const itemConfig = Array.isArray(options.design?.item)
    ? options.design?.item[0]
    : options.design?.item;
  let itemWidth = (itemConfig as any)?.width ?? 120;
  let itemHeight = (itemConfig as any)?.height ?? 50;

  // 构建一个扁平化的节点列表用于Item渲染
  const flatNodes: {
    datum: InteractionChildDatum;
    laneIndex: number;
    rowIndex: number;
  }[] = [];
  lanes.forEach((lane, laneIndex) => {
    lane.children?.forEach((child, rowIndex) => {
      flatNodes.push({ datum: child, laneIndex, rowIndex });
    });
  });

  if (
    !((itemConfig as any)?.width && (itemConfig as any)?.height) &&
    Item &&
    flatNodes.length > 0
  ) {
    const sampleNode = flatNodes[0];
    const sampleBounds = getElementBounds(
      <Item
        indexes={[0]}
        datum={sampleNode.datum}
        positionH="center"
        positionV="middle"
      />,
    );
    // 确保尺寸有效
    if (sampleBounds.width > 0) itemWidth = sampleBounds.width;
    if (sampleBounds.height > 0) itemHeight = sampleBounds.height;
  }

  // 测量relations标签的最大宽度，自动调整泳道间距
  let maxLabelWidth = 0;
  relations.forEach((relation) => {
    if (relation.label) {
      const labelBounds = getElementBounds(
        <Text fontSize={12} fontWeight="normal">
          {relation.label}
        </Text>,
      );
      maxLabelWidth = Math.max(maxLabelWidth, labelBounds.width);
    }
  });

  // 动态计算泳道宽度：节点宽度 + 标签宽度 + 间距
  const minLaneWidth = itemWidth + 60;
  const labelBasedWidth = itemWidth + maxLabelWidth + 80; // 80 = 两边各40的间距
  const effectiveLaneGap = Math.max(laneGap, labelBasedWidth);
  const laneWidth = Math.max(minLaneWidth, effectiveLaneGap);

  // 计算行高度和总高度
  const headerOffset = showLaneHeader ? laneHeaderHeight : 0;
  const firstGap = 20; // 首个节点与标题的固定间距
  const contentHeight =
    firstGap + maxRows * itemHeight + Math.max(0, maxRows - 1) * nodeGap;
  const totalHeight = headerOffset + contentHeight + padding * 2 + 60;
  const totalWidth = laneWidth * lanes.length + padding * 2;

  // 计算每个泳道的中心X坐标
  const getLaneCenterX = (laneIndex: number) => {
    return padding + laneWidth / 2 + laneIndex * laneWidth;
  };

  // 计算每行的Y坐标
  const getRowY = (rowIndex: number) => {
    return (
      padding +
      headerOffset +
      firstGap +
      rowIndex * (itemHeight + nodeGap) +
      itemHeight / 2
    );
  };

  // 创建泳道ID到索引的映射
  const laneIdToIndex = new Map<string, number>();
  lanes.forEach((lane, index) => {
    laneIdToIndex.set(lane.label, index);
  });

  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];
  const defsElements: JSXElement[] = [];

  // 绘制生命线
  if (showLifeline) {
    lanes.forEach((_lane, laneIndex) => {
      const centerX = getLaneCenterX(laneIndex);
      const startY = padding + headerOffset;
      const endY = totalHeight - padding;

      decorElements.push(
        <Path
          d={`M ${centerX} ${startY} L ${centerX} ${endY}`}
          stroke={colorBorder}
          strokeWidth={lifelineWidth}
          strokeDasharray="5,5"
          fill="none"
          data-element-type="shape"
        />,
      );

      // 绘制生命线末端箭头（实心）
      decorElements.push(
        <Polygon
          points={[
            { x: centerX, y: endY },
            { x: centerX - 5, y: endY - 10 },
            { x: centerX + 5, y: endY - 10 },
          ]}
          fill={colorBorder}
          stroke={colorBorder}
          strokeWidth={1}
        />,
      );
    });
  }

  // 绘制泳道标题
  if (showLaneHeader) {
    lanes.forEach((lane, laneIndex) => {
      const centerX = getLaneCenterX(laneIndex);
      const laneColor = getPaletteColor(options, [laneIndex]);
      const laneThemeColors = getThemeColors(
        { colorPrimary: laneColor },
        options,
      );

      // 泳道标题背景
      if (Item) {
        decorElements.push(
          <Item
            indexes={[laneIndex]}
            datum={{
              label: lane.label,
              icon: lane.icon,
              desc: lane.desc,
            }}
            x={centerX - itemWidth / 2}
            y={padding}
            width={itemWidth}
            height={laneHeaderHeight - 10}
            themeColors={laneThemeColors}
            positionH="center"
          />,
        );
      }
    });
  }

  // 绘制节点（按行对齐）
  let flatIndex = 0;
  lanes.forEach((lane, laneIndex) => {
    lane.children?.forEach((child, rowIndex) => {
      const centerX = getLaneCenterX(laneIndex);
      const centerY = getRowY(rowIndex);

      const x = centerX - itemWidth / 2;
      const y = centerY - itemHeight / 2;

      // 保存节点布局信息
      nodeLayoutById.set(child.id, {
        x,
        y,
        width: itemWidth,
        height: itemHeight,
        centerX,
        centerY,
        laneIndex,
        rowIndex,
      });

      const nodeColor = getPaletteColor(options, [laneIndex]);
      const nodeThemeColors = getThemeColors(
        { colorPrimary: nodeColor },
        options,
      );

      // 添加节点背景遮挡层，防止生命线虚线透过半透明节点显示
      decorElements.push(
        <Rect
          x={x}
          y={y}
          width={itemWidth}
          height={itemHeight}
          fill={colorBg}
          rx={6}
        />,
      );

      // 构造类似 hierarchy-tree 的 _originalIndex
      const originalIndex = [laneIndex, rowIndex];
      // 附加到数据上，确保 Item 组件能正确识别
      const childWithIndex = {
        ...child,
        _originalIndex: originalIndex,
      };

      if (Item) {
        itemElements.push(
          <Item
            indexes={originalIndex}
            datum={childWithIndex}
            data={data}
            x={x}
            y={y}
            positionH="center"
            positionV="middle"
            themeColors={nodeThemeColors}
          />,
        );
      } else {
        // 默认节点渲染
        decorElements.push(
          <Rect
            x={x}
            y={y}
            width={itemWidth}
            height={itemHeight}
            fill={nodeThemeColors?.colorPrimaryBg ?? colorBg}
            stroke={nodeColor}
            strokeWidth={2}
            rx={6}
            data-element-type="shape"
          />,
        );

        if (child.label) {
          decorElements.push(
            <Text
              x={x}
              y={y}
              width={itemWidth}
              height={itemHeight}
              fontSize={14}
              fontWeight="bold"
              alignHorizontal="center"
              alignVertical="middle"
              fill={colorText}
            >
              {child.label}
            </Text>,
          );
        }
      }

      flatIndex++;
    });
  });

  // 绘制消息箭头
  relations.forEach((relation, relIndex) => {
    const fromId = String(relation.from);
    const toId = String(relation.to);

    // 使用精确的节点布局信息
    const fromLayout = nodeLayoutById.get(fromId);
    const toLayout = nodeLayoutById.get(toId);

    if (!fromLayout || !toLayout) return;

    // 边的起点Y = from节点的centerY，终点Y = to节点的centerY
    const startY = fromLayout.centerY;
    const endY = toLayout.centerY;

    // 计算起点和终点的X（从节点边界出发）
    const direction = relation.direction ?? 'forward';
    const isLeftToRight = fromLayout.centerX < toLayout.centerX;

    let startX: number;
    let endX: number;

    if (isLeftToRight) {
      // 从左边节点的右边界 到 右边节点的左边界
      startX = fromLayout.x + fromLayout.width;
      endX = toLayout.x;
    } else {
      // 从右边节点的左边界 到 左边节点的右边界
      startX = fromLayout.x;
      endX = toLayout.x + toLayout.width;
    }

    // 获取颜色
    const fromColor =
      getPaletteColor(options, [fromLayout.laneIndex]) || '#000000';
    const toColor = getPaletteColor(options, [toLayout.laneIndex]) || '#000000';
    const themePrimary = getColorPrimary(options);

    // 确定线条和箭头颜色
    let edgeStroke = themePrimary || '#999999';
    let targetArrowColor = themePrimary || '#999999';
    let sourceArrowColor = themePrimary || '#999999';

    // 如果是渐变模式，使用渐变色
    const gradientId = `arrow-gradient-${relIndex}`;
    if (edgeColorMode === 'gradient') {
      edgeStroke = `url(#${gradientId})`;
      targetArrowColor = toColor;
      sourceArrowColor = fromColor;

      defsElements.push(
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
        >
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>,
      );
    }

    // 绘制箭头线（斜线从from节点到to节点）
    decorElements.push(
      <Path
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke={edgeStroke}
        strokeWidth={arrowWidth}
        fill="none"
        data-element-type="shape"
        strokeDasharray={edgeStyle === 'dashed' || animated ? '5,5' : undefined}
      >
        {animated && (
          <animate
            attributeName="stroke-dashoffset"
            from="10"
            to="0"
            dur="1s"
            repeatCount="indefinite"
          />
        )}
      </Path>,
    );

    // 绘制箭头头部
    const arrowSize = 14;

    if (direction === 'forward' || direction === 'both') {
      const tipX = endX;
      const tipY = endY;

      // 计算边的实际角度
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx);
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const px = -uy;
      const py = ux;

      if (arrowType === 'triangle') {
        const points = [
          { x: tipX, y: tipY },
          {
            x: tipX - ux * arrowSize + px * arrowSize * 0.5,
            y: tipY - uy * arrowSize + py * arrowSize * 0.5,
          },
          {
            x: tipX - ux * arrowSize - px * arrowSize * 0.5,
            y: tipY - uy * arrowSize - py * arrowSize * 0.5,
          },
        ];

        decorElements.push(
          <Polygon
            points={points}
            fill={targetArrowColor}
            stroke={targetArrowColor}
            strokeWidth={1}
          />,
        );
      } else {
        // arrow type
        const leftX = tipX - ux * arrowSize + px * arrowSize * 0.5;
        const leftY = tipY - uy * arrowSize + py * arrowSize * 0.5;
        const rightX = tipX - ux * arrowSize - px * arrowSize * 0.5;
        const rightY = tipY - uy * arrowSize - py * arrowSize * 0.5;

        decorElements.push(
          <Path
            d={`M ${leftX} ${leftY} L ${tipX} ${tipY} L ${rightX} ${rightY}`}
            stroke={targetArrowColor}
            strokeWidth={arrowWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />,
        );
      }
    }

    if (direction === 'both') {
      const tipX = startX;
      const tipY = startY;

      // 计算边的反向角度
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx) + Math.PI; // 反向
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const px = -uy;
      const py = ux;

      if (arrowType === 'triangle') {
        const points = [
          { x: tipX, y: tipY },
          {
            x: tipX - ux * arrowSize + px * arrowSize * 0.5,
            y: tipY - uy * arrowSize + py * arrowSize * 0.5,
          },
          {
            x: tipX - ux * arrowSize - px * arrowSize * 0.5,
            y: tipY - uy * arrowSize - py * arrowSize * 0.5,
          },
        ];

        decorElements.push(
          <Polygon
            points={points}
            fill={sourceArrowColor}
            stroke={sourceArrowColor}
            strokeWidth={1}
          />,
        );
      } else {
        const leftX = tipX - ux * arrowSize + px * arrowSize * 0.5;
        const leftY = tipY - uy * arrowSize + py * arrowSize * 0.5;
        const rightX = tipX - ux * arrowSize - px * arrowSize * 0.5;
        const rightY = tipY - uy * arrowSize - py * arrowSize * 0.5;

        decorElements.push(
          <Path
            d={`M ${leftX} ${leftY} L ${tipX} ${tipY} L ${rightX} ${rightY}`}
            stroke={sourceArrowColor}
            strokeWidth={arrowWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />,
        );
      }
    }

    // 绘制消息标签
    if (relation.label) {
      const labelX = (startX + endX) / 2;
      const labelY = (startY + endY) / 2 - 15;

      const labelBounds = getElementBounds(
        <Text fontSize={12} fontWeight="normal">
          {relation.label}
        </Text>,
      );

      // 标签背景
      decorElements.push(
        <Rect
          x={labelX - labelBounds.width / 2 - 6}
          y={labelY - labelBounds.height / 2 - 2}
          width={labelBounds.width + 12}
          height={labelBounds.height + 4}
          fill={colorBg}
          rx={4}
        />,
      );

      decorElements.push(
        <Text
          x={labelX - labelBounds.width / 2}
          y={labelY - labelBounds.height / 2}
          width={labelBounds.width}
          height={labelBounds.height}
          fontSize={12}
          fontWeight="normal"
          alignHorizontal="center"
          alignVertical="middle"
          fill={colorText}
        >
          {relation.label}
        </Text>,
      );
    }
  });

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {Title ? <Title title={title} desc={desc} /> : null}
      <Group>
        <Rect x={0} y={0} width={totalWidth} height={totalHeight} fill="none" />
        <Defs>{defsElements}</Defs>
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup />
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-interaction', {
  component: SequenceInteractionFlow,
  composites: ['title', 'item'],
});
