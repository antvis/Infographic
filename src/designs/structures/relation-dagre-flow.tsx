import { DagreLayout } from '@antv/layout';
import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, getElementBounds, Group, Path, Polygon, Text } from '../../jsx';
import type { ItemDatum, RelationData, RelationEdgeDatum } from '../../types';
import { BtnAdd, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

type FlowNodeDatum = ItemDatum & {
  id?: string;
  parentId?: string;
};

type NodeMeta = {
  id: string;
  indexes: number[];
  datum: FlowNodeDatum;
  themeColors?: ReturnType<typeof getThemeColors>;
};

type NodeLayout = NodeMeta & {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export interface RelationDagreFlowProps extends BaseStructureProps {
  rankdir?: 'TB' | 'BT' | 'LR' | 'RL';
  nodesep?: number;
  ranksep?: number;
  edgesep?: number;
  edgeWidth?: number;
  showConnections?: boolean;
  edgeColorMode?: 'solid' | 'gradient';
  edgeStyle?: 'solid' | 'dashed';
  edgeDashPattern?: string;
  edgeCornerRadius?: number;
  edgeRouting?: 'dagre' | 'orth';
  showArrow?: boolean;
  arrowType?: 'arrow' | 'triangle' | 'diamond';
  padding?: number;
  edgeAnimation?: 'none' | 'ant-line';
  edgeAnimationSpeed?: number;
}

const DEFAULT_NODE_SEP = 50;
const DEFAULT_RANK_SEP = 70;
const DEFAULT_EDGE_SEP = 10;
const DEFAULT_EDGE_WIDTH = 2;
const DEFAULT_PADDING = 30;

const checkUndirectedCycle = (
  nodeIds: string[],
  edges: { id: string; source: string; target: string }[],
): boolean => {
  const adj = new Map<string, { target: string; edgeId: string }[]>();
  nodeIds.forEach((id) => adj.set(id, []));

  for (const edge of edges) {
    if (edge.source === edge.target) return true;
    adj.get(edge.source)?.push({ target: edge.target, edgeId: edge.id });
    adj.get(edge.target)?.push({ target: edge.source, edgeId: edge.id });
  }

  const visited = new Set<string>();
  const dfs = (u: string, parentEdgeId: string | null): boolean => {
    visited.add(u);
    const neighbors = adj.get(u) || [];
    for (const { target: v, edgeId } of neighbors) {
      if (edgeId === parentEdgeId) continue;
      if (visited.has(v)) return true;
      if (dfs(v, edgeId)) return true;
    }
    return false;
  };

  for (const node of nodeIds) {
    if (!visited.has(node)) {
      if (dfs(node, null)) return true;
    }
  }
  return false;
};

export const RelationDagreFlow: ComponentType<RelationDagreFlowProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    rankdir = 'TB',
    nodesep = DEFAULT_NODE_SEP,
    ranksep = DEFAULT_RANK_SEP,
    edgesep = DEFAULT_EDGE_SEP,
    edgeWidth = DEFAULT_EDGE_WIDTH,
    showConnections = true,
    edgeColorMode = 'gradient',
    edgeStyle = 'solid',
    edgeDashPattern = '5,5',
    edgeCornerRadius = 12,
    edgeRouting = 'orth',
    showArrow = true,
    arrowType = 'triangle',
    padding = DEFAULT_PADDING,
    edgeAnimation = 'none',
    edgeAnimationSpeed = 1,
    options,
  } = props;
  const { title, desc, items = [], relations = [] } = data as RelationData;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  if (!Item || items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnAdd indexes={[0]} x={0} y={0} />
        </Group>
      </FlexLayout>
    );
  }

  const nodeMetaMap = new Map<string, NodeMeta>();
  const nodeSizeMap = new Map<string, { width: number; height: number }>();
  const nodeColorMap = new Map<string, string>();
  const nodeIdsByIndex = new Map<number, string>();
  const nodeIdSet = new Set<string>();
  const colorGroupIndexMap = new Map<string, number>();
  let nextColorGroupIndex = 0;

  const nodes = items.map((item, index) => {
    const datum = item as FlowNodeDatum;
    const id = String(datum.id ?? index);
    const indexes = [index];
    let primary: string | undefined;
    const groupKey = String((datum as { group?: unknown }).group ?? '');
    if (groupKey) {
      let groupIndex = colorGroupIndexMap.get(groupKey);
      if (groupIndex == null) {
        groupIndex = nextColorGroupIndex;
        colorGroupIndexMap.set(groupKey, groupIndex);
        nextColorGroupIndex += 1;
      }
      primary = getPaletteColor(options, [groupIndex]);
    } else {
      primary = getPaletteColor(options, indexes);
    }
    const themeColors = primary
      ? getThemeColors({ colorPrimary: primary }, options)
      : undefined;
    if (primary) {
      nodeColorMap.set(id, primary);
    }
    const bounds = getElementBounds(
      <Item
        indexes={indexes}
        data={data}
        datum={datum}
        positionH="center"
        positionV="middle"
        themeColors={themeColors}
      />,
    );
    nodeSizeMap.set(id, bounds);
    nodeMetaMap.set(id, { id, indexes, datum, themeColors });
    nodeIdsByIndex.set(index, id);
    nodeIdSet.add(id);
    return { id, parentId: datum.parentId };
  });

  const resolveNodeId = (value: string | number | undefined | null) => {
    if (value == null) return null;
    const direct = String(value);
    if (nodeIdSet.has(direct)) return direct;
    const asIndex = Number(value);
    if (!Number.isNaN(asIndex)) {
      const mapped = nodeIdsByIndex.get(asIndex);
      if (mapped) return mapped;
    }
    return null;
  };

  const edges = relations
    .map((relation, index) => {
      const source = resolveNodeId(relation.from);
      const target = resolveNodeId(relation.to);
      if (!source || !target) return null;
      return {
        id: relation.id ? String(relation.id) : `edge-${index}`,
        source,
        target,
        relation,
      };
    })
    .filter(Boolean) as {
    id: string;
    source: string;
    target: string;
    relation: RelationEdgeDatum;
  }[];

  const hasCycle = checkUndirectedCycle(Array.from(nodeIdSet), edges);
  const finalEdgeRouting = hasCycle ? 'dagre' : edgeRouting;

  const layout = new DagreLayout({
    rankdir,
    nodesep,
    ranksep,
    edgesep,
    controlPoints: true,
    nodeSize: (node) => {
      const id = String((node as { id?: string | number }).id ?? '');
      const bounds = nodeSizeMap.get(id);
      return bounds ? [bounds.width, bounds.height] : [0, 0];
    },
  });

  layout.execute({ nodes, edges });

  const nodeLayouts: NodeLayout[] = [];
  layout.forEachNode((node) => {
    const id = String(node.id);
    const meta = nodeMetaMap.get(id);
    if (!meta) return;
    const bounds = nodeSizeMap.get(id);
    const width = bounds?.width ?? 0;
    const height = bounds?.height ?? 0;
    const x = (node.x ?? 0) - width / 2;
    const y = (node.y ?? 0) - height / 2;
    nodeLayouts.push({
      ...meta,
      x,
      y,
      width,
      height,
      centerX: x + width / 2,
      centerY: y + height / 2,
    });
  });

  if (nodeLayouts.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnAdd indexes={[0]} x={0} y={0} />
        </Group>
      </FlexLayout>
    );
  }

  const minX = Math.min(...nodeLayouts.map((node) => node.x));
  const minY = Math.min(...nodeLayouts.map((node) => node.y));
  const offsetX = padding - minX;
  const offsetY = padding - minY;

  const nodeLayoutById = new Map<string, NodeLayout>();
  const itemElements: JSXElement[] = [];
  nodeLayouts.forEach((node) => {
    const displayX = node.x + offsetX;
    const displayY = node.y + offsetY;
    const positionH =
      rankdir === 'LR' ? 'normal' : rankdir === 'RL' ? 'flipped' : 'center';
    const positionV =
      rankdir === 'TB' ? 'normal' : rankdir === 'BT' ? 'flipped' : 'middle';

    itemElements.push(
      <Item
        indexes={node.indexes}
        datum={node.datum}
        data={data}
        x={displayX}
        y={displayY}
        positionH={positionH}
        positionV={positionV}
        themeColors={node.themeColors}
      />,
    );

    nodeLayoutById.set(node.id, {
      ...node,
      x: displayX,
      y: displayY,
      centerX: displayX + node.width / 2,
      centerY: displayY + node.height / 2,
    });
  });

  const defsElements: JSXElement[] = [];
  const decorElements: JSXElement[] = [];
  if (showConnections) {
    const defaultStroke = getColorPrimary(options);
    const themeColors = getThemeColors(options.themeConfig, options);
    const labelBackground = themeColors?.colorBg ?? '#ffffff';
    const labelTextColor = themeColors?.colorText ?? defaultStroke;
    const arrowSize = Math.max(10, edgeWidth * 4);
    const isVertical = rankdir === 'TB' || rankdir === 'BT';

    const enableAnimation = edgeAnimation === 'ant-line';
    const animationDashArray = enableAnimation ? edgeDashPattern : '';
    const staticDashArray =
      !enableAnimation && edgeStyle === 'dashed' ? edgeDashPattern : '';
    const actualDashArray = enableAnimation
      ? animationDashArray
      : staticDashArray;

    const dashPatternLength = enableAnimation
      ? animationDashArray
          .split(',')
          .reduce((sum, val) => sum + parseFloat(val.trim() || '0'), 0)
      : 0;
    const animationDuration =
      enableAnimation && dashPatternLength > 0
        ? `${dashPatternLength / (edgeAnimationSpeed * 10)}s`
        : '1s';

    const straightCornerRadius = edgeCornerRadius;
    const createStraightPath = (
      points: [number, number][],
      dx: number,
      dy: number,
    ) =>
      points
        .map(([x, y], index) => {
          const prefix = index === 0 ? 'M' : 'L';
          return `${prefix} ${x + dx} ${y + dy}`;
        })
        .join(' ');

    const createRoundedPath = (
      points: [number, number][],
      radius: number,
      dx: number,
      dy: number,
    ) => {
      if (points.length < 2) return '';
      const clamp = (value: number, min: number, max: number) =>
        Math.min(max, Math.max(min, value));
      const toPoint = ([x, y]: [number, number]) => ({
        x: x + dx,
        y: y + dy,
      });
      const output: string[] = [];
      const first = toPoint(points[0]);
      output.push(`M ${first.x} ${first.y}`);

      if (points.length === 2) {
        const last = toPoint(points[1]);
        output.push(`L ${last.x} ${last.y}`);
        return output.join(' ');
      }

      for (let i = 1; i < points.length - 1; i += 1) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        const v0x = curr[0] - prev[0];
        const v0y = curr[1] - prev[1];
        const v1x = next[0] - curr[0];
        const v1y = next[1] - curr[1];
        const d0 = Math.hypot(v0x, v0y);
        const d1 = Math.hypot(v1x, v1y);
        if (d0 === 0 || d1 === 0) {
          const currPoint = toPoint(curr);
          output.push(`L ${currPoint.x} ${currPoint.y}`);
          continue;
        }
        const r = clamp(radius, 0, Math.min(d0, d1) / 2);
        if (r === 0) {
          const currPoint = toPoint(curr);
          output.push(`L ${currPoint.x} ${currPoint.y}`);
          continue;
        }
        const u0x = v0x / d0;
        const u0y = v0y / d0;
        const u1x = v1x / d1;
        const u1y = v1y / d1;
        const start = toPoint([curr[0] - u0x * r, curr[1] - u0y * r]);
        const end = toPoint([curr[0] + u1x * r, curr[1] + u1y * r]);
        output.push(`L ${start.x} ${start.y}`);
        const currPoint = toPoint(curr);
        output.push(`Q ${currPoint.x} ${currPoint.y} ${end.x} ${end.y}`);
      }

      const last = toPoint(points[points.length - 1]);
      output.push(`L ${last.x} ${last.y}`);
      return output.join(' ');
    };
    const createArrowElements = (
      x: number,
      y: number,
      angle: number,
      type: 'arrow' | 'triangle' | 'diamond',
      fillColor: string,
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

      if (type === 'diamond') {
        const diamondLength = length * 1.25;
        const diamondWidth = halfWidth * 0.75;
        const midX = x - ux * diamondLength * 0.5;
        const midY = y - uy * diamondLength * 0.5;
        const diamondPoints = [
          { x, y },
          { x: midX + px * diamondWidth, y: midY + py * diamondWidth },
          { x: x - ux * diamondLength, y: y - uy * diamondLength },
          { x: midX - px * diamondWidth, y: midY - py * diamondWidth },
        ];
        return [
          <Polygon
            points={diamondPoints}
            fill={fillColor}
            stroke={fillColor}
            strokeWidth={Math.max(1, edgeWidth * 0.8)}
          />,
        ];
      }

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
    const getOrthEdgeEndpoints = (sourceId: string, targetId: string) => {
      const source = nodeLayoutById.get(sourceId);
      const target = nodeLayoutById.get(targetId);
      if (!source || !target) return null;
      if (rankdir === 'TB') {
        return {
          start: [source.centerX, source.y + source.height] as [number, number],
          end: [target.centerX, target.y] as [number, number],
        };
      }
      if (rankdir === 'BT') {
        return {
          start: [source.centerX, source.y] as [number, number],
          end: [target.centerX, target.y + target.height] as [number, number],
        };
      }
      if (rankdir === 'LR') {
        return {
          start: [source.x + source.width, source.centerY] as [number, number],
          end: [target.x, target.centerY] as [number, number],
        };
      }
      return {
        start: [source.x, source.centerY] as [number, number],
        end: [target.x + target.width, target.centerY] as [number, number],
      };
    };
    const getOrthEdgePoints = (
      sourceId: string,
      targetId: string,
    ): {
      start: [number, number];
      end: [number, number];
      points: [number, number][];
    } | null => {
      const endpoints = getOrthEdgeEndpoints(sourceId, targetId);
      if (!endpoints) return null;
      const { start, end } = endpoints;
      if (isVertical) {
        const midY = start[1] + (end[1] - start[1]) / 2;
        return {
          start,
          end,
          points: [start, [start[0], midY], [end[0], midY], end],
        };
      }
      const midX = start[0] + (end[0] - start[0]) / 2;
      return {
        start,
        end,
        points: [start, [midX, start[1]], [midX, end[1]], end],
      };
    };
    layout.forEachEdge((edge) => {
      const normalizePoints = (rawPoints: any): [number, number][] => {
        if (!Array.isArray(rawPoints)) return [];
        return rawPoints
          .map((point) => {
            if (!point) return null;
            if (Array.isArray(point) && point.length >= 2) {
              return [Number(point[0]), Number(point[1])] as [number, number];
            }
            return null;
          })
          .filter(
            (point): point is [number, number] =>
              !!point && Number.isFinite(point[0]) && Number.isFinite(point[1]),
          );
      };
      const fallbackPoints = () => {
        const source = nodeLayoutById.get(String(edge.source));
        const target = nodeLayoutById.get(String(edge.target));
        if (!source || !target) return [];
        return [
          [source.centerX - offsetX, source.centerY - offsetY] as [
            number,
            number,
          ],
          [target.centerX - offsetX, target.centerY - offsetY] as [
            number,
            number,
          ],
        ];
      };
      const useOrthRouting = finalEdgeRouting === 'orth';
      const orthEdge = useOrthRouting
        ? getOrthEdgePoints(String(edge.source), String(edge.target))
        : null;
      const normalized = useOrthRouting ? [] : normalizePoints(edge.points);
      const points = useOrthRouting
        ? (orthEdge?.points ?? [])
        : normalized.length
          ? normalized
          : fallbackPoints();
      if (!points.length) return;
      const pointsOffsetX = useOrthRouting ? 0 : offsetX;
      const pointsOffsetY = useOrthRouting ? 0 : offsetY;
      const startPoint = useOrthRouting
        ? (orthEdge?.start ?? points[0])
        : points[0];
      const endPoint = useOrthRouting
        ? (orthEdge?.end ?? points[points.length - 1])
        : points[points.length - 1];
      const relation = (
        edge as { _original?: { relation?: RelationEdgeDatum } }
      )._original?.relation;
      const sourceColor =
        nodeColorMap.get(String(edge.source)) ?? defaultStroke;
      const targetColor =
        nodeColorMap.get(String(edge.target)) ?? defaultStroke;
      const gradientKey =
        `edge-gradient-${String(sourceColor)}-${String(targetColor)}`.replace(
          /[^a-zA-Z0-9_-]/g,
          '',
        );
      const edgeStroke =
        edgeColorMode === 'gradient' ? `url(#${gradientKey})` : defaultStroke;
      let pathD = '';
      if (straightCornerRadius > 0) {
        pathD = createRoundedPath(
          points,
          straightCornerRadius,
          pointsOffsetX,
          pointsOffsetY,
        );
      } else {
        pathD = createStraightPath(points, pointsOffsetX, pointsOffsetY);
      }
      if (!pathD) return;

      const pathElement = (
        <Path
          d={pathD}
          stroke={edgeStroke}
          strokeWidth={edgeWidth}
          strokeDasharray={actualDashArray}
          fill="none"
          data-element-type="shape"
        >
          {enableAnimation && (
            <animate
              attributeName="stroke-dashoffset"
              from={String(dashPatternLength)}
              to="0"
              dur={animationDuration}
              repeatCount="indefinite"
            />
          )}
        </Path>
      );

      decorElements.push(pathElement);
      if (edgeColorMode === 'gradient') {
        const start = startPoint;
        const end = endPoint;
        defsElements.push(
          <linearGradient
            id={gradientKey}
            gradientUnits="userSpaceOnUse"
            x1={start[0] + pointsOffsetX}
            y1={start[1] + pointsOffsetY}
            x2={end[0] + pointsOffsetX}
            y2={end[1] + pointsOffsetY}
          >
            <stop offset="0%" stopColor={sourceColor} />
            <stop offset="100%" stopColor={targetColor} />
          </linearGradient>,
        );
      }

      if (relation?.label) {
        let labelPoint: [number, number] | null = null;
        const midPoint = getMidPoint(points);
        if (midPoint) {
          labelPoint = [
            midPoint[0] + pointsOffsetX,
            midPoint[1] + pointsOffsetY,
          ];
        }
        if (labelPoint) {
          const labelText = String(relation.label);
          const labelBounds = getElementBounds(
            <Text fontSize={14} fontWeight="normal">
              {labelText}
            </Text>,
          );
          const labelX = labelPoint[0] - labelBounds.width / 2;
          const labelY = labelPoint[1] - labelBounds.height / 2;
          decorElements.push(
            <Text
              x={labelX}
              y={labelY}
              width={labelBounds.width}
              height={labelBounds.height}
              fontSize={14}
              fontWeight="normal"
              alignHorizontal="center"
              alignVertical="middle"
              fill={labelTextColor}
              backgroundColor={labelBackground}
            >
              {labelText}
            </Text>,
          );
        }
      }

      const effectiveShowArrow = relation?.showArrow ?? showArrow;
      const direction = relation?.direction ?? 'forward';
      const edgeArrowType = relation?.arrowType ?? arrowType;
      const lastIndex = points.length - 1;
      if (effectiveShowArrow && points.length > 1) {
        if (direction === 'forward' || direction === 'both') {
          const head = points[lastIndex];
          const tail = points[lastIndex - 1];
          const angle = Math.atan2(head[1] - tail[1], head[0] - tail[0]);
          const arrowFill =
            edgeColorMode === 'gradient' ? targetColor : defaultStroke;
          const arrowElements = createArrowElements(
            head[0] + pointsOffsetX,
            head[1] + pointsOffsetY,
            angle,
            edgeArrowType,
            arrowFill,
          );
          decorElements.push(...arrowElements);
        }
        if (direction === 'both') {
          const head = points[0];
          const tail = points[1];
          const angle = Math.atan2(head[1] - tail[1], head[0] - tail[0]);
          const arrowFill =
            edgeColorMode === 'gradient' ? sourceColor : defaultStroke;
          const arrowElements = createArrowElements(
            head[0] + pointsOffsetX,
            head[1] + pointsOffsetY,
            angle,
            edgeArrowType,
            arrowFill,
          );
          decorElements.push(...arrowElements);
        }
      }
    });
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <Defs>{defsElements}</Defs>
        <Group width={0} height={0}>
          {decorElements}
        </Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup />
      </Group>
    </FlexLayout>
  );
};

registerStructure('relation-dagre-flow', {
  component: RelationDagreFlow,
  composites: ['title', 'item'],
});
