import type { TemplateOptions } from './types';
import { findClosestTemplateKey } from './utils';

const TEMPLATE_REGISTRY = new Map<string, TemplateOptions>();

export function registerTemplate(type: string, template: TemplateOptions) {
  TEMPLATE_REGISTRY.set(type, template);
}

export function resolveTemplateKey(type: string): string | undefined {
  if (TEMPLATE_REGISTRY.has(type)) return type;
  return findClosestTemplateKey(type, TEMPLATE_REGISTRY.keys());
}

export function getTemplate(type: string): TemplateOptions | undefined {
  return TEMPLATE_REGISTRY.get(type);
}

export function getTemplates(): string[] {
  return Array.from(TEMPLATE_REGISTRY.keys());
}
