import tinycolor from 'tinycolor2';
import { ComponentType, Defs, Ellipse, Group, Rect } from '../../jsx';
import { ItemDesc, ItemIcon, ItemLabel, ItemValue } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface BadgeCardProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
  badgeSize?: number;
  gap?: number;
}

export const BadgeCard: ComponentType<BadgeCardProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 200,
      height = 80,
      iconSize = 24,
      badgeSize = 32,
      gap = 8,
      positionH = 'normal',
      themeColors,
      valueFormatter,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize', 'badgeSize', 'gap']);
  const value = datum.value;
  const hasValue = value !== undefined;
  const hasDesc = !!datum.desc;
  const hasIcon = !!datum.icon;
  const gradientId = `${themeColors.colorPrimary}-badge`;

  const badgeX = positionH === 'flipped' ? width - gap - badgeSize : gap;
  const contentStartX = hasIcon
    ? positionH === 'flipped'
      ? gap
      : badgeSize + 2 * gap
    : gap; // 没有图标时从左边距开始
  const fullWidth = width - gap * 2;
  const contentWidth = hasIcon ? width - badgeSize - 3 * gap : fullWidth;

  // 描述区域的固定位置（label + value 区域的下方）
  const descY = gap + 14 + 18 + 8; // label(14) + value(18) + gap(8)
  const contentAreaHeight = descY - gap; // label 和 value 占据的总高度

  // 当没有 desc 时，徽章和内容区域垂直居中
  const badgeY = !hasDesc ? (height - badgeSize) / 2 : gap;
  // 没有 value 时，label 在整个内容区域垂直居中；有 value 时从顶部开始
  const contentY = !hasValue && !hasDesc ? (height - 14) / 2 : gap;

  return (
    <Group {...restProps} width={width} height={height}>
      <Defs>
        <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={themeColors.colorPrimary} />
          <stop
            offset="100%"
            stopColor={tinycolor(themeColors.colorPrimary)
              .darken(20)
              .toHexString()}
          />
        </radialGradient>
      </Defs>

      {/* 背景卡片 */}
      <Rect
        data-element-type="shape"
        x={0}
        y={0}
        width={width}
        height={height}
        fill={themeColors.colorPrimaryBg}
        rx={8}
        ry={8}
      />

      {hasIcon && (
        <>
          {/* 徽章背景 */}
          <Ellipse
            x={badgeX}
            y={badgeY}
            width={badgeSize}
            height={badgeSize}
            fill={`url(#${gradientId})`}
          />

          {/* 徽章图标 */}
          <ItemIcon
            indexes={indexes}
            x={badgeX + (badgeSize - iconSize) / 2}
            y={badgeY + (badgeSize - iconSize) / 2}
            size={iconSize}
            fill={themeColors.colorWhite}
          />
        </>
      )}

      {/* 上方内容区域：label 和 value */}
      <FlexLayout
        flexDirection="column"
        x={contentStartX}
        y={contentY}
        width={contentWidth}
        height={!hasValue && !hasDesc ? undefined : contentAreaHeight}
        alignItems="center"
        justifyContent="center"
      >
        {/* 标签 */}
        <ItemLabel
          indexes={indexes}
          width={contentWidth}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
          alignVertical="middle"
          fontSize={14}
          fill={themeColors.colorText}
        >
          {datum.label}
        </ItemLabel>

        {/* 数值 */}
        {hasValue && (
          <ItemValue
            indexes={indexes}
            width={contentWidth}
            alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
            alignVertical="middle"
            fontSize={18}
            lineHeight={1}
            fontWeight="bold"
            fill={themeColors.colorPrimary}
            value={value}
            formatter={valueFormatter}
          />
        )}
      </FlexLayout>

      {/* 描述区域（固定位置，独立于 value） */}
      {hasDesc && (
        <ItemDesc
          indexes={indexes}
          x={gap}
          y={descY}
          width={fullWidth}
          alignHorizontal={positionH === 'flipped' ? 'right' : 'left'}
          fontSize={11}
          fill={themeColors.colorTextSecondary}
          lineNumber={2}
          lineHeight={1.2}
          wordWrap={true}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('badge-card', {
  component: BadgeCard,
  composites: ['icon', 'label', 'value', 'desc'],
});
