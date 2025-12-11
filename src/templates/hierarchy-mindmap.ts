import type {
  DesignOptions,
  HierarchyMindmapProps,
  TemplateOptions,
} from '../designs';

const BRANCH_GRADIENT: Partial<HierarchyMindmapProps> = {
  edgeType: 'curved',
  edgeColorMode: 'gradient',
  edgeWidth: 2,
  colorMode: 'branch',
  levelGap: 80,
  nodeGap: 18,
};

const LEVEL_GRADIENT: Partial<HierarchyMindmapProps> = {
  edgeType: 'curved',
  edgeWidth: 2,
  edgeColorMode: 'gradient',
  colorMode: 'level',
  levelGap: 80,
  nodeGap: 18,
};

const LINED_PALETTE = {
  type: 'lined-text',
  usePaletteColor: true,
  showUnderline: true,
  underlineThickness: 2,
};

const CAPSULE = {
  type: 'capsule-item',
};

const CIRCULAR_PROGRESS = {
  type: 'circular-progress',
};

const ROUNDED_RECT_NODE = {
  type: 'rounded-rect-node',
  positionH: 'center',
} as const;

const COMPACT_CARD = {
  type: 'compact-card',
};

const createStructure = (
  gradient: Partial<HierarchyMindmapProps>,
  edgeAlign?: HierarchyMindmapProps['edgeAlign'],
): Partial<HierarchyMindmapProps> & { type: string } => ({
  type: 'hierarchy-mindmap',
  ...(edgeAlign !== undefined ? { edgeAlign } : {}),
  ...gradient,
});

const createTemplate = (
  key: string,
  gradient: Partial<HierarchyMindmapProps>,
  item: DesignOptions['item'],
  edgeAlign?: HierarchyMindmapProps['edgeAlign'],
): [string, TemplateOptions] => [
  key,
  {
    design: {
      structure: createStructure(gradient, edgeAlign),
      item,
    },
  },
];

export const hierarchyMindmapTemplates: Record<string, TemplateOptions> =
  Object.fromEntries([
    createTemplate(
      'hierarchy-mindmap-branch-gradient-lined-palette',
      BRANCH_GRADIENT,
      LINED_PALETTE,
      'bottom',
    ),
    createTemplate(
      'hierarchy-mindmap-level-gradient-lined-palette',
      LEVEL_GRADIENT,
      LINED_PALETTE,
      'bottom',
    ),
    createTemplate(
      'hierarchy-mindmap-branch-gradient-capsule-item',
      BRANCH_GRADIENT,
      CAPSULE,
    ),
    createTemplate(
      'hierarchy-mindmap-level-gradient-capsule-item',
      LEVEL_GRADIENT,
      CAPSULE,
    ),
    createTemplate(
      'hierarchy-mindmap-branch-gradient-circle-progress',
      BRANCH_GRADIENT,
      CIRCULAR_PROGRESS,
      0.4,
    ),
    createTemplate(
      'hierarchy-mindmap-level-gradient-circle-progress',
      LEVEL_GRADIENT,
      CIRCULAR_PROGRESS,
      0.4,
    ),
    createTemplate(
      'hierarchy-mindmap-branch-gradient-rounded-rect',
      BRANCH_GRADIENT,
      ROUNDED_RECT_NODE,
    ),
    createTemplate(
      'hierarchy-mindmap-level-gradient-rounded-rect',
      LEVEL_GRADIENT,
      ROUNDED_RECT_NODE,
    ),
    createTemplate(
      'hierarchy-mindmap-branch-gradient-compact-card',
      BRANCH_GRADIENT,
      COMPACT_CARD,
    ),
    createTemplate(
      'hierarchy-mindmap-level-gradient-compact-card',
      LEVEL_GRADIENT,
      COMPACT_CARD,
    ),
  ]);
