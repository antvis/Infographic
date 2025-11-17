import tinycolor from 'tinycolor2';
import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, getElementBounds, Group, Path, Rect, Text } from '../../jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface sequenceCylinders3dProps extends BaseStructureProps {
  cylinderRx?: number;
  cylinderRy?: number;
  baseHeight?: number;
  heightIncrement?: number;
  horizontalSpacing?: number;
  depthSpacing?: number;
  itemVerticalAlign?: 'top' | 'center' | 'bottom';
  itemVerticalOffset?: number;
  firstDecorationWidth?: number;
}

interface CylinderPosition {
  x: number;
  y: number;
  height: number;
  bottomY: number;
  topY: number;
}

interface ItemPosition {
  x: number;
  y: number;
}

interface LayoutMetrics {
  canvasHeight: number;
  startY: number;
  leftItemAlignedX: number;
  rightItemAlignedX: number;
  cylinderAreaStartX: number;
}

const calculateDepthOffset = (
  pairIndex: number,
  cylinderRx: number,
): number => {
  if (pairIndex === 0) return 0;
  if (pairIndex === 1) return cylinderRx / 2;
  return cylinderRx / 2 + (pairIndex - 1) * ((cylinderRx / 2) * 3);
};

const calculateLateralOffset = (
  isLeft: boolean,
  pairIndex: number,
  cylinderRx: number,
): number => {
  if (isLeft) return 0;
  const firstPairGap = 2;
  const normalGap = cylinderRx;
  const gap = pairIndex === 0 ? firstPairGap : normalGap;
  return cylinderRx * 2 + gap;
};

const calculateLayoutMetrics = (
  itemsCount: number,
  itemBounds: { width: number; height: number },
  cylinderRx: number,
  baseHeight: number,
  heightIncrement: number,
  depthSpacing: number,
  firstDecorationWidth: number,
  gapFromCylinder: number,
): LayoutMetrics => {
  const planeStepY = Math.max(6, depthSpacing * 0.15);
  const lastCylinderHeight = baseHeight + (itemsCount - 1) * heightIncrement;
  const totalPlaneOffset = itemsCount * planeStepY;
  const bottomMargin = 100;
  const topMargin = 50;
  const canvasHeight =
    lastCylinderHeight + totalPlaneOffset + bottomMargin + topMargin;
  const startY = canvasHeight - bottomMargin;

  let leftItemAlignedX = 0;
  let rightItemAlignedX = 0;
  let cylindersCenterX = 0;
  let cylinderAreaStartX = 0;

  if (itemsCount > 0) {
    const tempCylinderStart = 0;
    let minCylinderX = Infinity;
    let maxCylinderX = -Infinity;

    for (let index = 0; index < itemsCount; index++) {
      const isLeft = index % 2 === 0;
      const pairIndex = Math.floor(index / 2);
      const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
      const lateralOffset = calculateLateralOffset(
        isLeft,
        pairIndex,
        cylinderRx,
      );
      const x = tempCylinderStart + lateralOffset + depthOffset;

      minCylinderX = Math.min(minCylinderX, x - cylinderRx);
      maxCylinderX = Math.max(maxCylinderX, x + cylinderRx);
    }

    const relativeCylindersCenterX = (minCylinderX + maxCylinderX) / 2;
    const firstCylinderRelativeX = tempCylinderStart;

    leftItemAlignedX = 0;
    const leftLineEndX = leftItemAlignedX + itemBounds.width + gapFromCylinder;
    const firstCylinderLeftEdge = leftLineEndX + firstDecorationWidth;
    const requiredFirstCylinderX = firstCylinderLeftEdge + cylinderRx;

    cylinderAreaStartX = requiredFirstCylinderX;
    cylindersCenterX =
      cylinderAreaStartX - firstCylinderRelativeX + relativeCylindersCenterX;

    const firstItemCenterX = leftItemAlignedX + itemBounds.width / 2;
    const distanceToCenter = cylindersCenterX - firstItemCenterX;
    const rightItemCenterX = cylindersCenterX + distanceToCenter;
    rightItemAlignedX = rightItemCenterX - itemBounds.width / 2;
  }

  return {
    canvasHeight,
    startY,
    leftItemAlignedX,
    rightItemAlignedX,
    cylinderAreaStartX,
  };
};

const calculateCylinderPosition = (
  index: number,
  cylinderRx: number,
  baseHeight: number,
  heightIncrement: number,
  planeStepY: number,
  startY: number,
  cylinderAreaStartX: number,
): CylinderPosition => {
  const isLeft = index % 2 === 0;
  const pairIndex = Math.floor(index / 2);
  const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
  const lateralOffset = calculateLateralOffset(isLeft, pairIndex, cylinderRx);

  const x = cylinderAreaStartX + lateralOffset + depthOffset;
  const bottomY = startY - index * planeStepY;
  const height = baseHeight + index * heightIncrement;
  const topY = bottomY - height;

  return { x, y: topY, height, bottomY, topY };
};

const calculateItemPosition = (
  index: number,
  cylinderPos: CylinderPosition,
  itemBounds: { width: number; height: number },
  cylinderRx: number,
  leftItemAlignedX: number,
  rightItemAlignedX: number,
  itemVerticalAlign: 'top' | 'center' | 'bottom',
  itemVerticalOffset: number,
  gapFromCylinder: number,
): {
  itemPos: ItemPosition;
  lineStartX: number;
  lineEndX: number;
  lineY: number;
} => {
  const isLeft = index % 2 === 0;
  const lineY = cylinderPos.topY + cylinderPos.height * 0.05;

  let itemX: number;
  let lineEndX: number;

  if (isLeft) {
    itemX = leftItemAlignedX;
    lineEndX = itemX + itemBounds.width + gapFromCylinder;
  } else {
    itemX = rightItemAlignedX;
    lineEndX = itemX - gapFromCylinder;
  }

  let itemY: number;
  if (itemVerticalAlign === 'top') {
    itemY = lineY;
  } else if (itemVerticalAlign === 'bottom') {
    itemY = lineY - itemBounds.height;
  } else {
    itemY = lineY - itemBounds.height / 2;
  }
  itemY += itemVerticalOffset;

  const cylinderEdgeX = isLeft
    ? cylinderPos.x - cylinderRx
    : cylinderPos.x + cylinderRx;
  const lineStartX = isLeft
    ? cylinderEdgeX - gapFromCylinder
    : cylinderEdgeX + gapFromCylinder;

  return { itemPos: { x: itemX, y: itemY }, lineStartX, lineEndX, lineY };
};

const createGradientDefs = (index: number, color: string): JSXElement[] => {
  const baseColor = tinycolor(color);
  const defs: JSXElement[] = [];

  defs.push(
    <linearGradient
      id={`cylinderGradient${index}`}
      x1="0%"
      y1="0%"
      x2="0%"
      y2="100%"
    >
      <stop offset="0%" stopColor={baseColor.toRgbString()} stopOpacity={0.7} />
      <stop
        offset="40%"
        stopColor={baseColor.clone().lighten(5).toRgbString()}
        stopOpacity={0.65}
      />
      <stop
        offset="70%"
        stopColor={baseColor.clone().lighten(15).toRgbString()}
        stopOpacity={0.6}
      />
      <stop
        offset="100%"
        stopColor={baseColor.clone().lighten(20).toRgbString()}
        stopOpacity={0.55}
      />
    </linearGradient>,
  );

  defs.push(
    <linearGradient
      id={`topGradient${index}`}
      x1="0%"
      y1="0%"
      x2="0%"
      y2="100%"
    >
      <stop
        offset="0%"
        stopColor={baseColor.clone().lighten(15).toRgbString()}
        stopOpacity={1}
      />
      <stop offset="100%" stopColor="#fafafa" stopOpacity={1} />
    </linearGradient>,
  );

  defs.push(
    <linearGradient
      id={`bottomGradient${index}`}
      x1="0%"
      y1="0%"
      x2="0%"
      y2="100%"
    >
      <stop
        offset="0%"
        stopColor={baseColor.clone().darken(8).toRgbString()}
        stopOpacity={0.75}
      />
      <stop
        offset="50%"
        stopColor={baseColor.clone().darken(5).toRgbString()}
        stopOpacity={0.7}
      />
      <stop
        offset="100%"
        stopColor={baseColor.clone().darken(12).toRgbString()}
        stopOpacity={0.65}
      />
    </linearGradient>,
  );

  defs.push(
    <linearGradient
      id={`numberGradient${index}`}
      x1="0%"
      y1="0%"
      x2="100%"
      y2="100%"
    >
      <stop
        offset="0%"
        stopColor={baseColor.clone().darken(0).toRgbString()}
        stopOpacity={0.9}
      />
      <stop
        offset="50%"
        stopColor={baseColor.clone().lighten(5).toRgbString()}
        stopOpacity={0.85}
      />
      <stop
        offset="100%"
        stopColor={baseColor.clone().lighten(10).toRgbString()}
        stopOpacity={0.8}
      />
    </linearGradient>,
  );

  defs.push(
    <linearGradient
      id={`glowGradient${index}`}
      x1="0%"
      y1="100%"
      x2="0%"
      y2="0%"
    >
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.2} />
      <stop offset="90%" stopColor="#FFFFFF" stopOpacity={0} />
    </linearGradient>,
  );

  return defs;
};

const createCylinderElements = (
  index: number,
  cylinderPos: CylinderPosition,
  cylinderRx: number,
  cylinderRy: number,
): JSXElement[] => {
  const { x, topY, bottomY } = cylinderPos;
  const elements: JSXElement[] = [];

  elements.push(
    <ellipse
      id={`cylinder-bottom-${index}`}
      cx={x}
      cy={bottomY}
      rx={cylinderRx}
      ry={cylinderRy}
      fill={`url(#bottomGradient${index})`}
      opacity={0.7}
    />,
  );

  elements.push(
    <Path
      id={`cylinder-body-${index}`}
      d={`
        M ${x - cylinderRx} ${topY}
        A ${cylinderRx} ${cylinderRy} 0 0 0 ${x} ${topY + cylinderRy}
        A ${cylinderRx} ${cylinderRy} 0 0 0 ${x + cylinderRx} ${topY}
        L ${x + cylinderRx} ${bottomY}
        A ${cylinderRx} ${cylinderRy} 0 0 1 ${x} ${bottomY + cylinderRy}
        A ${cylinderRx} ${cylinderRy} 0 0 1 ${x - cylinderRx} ${bottomY}
        Z
      `}
      fill={`url(#cylinderGradient${index})`}
      stroke="none"
    />,
  );

  elements.push(
    <Rect
      id={`cylinder-glow-${index}`}
      x={x - cylinderRx}
      y={topY - cylinderRy * 3}
      width={cylinderRx * 2}
      height={cylinderRy * 3}
      fill={`url(#glowGradient${index})`}
    />,
  );

  elements.push(
    <ellipse
      id={`cylinder-top-${index}`}
      cx={x}
      cy={topY}
      rx={cylinderRx}
      ry={cylinderRy}
      fill={`url(#topGradient${index})`}
    />,
  );

  const numberX = x;
  const numberY = topY + 2;
  const scaleY = 0.6;
  const skewX = -0.6;
  const transformValue = `translate(${numberX}, ${numberY}) matrix(1, 0, ${skewX}, ${scaleY}, 0, 0) translate(${-numberX}, ${-numberY})`;

  elements.push(
    <Text
      id={`cylinder-number-${index}`}
      x={numberX}
      y={numberY}
      fontFamily="Arial Black, sans-serif"
      fontSize={32}
      fontWeight={900}
      fill={`url(#numberGradient${index})`}
      alignHorizontal="center"
      alignVertical="middle"
      transform={transformValue}
    >
      {index + 1}
    </Text>,
  );

  return elements;
};

const createDecorationElements = (
  index: number,
  lineStartX: number,
  lineEndX: number,
  lineY: number,
  color: string,
): JSXElement[] => {
  const dotRadius = 2;
  const elements: JSXElement[] = [];

  elements.push(
    <circle
      id={`decoration-dot-start-${index}`}
      cx={lineStartX}
      cy={lineY}
      r={dotRadius}
      fill={color}
    />,
  );

  elements.push(
    <line
      id={`decoration-line-${index}`}
      x1={lineStartX}
      y1={lineY}
      x2={lineEndX}
      y2={lineY}
      stroke={color}
      strokeWidth={1}
      opacity={0.8}
    />,
  );

  elements.push(
    <circle
      id={`decoration-dot-end-${index}`}
      cx={lineEndX}
      cy={lineY}
      r={dotRadius}
      fill={color}
      opacity={0.9}
    />,
  );

  return elements;
};

const createBasePlate = (
  itemsCount: number,
  cylinderRx: number,
  cylinderAreaStartX: number,
  startY: number,
  planeStepY: number,
): JSXElement | null => {
  if (itemsCount === 0) return null;

  const positions: Array<{ x: number; y: number }> = [];

  for (let index = 0; index < itemsCount; index++) {
    const isLeft = index % 2 === 0;
    const pairIndex = Math.floor(index / 2);
    const depthOffset = calculateDepthOffset(pairIndex, cylinderRx);
    const lateralOffset = calculateLateralOffset(isLeft, pairIndex, cylinderRx);
    const x = cylinderAreaStartX + lateralOffset + depthOffset;
    const bottomY = startY - index * planeStepY;
    positions.push({ x, y: bottomY });
  }

  const leftmostPos = positions[0];
  const rightmostPos = positions[positions.length - 1];

  // 底板的厚度
  const plateThickness = 6;
  const plateMargin = itemsCount > 5 ? itemsCount * 16 : 100;

  const frontLeftX = leftmostPos.x - cylinderRx - plateMargin;
  const frontRightX = leftmostPos.x + cylinderRx + plateMargin;
  const frontY = leftmostPos.y + plateThickness + plateMargin / 6;

  const backLeftX = rightmostPos.x - cylinderRx - plateMargin;
  const backRightX = rightmostPos.x + cylinderRx + plateMargin;
  const backY = rightmostPos.y + plateThickness - plateMargin / 6;

  const platePath = `
    M ${frontLeftX} ${frontY}
    L ${frontRightX} ${frontY}
    L ${backRightX} ${backY}
    L ${backLeftX} ${backY}
    Z
  `;

  const sidePath = `
    M ${frontRightX} ${frontY}
    L ${frontRightX} ${frontY + plateThickness}
    L ${backRightX} ${backY + plateThickness}
    L ${backRightX} ${backY}
    Z
  `;

  const frontPath = `
    M ${frontLeftX} ${frontY}
    L ${frontRightX} ${frontY}
    L ${frontRightX} ${frontY + plateThickness}
    L ${frontLeftX} ${frontY + plateThickness}
    Z
  `;

  const plateGradients = (
    <>
      {/* 顶面渐变 */}
      <linearGradient
        id="basePlateTopGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#fafafa" stopOpacity={1} />
        <stop offset="50%" stopColor="#ffffff" stopOpacity={0.98} />
        <stop offset="100%" stopColor="#ececec" stopOpacity={0.95} />
      </linearGradient>

      {/* 前面渐变 */}
      <linearGradient
        id="basePlateFrontGradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#e0e0e0" stopOpacity={0.95} />
        <stop offset="50%" stopColor="#d2d2d2" stopOpacity={0.93} />
        <stop offset="100%" stopColor="#c5c5c5" stopOpacity={0.9} />
      </linearGradient>

      {/* 侧面渐变 */}
      <linearGradient
        id="basePlateSideGradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#b8b8b8" stopOpacity={0.92} />
        <stop offset="50%" stopColor="#c0c0c0" stopOpacity={0.88} />
        <stop offset="100%" stopColor="#adadad" stopOpacity={0.85} />
      </linearGradient>
    </>
  );

  return (
    <Group>
      <Defs>{plateGradients}</Defs>
      <Path
        id="base-plate-front"
        d={frontPath}
        fill="url(#basePlateFrontGradient)"
        stroke="#c5c5c5"
        strokeWidth={0.3}
        opacity={0.92}
      />
      <Path
        id="base-plate-side"
        d={sidePath}
        fill="url(#basePlateSideGradient)"
        stroke="#aaaaaa"
        strokeWidth={0.3}
        opacity={0.88}
      />
      <Path
        id="base-plate-top"
        d={platePath}
        fill="url(#basePlateTopGradient)"
        stroke="#e5e5e5"
        strokeWidth={0.5}
        opacity={0.93}
      />
    </Group>
  );
};

export const sequenceCylinders3d: ComponentType<sequenceCylinders3dProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    options,
    cylinderRx = 28,
    cylinderRy = 18,
    baseHeight = 120,
    heightIncrement = 40,
    depthSpacing = 60,
    itemVerticalAlign = 'top',
    itemVerticalOffset = -12,
    firstDecorationWidth = 90,
  } = props;

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  const colorPrimary = getColorPrimary(options);
  const gapFromCylinder = 10;

  const planeStepY = Math.max(6, depthSpacing * 0.15);
  const layoutMetrics = calculateLayoutMetrics(
    items.length,
    itemBounds,
    cylinderRx,
    baseHeight,
    heightIncrement,
    depthSpacing,
    firstDecorationWidth,
    gapFromCylinder,
  );

  const { startY, leftItemAlignedX, rightItemAlignedX, cylinderAreaStartX } =
    layoutMetrics;

  const defsElements: JSXElement[] = [];
  const perItemGroups: Array<{
    cylinderNodes: JSXElement[];
    itemNode: JSXElement;
    btnNodes: JSXElement[];
    itemX: number;
    itemY: number;
  }> = [];

  items.forEach((item, index) => {
    const color = getPaletteColor(options, [index]) || colorPrimary;
    defsElements.push(...createGradientDefs(index, color));

    const cylinderPos = calculateCylinderPosition(
      index,
      cylinderRx,
      baseHeight,
      heightIncrement,
      planeStepY,
      startY,
      cylinderAreaStartX,
    );

    const cylinderNodes = createCylinderElements(
      index,
      cylinderPos,
      cylinderRx,
      cylinderRy,
    );

    const { itemPos, lineStartX, lineEndX, lineY } = calculateItemPosition(
      index,
      cylinderPos,
      itemBounds,
      cylinderRx,
      leftItemAlignedX,
      rightItemAlignedX,
      itemVerticalAlign,
      itemVerticalOffset,
      gapFromCylinder,
    );

    const decorationNodes = createDecorationElements(
      index,
      lineStartX,
      lineEndX,
      lineY,
      color,
    );

    cylinderNodes.push(...decorationNodes);

    const itemNode = (
      <Item
        indexes={[index]}
        datum={item}
        data={data}
        x={itemPos.x}
        y={itemPos.y}
        positionH={index % 2 === 0 ? 'flipped' : 'normal'}
      />
    );

    const btnNodes: JSXElement[] = [
      <BtnRemove
        indexes={[index]}
        x={itemPos.x + itemBounds.width / 2 - btnBounds.width / 2}
        y={itemPos.y + itemBounds.height + 10}
      />,
      <BtnAdd
        indexes={[index]}
        x={itemPos.x + itemBounds.width / 2 - btnBounds.width / 2}
        y={itemPos.y - btnBounds.height - 10}
      />,
    ];

    perItemGroups[index] = {
      cylinderNodes,
      itemNode,
      btnNodes,
      itemX: itemPos.x,
      itemY: itemPos.y,
    };
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  perItemGroups.forEach((group) => {
    const { itemX, itemY } = group;
    minX = Math.min(minX, itemX);
    minY = Math.min(minY, itemY);
    maxX = Math.max(maxX, itemX + itemBounds.width);
    maxY = Math.max(maxY, itemY + itemBounds.height);
  });

  const itemsBoundsWidth = maxX - minX;
  const itemsBoundsHeight = maxY - minY;

  const itemElements: JSXElement[] = [<Defs>{defsElements}</Defs>];
  const btnElements: JSXElement[] = [];

  // 添加底板
  const basePlate = createBasePlate(
    items.length,
    cylinderRx,
    cylinderAreaStartX,
    startY,
    planeStepY,
  );
  if (basePlate) {
    itemElements.push(basePlate);
  }

  for (let i = items.length - 1; i >= 0; i--) {
    const g = perItemGroups[i];
    if (!g) continue;
    itemElements.push(
      <Group>
        <Group>{g.cylinderNodes}</Group>
        {g.itemNode}
      </Group>,
    );
    btnElements.push(...g.btnNodes);
  }

  if (items.length > 0) {
    const isNextLeft = items.length % 2 === 0;
    const nextPairIndex = Math.floor(items.length / 2);
    const nextDepthOffset = calculateDepthOffset(nextPairIndex, cylinderRx);
    const nextLateralOffset = calculateLateralOffset(
      isNextLeft,
      nextPairIndex,
      cylinderRx,
    );
    const nextX = cylinderAreaStartX + nextLateralOffset + nextDepthOffset;
    const nextY = startY - items.length * planeStepY;

    btnElements.push(
      <BtnAdd indexes={[items.length]} x={nextX} y={nextY - 100} />,
    );
  }

  return (
    <FlexLayout
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={itemsBoundsWidth} height={itemsBoundsHeight}>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-cylinders-3d', {
  component: sequenceCylinders3d,
  composites: ['title', 'item'],
});
