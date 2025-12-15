import { ResourceScene } from './scene';

export interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom';
  data: string;
  scene?: ResourceScene;
  [key: string]: any;
}

export type Resource = SVGSymbolElement;

export type ResourceLoader = (
  config: ResourceConfig,
) => Promise<Resource | null>;
