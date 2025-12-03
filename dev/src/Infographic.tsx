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
  const type = data.startsWith('illus:') ? 'illustration' : 'icon';
  const _data = data.replace(/^illus:|^icon:/, '');

  const str = await getAsset(type, _data);
  return loadSVGResource(str);
});

export const Infographic = ({ options }: { options: InfographicOptions }) => {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer>(null);

  useEffect(() => {
    if (!options) return;
    if (!ref.current) return;
    if (instanceRef.current && instanceRef.current.getOptions() === options)
      return;

    const instance = new Renderer({
      container: ref.current,
      svg: {
        attributes: {
          width: '100%',
          height: '100%',
        },
        style: {
          maxHeight: '80vh',
        },
      },
      ...options,
    });

    instance.render();
    instanceRef.current = instance;
    Object.assign(window, { infographic: instance });
    return () => {
      instance.destroy();
    };
  }, [options]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
};
