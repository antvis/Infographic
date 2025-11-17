import type { Item } from './types';

const ITEM_REGISTRY = new Map<string, Item>();

export function registerItem(type: string, item: Item) {
  ITEM_REGISTRY.set(type, item);
}

export function getItem(type: string): Item | undefined {
  return ITEM_REGISTRY.get(type);
}

export function getItems(): string[] {
  return Array.from(ITEM_REGISTRY.keys());
}
