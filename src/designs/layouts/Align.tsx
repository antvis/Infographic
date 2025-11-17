import {
  cloneElement,
  createLayout,
  getElementBounds,
  getElementsBounds,
  Group,
  type GroupProps,
} from '../../jsx';

export interface AlignLayoutProps extends GroupProps {
  /** 水平对齐方式 */
  horizontal?: 'left' | 'center' | 'right';
  /** 垂直对齐方式 */
  vertical?: 'top' | 'middle' | 'bottom';
}

export const AlignLayout = createLayout<AlignLayoutProps>(
  (children, { horizontal, vertical, ...props }) => {
    if (!children || children.length === 0) {
      return <Group {...props} />;
    }

    const childBounds = children.map((child) => getElementBounds(child));

    // 检查是否设置了容器的宽高
    const hasContainerWidth = props.width !== undefined;
    const hasContainerHeight = props.height !== undefined;

    let positionedChildren = [...children];

    // 如果没有设置容器尺寸，先获取子节点的整体包围盒
    const childrenBounds = getElementsBounds(children);

    // 确定对齐的基础区域
    const alignmentWidth = hasContainerWidth
      ? props.width!
      : childrenBounds.width;
    const alignmentHeight = hasContainerHeight
      ? props.height!
      : childrenBounds.height;
    const alignmentX = hasContainerWidth ? props.x || 0 : childrenBounds.x;
    const alignmentY = hasContainerHeight ? props.y || 0 : childrenBounds.y;

    // 应用对齐
    positionedChildren = children.map((child, index) => {
      const bounds = childBounds[index];
      const childProps = { ...child.props };

      // 水平对齐
      if (horizontal) {
        switch (horizontal) {
          case 'left':
            childProps.x = alignmentX;
            break;
          case 'center':
            childProps.x = alignmentX + (alignmentWidth - bounds.width) / 2;
            break;
          case 'right':
            childProps.x = alignmentX + alignmentWidth - bounds.width;
            break;
        }
      } else {
        // 如果没有设置水平对齐，保持原有的 x 坐标
        childProps.x = child.props.x || bounds.x;
      }

      // 垂直对齐
      if (vertical) {
        switch (vertical) {
          case 'top':
            childProps.y = alignmentY;
            break;
          case 'middle':
            childProps.y = alignmentY + (alignmentHeight - bounds.height) / 2;
            break;
          case 'bottom':
            childProps.y = alignmentY + alignmentHeight - bounds.height;
            break;
        }
      } else {
        // 如果没有设置垂直对齐，保持原有的 y 坐标
        childProps.y = child.props.y || bounds.y;
      }

      return cloneElement(child, childProps);
    });

    // 如果没有设置容器尺寸，更新容器的边界框
    if (!hasContainerWidth || !hasContainerHeight) {
      const finalBounds = getElementsBounds(positionedChildren);
      if (!hasContainerWidth) {
        // props.x ??= finalBounds.x;
        props.width ??= finalBounds.width;
      }
      if (!hasContainerHeight) {
        // props.y ??= finalBounds.y;
        props.height ??= finalBounds.height;
      }
    }

    return <Group {...props}>{positionedChildren}</Group>;
  },
);
