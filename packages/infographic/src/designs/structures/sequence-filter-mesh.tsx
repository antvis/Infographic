/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType, JSXElement } from '@antv/infographic-jsx';
import {
  getElementBounds,
  Group,
  Path,
  Rect,
  Text,
} from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

export interface SequenceFilterMeshProps extends BaseStructureProps {
  gap?: number;
}

// 生成固定位置的粒子
function generateParticles(
  count: number,
  rectX: number,
  rectY: number,
  rectWidth: number,
  rectHeight: number,
  seed: number,
) {
  const particles: { x: number; y: number; colorIndex: number }[] = [];
  const particleSize = 8; // 菱形粒子的尺寸
  const padding = particleSize / 2; // 边界内边距，确保粒子不超出

  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const rows = Math.ceil(count / cols);
  const cellWidth = (rectWidth - padding * 2) / (cols + 1);
  const cellHeight = (rectHeight - padding * 2) / (rows + 1);

  let particleCount = 0;
  for (let row = 0; row < rows && particleCount < count; row++) {
    for (let col = 0; col < cols && particleCount < count; col++) {
      // 使用 seed 和位置生成伪随机偏移（范围缩小，更收拢）
      const pseudoRandom = (seed + row * 7 + col * 13) % 100;
      const offsetX = (pseudoRandom % 16) - 8; // 缩小偏移范围
      const offsetY = ((pseudoRandom * 3) % 12) - 6; // 缩小偏移范围

      // 行间错落：奇数行整体偏移半个单元格
      const rowOffset = row % 2 === 1 ? cellWidth / 2 : 0;

      // 计算粒子位置
      let x = rectX + padding + (col + 1) * cellWidth + offsetX + rowOffset;
      let y = rectY + padding + (row + 1) * cellHeight + offsetY;

      // 确保粒子在边界内（考虑粒子尺寸）
      x = Math.max(rectX + padding, Math.min(x, rectX + rectWidth - padding));
      y = Math.max(rectY + padding, Math.min(y, rectY + rectHeight - padding));

      particles.push({
        x,
        y,
        colorIndex: particleCount, // 用于色板取色
      });
      particleCount++;
    }
  }
  return particles;
}

export const SequenceFilterMesh: ComponentType<SequenceFilterMeshProps> = (
  props,
) => {
  const { Title, Item, data, gap = 20, options } = props;
  const { title, desc, items = [] } = data;
  const shapeWidth = 160;
  const shapeHeight = 260;
  const arrowHeight = 148;
  const arrowWidth = 100;
  const lineX = 100;
  const rectX = 0;
  const rectY = 80;
  const rectWidth = 100;
  const rectHeight = 130;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);
  const itemBounds = getElementBounds(
    <Item
      indexes={[0]}
      data={data}
      datum={items[0]}
      width={shapeWidth}
      positionH="center"
    />,
  );

  const decorElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const btnElements: JSXElement[] = [];

  // 计算每个阶段的粒子数量（递减）
  const maxParticles = 40;
  const minParticles = 5;

  items.forEach((item, index) => {
    const itemX = index * shapeWidth;
    const indexes = [index];
    const color = getPaletteColor(options, indexes);

    // 计算当前阶段的粒子数量（线性递减）
    const progress = items.length > 1 ? index / (items.length - 1) : 0;
    const particleCount = Math.round(
      maxParticles - (maxParticles - minParticles) * progress,
    );

    // 生成固定位置的粒子
    const particles = generateParticles(
      particleCount,
      rectX,
      rectY,
      rectWidth,
      rectHeight,
      index * 100, // 使用 index 作为 seed，确保每个位置的粒子固定
    );

    // 装饰元素
    decorElements.push(
      <Group x={itemX} y={0} width={shapeWidth} height={shapeHeight}>
        <Path d={createMesh()} stroke="#D9D9D9" strokeWidth={2} />
        <Path
          d={`M${lineX} 25V${260}`}
          stroke="#BFBFBF"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Rect
          x={rectX}
          y={rectY}
          width={rectWidth}
          height={rectHeight}
          fill="#FFCB0E"
          fillOpacity={0.2}
        />
        {/* 粒子 - 菱形 */}
        {particles.map((particle) => {
          const particleColor = getPaletteColor(options, [particle.colorIndex]);
          return (
            <Path
              d="M4 0L8 4L4 8L0 4Z"
              fill={particleColor}
              x={particle.x}
              y={particle.y}
              width={8}
              height={8}
            />
          );
        })}
        <Text
          x={lineX - 25}
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
      </Group>,
    );

    // 箭头（只在最后一项右侧添加）
    if (index === items.length - 1) {
      const arrowY = rectY + rectHeight / 2 - arrowHeight / 2;

      // 箭头内的粒子数量（最少）
      const arrowParticleCount = Math.max(Math.round(minParticles * 0.6), 3);
      const arrowParticles = generateParticles(
        arrowParticleCount,
        0,
        14, // 箭头内部区域的相对位置
        57, // 箭头左侧矩形区域宽度
        120, // 箭头内部高度
        999, // 固定 seed
      );

      decorElements.push(
        <Group x={itemX + shapeWidth} y={arrowY}>
          <Path
            d="M0 13.9679H57.1429V0L100 74L57.1429 148V134.032H0V13.9679Z"
            width={arrowWidth}
            height={arrowHeight}
            fill="#FFCB0E"
            fillOpacity={0.2}
          />
          {/* 箭头内的粒子 */}
          {arrowParticles.map((particle) => {
            const particleColor = getPaletteColor(options, [
              particle.colorIndex,
            ]);
            return (
              <Path
                d="M4 0L8 4L4 8L0 4Z"
                fill={particleColor}
                x={particle.x}
                y={particle.y}
                width={8}
                height={8}
              />
            );
          })}
        </Group>,
      );
    }

    // 数据项（在装饰元素下面，与竖线水平居中）
    const itemYPos = shapeHeight + gap;
    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        width={shapeWidth}
        x={itemX + lineX - shapeWidth / 2}
        y={itemYPos}
        positionH="center"
      />,
    );

    // 删除按钮（与竖线居中）
    const btnY = itemYPos + itemBounds.height + 10;
    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={itemX + lineX - btnBounds.width / 2}
        y={btnY}
      />,
    );

    // 添加按钮（在相邻项之间）
    if (index < items.length - 1) {
      btnElements.push(
        <BtnAdd
          indexes={[index + 1]}
          x={itemX + shapeWidth - btnBounds.width / 2}
          y={btnY}
        />,
      );
    }
  });

  // 首位和末尾添加按钮
  if (items.length > 0) {
    const itemYPos = shapeHeight + gap;
    const btnY = itemYPos + itemBounds.height + 10;

    // 首位添加按钮
    btnElements.unshift(
      <BtnAdd indexes={[0]} x={-btnBounds.width / 2} y={btnY} />,
    );

    // 末尾添加按钮
    const lastItemX = (items.length - 1) * shapeWidth;
    btnElements.push(
      <BtnAdd
        indexes={[items.length]}
        x={lastItemX + shapeWidth - btnBounds.width / 2}
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
        width={shapeWidth * items.length + arrowWidth}
        height={shapeHeight + gap + itemBounds.height}
      >
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

function createMesh() {
  const gridCount = 12;
  const width = 120;
  const height = 180;
  const tl = { x: 40, y: 25 };
  const tr = { x: tl.x + width, y: tl.y + 50 };
  const bl = { x: tl.x, y: tl.y + height };
  const br = { x: tr.x, y: bl.y + 50 };

  const lines: string[] = [];

  // 横向网格线
  for (let i = 0; i <= gridCount; i++) {
    const t = i / gridCount;
    const sx = tl.x + (bl.x - tl.x) * t;
    const sy = tl.y + (bl.y - tl.y) * t;
    const ex = tr.x + (br.x - tr.x) * t;
    const ey = tr.y + (br.y - tr.y) * t;
    lines.push(`M${sx} ${sy}L${ex} ${ey}`);
  }

  // 纵向网格线
  for (let i = 0; i <= gridCount; i++) {
    const t = i / gridCount;
    const sx = tl.x + (tr.x - tl.x) * t;
    const sy = tl.y + (tr.y - tl.y) * t;
    const ex = bl.x + (br.x - bl.x) * t;
    const ey = bl.y + (br.y - bl.y) * t;
    lines.push(`M${sx} ${sy}L${ex} ${ey}`);
  }

  return lines.join('');
}

registerStructure('sequence-filter-mesh', {
  component: SequenceFilterMesh,
  composites: ['title', 'item'],
});
