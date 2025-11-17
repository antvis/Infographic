import type { ResourceLoader } from './types';

let customResourceLoader: ResourceLoader | null = null;

export function registerResourceLoader(loader: ResourceLoader) {
  customResourceLoader = loader;
}

export function getCustomResourceLoader(): ResourceLoader | null {
  return customResourceLoader;
}
