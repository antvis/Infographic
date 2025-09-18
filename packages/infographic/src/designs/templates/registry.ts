import { TemplateOptions } from './types';

const TEMPLATE_REGISTRY = new Map<string, TemplateOptions>();

export function registerTemplate(type: string, template: TemplateOptions) {
  TEMPLATE_REGISTRY.set(type, template);
}

export function getTemplate(type: string): TemplateOptions | undefined {
  return TEMPLATE_REGISTRY.get(type);
}
