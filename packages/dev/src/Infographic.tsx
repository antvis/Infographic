import type { InfographicOptions } from '@antv/infographic';
import {
  loadSVGResource,
  registerResourceLoader,
  Infographic as Renderer,
} from '@antv/infographic';
import { useEffect, useRef } from 'react';
import { getAsset } from './get-asset';

registerResourceLoader(async (config) => {
  const { data } = config;
  const str = await getAsset('icon', data);
  return loadSVGResource(str);
});

export const Infographic = ({ options }: { options: InfographicOptions }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer>(null);

  useEffect(() => {
    if (!options) return;
    if (!ref.current) return;

    const instance = new Renderer({
      container: ref.current,
      ...options,
    });

    instance.render();
    instanceRef.current = instance;
  }, [options]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
};
