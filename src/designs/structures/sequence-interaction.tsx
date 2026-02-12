import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, getElementBounds, Group, Path, Rect, Text } from '../../jsx';
import type { RelationEdgeDatum } from '../../types';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import {
  createArrowElements,
  getColorPrimary,
  getEdgePathD,
  getLabelPosition,
  getNodesAnchors,
  getPaletteColor,
  getTangentAngle,
  getThemeColors,
} from '../utils';
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
  /**
   * 手动指定节点的垂直顺序（层级），默认为数组索引
   * 相同 step 的节点会处于同一高度
   */
  step?: number;
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
  laneGap?: number;
  nodeGap?: number;
  lifelineWidth?: number;
  arrowWidth?: number;
  showLifeline?: boolean;
  padding?: number;
  arrowType?: 'arrow' | 'triangle';
  showLaneHeader?: boolean;
  laneHeaderHeight?: number;
  edgeStyle?: 'solid' | 'dashed';
  animated?: boolean;
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

const LANE_PADDING = 60;

const BTN_HALF_SIZE = 12;
const BTN_MARGIN = 10;
const BTN_LANE_ADD_Gap = 20;
const BOTTOM_AREA_HEIGHT = 60;

const LANE_HEADER_MARGIN = 10;
const LABEL_BG_PADDING_H = 6;
const LABEL_BG_PADDING_V = 2;
const LABEL_OFFSET_Y = 10;
const FIRST_GAP = 20;

const PATH_OFFSET = 40;

const calculateEdgePath = (
  fromId: string,
  toId: string,
  fromLayout: NodeLayout,
  toLayout: NodeLayout,
  edgeMap: Map<string, RelationEdgeDatum[]>,
  fromOutDegree: number,
  toInDegree: number,
  fromInDegree: number,
  toOutDegree: number,
) => {
  const fromAnchors = getNodesAnchors(fromLayout);
  const toAnchors = getNodesAnchors(toLayout);

  const reverseKey = `${toId}-${fromId}`;
  const hasReverse = edgeMap.has(reverseKey);

  const isStartLane = fromLayout.laneIndex === 0;

  let points: [number, number][] = [];

  if (fromId === toId) {
    // 1. 自连接 (A->A)
    //  RT -> Right Arc -> RB
    const start = isStartLane ? fromAnchors.LT : fromAnchors.RT;
    const end = isStartLane ? fromAnchors.LB : fromAnchors.RB;
    const offset = isStartLane ? -PATH_OFFSET : PATH_OFFSET;

    points = [
      [start.x, start.y],
      [start.x + offset, start.y],
      [end.x + offset, end.y],
      [end.x, end.y],
    ];
  } else if (fromLayout.laneIndex === toLayout.laneIndex) {
    // 2. 同泳道回环 (Bottom -> Top)
    const start = isStartLane ? fromAnchors.LB : fromAnchors.RB;
    const end = isStartLane ? toAnchors.LT : toAnchors.RT;
    const offset = isStartLane ? -PATH_OFFSET : PATH_OFFSET;

    points = [
      [start.x, start.y],
      [start.x + offset, start.y],
      [end.x + offset, end.y],
      [end.x, end.y],
    ];
  } else {
    // 3. 互连 & 单向连接
    const isToRight = toLayout.centerX > fromLayout.centerX;
    const isToLeft = toLayout.centerX < fromLayout.centerX;

    const isSameY = Math.abs(fromLayout.centerY - toLayout.centerY) < 1;
    const isTargetBelow = toLayout.centerY > fromLayout.centerY;
    const isTargetStrictRight = toLayout.x >= fromLayout.x + fromLayout.width;

    let startPoint: { x: number; y: number };
    let endPoint: { x: number; y: number };

    // 优先处理同行情况
    if (isSameY) {
      startPoint = isToRight ? fromAnchors.RC : fromAnchors.LC;
      endPoint = isToRight ? toAnchors.LC : toAnchors.RC;
    }
    // 处理互连情况 (避免重叠，使用对角锚点)
    else if (hasReverse) {
      if (isTargetBelow) {
        startPoint = isToRight ? fromAnchors.RB : fromAnchors.LT;
        endPoint = isToRight ? toAnchors.LT : toAnchors.RB;
      } else {
        startPoint = isToRight ? fromAnchors.RT : fromAnchors.LT;
        endPoint = isToRight ? toAnchors.LB : toAnchors.RB;
      }
    }
    // 处理普通单向连接
    else {
      // 1. 确定终点 (End Point)
      if (toInDegree === 1 && toOutDegree === 0) {
        endPoint = isToRight ? toAnchors.LC : toAnchors.RC;
      } else if (isTargetBelow) {
        endPoint = isTargetStrictRight ? toAnchors.LT : toAnchors.RT;
      } else {
        endPoint = isTargetStrictRight ? toAnchors.LB : toAnchors.RB;
      }

      // 2. 确定起点 (Start Point)
      if (fromOutDegree === 1 && fromInDegree === 0) {
        startPoint = isToRight ? fromAnchors.RC : fromAnchors.LC;
      } else if (isToRight) {
        startPoint = fromAnchors.RB;
      } else if (isToLeft) {
        startPoint = fromAnchors.LB;
      } else {
        startPoint = fromAnchors.RB;
      }
    }

    if (hasReverse && !isSameY) {
      // 1. 跨行（不同 Y 轴）的双向连接
      const startArr: [number, number] = [startPoint.x, startPoint.y];
      const endArr: [number, number] = [endPoint.x, endPoint.y];

      const cx = (startArr[0] + endArr[0]) / 2;
      const cy = startArr[1];

      points = [startArr, [cx, cy], endArr];
    } else if (hasReverse && isSameY) {
      // 2. 同行（相同 Y 轴）的双向连接
      const startArr: [number, number] = [startPoint.x, startPoint.y];
      const endArr: [number, number] = [endPoint.x, endPoint.y];

      const midX = (startArr[0] + endArr[0]) / 2;
      const midY = (startArr[1] + endArr[1]) / 2;

      const offsetY = 30;
      const isL2R = startArr[0] < endArr[0];
      const cpY = isL2R ? midY - offsetY : midY + offsetY;

      points = [startArr, [midX, cpY], endArr];
    } else {
      // 3. 普通单向连接
      points = [
        [startPoint.x, startPoint.y],
        [endPoint.x, endPoint.y],
      ];
    }
  }

  return { points };
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

  // 计算最大行数（所有泳道中 children 的最大 step 或 索引），至少为1
  let maxStep = 0;
  lanes.forEach((lane) => {
    lane.children?.forEach((child, index) => {
      const currentStep = child.step ?? index;
      if (currentStep > maxStep) {
        maxStep = currentStep;
      }
    });
  });
  const maxRows = Math.max(1, maxStep + 1);

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

  // 动态计算泳道宽度：需要兼顾节点宽度、标签宽度需求以及用户设置的间距
  const baseWidth = itemWidth + LANE_PADDING;
  const labelWidthRequirement = itemWidth + maxLabelWidth + LANE_PADDING * 2;
  const laneWidth = Math.max(laneGap, baseWidth, labelWidthRequirement);

  // 计算行高度和总高度
  const headerOffset = showLaneHeader ? laneHeaderHeight : 0;
  const contentHeight =
    FIRST_GAP + maxRows * itemHeight + Math.max(0, maxRows - 1) * nodeGap;
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
      FIRST_GAP +
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
        ...createArrowElements(
          centerX,
          endY,
          Math.PI / 2,
          'triangle',
          colorBorder,
          1,
          10,
        ),
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
            height={laneHeaderHeight - LANE_HEADER_MARGIN}
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
      // 使用 step 属性作为行索引，如果未定义则回退到数组索引
      const effectiveRowIndex = child.step ?? rowIndex;

      const centerX = getLaneCenterX(laneIndex);
      const centerY = getRowY(effectiveRowIndex);

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
        rowIndex: effectiveRowIndex,
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

    // 找出当前泳道最大的 step
    let lastEffectRowIndex = -1;
    lane.children?.forEach((child, index) => {
      const s = child.step ?? index;
      if (s > lastEffectRowIndex) lastEffectRowIndex = s;
    });

    const lastRowY =
      lastEffectRowIndex >= 0
        ? getRowY(lastEffectRowIndex)
        : padding + headerOffset;
    const addNodeY =
      childCount > 0
        ? lastRowY + itemHeight / 2 + BTN_LANE_ADD_Gap
        : lastRowY + FIRST_GAP + BTN_MARGIN;
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

    const { points } = calculateEdgePath(
      fromId,
      toId,
      fromLayout,
      toLayout,
      edgeMap,
      outDegreeMap.get(fromId) || 0,
      inDegreeMap.get(toId) || 0,
      inDegreeMap.get(fromId) || 0,
      outDegreeMap.get(toId) || 0,
    );

    // 生成路径字符串
    const pathD = getEdgePathD(points);

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

    const arrowConfigs = [
      {
        show: direction === 'forward' || direction === 'both',
        angle: getTangentAngle(points, 1),
        point: points[points.length - 1],
        color: targetArrowColor,
      },
      {
        show: direction === 'both',
        angle: getTangentAngle(points, 0),
        point: points[0],
        color: sourceArrowColor,
      },
    ];

    arrowConfigs.forEach((cfg) => {
      if (cfg.show) {
        decorElements.push(
          ...createArrowElements(
            cfg.point[0],
            cfg.point[1],
            cfg.angle,
            relation.arrowType ?? arrowType,
            cfg.color,
            arrowWidth,
            effectiveArrowSize,
          ),
        );
      }
    });

    // 绘制消息标签
    if (relation.label) {
      const labelPoint = getLabelPosition(points);

      if (labelPoint) {
        const labelX = labelPoint[0];
        const labelY = labelPoint[1] - LABEL_OFFSET_Y;

        const labelBounds = getElementBounds(
          <Text fontSize={12} fontWeight="normal">
            {relation.label}
          </Text>,
        );

        // 标签背景
        decorElements.push(
          <Rect
            x={labelX - labelBounds.width / 2 - LABEL_BG_PADDING_H}
            y={labelY - labelBounds.height / 2 - LABEL_BG_PADDING_V}
            width={labelBounds.width + LABEL_BG_PADDING_H * 2}
            height={labelBounds.height + LABEL_BG_PADDING_V * 2}
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
