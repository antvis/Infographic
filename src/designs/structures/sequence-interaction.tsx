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
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
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
const DEFAULT_ITEM_WIDTH = 120;
const DEFAULT_ITEM_HEIGHT = 50;
const ARROW_SIZE = 14;
const CORNER_RADIUS_NODE = 6;
const CORNER_RADIUS_LABEL = 4;

// 按钮布局常量
const BTN_SIZE = 24; // 按钮尺寸（通常为24）
const BTN_HALF_SIZE = BTN_SIZE / 2;
const BTN_MARGIN = 10; // 按钮与元素的通用间距
const BTN_LANE_ADD_Gap = 20; // 添加泳道按钮与最后一个泳道的间距
const BOTTOM_AREA_HEIGHT = 60; // 为底部按钮和边距预留空间

const getMidPoint = (points: [number, number][]) => {
  if (points.length === 0) return null;
  if (points.length === 1) return points[0];
  let total = 0;
  const segments: {
    length: number;
    start: [number, number];
    end: [number, number];
  }[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    segments.push({ length, start, end });
    total += length;
  }
  if (total === 0) return points[0];
  let target = total / 2;
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (target <= segment.length || i === segments.length - 1) {
      const ratio =
        segment.length === 0
          ? 0
          : Math.max(0, Math.min(1, target / segment.length));
      return [
        segment.start[0] + (segment.end[0] - segment.start[0]) * ratio,
        segment.start[1] + (segment.end[1] - segment.start[1]) * ratio,
      ] as [number, number];
    }
    target -= segment.length;
  }
  return points[Math.floor(points.length / 2)];
};

const createArrowElements = (
  x: number,
  y: number,
  angle: number,
  type: 'arrow' | 'triangle' | 'diamond',
  fillColor: string,
  edgeWidth: number,
  arrowSize: number,
): JSXElement[] => {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const px = -uy;
  const py = ux;
  const length = arrowSize;
  const halfWidth = arrowSize * 0.55;

  if (type === 'arrow') {
    const leftX = x - ux * length + px * halfWidth;
    const leftY = y - uy * length + py * halfWidth;
    const rightX = x - ux * length - px * halfWidth;
    const rightY = y - uy * length - py * halfWidth;
    return [
      <Path
        d={`M ${leftX} ${leftY} L ${x} ${y} L ${rightX} ${rightY}`}
        stroke={fillColor}
        strokeWidth={Math.max(1.5, edgeWidth)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />,
    ];
  }

  // Handle triangle and others as filled shapes
  const trianglePoints = [
    { x, y },
    {
      x: x - ux * length + px * halfWidth,
      y: y - uy * length + py * halfWidth,
    },
    {
      x: x - ux * length - px * halfWidth,
      y: y - uy * length - py * halfWidth,
    },
  ];
  return [
    <Polygon
      points={trianglePoints}
      fill={fillColor}
      stroke={fillColor}
      strokeWidth={Math.max(1, edgeWidth * 0.8)}
    />,
  ];
};

// Helper: Get 6 anchor points for a node
// LT: Left Top (1/4), LC: Left Center (1/2), LB: Left Bottom (3/4)
// RT: Right Top (1/4), RC: Right Center (1/2), RB: Right Bottom (3/4)
const getNodesAnchors = (node: NodeLayout) => {
  const { x, y, width, height } = node;
  const q1H = height * 0.25; // Top at 1/4
  const halfH = height * 0.5; // Center
  const q3H = height * 0.75; // Bottom at 3/4

  return {
    LT: { x, y: y + q1H },
    LC: { x, y: y + halfH },
    LB: { x, y: y + q3H },
    RT: { x: x + width, y: y + q1H },
    RC: { x: x + width, y: y + halfH },
    RB: { x: x + width, y: y + q3H },
  };
};

const calculateEdgePath = (
  fromId: string,
  toId: string,
  fromLayout: NodeLayout,
  toLayout: NodeLayout,
  edgeMap: Map<string, RelationEdgeDatum[]>,
  fromOutDegree: number,
  toInDegree: number,
) => {
  const fromAnchors = getNodesAnchors(fromLayout);
  const toAnchors = getNodesAnchors(toLayout);

  let points: [number, number][] = [];
  let isSelfLoop = false;
  let isCurved = false;

  // 1. 自连接 (A->A)
  // 规则：左上到左下 或 右上到右下 (打破出点 LC/RC 限制)
  if (fromId === toId) {
    isSelfLoop = true;
    // 默认使用右侧自连: RT -> Right Arc -> RB
    const start = fromAnchors.RT;
    const end = fromAnchors.RB;
    const offset = 40;

    // We use 4 points for Cubic Bezier logic later
    points = [
      [start.x, start.y],
      [start.x + offset, start.y], // Control 1
      [end.x + offset, end.y], // Control 2
      [end.x, end.y],
    ];
  } else {
    // 2. 互连 & 单向连接
    // 规则：Output: LC/RC; Input: LT/LB/RT/RB

    const isToRight = toLayout.centerX > fromLayout.centerX;
    const isToLeft = toLayout.centerX < fromLayout.centerX;
    // Check for exact same Y (same lane or perfectly aligned)
    // Using small epsilon for float comparison safety
    const isSameY = Math.abs(fromLayout.centerY - toLayout.centerY) < 1;

    let startPoint: { x: number; y: number };
    let endPoint: { x: number; y: number };

    if (isSameY) {
      // Rule 1: Same Y axis -> Center to Center
      if (isToRight) {
        startPoint = fromAnchors.RC;
        endPoint = toAnchors.LC;
      } else {
        startPoint = fromAnchors.LC; // Output Left
        endPoint = toAnchors.RC; // Input Right
      }
      // Same Y usually implies straight line by default
      isCurved = false;
    } else {
      // Different Y: Use Advanced Logic (Top/Bottom Anchors)

      // Select Input Port
      const isTargetBelow = toLayout.centerY > fromLayout.centerY;
      const isTargetStrictRight = toLayout.x >= fromLayout.x + fromLayout.width;

      if (toInDegree === 1) {
        // Use Center for Input
        if (isToRight) endPoint = toAnchors.LC;
        else endPoint = toAnchors.RC;
      } else if (isTargetBelow) {
        // Target Below -> Input Top
        if (isTargetStrictRight) {
          endPoint = toAnchors.LT;
        } else {
          endPoint = toAnchors.RT;
        }
      } else {
        // Target Above -> Input Bottom
        if (isTargetStrictRight) {
          endPoint = toAnchors.LB;
        } else {
          endPoint = toAnchors.RB;
        }
      }

      // Select Output Port
      if (fromOutDegree === 1) {
        // Use Center for Output
        if (isToRight) startPoint = fromAnchors.RC;
        else startPoint = fromAnchors.LC;
      } else if (isToRight) {
        startPoint = fromAnchors.RB; // Change to Bottom-Right
      } else if (isToLeft) {
        startPoint = fromAnchors.LB; // Change to Bottom-Left
      } else {
        startPoint = fromAnchors.RB;
      }
    }

    const reverseKey = `${toId}-${fromId}`;
    const hasReverse = edgeMap.has(reverseKey);

    if (hasReverse && !isSameY) {
      // Mutual connection on different Y -> Curve to separate
      isCurved = true;
      const startArr: [number, number] = [startPoint.x, startPoint.y];
      const endArr: [number, number] = [endPoint.x, endPoint.y];

      // Control Point: Horizontal Midpoint, Vertical Start Y
      const cx = (startArr[0] + endArr[0]) / 2;
      const cy = startArr[1];

      points = [startArr, [cx, cy], endArr];
    } else if (hasReverse && isSameY) {
      // Mutual connection on Same Y -> Curve (Arc up/down)
      isCurved = true;
      // Curve separation logic:
      // Left->Right: Upper Arc (Y-)
      // Right->Left: Lower Arc (Y+)
      const startArr: [number, number] = [startPoint.x, startPoint.y];
      const endArr: [number, number] = [endPoint.x, endPoint.y];

      const midX = (startArr[0] + endArr[0]) / 2;
      const midY = (startArr[1] + endArr[1]) / 2;

      const offsetY = 30;
      const isL2R = startArr[0] < endArr[0];
      const cpY = isL2R ? midY - offsetY : midY + offsetY;

      points = [startArr, [midX, cpY], endArr];
    } else {
      // Single direction -> Straight Line
      points = [
        [startPoint.x, startPoint.y],
        [endPoint.x, endPoint.y],
      ];
    }
  }

  return { points, isSelfLoop, isCurved };
};

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

  // 获取主题颜色
  const themeColors = getThemeColors(options.themeConfig, options);
  const colorText = themeColors?.colorText ?? '#333333';
  const colorBg = themeColors?.colorBg ?? '#ffffff';
  const colorBorder = themeColors?.colorTextSecondary ?? '#e0e0e0';

  const flowData = data as InteractionFlowData;
  const { title, desc, items = [], relations = [] } = flowData;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  // 空状态处理
  if (!items || items.length === 0) {
    const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>
            <BtnAdd
              indexes={[0]}
              x={-btnBounds.width / 2}
              y={-btnBounds.height / 2}
            />
          </BtnsGroup>
          <Text
            x={0}
            y={btnBounds.height / 2 + BTN_MARGIN}
            width={200}
            height={40}
            fontSize={14}
            alignHorizontal="center"
            alignVertical="middle"
            fill={themeColors?.colorTextSecondary ?? '#999'}
          >
            暂无数据
          </Text>
        </Group>
      </FlexLayout>
    );
  }

  // 泳道列表（每个顶层item是一个泳道）
  const lanes = items as InteractionLaneDatum[];

  // 计算最大行数（所有泳道中children最多的数量），至少为1
  const maxRows = Math.max(
    1,
    ...lanes.map((lane) => lane.children?.length ?? 0),
  );

  const nodeLayoutById = new Map<string, NodeLayout>();

  // 测量Item尺寸
  const designItem = options.design?.item;
  const itemConfig = Array.isArray(designItem) ? designItem[0] : designItem;

  // 使用类型安全的访问或默认值
  let itemWidth = itemConfig?.width ?? DEFAULT_ITEM_WIDTH;
  let itemHeight = itemConfig?.height ?? DEFAULT_ITEM_HEIGHT;

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

  // 尝试通过采样修正尺寸 (仅当配置未指定时)
  if (
    (!itemConfig?.width || !itemConfig?.height) &&
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
  const totalHeight =
    headerOffset + contentHeight + padding * 2 + BOTTOM_AREA_HEIGHT;
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

  const itemElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];
  const defsElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];

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

        // 泳道标题删除按钮 (右上角)
        btnElements.push(
          <BtnRemove
            indexes={[laneIndex]}
            x={centerX + itemWidth / 2 - BTN_MARGIN}
            y={padding - BTN_MARGIN}
          />,
        );
      }
    });
  }

  // 绘制节点（按行对齐）
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
          rx={CORNER_RADIUS_NODE}
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

        // 节点删除按钮 (底部剧中)
        btnElements.push(
          <BtnRemove
            indexes={originalIndex}
            x={x + itemWidth / 2 - BTN_MARGIN}
            y={y + itemHeight + BTN_MARGIN / 2}
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
            rx={CORNER_RADIUS_NODE}
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
    });

    // 每个泳道底部的添加节点按钮
    const childCount = lane.children?.length ?? 0;
    const lastRowIndex = Math.max(0, childCount - 1);
    const lastRowY =
      childCount > 0 ? getRowY(lastRowIndex) : padding + headerOffset;
    const addNodeY =
      childCount > 0
        ? lastRowY + itemHeight / 2 + BTN_LANE_ADD_Gap
        : lastRowY + firstGap + BTN_MARGIN;
    const centerX = getLaneCenterX(laneIndex);

    btnElements.push(
      <BtnAdd
        indexes={[laneIndex, childCount]}
        x={centerX - BTN_HALF_SIZE}
        y={addNodeY}
      />,
    );
  });

  // 添加新泳道按钮 (最右侧)
  const lastLaneRightX = getLaneCenterX(lanes.length - 1) + laneWidth / 2;
  const newLaneX =
    lanes.length > 0 ? lastLaneRightX + BTN_LANE_ADD_Gap : padding;
  const newLaneY = padding + headerOffset / 2 - BTN_HALF_SIZE; // 垂直居中于标题栏
  btnElements.push(
    <BtnAdd indexes={[lanes.length]} x={newLaneX} y={newLaneY} />,
  );

  // 预处理边，方便快速查找反向边
  const edgeMap = new Map<string, RelationEdgeDatum[]>();
  // 统计入度和出度
  const inDegreeMap = new Map<string, number>();
  const outDegreeMap = new Map<string, number>();

  relations.forEach((r) => {
    const key = `${r.from}-${r.to}`;
    if (!edgeMap.has(key)) edgeMap.set(key, []);
    edgeMap.get(key)?.push(r);

    const fromId = String(r.from);
    const toId = String(r.to);
    if (fromId === toId) return;
    outDegreeMap.set(fromId, (outDegreeMap.get(fromId) || 0) + 1);
    inDegreeMap.set(toId, (inDegreeMap.get(toId) || 0) + 1);
  });

  // 绘制消息箭头
  relations.forEach((relation, relIndex) => {
    const fromId = String(relation.from);
    const toId = String(relation.to);

    // 使用精确的节点布局信息
    const fromLayout = nodeLayoutById.get(fromId);
    const toLayout = nodeLayoutById.get(toId);

    if (!fromLayout || !toLayout) return;

    // 颜色处理
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
    }

    const { points, isSelfLoop, isCurved } = calculateEdgePath(
      fromId,
      toId,
      fromLayout,
      toLayout,
      edgeMap,
      outDegreeMap.get(fromId) || 0,
      inDegreeMap.get(toId) || 0,
    );

    // 生成路径字符串
    let pathD = '';

    if (isSelfLoop) {
      // Cubic Bezier C-shape: M p0 C p1 p2 p3
      const [p0, p1, p2, p3] = points;
      pathD = `M ${p0[0]} ${p0[1]} C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
    } else if (isCurved) {
      // Quad Bezier
      const [p0, p1, p2] = points;
      pathD = `M ${p0[0]} ${p0[1]} Q ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}`;
    } else {
      // Straight L
      const [p0, p1] = points;
      pathD = `M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]}`;
    }

    // Gradient Definition
    if (edgeColorMode === 'gradient') {
      const startPoint = points[0];
      const endPoint = points[points.length - 1];
      defsElements.push(
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={startPoint[0]}
          y1={startPoint[1]}
          x2={endPoint[0]}
          y2={endPoint[1]}
        >
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>,
      );
    }

    // 绘制 Path
    decorElements.push(
      <Path
        d={pathD}
        stroke={edgeStroke}
        strokeWidth={arrowWidth}
        fill="none"
        data-element-type="shape"
        strokeDasharray={
          (relation.lineStyle ?? edgeStyle) === 'dashed' || animated
            ? '5,5'
            : undefined
        }
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
    const effectiveArrowSize = ARROW_SIZE;
    const direction = relation.direction ?? 'forward';

    // Helper to calculate tangent angle
    const getTangentAngle = (pts: [number, number][], t: number) => {
      // t is 0 (start) or 1 (end)
      if (isSelfLoop) {
        // Cubic Bezier: M p0 C p1 p2 p3
        // B'(t) = 3(1-t)^2(p1-p0) + 6(1-t)t(p2-p1) + 3t^2(p3-p2)
        const p0 = pts[0],
          p1 = pts[1],
          p2 = pts[2],
          p3 = pts[3];
        if (t === 0) {
          return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) + Math.PI; // Reverse for start arrow
        } else {
          return Math.atan2(p3[1] - p2[1], p3[0] - p2[0]);
        }
      } else if (isCurved) {
        // Quad Bezier: M p0 Q p1 p2
        // B'(t) = 2(1-t)(p1-p0) + 2t(p2-p1)
        const p0 = pts[0],
          p1 = pts[1],
          p2 = pts[2];
        if (t === 0) {
          return Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) + Math.PI;
        } else {
          return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        }
      } else {
        // Line
        const angle = Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]);
        return t === 0 ? angle + Math.PI : angle;
      }
    };

    if (direction === 'forward' || direction === 'both') {
      const angle = getTangentAngle(points, 1);
      const endPt = points[points.length - 1];
      decorElements.push(
        ...createArrowElements(
          endPt[0],
          endPt[1],
          angle,
          relation.arrowType ?? arrowType,
          targetArrowColor,
          arrowWidth,
          effectiveArrowSize,
        ),
      );
    }

    if (direction === 'both') {
      const angle = getTangentAngle(points, 0);
      const startPt = points[0];
      decorElements.push(
        ...createArrowElements(
          startPt[0],
          startPt[1],
          angle,
          relation.arrowType ?? arrowType,
          sourceArrowColor,
          arrowWidth,
          effectiveArrowSize,
        ),
      );
    }

    // 绘制消息标签
    if (relation.label) {
      let labelPoint: [number, number] | null = null;

      if (isSelfLoop) {
        // Cubic Midpoint approx t=0.5
        // B(0.5) = 0.125*p0 + 0.375*p1 + 0.375*p2 + 0.125*p3
        const [p0, p1, p2, p3] = points;
        labelPoint = [
          0.125 * p0[0] + 0.375 * p1[0] + 0.375 * p2[0] + 0.125 * p3[0],
          0.125 * p0[1] + 0.375 * p1[1] + 0.375 * p2[1] + 0.125 * p3[1],
        ];
        labelPoint[0] += 10;
      } else if (isCurved) {
        // Quad Midpoint t=0.5
        const [p0, p1, p2] = points;
        labelPoint = [
          0.25 * p0[0] + 0.5 * p1[0] + 0.25 * p2[0],
          0.25 * p0[1] + 0.5 * p1[1] + 0.25 * p2[1],
        ];
      } else {
        labelPoint = getMidPoint(points);
      }

      if (labelPoint) {
        const labelX = labelPoint[0];
        const labelY = labelPoint[1] - 15;

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
            rx={CORNER_RADIUS_LABEL}
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
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-interaction', {
  component: SequenceInteractionFlow,
  composites: ['title', 'item'],
});
