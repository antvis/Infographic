import type { InfographicOptions } from '../options';
import { mapWithSchema } from './mapper';
import { parseSyntaxToAst } from './parser';
import {
  DataSchema,
  DesignSchema,
  RootSchema,
  TemplateSchema,
  ThemeSchema,
} from './schema';
import type { SyntaxNode, SyntaxParseResult } from './types';

function resolveTemplate(
  node: SyntaxNode | undefined,
  errors: SyntaxParseResult['errors'],
) {
  if (!node) return undefined;
  const mapped = mapWithSchema(node, TemplateSchema, 'template', errors);
  if (!mapped) return undefined;
  if (typeof mapped === 'string') return mapped;
  if (typeof mapped === 'object' && typeof mapped.type === 'string') {
    return mapped.type;
  }
  return undefined;
}

export function parseSyntax(input: string): SyntaxParseResult {
  const { ast, errors } = parseSyntaxToAst(input);
  const warnings: SyntaxParseResult['warnings'] = [];
  const options: Partial<InfographicOptions> = {};

  const mergedEntries = { ...ast.entries };
  const infographicNode = ast.entries.infographic;
  let templateFromInfographic: string | undefined;
  if (infographicNode && infographicNode.kind === 'object') {
    if (infographicNode.value) templateFromInfographic = infographicNode.value;
    Object.entries(infographicNode.entries).forEach(([key, value]) => {
      if (!(key in mergedEntries)) mergedEntries[key] = value;
    });
  }

  const allowedRootKeys = new Set([
    'infographic',
    'template',
    'design',
    'data',
    'theme',
    'width',
    'height',
  ]);
  Object.keys(mergedEntries).forEach((key) => {
    if (!allowedRootKeys.has(key)) {
      errors.push({
        path: key,
        line: (mergedEntries[key] as SyntaxNode).line,
        code: 'unknown_key',
        message: 'Unknown top-level key.',
        raw: key,
      });
    }
  });

  const templateNode = mergedEntries.template as SyntaxNode | undefined;
  const templateValue = resolveTemplate(templateNode, errors);
  if (templateValue) options.template = templateValue;
  if (!options.template && templateFromInfographic) {
    options.template = templateFromInfographic;
  }

  const designNode = mergedEntries.design as SyntaxNode | undefined;
  if (designNode) {
    const design = mapWithSchema(designNode, DesignSchema, 'design', errors);
    if (design) options.design = design;
  }

  const dataNode = mergedEntries.data as SyntaxNode | undefined;
  if (dataNode) {
    const data = mapWithSchema(dataNode, DataSchema, 'data', errors);
    if (data) options.data = data;
  }

  const themeNode = mergedEntries.theme as SyntaxNode | undefined;
  if (themeNode) {
    const theme = mapWithSchema(themeNode, ThemeSchema, 'theme', errors);
    if (theme && typeof theme === 'object') {
      const { type, ...rest } = theme as Record<string, any>;
      if (typeof type === 'string' && type) options.theme = type;
      if (Object.keys(rest).length > 0) {
        options.themeConfig = rest;
      }
    }
  }

  const widthNode = mergedEntries.width as SyntaxNode | undefined;
  if (widthNode) {
    const width = mapWithSchema(
      widthNode,
      RootSchema.fields.width,
      'width',
      errors,
    );
    if (width !== undefined) options.width = width;
  }

  const heightNode = mergedEntries.height as SyntaxNode | undefined;
  if (heightNode) {
    const height = mapWithSchema(
      heightNode,
      RootSchema.fields.height,
      'height',
      errors,
    );
    if (height !== undefined) options.height = height;
  }

  return {
    options,
    errors,
    warnings,
    ast,
  };
}

export type { SyntaxError, SyntaxNode, SyntaxParseResult } from './types';
