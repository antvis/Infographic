import {getTemplates} from '@antv/infographic';
import {getDataByTemplate} from '../../../../shared/get-template-data';

export type GalleryTemplate = {
  template: string;
  syntax: string;
};

const COMMON_THEME = {
  type: 'light',
  palette: 'antv',
} as const;

const DATA_KEY_ORDER = [
  'title',
  'desc',
  'lists',
  'sequences',
  'compares',
  'root',
  'nodes',
  'relations',
  'values',
  'items',
] as const;
const ITEM_KEY_ORDER = [
  'id',
  'label',
  'value',
  'desc',
  'time',
  'icon',
  'illus',
  'group',
  'category',
  'children',
] as const;
const INLINE_ITEM_KEYS = ['label', 'value', 'time', 'desc'] as const;
const INDENT = '  ';

const orderKeys = (obj: Record<string, any>, preferred: readonly string[]) => {
  const ordered: string[] = [];
  const preferredSet = new Set(preferred);
  preferred.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ordered.push(key);
    }
  });
  Object.keys(obj)
    .filter((key) => !preferredSet.has(key))
    .sort()
    .forEach((key) => ordered.push(key));
  return ordered;
};

const stringifyScalar = (value: unknown) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return String(value);
};

function stringifyArray(items: any[], indentLevel: number) {
  const lines: string[] = [];
  const indent = INDENT.repeat(indentLevel);

  items.forEach((item) => {
    if (item === undefined || item === null) return;

    if (Array.isArray(item)) {
      lines.push(`${indent}- ${item.map(stringifyScalar).join(' ')}`);
      return;
    }

    if (typeof item === 'object') {
      const record = item as Record<string, any>;
      const inlineKey = INLINE_ITEM_KEYS.find(
        (key) =>
          record[key] !== undefined &&
          record[key] !== null &&
          typeof record[key] !== 'object'
      );
      if (inlineKey) {
        lines.push(
          `${indent}- ${inlineKey} ${stringifyScalar(record[inlineKey])}`
        );
      } else {
        lines.push(`${indent}-`);
      }
      const omit = inlineKey ? new Set([inlineKey]) : new Set<string>();
      const nested = stringifyObject(
        record,
        indentLevel + 1,
        ITEM_KEY_ORDER,
        omit
      );
      if (nested.length) {
        lines.push(...nested);
      }
      return;
    }

    lines.push(`${indent}- ${stringifyScalar(item)}`);
  });

  return lines;
}

function stringifyObject(
  obj: Record<string, any>,
  indentLevel: number,
  keyOrder: readonly string[],
  omitKeys: Set<string> = new Set()
) {
  const lines: string[] = [];
  const indent = INDENT.repeat(indentLevel);
  const keys = orderKeys(obj, keyOrder);

  keys.forEach((key) => {
    if (omitKeys.has(key)) return;
    const value = obj[key];
    if (value === undefined || value === null) return;

    if (key === 'relations' && Array.isArray(value)) {
      if (value.length === 0) return;
      lines.push(`${indent}${key}`);
      value.forEach((relation: any) => {
        const {from, to, label} = relation;
        if (from && to) {
          lines.push(
            `${indent}${INDENT}${
              label ? `${from} - ${label} -> ${to}` : `${from} -> ${to}`
            }`
          );
        }
      });
      return;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return;
      lines.push(`${indent}${key}`);
      lines.push(...stringifyArray(value, indentLevel + 1));
      return;
    }

    if (typeof value === 'object') {
      const nested = stringifyObject(value, indentLevel + 1, []);
      if (nested.length === 0) return;
      lines.push(`${indent}${key}`);
      lines.push(...nested);
      return;
    }

    lines.push(`${indent}${key} ${stringifyScalar(value)}`);
  });

  return lines;
}

const normalizeData = (template: string, data: Record<string, any>) => {
  const normalized: Record<string, any> = {...data};
  const items = normalized.items;

  if (template.startsWith('relation-')) {
    if (normalized.nodes === undefined && items !== undefined) {
      normalized.nodes = items;
      delete normalized.items;
    }
    return normalized;
  }

  if (template.startsWith('chart-')) {
    if (normalized.values === undefined && items !== undefined) {
      normalized.values = items;
      delete normalized.items;
    }
    return normalized;
  }

  if (template.startsWith('sequence-')) {
    if (normalized.sequences === undefined && items !== undefined) {
      normalized.sequences = items;
      delete normalized.items;
    }
    return normalized;
  }

  if (template.startsWith('compare-') || template.includes('quadrant')) {
    if (normalized.compares === undefined && items !== undefined) {
      normalized.compares = items;
      delete normalized.items;
    }
    return normalized;
  }

  if (template.startsWith('hierarchy-structure')) {
    return normalized;
  }

  if (template.startsWith('hierarchy-')) {
    if (normalized.root === undefined && Array.isArray(items) && items.length) {
      normalized.root = items[0];
      delete normalized.items;
    }
    return normalized;
  }

  if (template.startsWith('list-')) {
    if (normalized.lists === undefined && items !== undefined) {
      normalized.lists = items;
      delete normalized.items;
    }
    return normalized;
  }

  return normalized;
};

const buildSyntax = (template: string, data: Record<string, any>) => {
  const lines: string[] = [`infographic ${template}`];
  const normalized = data ? normalizeData(template, data) : data;
  if (normalized && Object.keys(normalized).length > 0) {
    lines.push('data');
    lines.push(...stringifyObject(normalized, 1, DATA_KEY_ORDER));
  }
  lines.push(`theme ${COMMON_THEME.type}`);
  lines.push(`${INDENT}palette ${COMMON_THEME.palette}`);
  return lines.join('\n');
};

// 2. 导出结果 (按字母顺序排序)
export const TEMPLATES: GalleryTemplate[] = getTemplates()
  .map((template) => ({
    template,
    syntax: buildSyntax(template, getDataByTemplate(template)),
  }))
  .sort((a, b) => a.template.localeCompare(b.template));
