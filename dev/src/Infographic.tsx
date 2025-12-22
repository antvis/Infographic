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
  const normalized = data.replace(/^illus:|^icon:/, '');
  const str = await getAsset(type, normalized);
  return loadSVGResource(str);
});

export const Infographic = ({
  options,
  init,
  onError,
}: {
  options: string | InfographicOptions;
  init?: Partial<InfographicOptions>;
  onError?: (error: Error | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (instanceRef.current) return;

    const instance = new Renderer({
      container: containerRef.current,
      svg: {
        attributes: {
          width: '100%',
          height: '100%',
        },
        style: {
          maxHeight: '80vh',
        },
      },
      ...init,
    });
    instanceRef.current = instance;
    Object.assign(window, { infographic: instance });

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [init]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || !options) return;

    try {
      onError?.(null);
      instance.render(options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Dev Infographic render error', error);
      onError?.(error);
    }
  }, [options, onError]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
