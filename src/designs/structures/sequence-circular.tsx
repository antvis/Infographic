import type { ComponentType, JSXElement } from '../../jsx';
import { Ellipse, getElementBounds, Group, Path } from '../../jsx';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemIcon,
  ItemsGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

const ITEM_AREA_HORIZONTAL_PADDING = 100;
const CIRCLE_AREA_HORIZONTAL_PADDING = 50;
const INNER_ARC_PADDING = 6;
const ARC_BACKGROUND_OPACITY_HEX = '40';

export interface SequenceCircularProps extends BaseStructureProps {
  outerRadius?: number;
  innerRadius?: number;
  itemDistance?: number;
  gapAngle?: number;
  iconRadius?: number;
  iconBgRadius?: number;
  iconSize?: number;
}

export const SequenceCircular: ComponentType<SequenceCircularProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    options,
    outerRadius = 180,
    innerRadius = 120,
    itemDistance = 310,
    gapAngle = 5,
    iconRadius = 34,
    iconBgRadius = 38,
    iconSize = 36,
  } = props;

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  // 计算布局中心点，确保最高点为0
  const centerX = Math.max(
    itemDistance + ITEM_AREA_HORIZONTAL_PADDING,
    outerRadius + CIRCLE_AREA_HORIZONTAL_PADDING,
  );
  const centerY = Math.min(itemDistance, outerRadius);
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  // 如果没有数据，显示中心添加按钮
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
          <BtnsGroup>
            <BtnAdd indexes={[0]} x={centerX - 20} y={centerY - 20} />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const arcElements: JSXElement[] = [];
  const iconElements: JSXElement[] = [];

  // 获取Item组件尺寸
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );

  // 计算每个扇区的角度
  const totalGapAngle = items.length * gapAngle;
  const availableAngle = 360 - totalGapAngle;
  const arcAngle = availableAngle / items.length;

  // 创建弧形路径的辅助函数
  const createArcPath = (
    centerX: number,
    centerY: number,
    innerR: number,
    outerR: number,
    startAngle: number,
    endAngle: number,
  ): string => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + innerR * Math.cos(startAngleRad);
    const y1 = centerY + innerR * Math.sin(startAngleRad);
    const x2 = centerX + outerR * Math.cos(startAngleRad);
    const y2 = centerY + outerR * Math.sin(startAngleRad);

    const x3 = centerX + outerR * Math.cos(endAngleRad);
    const y3 = centerY + outerR * Math.sin(endAngleRad);
    const x4 = centerX + innerR * Math.cos(endAngleRad);
    const y4 = centerY + innerR * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
      'Z',
    ].join(' ');
  };

  const computePosition = ({
    centerX,
    outerRadius,
    angleRad,
    btnBounds,
  }: {
    centerX: number;
    outerRadius: number;
    angleRad: number;
    btnBounds: { width: number; height: number };
  }) => {
    const x =
      centerX + (outerRadius + 20) * Math.cos(angleRad) - btnBounds.width / 2;

    const y =
      centerY + (outerRadius + 20) * Math.sin(angleRad) - btnBounds.height / 2;

    return {
      x,
      y,
    };
  };

  // 计算角度边距，使其在弧形上的实际距离等于径向边距
  const padding = INNER_ARC_PADDING;
  const avgRadius = (innerRadius + outerRadius) / 2;
  const anglePadding = (padding / avgRadius) * (180 / Math.PI);

  items.forEach((item, index) => {
    const indexes = [index];

    // 计算当前扇区的起始和结束角度（从顶部开始，270度对应顶部）
    const startAngle = index * (arcAngle + gapAngle) + 270;
    const endAngle = startAngle + arcAngle;

    // 计算扇区中心角度，用于定位Item和按钮
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;

    // 获取当前项的颜色
    const itemColor = getPaletteColor(options, indexes);
    const lightColor = itemColor + ARC_BACKGROUND_OPACITY_HEX;

    // 绘制外层浅色弧形
    const outerArcPath = createArcPath(
      centerX,
      centerY,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
    );

    arcElements.push(
      <Path
        d={outerArcPath}
        fill={lightColor}
        width={outerRadius * 2}
        height={outerRadius * 2}
        data-element-type="shape"
      />,
    );

    // 绘制内层主题色弧形
    const innerArcPath = createArcPath(
      centerX,
      centerY,
      innerRadius + padding,
      outerRadius - padding,
      startAngle + anglePadding,
      endAngle - anglePadding,
    );

    arcElements.push(
      <Path
        d={innerArcPath}
        fill={itemColor}
        width={outerRadius * 2}
        height={outerRadius * 2}
        data-element-type="shape"
      />,
    );

    // 计算图标在弧形中心的位置
    const iconDistance = (innerRadius + outerRadius) / 2;
    const iconCenterX = centerX + iconDistance * Math.cos(midAngleRad);
    const iconCenterY = centerY + iconDistance * Math.sin(midAngleRad);

    // 添加外层白色圆形背景
    iconElements.push(
      <Ellipse
        x={iconCenterX - iconBgRadius}
        y={iconCenterY - iconBgRadius}
        width={iconBgRadius * 2}
        height={iconBgRadius * 2}
        fill="#ffffff"
        data-element-type="shape"
      />,
    );

    // 添加内层主题色圆形
    iconElements.push(
      <Ellipse
        x={iconCenterX - iconRadius}
        y={iconCenterY - iconRadius}
        width={iconRadius * 2}
        height={iconRadius * 2}
        fill={itemColor}
        data-element-type="shape"
      />,
    );

    // 添加图标（如果数据项有图标）
    if (item.icon) {
      iconElements.push(
        <ItemIcon
          x={iconCenterX - iconSize / 2}
          y={iconCenterY - iconSize / 2}
          indexes={indexes}
          size={iconSize}
          fill="#fff"
        />,
      );
    }

    // 判断Item应该显示在左侧还是右侧
    const normalizedAngle = ((midAngle % 360) + 360) % 360;
    const isRightSide = normalizedAngle >= 270 || normalizedAngle <= 90;
    // 定义底部区域：75° - 105°（以90°为中心的±15°范围）
    const isBottomArea = normalizedAngle >= 75 && normalizedAngle <= 105;

    // 计算Item在弧形上的位置
    let itemAngle: number;
    let positionH: 'normal' | 'flipped' | 'center' = 'normal';
    let positionV: 'normal' | 'flipped' | 'center' = 'normal';

    if (isBottomArea) {
      itemAngle = normalizedAngle;
      positionV = 'normal';
      positionH = 'center';
    } else if (isRightSide) {
      // 右侧：将角度映射到右侧弧形范围 (-60° 到 60°)
      if (normalizedAngle >= 270) {
        // 270° - 360° 映射到 -60° - 0°
        itemAngle = -60 + ((normalizedAngle - 270) / 90) * 60;
      } else {
        // 0° - 90° 映射到 0° - 60°
        itemAngle = (normalizedAngle / 90) * 60;
      }
      positionH = 'normal';
    } else {
      // 左侧：将角度映射到左侧弧形范围 (120° 到 240°)
      // 90° - 270° 映射到 120° - 240°
      itemAngle = 120 + ((normalizedAngle - 90) / 180) * 120;
      positionH = 'flipped';
    }

    // 转换为弧度并计算Item位置
    const itemAngleRad = (itemAngle * Math.PI) / 180;
    const itemX =
      centerX + itemDistance * Math.cos(itemAngleRad) - itemBounds.width / 2;
    let itemY =
      centerY + itemDistance * Math.sin(itemAngleRad) - itemBounds.height / 2;

    if (isBottomArea) {
      itemY = centerY + outerRadius + itemBounds.height / 2;
    }

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH={positionH}
        positionV={positionV}
      />,
    );

    // 添加删除按钮（在Item外侧）
    const removeBtnDistance = itemDistance + 40;
    const removeBtnX =
      centerX +
      removeBtnDistance * Math.cos(itemAngleRad) -
      btnBounds.width / 2;
    const removeBtnY =
      centerY +
      removeBtnDistance * Math.sin(itemAngleRad) -
      btnBounds.height / 2;

    btnElements.push(
      <BtnRemove indexes={indexes} x={removeBtnX} y={removeBtnY} />,
    );

    // 计算添加按钮位置（在相邻扇区之间的弧形上）
    const nextGapAngle = startAngle + arcAngle + gapAngle / 2;
    const nextGapAngleRad = (nextGapAngle * Math.PI) / 180;
    const { x: addBtnX, y: addBtnY } = computePosition({
      centerX,
      outerRadius,
      angleRad: nextGapAngleRad,
      btnBounds,
    });

    btnElements.push(<BtnAdd indexes={[index + 1]} x={addBtnX} y={addBtnY} />);
  });

  // 添加第一个位置的添加按钮
  const firstGapAngle = 270 - gapAngle / 2;
  const firstGapAngleRad = (firstGapAngle * Math.PI) / 180;

  const { x: firstAddBtnX, y: firstAddBtnY } = computePosition({
    centerX,
    outerRadius,
    angleRad: firstGapAngleRad,
    btnBounds,
  });

  btnElements.unshift(
    <BtnAdd indexes={[0]} x={firstAddBtnX} y={firstAddBtnY} />,
  );

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={50}
    >
      {titleContent}
      <Group>
        <Group>{arcElements}</Group>
        <Group>{iconElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-circular', {
  component: SequenceCircular,
  composites: ['title', 'item'],
});
