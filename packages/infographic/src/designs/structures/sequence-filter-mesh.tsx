/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  getElementBounds,
  Group,
  Path,
  Rect,
  Text,
} from '@antv/infographic-jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemsGroup,
  ShapesGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceFilterMeshProps extends BaseStructureProps {
  gap?: number;
}

// 常量配置
const SHAPE_CONFIG = {
  WIDTH: 160,
  HEIGHT: 260,
  ARROW_HEIGHT: 148,
  ARROW_WIDTH: 100,
  LINE_X: 100,
  RECT_X: 0,
  RECT_Y: 80,
  RECT_WIDTH: 100,
  RECT_HEIGHT: 130,
} as const;

const PARTICLE_CONFIG = {
  SIZE: 8,
  MAX_COUNT: 40,
  MIN_COUNT: 5,
  ARROW_RATIO: 0.6,
  MIN_ARROW_COUNT: 3,
} as const;

interface Particle {
  x: number;
  y: number;
  colorIndex: number;
}

interface ParticleGeneratorParams {
  count: number;
  rectX: number;
  rectY: number;
  rectWidth: number;
  rectHeight: number;
  seed: number;
}

/**
 * 生成伪随机数
 */
function pseudoRandom(seed: number, row: number, col: number): number {
  return (seed + row * 7 + col * 13) % 100;
}

/**
 * 计算网格布局参数
 */
function calculateGridLayout(count: number) {
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

/**
 * 计算粒子位置（带边界约束）
 */
function calculateParticlePosition(
  baseX: number,
  baseY: number,
  offsetX: number,
  offsetY: number,
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
): { x: number; y: number } {
  const x = Math.max(minX, Math.min(baseX + offsetX, maxX));
  const y = Math.max(minY, Math.min(baseY + offsetY, maxY));
  return { x, y };
}

/**
 * 生成固定位置的粒子
 */
function generateParticles({
  count,
  rectX,
  rectY,
  rectWidth,
  rectHeight,
  seed,
}: ParticleGeneratorParams): Particle[] {
  const particles: Particle[] = [];
  const padding = PARTICLE_CONFIG.SIZE / 2;
  const { cols, rows } = calculateGridLayout(count);

  const cellWidth = (rectWidth - padding * 2) / (cols + 1);
  const cellHeight = (rectHeight - padding * 2) / (rows + 1);

  let particleCount = 0;

  for (let row = 0; row < rows && particleCount < count; row++) {
    for (let col = 0; col < cols && particleCount < count; col++) {
      const random = pseudoRandom(seed, row, col);
      const offsetX = (random % 16) - 8;
      const offsetY = ((random * 3) % 12) - 6;
      const rowOffset = row % 2 === 1 ? cellWidth / 2 : 0;

      const baseX = rectX + padding + (col + 1) * cellWidth + rowOffset;
      const baseY = rectY + padding + (row + 1) * cellHeight;

      const { x, y } = calculateParticlePosition(
        baseX,
        baseY,
        offsetX,
        offsetY,
        rectX + padding,
        rectX + rectWidth - padding,
        rectY + padding,
        rectY + rectHeight - padding,
      );

      particles.push({ x, y, colorIndex: particleCount });
      particleCount++;
    }
  }

  return particles;
}

/**
 * 计算当前阶段的粒子数量
 */
function calculateParticleCount(index: number, totalItems: number): number {
  if (totalItems <= 1) return PARTICLE_CONFIG.MAX_COUNT;

  const progress = index / (totalItems - 1);
  const range = PARTICLE_CONFIG.MAX_COUNT - PARTICLE_CONFIG.MIN_COUNT;
  return Math.round(PARTICLE_CONFIG.MAX_COUNT - range * progress);
}

/**
 * 创建透视网格路径
 */
function createMeshPath(): string {
  const GRID_COUNT = 12;
  const MESH_WIDTH = 120;
  const MESH_HEIGHT = 180;
  const START_X = 40;
  const START_Y = 25;
  const PERSPECTIVE_OFFSET = 50; // 透视偏移量

  // 定义四个角点（透视梯形）
  const corners = {
    topLeft: { x: START_X, y: START_Y },
    topRight: { x: START_X + MESH_WIDTH, y: START_Y + PERSPECTIVE_OFFSET },
    bottomLeft: { x: START_X, y: START_Y + MESH_HEIGHT },
    bottomRight: {
      x: START_X + MESH_WIDTH,
      y: START_Y + MESH_HEIGHT + PERSPECTIVE_OFFSET,
    },
  };

  const lines: string[] = [];

  // 生成网格线
  for (let i = 0; i <= GRID_COUNT; i++) {
    const t = i / GRID_COUNT;

    // 横向网格线（从左到右）
    const horizontalStart = {
      x: corners.topLeft.x + (corners.bottomLeft.x - corners.topLeft.x) * t,
      y: corners.topLeft.y + (corners.bottomLeft.y - corners.topLeft.y) * t,
    };
    const horizontalEnd = {
      x: corners.topRight.x + (corners.bottomRight.x - corners.topRight.x) * t,
      y: corners.topRight.y + (corners.bottomRight.y - corners.topRight.y) * t,
    };
    lines.push(
      `M${horizontalStart.x} ${horizontalStart.y}L${horizontalEnd.x} ${horizontalEnd.y}`,
    );

    // 纵向网格线（从上到下）
    const verticalStart = {
      x: corners.topLeft.x + (corners.topRight.x - corners.topLeft.x) * t,
      y: corners.topLeft.y + (corners.topRight.y - corners.topLeft.y) * t,
    };
    const verticalEnd = {
      x:
        corners.bottomLeft.x +
        (corners.bottomRight.x - corners.bottomLeft.x) * t,
      y:
        corners.bottomLeft.y +
        (corners.bottomRight.y - corners.bottomLeft.y) * t,
    };
    lines.push(
      `M${verticalStart.x} ${verticalStart.y}L${verticalEnd.x} ${verticalEnd.y}`,
    );
  }

  return lines.join('');
}

/**
 * 渲染粒子组件
 */
function renderParticles(particles: Particle[], options: any): JSXElement[] {
  return particles.map((particle) => {
    const color = getPaletteColor(options, [particle.colorIndex]);
    return (
      <Path
        d="M4 0L8 4L4 8L0 4Z"
        fill={color}
        x={particle.x}
        y={particle.y}
        width={PARTICLE_CONFIG.SIZE}
        height={PARTICLE_CONFIG.SIZE}
        data-element-type="shape"
      />
    );
  });
}

/**
 * 创建装饰元素
 */
function createDecorElement(
  index: number,
  itemX: number,
  color: string,
  particles: Particle[],
  options: any,
): JSXElement {
  return (
    <Group
      x={itemX}
      y={0}
      width={SHAPE_CONFIG.WIDTH}
      height={SHAPE_CONFIG.HEIGHT}
    >
      <ShapesGroup>
        <Path d={createMeshPath()} stroke="#D9D9D9" strokeWidth={2} />
        <Path
          d={`M${SHAPE_CONFIG.LINE_X} 25V260`}
          stroke="#BFBFBF"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Rect
          x={SHAPE_CONFIG.RECT_X}
          y={SHAPE_CONFIG.RECT_Y}
          width={SHAPE_CONFIG.RECT_WIDTH}
          height={SHAPE_CONFIG.RECT_HEIGHT}
          fill="#FFCB0E"
          fillOpacity={0.2}
        />
      </ShapesGroup>
      <>{renderParticles(particles, options)}</>
      <Text
        x={SHAPE_CONFIG.LINE_X - 25}
        y={0}
        width={50}
        height={20}
        fontSize={20}
        fontWeight="bold"
        alignHorizontal="center"
        alignVertical="top"
        fill={color}
      >
        {String(index + 1).padStart(2, '0')}
      </Text>
    </Group>
  );
}

/**
 * 创建箭头元素
 */
function createArrowElement(itemX: number, options: any): JSXElement {
  const arrowY =
    SHAPE_CONFIG.RECT_Y +
    SHAPE_CONFIG.RECT_HEIGHT / 2 -
    SHAPE_CONFIG.ARROW_HEIGHT / 2;
  const arrowParticleCount = Math.max(
    Math.round(PARTICLE_CONFIG.MIN_COUNT * PARTICLE_CONFIG.ARROW_RATIO),
    PARTICLE_CONFIG.MIN_ARROW_COUNT,
  );

  const arrowParticles = generateParticles({
    count: arrowParticleCount,
    rectX: 0,
    rectY: 14,
    rectWidth: 57,
    rectHeight: 120,
    seed: 999,
  });

  return (
    <Group x={itemX + SHAPE_CONFIG.WIDTH} y={arrowY}>
      <Path
        d="M0 13.9679H57.1429V0L100 74L57.1429 148V134.032H0V13.9679Z"
        width={SHAPE_CONFIG.ARROW_WIDTH}
        height={SHAPE_CONFIG.ARROW_HEIGHT}
        fill="#FFCB0E"
        fillOpacity={0.2}
        data-element-type="shape"
      />
      <>{renderParticles(arrowParticles, options)}</>
    </Group>
  );
}

export const SequenceFilterMesh: ComponentType<SequenceFilterMeshProps> = (
  props,
) => {
  const { Title, Item, data, gap = 20, options } = props;
  const { title, desc, items = [] } = data;

  const titleContent = Title ? <Title title={title} desc={desc} /> : null;
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item
      indexes={[0]}
      data={data}
      datum={items[0]}
      width={SHAPE_CONFIG.WIDTH}
      positionH="center"
    />,
  );

  const decorElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];

  const itemYPos = SHAPE_CONFIG.HEIGHT + gap;
  const btnY = itemYPos + itemBounds.height + 10;

  // 生成各项元素
  items.forEach((item, index) => {
    const itemX = index * SHAPE_CONFIG.WIDTH;
    const indexes = [index];
    const color = getPaletteColor(options, indexes);

    // 生成粒子
    const particleCount = calculateParticleCount(index, items.length);
    const particles = generateParticles({
      count: particleCount,
      rectX: SHAPE_CONFIG.RECT_X,
      rectY: SHAPE_CONFIG.RECT_Y,
      rectWidth: SHAPE_CONFIG.RECT_WIDTH,
      rectHeight: SHAPE_CONFIG.RECT_HEIGHT,
      seed: index * 100,
    });

    // 装饰元素
    decorElements.push(
      createDecorElement(index, itemX, color!, particles, options),
    );

    // 最后一项添加箭头
    if (index === items.length - 1) {
      decorElements.push(createArrowElement(itemX, options));
    }

    // 数据项
    itemElements.push(
      <Item
        key={`item-${index}`}
        indexes={indexes}
        datum={item}
        data={data}
        width={SHAPE_CONFIG.WIDTH}
        x={itemX + SHAPE_CONFIG.LINE_X - SHAPE_CONFIG.WIDTH / 2}
        y={itemYPos}
        positionH="center"
      />,
    );

    // 删除按钮
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + SHAPE_CONFIG.LINE_X - btnBounds.width / 2}
        y={btnY}
      />,
    );

    // 中间添加按钮
    if (index < items.length - 1) {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={itemX + SHAPE_CONFIG.WIDTH - btnBounds.width / 2}
          y={btnY}
        />,
      );
    }
  });

  // 首尾添加按钮
  if (items.length > 0) {
    btnElements.unshift(
      <BtnAdd indexes={[0]} x={-btnBounds.width / 2} y={btnY} />,
    );

    const lastItemX = (items.length - 1) * SHAPE_CONFIG.WIDTH;
    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastItemX + SHAPE_CONFIG.WIDTH - btnBounds.width / 2}
        y={btnY}
      />,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group
        width={SHAPE_CONFIG.WIDTH * items.length + SHAPE_CONFIG.ARROW_WIDTH}
        height={SHAPE_CONFIG.HEIGHT + gap + itemBounds.height}
      >
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-filter-mesh', {
  component: SequenceFilterMesh,
  composites: ['title', 'item'],
});
