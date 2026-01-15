import { ElementTypeEnum } from '../../constants';
import type { ComponentType, JSXElement } from '../../jsx';
import { getElementBounds, Group, Rect, Text } from '../../jsx';
import type { HierarchyData } from '../../types';
import { ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor, getThemeColors } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

const applyAlpha = (color: string, alpha: number) => {
  if (!color || color[0] !== '#' || color.length !== 7) return color;
  const clamped = Math.max(0, Math.min(1, alpha));
  const alphaHex = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `${color}${alphaHex}`;
};

const normalizeLabel = (label?: string | number) =>
  label == null ? '' : String(label);

const measureText = (
  text: string,
  fontSize: number,
  fontWeight: 'normal' | 'bold',
) =>
  getElementBounds(
    <Text fontSize={fontSize} fontWeight={fontWeight}>
      {text}
    </Text>,
  );

const getMaxTextBounds = (
  labels: string[],
  fontSize: number,
  fontWeight: 'normal' | 'bold',
  fallbackText = ' ',
) => {
  const sampleBounds = measureText(fallbackText, fontSize, fontWeight);
  let maxWidth = sampleBounds.width;
  let maxHeight = sampleBounds.height;

  labels.forEach((label) => {
    const bounds = measureText(label || ' ', fontSize, fontWeight);
    maxWidth = Math.max(maxWidth, bounds.width);
    maxHeight = Math.max(maxHeight, bounds.height);
  });

  return { width: maxWidth, height: maxHeight };
};

const getPillDimensions = (
  labels: string[],
  fontSize: number,
  paddingX: number,
  paddingY: number,
) => {
  const bounds = getMaxTextBounds(labels, fontSize, 'normal', 'Item');
  return {
    pillWidth: bounds.width + paddingX * 2,
    pillHeight: bounds.height + paddingY * 2,
  };
};

export interface HierarchyStructureProps extends BaseStructureProps {
  /** Vertical gap between rows. */
  rowGap?: number;
  /** Horizontal gap between left label and right content area. */
  labelGap?: number;
  /** Horizontal gap between groups inside a grouped row. */
  groupGap?: number;
  /** Horizontal/vertical gap between pills. */
  pillGap?: number;
  /** Columns per group (when grouped). */
  pillColumns?: number;
  /** Columns for flat rows (no groups). */
  ungroupedColumns?: number;
  /** Position of the layer label block. */
  layerLabelPosition?: 'left' | 'right';
  /** Padding inside right content container. */
  rowPadding?: number;
  /** Padding inside each group container. */
  groupPadding?: number;
  /** Left/right padding inside left label block. */
  labelPaddingX?: number;
  /** Top/bottom padding inside left label block. */
  labelPaddingY?: number;
  /** Left/right padding inside a pill. */
  pillPaddingX?: number;
  /** Top/bottom padding inside a pill. */
  pillPaddingY?: number;
  /** Font size for left layer labels. */
  labelFontSize?: number;
  /** Font size for group titles. */
  groupTitleFontSize?: number;
  /** Font size for pill text. */
  pillFontSize?: number;
  /** Gap between group title and its pill grid. */
  groupTitleGap?: number;
  /** Corner radius for row containers. */
  rowRadius?: number;
  /** Corner radius for group containers. */
  groupRadius?: number;
  /** Corner radius for pills. */
  pillRadius?: number;
}

export const HierarchyStructure: ComponentType<HierarchyStructureProps> = (
  props,
) => {
  const {
    Title,
    data,
    options,
    rowGap = 20,
    labelGap = 20,
    groupGap = 20,
    pillGap = 14,
    pillColumns = 2,
    ungroupedColumns = 6,
    layerLabelPosition = 'left',
    rowPadding = 20,
    groupPadding = 16,
    labelPaddingX = 28,
    labelPaddingY = 16,
    pillPaddingX = 18,
    pillPaddingY = 10,
    labelFontSize = 20,
    groupTitleFontSize = 18,
    pillFontSize = 16,
    groupTitleGap = 10,
    rowRadius = 12,
    groupRadius = 10,
    pillRadius = 12,
  } = props;

  const { title, desc, items = [] } = data as HierarchyData;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

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
          <ItemsGroup />
        </Group>
      </FlexLayout>
    );
  }

  const themeColors = getThemeColors(options.themeConfig);
  const decorElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const isLabelOnRight = layerLabelPosition === 'right';

  const rowBackgroundAlpha = 0.12;
  const rowBorderAlpha = 0.55;
  const groupBackgroundAlpha = 0.08;
  const groupBorderAlpha = 0.4;
  const pillBackgroundAlpha = 0.06;
  const pillBorderAlpha = 0.35;

  const rowInfos = items.map((layer) => {
    const layerLabel = normalizeLabel(layer.label);
    const labelBounds = measureText(layerLabel || ' ', labelFontSize, 'bold');
    const labelWidth = labelBounds.width + labelPaddingX * 2;
    const labelHeight = labelBounds.height + labelPaddingY * 2;

    const children = layer.children || [];
    const hasGroups = children.some(
      (child) => (child.children?.length || 0) > 0,
    );

    if (hasGroups) {
      const pillLabels: string[] = [];
      children.forEach((child) => {
        (child.children || []).forEach((pill) => {
          pillLabels.push(normalizeLabel(pill.label));
        });
      });

      const { pillWidth, pillHeight } = getPillDimensions(
        pillLabels,
        pillFontSize,
        pillPaddingX,
        pillPaddingY,
      );

      const groupMetrics = children.map((group) => {
        const groupLabel = normalizeLabel(group.label);
        const groupTitleBounds = measureText(
          groupLabel || ' ',
          groupTitleFontSize,
          'bold',
        );
        const groupChildren = group.children || [];
        const groupColumns =
          groupChildren.length > 0
            ? Math.min(pillColumns, groupChildren.length)
            : 0;
        const groupRows =
          groupColumns > 0 ? Math.ceil(groupChildren.length / groupColumns) : 0;
        const groupContentWidth =
          groupColumns > 0
            ? groupColumns * pillWidth + (groupColumns - 1) * pillGap
            : 0;
        const groupContentHeight =
          groupRows > 0
            ? groupRows * pillHeight + (groupRows - 1) * pillGap
            : 0;
        const innerWidth = Math.max(groupTitleBounds.width, groupContentWidth);
        const groupWidth = innerWidth + groupPadding * 2;
        const groupHeight =
          groupPadding * 2 +
          groupTitleBounds.height +
          (groupRows > 0 ? groupTitleGap + groupContentHeight : 0);

        return {
          label: groupLabel,
          children: groupChildren,
          width: groupWidth,
          height: groupHeight,
          titleHeight: groupTitleBounds.height,
          columns: groupColumns,
          contentWidth: groupContentWidth,
          pillWidth,
          pillHeight,
        };
      });

      const contentInnerWidth =
        groupMetrics.reduce((sum, metric) => sum + metric.width, 0) +
        (groupMetrics.length > 1 ? (groupMetrics.length - 1) * groupGap : 0);
      const contentInnerHeight = groupMetrics.reduce(
        (max, metric) => Math.max(max, metric.height),
        0,
      );

      return {
        label: layerLabel,
        labelWidth,
        labelHeight,
        hasGroups: true,
        children,
        groupMetrics,
        contentInnerWidth,
        contentInnerHeight,
      };
    }

    const pillLabels = children.map((child) => normalizeLabel(child.label));
    const { pillWidth, pillHeight } = getPillDimensions(
      pillLabels,
      pillFontSize,
      pillPaddingX,
      pillPaddingY,
    );
    const columns =
      children.length > 0 ? Math.min(ungroupedColumns, children.length) : 0;
    const rows = columns > 0 ? Math.ceil(children.length / columns) : 0;
    const contentInnerWidth =
      columns > 0 ? columns * pillWidth + (columns - 1) * pillGap : 0;
    const contentInnerHeight =
      rows > 0 ? rows * pillHeight + (rows - 1) * pillGap : 0;

    return {
      label: layerLabel,
      labelWidth,
      labelHeight,
      hasGroups: false,
      children,
      pillWidth,
      pillHeight,
      columns,
      contentInnerWidth,
      contentInnerHeight,
    };
  });

  const maxLabelWidth = rowInfos.reduce(
    (max, row) => Math.max(max, row.labelWidth),
    0,
  );
  const targetContentInnerWidth = rowInfos.reduce(
    (max, row) => Math.max(max, row.contentInnerWidth),
    0,
  );

  const getRowColors = (layerIndex: number) => {
    const rowColor =
      getPaletteColor(options, [layerIndex]) ||
      themeColors.colorPrimary ||
      '#6c7dff';
    return {
      rowFill: applyAlpha(rowColor, rowBackgroundAlpha),
      rowStroke: applyAlpha(rowColor, rowBorderAlpha),
      groupFill: applyAlpha(rowColor, groupBackgroundAlpha),
      groupStroke: applyAlpha(rowColor, groupBorderAlpha),
      pillFill: applyAlpha(rowColor, pillBackgroundAlpha),
      pillStroke: applyAlpha(rowColor, pillBorderAlpha),
    };
  };

  const renderRowFrame = (
    layerLabel: string,
    layerIndexes: number[],
    labelX: number,
    labelY: number,
    labelWidth: number,
    labelHeight: number,
    rowY: number,
    rowHeight: number,
    contentX: number,
    contentY: number,
    contentWidth: number,
    contentHeight: number,
    rowFill: string,
    rowStroke: string,
  ) => {
    decorElements.push(
      <Rect
        x={labelX}
        y={rowY}
        width={labelWidth}
        height={rowHeight}
        fill={rowFill}
        stroke={rowStroke}
        rx={rowRadius}
        ry={rowRadius}
        data-element-type="shape"
      />,
    );
    decorElements.push(
      <Rect
        x={contentX}
        y={contentY}
        width={contentWidth}
        height={contentHeight}
        fill={rowFill}
        stroke={rowStroke}
        rx={rowRadius}
        ry={rowRadius}
        data-element-type="shape"
      />,
    );

    itemElements.push(
      <Text
        x={labelX}
        y={labelY}
        width={labelWidth}
        height={labelHeight}
        fontSize={labelFontSize}
        fontWeight="bold"
        alignHorizontal="center"
        alignVertical="middle"
        fill={themeColors.colorText}
        data-element-type={ElementTypeEnum.ItemLabel}
        data-indexes={layerIndexes}
      >
        {layerLabel}
      </Text>,
    );
  };

  const renderGroupedRow = (
    rowInfo: (typeof rowInfos)[number],
    layerIndex: number,
    rowY: number,
    rowColors: ReturnType<typeof getRowColors>,
  ) => {
    const groupMetrics = rowInfo.groupMetrics || [];
    const layerLabel = rowInfo.label;
    const layerIndexes = [layerIndex];
    const labelWidth = maxLabelWidth;
    const labelHeight = rowInfo.labelHeight;
    const contentInnerHeight = rowInfo.contentInnerHeight;
    const extraInnerWidth = Math.max(
      0,
      targetContentInnerWidth - rowInfo.contentInnerWidth,
    );
    const extraPerGroup =
      groupMetrics.length > 0 ? extraInnerWidth / groupMetrics.length : 0;
    const contentInnerWidth =
      rowInfo.contentInnerWidth +
      (groupMetrics.length > 0 ? extraInnerWidth : 0);
    const contentWidth = contentInnerWidth + rowPadding * 2;
    const contentHeight = contentInnerHeight + rowPadding * 2;
    const rowHeight = Math.max(labelHeight, contentHeight);
    const contentX = isLabelOnRight ? 0 : labelWidth + labelGap;
    const labelX = isLabelOnRight ? contentX + contentWidth + labelGap : 0;
    const labelY = rowY + (rowHeight - labelHeight) / 2;
    const contentY = rowY + (rowHeight - contentHeight) / 2;

    renderRowFrame(
      layerLabel,
      layerIndexes,
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      rowY,
      rowHeight,
      contentX,
      contentY,
      contentWidth,
      contentHeight,
      rowColors.rowFill,
      rowColors.rowStroke,
    );

    let groupX = contentX + rowPadding;
    groupMetrics.forEach((metric, groupIndex) => {
      const groupIndexes = [...layerIndexes, groupIndex];
      const groupWidth = metric.width + extraPerGroup;
      const groupY =
        contentY + rowPadding + (contentInnerHeight - metric.height) / 2;

      decorElements.push(
        <Rect
          x={groupX}
          y={groupY}
          width={groupWidth}
          height={metric.height}
          fill={rowColors.groupFill}
          stroke={rowColors.groupStroke}
          rx={groupRadius}
          ry={groupRadius}
          data-element-type="shape"
        />,
      );

      const hasGroupChildren = metric.children.length > 0;
      const titleY = hasGroupChildren ? groupY + groupPadding : groupY;
      const titleHeight = hasGroupChildren ? metric.titleHeight : metric.height;
      const titleAlignV = hasGroupChildren ? 'top' : 'middle';

      itemElements.push(
        <Text
          x={groupX + groupPadding}
          y={titleY}
          width={groupWidth - groupPadding * 2}
          height={titleHeight}
          fontSize={groupTitleFontSize}
          fontWeight="bold"
          alignHorizontal="center"
          alignVertical={titleAlignV}
          fill={themeColors.colorText}
          data-element-type={ElementTypeEnum.ItemLabel}
          data-indexes={groupIndexes}
        >
          {metric.label}
        </Text>,
      );

      if (metric.columns > 0) {
        const innerWidth = groupWidth - groupPadding * 2;
        const extraWidth = innerWidth - metric.contentWidth;
        const columnExtra = extraWidth > 0 ? extraWidth / metric.columns : 0;
        const pillWidth = metric.pillWidth + columnExtra;
        const contentWidth =
          metric.columns * pillWidth + (metric.columns - 1) * pillGap;
        const contentOffsetX = (innerWidth - contentWidth) / 2;
        const pillStartX = groupX + groupPadding + Math.max(0, contentOffsetX);
        const pillStartY =
          groupY + groupPadding + metric.titleHeight + groupTitleGap;

        metric.children.forEach((pill, pillIndex) => {
          const pillIndexes = [...groupIndexes, pillIndex];
          const rowIndex = Math.floor(pillIndex / metric.columns);
          const colIndex = pillIndex % metric.columns;
          const pillX = pillStartX + colIndex * (pillWidth + pillGap);
          const pillY = pillStartY + rowIndex * (metric.pillHeight + pillGap);
          const pillRx = Math.min(pillRadius, metric.pillHeight / 2);

          decorElements.push(
            <Rect
              x={pillX}
              y={pillY}
              width={pillWidth}
              height={metric.pillHeight}
              fill={rowColors.pillFill}
              stroke={rowColors.pillStroke}
              rx={pillRx}
              ry={pillRx}
              data-element-type="shape"
            />,
          );

          itemElements.push(
            <Text
              x={pillX}
              y={pillY}
              width={pillWidth}
              height={metric.pillHeight}
              fontSize={pillFontSize}
              fontWeight="normal"
              alignHorizontal="center"
              alignVertical="middle"
              fill={themeColors.colorText}
              data-element-type={ElementTypeEnum.ItemLabel}
              data-indexes={pillIndexes}
            >
              {normalizeLabel(pill.label)}
            </Text>,
          );
        });
      }

      groupX += groupWidth + groupGap;
    });

    const rowWidth = isLabelOnRight
      ? labelX + labelWidth
      : contentX + contentWidth;
    return { rowWidth, rowHeight };
  };

  const renderUngroupedRow = (
    rowInfo: (typeof rowInfos)[number],
    layerIndex: number,
    rowY: number,
    rowColors: ReturnType<typeof getRowColors>,
  ) => {
    const layerLabel = rowInfo.label;
    const layerIndexes = [layerIndex];
    const labelWidth = maxLabelWidth;
    const labelHeight = rowInfo.labelHeight;
    const contentInnerHeight = rowInfo.contentInnerHeight;
    const extraInnerWidth = Math.max(
      0,
      targetContentInnerWidth - rowInfo.contentInnerWidth,
    );
    const columns = rowInfo.columns || 0;
    const pillWidthBase = rowInfo.pillWidth || 0;
    const pillHeight = rowInfo.pillHeight || 0;
    const extraPerColumn = columns > 0 ? extraInnerWidth / columns : 0;
    const pillWidth = pillWidthBase + extraPerColumn;
    const contentInnerWidth =
      columns > 0 ? columns * pillWidth + (columns - 1) * pillGap : 0;
    const contentWidth = contentInnerWidth + rowPadding * 2;
    const contentHeight = contentInnerHeight + rowPadding * 2;
    const rowHeight = Math.max(labelHeight, contentHeight);
    const contentX = isLabelOnRight ? 0 : labelWidth + labelGap;
    const labelX = isLabelOnRight ? contentX + contentWidth + labelGap : 0;
    const labelY = rowY + (rowHeight - labelHeight) / 2;
    const contentY = rowY + (rowHeight - contentHeight) / 2;

    renderRowFrame(
      layerLabel,
      layerIndexes,
      labelX,
      labelY,
      labelWidth,
      labelHeight,
      rowY,
      rowHeight,
      contentX,
      contentY,
      contentWidth,
      contentHeight,
      rowColors.rowFill,
      rowColors.rowStroke,
    );

    if (columns > 0) {
      const pillStartX = contentX + rowPadding;
      const pillStartY = contentY + rowPadding;
      const flatChildren = rowInfo.children || [];

      flatChildren.forEach((child, pillIndex) => {
        const pillIndexes = [...layerIndexes, pillIndex];
        const rowIndex = Math.floor(pillIndex / columns);
        const colIndex = pillIndex % columns;
        const pillX = pillStartX + colIndex * (pillWidth + pillGap);
        const pillY = pillStartY + rowIndex * (pillHeight + pillGap);
        const pillRx = Math.min(pillRadius, pillHeight / 2);

        decorElements.push(
          <Rect
            x={pillX}
            y={pillY}
            width={pillWidth}
            height={pillHeight}
            fill={rowColors.pillFill}
            stroke={rowColors.pillStroke}
            rx={pillRx}
            ry={pillRx}
            data-element-type="shape"
          />,
        );

        itemElements.push(
          <Text
            x={pillX}
            y={pillY}
            width={pillWidth}
            height={pillHeight}
            fontSize={pillFontSize}
            fontWeight="normal"
            alignHorizontal="center"
            alignVertical="middle"
            fill={themeColors.colorText}
            data-element-type={ElementTypeEnum.ItemLabel}
            data-indexes={pillIndexes}
          >
            {normalizeLabel(child.label)}
          </Text>,
        );
      });
    }

    const rowWidth = isLabelOnRight
      ? labelX + labelWidth
      : contentX + contentWidth;
    return { rowWidth, rowHeight };
  };

  let currentY = 0;
  let maxWidth = 0;

  rowInfos.forEach((rowInfo, layerIndex) => {
    const rowColors = getRowColors(layerIndex);
    const { rowWidth, rowHeight } = rowInfo.hasGroups
      ? renderGroupedRow(rowInfo, layerIndex, currentY, rowColors)
      : renderUngroupedRow(rowInfo, layerIndex, currentY, rowColors);

    maxWidth = Math.max(maxWidth, rowWidth);
    currentY += rowHeight + rowGap;
  });

  const totalHeight = Math.max(currentY - rowGap, 0);

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group width={maxWidth} height={totalHeight}>
        <Group>{decorElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('hierarchy-structure', {
  component: HierarchyStructure,
  composites: ['title'],
});
