/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Path,
} from '@antv/infographic-jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemIcon,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getColorPrimary, getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

// W 型路径参数
const DX = 240;
const DY = 130;
const ITEM_TO_PATH_GAP = 105;
// W 型路径宽度
const W_PATH_W = 12;
// 光晕尺寸 (Ellipse W/H)
const GLOW_W = 120; // 椭圆宽度 (水平对角线)
const GLOW_H = 50; // 椭圆高度 (垂直对角线)
const GLOW_OPACITY = 0.6; // 控制光晕的透明度，实现颜色调淡
// 原始装饰性 Path 的 D 属性
const DECO_PATH_1 =
  'M132.821 50.6599L87.6795 76.8925C78.0629 82.4807 62.4238 82.4807 52.7445 76.8925L7.30824 50.6599C2.43719 47.8482 0.00459679 44.1562 0.0152907 40.472L3.17695e-05 45.6925C-0.0101404 49.378 2.42245 53.0686 7.29298 55.8803L52.7289 82.1129C62.4094 87.7011 78.0485 87.7011 87.6652 82.1129L132.806 55.8803C137.583 53.1038 139.975 49.4705 139.986 45.832L140 40.6116C139.989 44.2501 137.598 47.8834 132.821 50.6599Z';
const DECO_PATH_2 =
  'M132.707 30.4224C142.386 36.0119 142.437 45.0704 132.821 50.6599L87.6795 76.8925C78.0629 82.4807 62.4238 82.4807 52.7445 76.8925L7.30825 50.6599C-2.37126 45.0717 -2.42225 36.0132 7.19414 30.4237L52.335 4.19115C61.9517 -1.39705 77.5908 -1.39705 87.2713 4.19115L132.707 30.4224Z';

// 装饰元素的偏移量 - 改为正值
const DECO_OFFSET_X = 70 + W_PATH_W / 2;
const DECO_OFFSET_Y = 40 + W_PATH_W / 2;

export interface SequenceZigzagStepsProps extends BaseStructureProps {
  dx?: number;
  dy?: number;
  iconSize?: number;
}

// 滤镜定义
const GlowFilter = (
  <filter
    id="sequence-zigzag-glow-filter"
    x="-50%"
    y="-50%"
    width="200%"
    height="200%"
  >
    <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
  </filter>
);

export const SequenceZigzagSteps: ComponentType<SequenceZigzagStepsProps> = (
  props,
) => {
  const { Title, Item, data, options, dx = DX, dy = DY, iconSize = 30 } = props;
  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const colorPrimary = getColorPrimary(options);

  if (items.length === 0) {
    const btnAddElement = <BtnAdd indexes={[0]} x={0} y={0} />;
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Defs>{GlowFilter}</Defs>
        {titleContent}
        <Group>
          <BtnsGroup>{btnAddElement}</BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const pathElements: JSXElement[] = [];
  const decoElements: JSXElement[] = [];
  const iconElements: JSXElement[] = [];

  let currentX = 0;
  let currentY = 0;
  let pathD = '';
  let minPathY = Infinity;
  let maxItemY = -Infinity;
  let minDecoX = Infinity;
  let minDecoY = Infinity;

  const pathPoints: Array<{ x: number; y: number }> = [];

  // Pass 1: 计算路径点和装饰元素的边界
  items.forEach((item, index) => {
    const cx = currentX;
    const cy = currentY;

    pathPoints.push({ x: cx, y: cy });
    minPathY = Math.min(minPathY, cy);

    // 计算装饰元素的位置
    const decoX = cx - DECO_OFFSET_X;
    const decoY = cy - DECO_OFFSET_Y;

    minDecoX = Math.min(minDecoX, decoX);
    minDecoY = Math.min(minDecoY, decoY);

    const isPeak = index % 2 === 0;

    if (index < items.length - 1) {
      currentX += dx;
      currentY = isPeak ? currentY + dy : currentY - dy;
    }
  });

  // 计算偏移量以确保所有元素都在正坐标
  const offsetX = Math.max(0, -minDecoX);
  const offsetY = Math.max(0, -minDecoY);

  currentX = 0;
  currentY = 0;

  // Pass 2: 放置元素，应用偏移量
  items.forEach((item, index) => {
    const indexes = [index];
    const pathPoint = pathPoints[index];
    const cx = pathPoint.x + offsetX;
    const cy = pathPoint.y + offsetY;

    const currentColor = getPaletteColor(options, indexes);

    // 装饰元素 - 确保坐标为正值
    const decoX = Math.max(0, cx - DECO_OFFSET_X);
    const decoY = Math.max(0, cy - DECO_OFFSET_Y);

    const glowX = 10;
    const glowY = GLOW_H + 10;
    const { colorPrimaryBg } = getThemeColors({
      colorPrimary: currentColor,
    });

    decoElements.push(
      <ShapesGroup x={decoX} y={decoY} width={140} height={110}>
        <Ellipse
          x={glowX}
          y={glowY}
          width={GLOW_W}
          height={GLOW_H}
          fill={currentColor || colorPrimary}
          filter="url(#sequence-zigzag-glow-filter)"
          opacity={GLOW_OPACITY}
        />
        <Path d={DECO_PATH_1} fill={currentColor || colorPrimary} />
        <Path d={DECO_PATH_2} fill={'#fff'} />
        <Path d={DECO_PATH_2} fill={colorPrimaryBg || colorPrimaryBg} />
      </ShapesGroup>,
    );

    // Icon 元素
    if (item.icon) {
      const iconX = Math.max(0, cx - iconSize / 2 - W_PATH_W / 2);
      const iconY = Math.max(0, cy - iconSize / 2 - W_PATH_W / 2);

      iconElements.push(
        <ItemIcon
          x={iconX}
          y={iconY}
          size={iconSize}
          indexes={indexes}
          fill={currentColor}
        />,
      );
    }

    // Item 元素和按钮
    const itemX = cx - itemBounds.width / 2 - W_PATH_W / 2;
    const itemY = Math.max(0, cy + ITEM_TO_PATH_GAP - W_PATH_W / 2);

    maxItemY = Math.max(maxItemY, itemY + itemBounds.height);

    if (index === 0) {
      pathD = `M ${cx} ${cy}`;
    } else {
      pathD += ` L ${cx} ${cy}`;
    }

    itemElements.push(
      <Item indexes={indexes} datum={item} data={data} x={itemX} y={itemY} />,
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={Math.max(0, itemX + itemBounds.width - btnBounds.width / 2)}
        y={Math.max(0, itemY + itemBounds.height - btnBounds.height / 2)}
      />,
    );

    if (index < items.length - 1) {
      const nextPoint = pathPoints[index + 1];
      const nextCx = nextPoint.x + offsetX;
      const nextCy = nextPoint.y + offsetY;
      const btnAddX = Math.max(0, cx + (nextCx - cx) / 2 - btnBounds.width / 2);
      const btnAddY = Math.max(
        0,
        cy + (nextCy - cy) / 2 - btnBounds.height / 2,
      );

      btnElements.push(
        <BtnAdd indexes={[index + 1]} x={btnAddX} y={btnAddY} />,
      );
    } else {
      btnElements.push(
        <BtnAdd
          indexes={[items.length]}
          x={Math.max(0, itemX + itemBounds.width + dx / 4)}
          y={Math.max(0, itemY + itemBounds.height / 2 - btnBounds.height / 2)}
        />,
      );
    }
  });

  if (pathD) {
    const finalX = (pathPoints[pathPoints.length - 1]?.x || 0) + offsetX;
    pathElements.push(
      <Path
        d={pathD}
        stroke="#f3f2f1"
        strokeWidth={W_PATH_W}
        fill="none"
        width={finalX}
        height={maxItemY - Math.min(minPathY + offsetY, 0)}
      />,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={30}
    >
      <Defs>{GlowFilter}</Defs>
      {titleContent}
      <Group x={0} y={0}>
        <Group>{[...pathElements, ...decoElements, ...iconElements]}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-zigzag-steps', {
  component: SequenceZigzagSteps,
  composites: ['title', 'item'],
});
