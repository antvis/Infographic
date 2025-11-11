import type { HierarchyTreeProps, TemplateOptions } from '../designs';

const structures: Record<string, Partial<HierarchyTreeProps>> = {
  // 默认样式
  default: {},

  // ========== 基础样式（优化后） ==========
  // 简约直线风格
  'straight-line': {
    edgeType: 'straight',
    edgeColorMode: 'solid',
    edgeMarker: 'none',
  },
  // 圆角直线风格
  'rounded-line': {
    edgeType: 'straight',
    edgeCornerRadius: 10,
    edgeColorMode: 'gradient',
  },
  // 虚线风格
  'dashed-line': {
    edgeStyle: 'dashed',
    edgeCornerRadius: 10,
    edgeDashPattern: '10,5',
    edgeColorMode: 'gradient',
    edgeMarker: 'dot',
    markerSize: 6,
    edgeOffset: 6,
  },
  // 带箭头的流程图风格
  'arrowed-line': {
    edgeMarker: 'arrow',
    markerSize: 12,
    edgeType: 'straight',
    edgeCornerRadius: 10,
    edgeColorMode: 'solid',
  },
  // 分散起点风格
  'distributed-origin': {
    edgeOrigin: 'distributed',
    edgeOriginPadding: 30,
    edgeMarker: 'dot',
    edgeCornerRadius: 10,
    markerSize: 8,
    edgeColorMode: 'gradient',
  },
  // 曲线风格
  'curved-line': {
    edgeType: 'curved',
    edgeColorMode: 'gradient',
    edgeMarker: 'none',
  },

  // ========== 新增精选样式 ==========
  // 优雅曲线 - 适合展示优雅、流畅的层级关系
  'elegant-curve': {
    edgeType: 'curved',
    edgeColorMode: 'gradient',
    edgeMarker: 'dot',
    markerSize: 6,
    edgeOffset: 4,
  },
  // 科技感 - 适合技术类、现代化的展示
  'tech-style': {
    edgeType: 'straight',
    edgeStyle: 'solid',
    edgeColorMode: 'gradient',
    edgeMarker: 'arrow',
    markerSize: 10,
    edgeCornerRadius: 5,
  },
  // 极简主义 - 最简洁的设计
  minimalist: {
    edgeType: 'straight',
    edgeColorMode: 'solid',
    edgeMarker: 'none',
    edgeCornerRadius: 0,
  },
  // 工程图风格 - 类似工程图纸的严谨风格
  blueprint: {
    edgeType: 'straight',
    edgeStyle: 'dashed',
    edgeDashPattern: '8,4',
    edgeColorMode: 'solid',
    edgeMarker: 'arrow',
    markerSize: 10,
    edgeCornerRadius: 0,
  },
  // 有机流动 - 自然、柔和的曲线
  'organic-flow': {
    edgeType: 'curved',
    edgeColorMode: 'gradient',
    edgeMarker: 'none',
  },
  // 节点强调 - 强调节点连接点
  'node-emphasis': {
    edgeType: 'straight',
    edgeCornerRadius: 8,
    edgeColorMode: 'gradient',
    edgeMarker: 'dot',
    markerSize: 10,
    edgeOffset: 8,
  },
  // 分支可视化 - 清晰展示分支结构
  'branch-visual': {
    edgeType: 'straight',
    edgeOrigin: 'distributed',
    edgeOriginPadding: 20,
    edgeColorMode: 'gradient',
    edgeMarker: 'dot',
    markerSize: 6,
    edgeCornerRadius: 8,
  },
};

const items: string[] = [
  'capsule-item',
  'rounded-rect-node',
  'compact-card',
  'badge-card',
  'ribbon-card',
];

export const hierarchyTreeTemplates: Record<string, TemplateOptions> = {};

const structureName = 'hierarchy-tree';
for (const item of items) {
  for (const [name, structureProps] of Object.entries(structures)) {
    const templateName = `${structureName}-${name}-${item}`;
    hierarchyTreeTemplates[templateName] = {
      design: {
        structure: {
          type: 'hierarchy-tree',
          ...structureProps,
        },
        item: {
          type: item,
        },
      },
    };
  }
}
