import type { TemplateOptions } from './types';

const baseTemplates: Record<string, TemplateOptions> = {
  'compare-quadrant-quarter-simple-card': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'quarter-simple-card' }],
    },
  },
  'compare-quadrant-quarter-circular': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'quarter-circular' }],
    },
  },
  'compare-quadrant-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'quadrant' },
      items: [{ type: 'simple-illus' }],
    },
  },
};

// 兼容旧版 quadrant-xxx 命名的模板
const warnedKeys = new Set<string>();
const wrappedTemplates: Record<string, TemplateOptions> = {};

Object.entries(baseTemplates).forEach(([key, template]) => {
  wrappedTemplates[key] = template;

  const oldKey = key.replace('compare-quadrant', 'quadrant');
  wrappedTemplates[oldKey] = new Proxy(template, {
    get(target, prop, receiver) {
      if (!warnedKeys.has(oldKey)) {
        console.warn(
          `[Deprecated] "${oldKey}" 已被废弃，将在下个版本移除，请使用 "${key}"`,
        );
        warnedKeys.add(oldKey);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
});

export const compareQuadrantTemplates = wrappedTemplates;
