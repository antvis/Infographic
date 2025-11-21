import {InfographicOptions, Infographic as Renderer} from '@antv/infographic';
import {useTheme} from 'hooks/useTheme';
import {useEffect, useMemo, useRef} from 'react';

export function Infographic(props: {options: Partial<InfographicOptions>}) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDark = useMemo(() => theme === 'dark', [theme]);

  useEffect(() => {
    if (ref.current) {
      if (isDark) {
        const options = {...props.options};
        if (!options.themeConfig) options.themeConfig = {};
        options.theme ||= 'dark';
        options.themeConfig!.colorBg = '#000';
      }

      try {
        const instance = new Renderer({
          container: ref.current,
          ...props.options,
          svg: {
            style: {
              width: '100%',
              height: '100%',
            },
          },
        } as InfographicOptions);

        instance.render();
      } catch (e) {
        console.error('Infographic render error', e);
      }
    }
  }, [props.options, isDark]);

  return <div className="w-full h-full" ref={ref} />;
}
