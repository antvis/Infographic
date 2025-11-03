/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  Defs,
  getElementBounds,
  Group,
  Path,
  Rect,
  Text,
} from '@antv/infographic-jsx';
import tinycolor from 'tinycolor2';
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
  decorationWidth?: number;
}

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
    decorationWidth = 80,
  } = props;

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} positionH="center" />,
  );
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];
  const defsElements: JSXElement[] = [];

  const colorPrimary = getColorPrimary(options);

  // 计算深度偏移的辅助函数
  const calculateDepthOffset = (pairIndex: number): number => {
    if (pairIndex === 0) return 0;
    if (pairIndex === 1) return cylinderRx / 2;
    return cylinderRx / 2 + (pairIndex - 1) * ((cylinderRx / 2) * 3);
  };

  // 计算横向偏移的辅助函数
  const calculateLateralOffset = (
    isLeft: boolean,
    pairIndex: number,
  ): number => {
    if (isLeft) return 0;
    const firstPairGap = 2;
    const normalGap = cylinderRx;
    const gap = pairIndex === 0 ? firstPairGap : normalGap;
    return cylinderRx * 2 + gap;
  };

  // 动态计算画布高度
  const planeStepY = Math.max(6, depthSpacing * 0.15);
  const lastCylinderHeight = baseHeight + (items.length - 1) * heightIncrement;
  const totalPlaneOffset = items.length * planeStepY;
  const bottomMargin = 100;
  const topMargin = 50;
  const canvasHeight =
    lastCylinderHeight + totalPlaneOffset + bottomMargin + topMargin;

  const startY = canvasHeight - bottomMargin;

  // 垂直对齐模式：预先计算布局参数
  let leftItemAlignedX = 0;
  let rightItemAlignedX = 0;
  let cylindersCenterX = 0;
  let cylinderAreaStartX = 0;

  const gapFromCylinder = 10; // 离圆柱体的距离

  if (items.length > 0) {
    // 先假设柱体从临时位置开始，计算柱体的相对范围
    const tempCylinderStart = 0;
    let minCylinderX = Infinity;
    let maxCylinderX = -Infinity;

    items.forEach((_, index) => {
      const isLeft = index % 2 === 0;
      const pairIndex = Math.floor(index / 2);
      const depthOffset = calculateDepthOffset(pairIndex);
      const lateralOffset = calculateLateralOffset(isLeft, pairIndex);
      const x = tempCylinderStart + lateralOffset + depthOffset;

      minCylinderX = Math.min(minCylinderX, x - cylinderRx);
      maxCylinderX = Math.max(maxCylinderX, x + cylinderRx);
    });

    // 柱体整体的相对中轴线
    const relativeCylindersCenterX = (minCylinderX + maxCylinderX) / 2;

    // 第一个数据项（左侧）需要的装饰线长度
    const firstCylinderRelativeX = tempCylinderStart;

    // 左侧 items 从 x=itemBounds.width 开始（整体向右移动）
    leftItemAlignedX = 0;

    // 左侧装饰线终点应该在 item 的右边缘
    const leftLineEndX = leftItemAlignedX + itemBounds.width + gapFromCylinder;

    // 第一个柱体左边缘需要在装饰线起点右侧
    const firstCylinderLeftEdge = leftLineEndX + decorationWidth;
    const requiredFirstCylinderX = firstCylinderLeftEdge + cylinderRx;

    // 调整柱体区域起点，使第一个柱体处于正确位置
    cylinderAreaStartX = requiredFirstCylinderX;

    // 重新计算实际的柱体中轴线
    cylindersCenterX =
      cylinderAreaStartX - firstCylinderRelativeX + relativeCylindersCenterX;

    // 计算第一个数据项的 item 中心到柱体中轴线的距离
    const firstItemCenterX = leftItemAlignedX + itemBounds.width / 2;
    const distanceToCenter = cylindersCenterX - firstItemCenterX;

    // 右侧 items 对称到中轴线另一侧（item 中心对称）
    const rightItemCenterX = cylindersCenterX + distanceToCenter;
    rightItemAlignedX = rightItemCenterX - itemBounds.width / 2;
  }

  // 生成渐变定义
  items.forEach((_, index) => {
    const color = getPaletteColor(options, [index]) || colorPrimary;
    const baseColor = tinycolor(color);

    // 主体渐变
    defsElements.push(
      <linearGradient
        id={`cylinderGradient${index}`}
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop
          offset="0%"
          stopColor={baseColor.toRgbString()}
          stopOpacity={0.7}
        />
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

    // 顶部渐变
    defsElements.push(
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

    // 数字渐变 - 融入柱体顶面
    defsElements.push(
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

    // 散射光渐变 - 白色径向渐变，从中心向外逐渐透明
    defsElements.push(
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
  });

  const perItemGroups: Array<{
    cylinderNodes: JSXElement[];
    itemNode: JSXElement;
    btnNodes: JSXElement[];
    itemX: number;
    itemY: number;
  }> = [];

  items.forEach((item, index) => {
    const isLeft = index % 2 === 0;
    const pairIndex = Math.floor(index / 2);

    // 计算柱体位置（相对于柱体区域起点）
    const depthOffset = calculateDepthOffset(pairIndex);
    const lateralOffset = calculateLateralOffset(isLeft, pairIndex);
    const cylinderX = cylinderAreaStartX + lateralOffset + depthOffset;
    const cylinderBottomY = startY - index * planeStepY;
    const cylinderHeight = baseHeight + index * heightIncrement;
    const topY = cylinderBottomY - cylinderHeight;

    const cylinderNodes: JSXElement[] = [];

    // 柱体主体路径
    cylinderNodes.push(
      <Path
        id={`cylinder-body-${index}`}
        d={`
          M ${cylinderX - cylinderRx} ${topY}
          A ${cylinderRx} ${cylinderRy} 0 0 0 ${cylinderX} ${topY + cylinderRy}
          A ${cylinderRx} ${cylinderRy} 0 0 0 ${cylinderX + cylinderRx} ${topY}
          L ${cylinderX + cylinderRx} ${cylinderBottomY}
          A ${cylinderRx} ${cylinderRy} 0 0 1 ${cylinderX} ${cylinderBottomY + cylinderRy * 0.6}
          A ${cylinderRx} ${cylinderRy} 0 0 1 ${cylinderX - cylinderRx} ${cylinderBottomY}
          Z
        `}
        fill={`url(#cylinderGradient${index})`}
        stroke="none"
      />,
    );

    // 散射光 - 白色光晕效果
    cylinderNodes.push(
      <Rect
        id={`cylinder-glow-${index}`}
        x={cylinderX - cylinderRx}
        y={topY - cylinderRy * 3}
        width={cylinderRx * 2}
        height={cylinderRy * 3}
        fill={`url(#glowGradient${index})`}
      />,
    );

    // 顶部椭圆
    cylinderNodes.push(
      <ellipse
        id={`cylinder-top-${index}`}
        cx={cylinderX}
        cy={topY}
        rx={cylinderRx}
        ry={cylinderRy}
        fill={`url(#topGradient${index})`}
      />,
    );

    const numberX = cylinderX;
    const numberY = topY + 2;
    const scaleY = 0.6; // Y方向压缩，模拟俯视角度
    const skewX = -0.6; // 不倾斜，保持字形
    const transformValue = `translate(${numberX}, ${numberY}) matrix(1, 0, ${skewX}, ${scaleY}, 0, 0) translate(${-numberX}, ${-numberY})`;

    cylinderNodes.push(
      <Text
        id={`cylinder-number-${index}`}
        x={numberX}
        y={numberY}
        fontFamily="Arial Black, sans-serif"
        fontSize={32}
        fontWeight={900}
        fill={`url(#numberGradient${index})`}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={transformValue}
      >
        {index + 1}
      </Text>,
    );

    // 装饰线和圆点 - 连接柱体和Item
    const lineY = topY + cylinderHeight * 0.05;
    const cylinderEdgeX = isLeft
      ? cylinderX - cylinderRx
      : cylinderX + cylinderRx;
    const gapFromCylinder = 10; // 离圆柱体的距离
    const lineStartX = isLeft
      ? cylinderEdgeX - gapFromCylinder
      : cylinderEdgeX + gapFromCylinder;

    // Item 定位
    let itemX: number;
    let lineEndX: number;

    // 使用垂直对齐模式的预先计算好的对齐位置
    if (isLeft) {
      itemX = leftItemAlignedX;
      // 装饰线终点在 item 的右边缘
      lineEndX = itemX + itemBounds.width + gapFromCylinder;
    } else {
      itemX = rightItemAlignedX;
      // 装饰线终点在 item 的左边缘
      lineEndX = itemX - gapFromCylinder;
    }

    const dotRadius = 2;
    const color = getPaletteColor(options, [index]) || colorPrimary;

    // 起点圆点（离柱体有一定距离）
    cylinderNodes.push(
      <circle
        id={`decoration-dot-start-${index}`}
        cx={lineStartX}
        cy={lineY}
        r={dotRadius}
        fill={color}
      />,
    );

    // 装饰线
    cylinderNodes.push(
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

    // 终点圆点（统一对齐）
    cylinderNodes.push(
      <circle
        id={`decoration-dot-end-${index}`}
        cx={lineEndX}
        cy={lineY}
        r={dotRadius}
        fill={color}
        opacity={0.9}
      />,
    );

    // Item 定位在装饰线的终点处
    // 根据 itemVerticalAlign 计算 Item 的垂直位置，然后应用 itemVerticalOffset
    let itemY: number;

    // 每个 item 跟随各自柱体的位置
    if (itemVerticalAlign === 'top') {
      itemY = lineY; // 顶部对齐装饰线
    } else if (itemVerticalAlign === 'bottom') {
      itemY = lineY - itemBounds.height; // 底部对齐装饰线
    } else {
      itemY = lineY - itemBounds.height / 2; // 垂直居中对齐装饰线（默认）
    }

    // 应用额外的垂直偏移
    itemY += itemVerticalOffset;

    const itemNode = (
      <Item
        indexes={[index]}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH="center"
      />
    );

    const btnNodes: JSXElement[] = [
      <BtnRemove
        indexes={[index]}
        x={itemX + itemBounds.width / 2 - btnBounds.width / 2}
        y={itemY + itemBounds.height + 10}
      />,
      <BtnAdd
        indexes={[index]}
        x={itemX + itemBounds.width / 2 - btnBounds.width / 2}
        y={itemY - btnBounds.height - 10}
      />,
    ];

    perItemGroups[index] = {
      cylinderNodes,
      itemNode,
      btnNodes,
      itemX,
      itemY,
    };
  });

  // 计算所有items的整体bounds
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

  itemElements.push(<Defs>{defsElements}</Defs>);
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

  // // 添加3D底座平台
  // (() => {
  //   // 计算所有柱体的x坐标范围
  //   let minX = Infinity;
  //   let maxX = -Infinity;

  //   items.forEach((_, index) => {
  //     const isLeft = index % 2 === 0;
  //     const pairIndex = Math.floor(index / 2);
  //     const depthOffset = calculateDepthOffset(pairIndex);
  //     const lateralOffset = calculateLateralOffset(isLeft, pairIndex);
  //     const x = offsetX + lateralOffset + depthOffset;

  //     minX = Math.min(minX, x - cylinderRx);
  //     maxX = Math.max(maxX, x + cylinderRx);
  //   });

  //   // 添加边距
  //   const margin = 40;
  //   const leftFront = { x: minX - margin, y: startY + 20 };
  //   const rightFront = { x: maxX + margin, y: startY + 20 };
  //   const rightBack = {
  //     x: maxX + margin,
  //     y: startY - items.length * planeStepY - 40,
  //   };
  //   const leftBack = {
  //     x: minX - margin,
  //     y: startY - items.length * planeStepY - 40,
  //   };

  //   // 底座厚度
  //   const thickness = 1.5;
  //   const leftFrontBottom = {
  //     x: leftFront.x - thickness * 0.3,
  //     y: leftFront.y + thickness,
  //   };
  //   const rightFrontBottom = {
  //     x: rightFront.x + thickness * 0.3,
  //     y: rightFront.y + thickness,
  //   };
  //   const rightBackBottom = {
  //     x: rightBack.x + thickness * 0.3,
  //     y: rightBack.y + thickness * 0.7,
  //   };
  //   const leftBackBottom = {
  //     x: leftBack.x - thickness * 0.3,
  //     y: leftBack.y + thickness * 0.7,
  //   };

  //   // 顶面 - 主平台
  //   decoElements.push(
  //     <Path
  //       id="platform-top"
  //       d={`
  //         M ${leftFront.x} ${leftFront.y}
  //         L ${rightFront.x} ${rightFront.y}
  //         L ${rightBack.x} ${rightBack.y}
  //         L ${leftBack.x} ${leftBack.y}
  //         Z
  //       `}
  //       fill="#A78BFA"
  //       opacity={0.85}
  //     />,
  //   );

  //   // 右侧面
  //   decoElements.push(
  //     <Path
  //       id="platform-right-side"
  //       d={`
  //         M ${rightFront.x} ${rightFront.y}
  //         L ${rightFrontBottom.x} ${rightFrontBottom.y}
  //         L ${rightBackBottom.x} ${rightBackBottom.y}
  //         L ${rightBack.x} ${rightBack.y}
  //         Z
  //       `}
  //       fill="#7C3AED"
  //       opacity={0.9}
  //     />,
  //   );

  //   // 前侧面
  //   decoElements.push(
  //     <Path
  //       id="platform-front-side"
  //       d={`
  //         M ${leftFront.x} ${leftFront.y}
  //         L ${leftFrontBottom.x} ${leftFrontBottom.y}
  //         L ${rightFrontBottom.x} ${rightFrontBottom.y}
  //         L ${rightFront.x} ${rightFront.y}
  //         Z
  //       `}
  //       fill="#8B5CF6"
  //       opacity={0.88}
  //     />,
  //   );

  //   // 左侧面
  //   decoElements.push(
  //     <Path
  //       id="platform-left-side"
  //       d={`
  //         M ${leftFront.x} ${leftFront.y}
  //         L ${leftFrontBottom.x} ${leftFrontBottom.y}
  //         L ${leftBackBottom.x} ${leftBackBottom.y}
  //         L ${leftBack.x} ${leftBack.y}
  //         Z
  //       `}
  //       fill="#6D28D9"
  //       opacity={0.7}
  //     />,
  //   );
  // })();

  // 最后一个添加按钮
  if (items.length > 0) {
    const isNextLeft = items.length % 2 === 0;
    const nextPairIndex = Math.floor(items.length / 2);

    // 计算下一个圆柱体的深度偏移
    let nextDepthOffset = 0;
    if (isNextLeft) {
      if (nextPairIndex === 0) {
        nextDepthOffset = 0;
      } else if (nextPairIndex === 1) {
        nextDepthOffset = cylinderRx / 2;
      } else {
        nextDepthOffset =
          cylinderRx / 2 + (nextPairIndex - 1) * ((cylinderRx / 2) * 3);
      }
    } else {
      // 右侧跟随左侧
      const correspondingLeftPairIndex = nextPairIndex;
      if (correspondingLeftPairIndex === 0) {
        nextDepthOffset = 0;
      } else if (correspondingLeftPairIndex === 1) {
        nextDepthOffset = cylinderRx / 2;
      } else {
        nextDepthOffset =
          cylinderRx / 2 +
          (correspondingLeftPairIndex - 1) * ((cylinderRx / 2) * 3);
      }
    }

    // 计算横向偏移
    const firstPairGap = -cylinderRx / 3;
    const normalGap = cylinderRx / 8;
    let nextLateralOffset = 0;
    if (!isNextLeft) {
      if (nextPairIndex === 0) {
        nextLateralOffset = cylinderRx * 2 + firstPairGap;
      } else {
        nextLateralOffset = cylinderRx * 2 + normalGap;
      }
    }

    // 下一个柱体的位置
    const nextX = cylinderAreaStartX + nextLateralOffset + nextDepthOffset;

    // 下一个柱体在同一倾斜平面上的 Y
    const nextPlaneStepY = Math.max(6, depthSpacing * 0.15);
    const nextY = startY - items.length * nextPlaneStepY;

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
});
