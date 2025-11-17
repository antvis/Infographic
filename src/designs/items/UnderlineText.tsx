import { ComponentType, Group, Rect, getElementBounds } from '../../jsx';

import { ItemDesc, ItemLabel } from '../components';

import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface UnderlineTextProps extends BaseItemProps {
  width?: number;
  gap?: number;
}

const underlineWidth = 80;
const underlineHeight = 3;

export const UnderlineText: ComponentType<UnderlineTextProps> = (props) => {
  const [
    { datum, indexes, width = 200, gap = 4, positionH = 'center', themeColors },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'gap']);

  // 获取各元素的尺寸
  const labelBounds = getElementBounds(
    <ItemLabel indexes={indexes} fontSize={18} fontWeight="bold" width={width}>
      {datum.label}
    </ItemLabel>,
  );

  const descBounds = datum.desc
    ? getElementBounds(
        <ItemDesc indexes={indexes} width={width} wordWrap={true}>
          {datum.desc}
        </ItemDesc>,
      )
    : { width: 0, height: 0 };

  // 计算内容总高度
  const contentHeight =
    labelBounds.height +
    gap +
    underlineHeight +
    (datum.desc ? gap * 2 + descBounds.height : 0);

  // 标题位置
  const titleX = 0; // 使用 alignHorizontal 控制对齐
  const titleY = 0;

  // 对齐方式
  const alignHorizontal =
    positionH === 'center'
      ? 'center'
      : positionH === 'flipped'
        ? 'right'
        : 'left';

  // 下划线位置（受 positionH 控制）
  const underlineX =
    positionH === 'center'
      ? (width - underlineWidth) / 2
      : positionH === 'flipped'
        ? width - underlineWidth
        : 0;
  const underlineY = titleY + labelBounds.height + gap;

  // 描述文本位置
  const descX = 0; // 使用 alignHorizontal 控制对齐
  const descY = underlineY + underlineHeight + gap * 2;

  return (
    <Group width={width} height={contentHeight} {...restProps}>
      {/* 标题 */}
      {datum.label && (
        <ItemLabel
          indexes={indexes}
          x={titleX}
          y={titleY}
          width={width}
          alignHorizontal={alignHorizontal}
          fill={themeColors.colorPrimary}
          fontSize={18}
          fontWeight="bold"
        >
          {datum.label}
        </ItemLabel>
      )}

      {/* 下划线 */}
      {datum.label && (
        <Rect
          x={underlineX}
          y={underlineY}
          width={underlineWidth}
          height={underlineHeight}
          fill={themeColors.colorPrimary}
          data-element-type="shape"
        />
      )}

      {/* 描述文本 */}
      {datum.desc && (
        <ItemDesc
          indexes={indexes}
          width={width}
          x={descX}
          y={descY}
          alignHorizontal={alignHorizontal}
          wordWrap={true}
          fill={themeColors.colorText}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('underline-text', {
  component: UnderlineText,
  composites: ['label', 'desc'],
});
