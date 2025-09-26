/** @jsxImportSource @antv/infographic-jsx */
import {
  cloneElement,
  createLayout,
  getElementBounds,
  getElementsBounds,
  Group,
  type Bounds,
  type GroupProps,
  type JSXElement,
} from '@antv/infographic-jsx';

export interface FlexLayoutProps extends GroupProps {
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  alignItems?: 'flex-start' | 'flex-end' | 'center';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between';
  flexWrap?: 'wrap' | 'nowrap';
  gap?: number;
}

export const FlexLayout = createLayout<FlexLayoutProps>(
  (
    children,
    {
      flexDirection = 'row',
      justifyContent = 'flex-start',
      alignItems = 'flex-start',
      alignContent = 'flex-start',
      flexWrap = 'nowrap',
      gap = 0,
      ...props
    },
  ) => {
    if (!children || children.length === 0) {
      return <Group {...props} />;
    }

    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
    const isReverse =
      flexDirection === 'row-reverse' || flexDirection === 'column-reverse';

    const childBounds = children.map((child) => getElementBounds(child));

    const hasContainerSize =
      props.width !== undefined && props.height !== undefined;
    const containerWidth = props.width || 0;
    const containerHeight = props.height || 0;

    const lines: Array<{ children: JSXElement[]; bounds: Bounds[] }> = [];

    if (flexWrap === 'wrap' && hasContainerSize) {
      let currentLine: JSXElement[] = [];
      let currentLineBounds: Bounds[] = [];
      let currentLineSize = 0;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const bounds = childBounds[i];
        const childSize = isRow ? bounds.width : bounds.height;
        const maxSize = isRow ? containerWidth : containerHeight;

        if (
          currentLine.length === 0 ||
          currentLineSize + gap + childSize <= maxSize
        ) {
          currentLine.push(child);
          currentLineBounds.push(bounds);
          currentLineSize += (currentLine.length > 1 ? gap : 0) + childSize;
        } else {
          lines.push({ children: currentLine, bounds: currentLineBounds });
          currentLine = [child];
          currentLineBounds = [bounds];
          currentLineSize = childSize;
        }
      }

      if (currentLine.length > 0) {
        lines.push({ children: currentLine, bounds: currentLineBounds });
      }
    } else {
      lines.push({ children, bounds: childBounds });
    }

    const layoutChildren: JSXElement[] = [];
    let currentCrossPos = 0;
    const crossSizes: number[] = [];

    lines.forEach((line) => {
      const { children: lineChildren, bounds: lineBounds } = line;

      const totalMainSize = lineBounds.reduce((sum, bounds, index) => {
        const childMainSize = isRow ? bounds.width : bounds.height;
        return sum + childMainSize + (index > 0 ? gap : 0);
      }, 0);

      const maxCrossSize = Math.max(
        ...lineBounds.map((bounds) => (isRow ? bounds.height : bounds.width)),
      );

      crossSizes.push(maxCrossSize);

      let mainStart = 0;
      const availableMainSpace =
        (isRow ? containerWidth : containerHeight) - totalMainSize;

      if (hasContainerSize) {
        switch (justifyContent) {
          case 'flex-end':
            mainStart = availableMainSpace;
            break;
          case 'center':
            mainStart = availableMainSpace / 2;
            break;
          case 'space-between':
            mainStart = 0;
            break;
          default:
            mainStart = 0;
            break;
        }
      }

      let itemSpacing = gap;
      if (
        hasContainerSize &&
        justifyContent === 'space-between' &&
        lineChildren.length > 1
      ) {
        itemSpacing = availableMainSpace / (lineChildren.length - 1) + gap;
      }

      let currentMainPos = mainStart;

      lineChildren.forEach((child, childIndex) => {
        const bounds = lineBounds[childIndex];
        const childMainSize = isRow ? bounds.width : bounds.height;
        const childCrossSize = isRow ? bounds.height : bounds.width;

        let crossPos = currentCrossPos;
        if (hasContainerSize) {
          switch (alignItems) {
            case 'flex-end':
              crossPos = currentCrossPos + maxCrossSize - childCrossSize;
              break;
            case 'center':
              crossPos = currentCrossPos + (maxCrossSize - childCrossSize) / 2;
              break;
            default:
              crossPos = currentCrossPos;
              break;
          }
        }

        let x: number, y: number;
        if (isRow) {
          x = isReverse
            ? containerWidth - currentMainPos - childMainSize
            : currentMainPos;
          y = crossPos;
        } else {
          x = crossPos;
          y = isReverse
            ? containerHeight - currentMainPos - childMainSize
            : currentMainPos;
        }

        const clonedChild = cloneElement(child, { x, y });
        layoutChildren.push(clonedChild);

        currentMainPos += childMainSize + itemSpacing;
      });

      currentCrossPos += maxCrossSize + gap;
    });

    if (lines.length > 1 && hasContainerSize) {
      const totalCrossSize =
        crossSizes.reduce((sum, size) => sum + size, 0) +
        (lines.length - 1) * gap;
      const availableCrossSpace =
        (isRow ? containerHeight : containerWidth) - totalCrossSize;

      let crossOffset = 0;
      switch (alignContent) {
        case 'flex-end':
          crossOffset = availableCrossSpace;
          break;
        case 'center':
          crossOffset = availableCrossSpace / 2;
          break;
        case 'space-between':
          if (lines.length > 1) {
            const lineSpacing = availableCrossSpace / (lines.length - 1);
            let currentOffset = 0;

            lines.forEach((line, lineIndex) => {
              const lineStartIndex = lines
                .slice(0, lineIndex)
                .reduce((sum, l) => sum + l.children.length, 0);
              const lineEndIndex = lineStartIndex + line.children.length;

              for (let i = lineStartIndex; i < lineEndIndex; i++) {
                const child = layoutChildren[i];
                const newProps = { ...child.props };
                if (isRow) {
                  newProps.y = (newProps.y || 0) + currentOffset;
                } else {
                  newProps.x = (newProps.x || 0) + currentOffset;
                }
                layoutChildren[i] = cloneElement(child, newProps);
              }

              currentOffset +=
                crossSizes[lineIndex] +
                gap +
                (lineIndex < lines.length - 1 ? lineSpacing : 0);
            });
            break;
          }
          break;
        default:
          crossOffset = 0;
          break;
      }

      if (crossOffset !== 0 && alignContent !== 'space-between') {
        layoutChildren.forEach((child, index) => {
          const newProps = { ...child.props };
          if (isRow) {
            newProps.y = (newProps.y || 0) + crossOffset;
          } else {
            newProps.x = (newProps.x || 0) + crossOffset;
          }
          layoutChildren[index] = cloneElement(child, newProps);
        });
      }
    }

    if (!hasContainerSize) {
      if (alignItems === 'center' && !isRow) {
        // For column layout, center items horizontally
        const maxWidth = Math.max(...childBounds.map((bounds) => bounds.width));
        layoutChildren.forEach((child, index) => {
          const bounds = childBounds[index];
          const centerOffset = (maxWidth - bounds.width) / 2;
          const newProps = { ...child.props };
          newProps.x = (newProps.x || 0) + centerOffset;
          layoutChildren[index] = cloneElement(child, newProps);
        });
      } else if (alignItems === 'center' && isRow) {
        // For row layout, center items vertically
        const maxHeight = Math.max(
          ...childBounds.map((bounds) => bounds.height),
        );
        layoutChildren.forEach((child, index) => {
          const bounds = childBounds[index];
          const centerOffset = (maxHeight - bounds.height) / 2;
          const newProps = { ...child.props };
          newProps.y = (newProps.y || 0) + centerOffset;
          layoutChildren[index] = cloneElement(child, newProps);
        });
      }

      const finalBounds = getElementsBounds(layoutChildren);
      // props.x ??= finalBounds.x;
      // props.y ??= finalBounds.y;
      props.width ??= finalBounds.width;
      props.height ??= finalBounds.height;
    }

    return <Group {...props}>{layoutChildren}</Group>;
  },
);
