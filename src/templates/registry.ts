import type { TemplateOptions } from './types';

const TEMPLATE_REGISTRY = new Map<string, TemplateOptions>();

export function registerTemplate(type: string, template: TemplateOptions) {
  TEMPLATE_REGISTRY.set(type, template);
}

export function getTemplate(type: string): TemplateOptions | undefined {
  return TEMPLATE_REGISTRY.get(type);
}

export function getTemplates(): string[] {
  return Array.from(TEMPLATE_REGISTRY.keys());
}
