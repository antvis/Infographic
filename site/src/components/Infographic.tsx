import {InfographicOptions, Infographic as Renderer} from '@antv/infographic';
import {useTheme} from 'hooks/useTheme';
import {useEffect, useMemo, useRef} from 'react';

export function Infographic(props: {options: Partial<InfographicOptions>}) {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);
  const theme = useTheme();
  const isDark = useMemo(() => theme === 'dark', [theme]);
  useEffect(() => {
    if (ref.current) {
      const options = {...props.options};

      if (isDark) {
        options.themeConfig = {...options.themeConfig};
        options.theme ||= 'dark';
        options.themeConfig!.colorBg = '#000';
      }
      try {
        const instance = new Renderer({
          container: ref.current,
          ...options,
          svg: {
            style: {
              width: '100%',
              height: '100%',
            },
          },
        } as InfographicOptions);

        instance.render();
        instanceRef.current = instance;
      } catch (e) {
        console.error('Infographic render error', e);
      }
    }

    return () => {
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, [props.options, isDark]);

  const handleCopy = async () => {
    const instance = instanceRef.current;
    if (!instance) {
      return;
    }

    try {
      const dataUrl = await instance.toDataURL();
      if (!dataUrl) {
        return;
      }

      const clipboard = navigator?.clipboard;
      if (!clipboard) {
        return;
      }

      if ('write' in clipboard && typeof ClipboardItem !== 'undefined') {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await clipboard.write([new ClipboardItem({[blob.type]: blob})]);
      } else if ('writeText' in clipboard) {
        await clipboard.writeText(dataUrl);
      }
    } catch (e) {
      console.error('Infographic copy error', e);
    }
  };

  return <div className="w-full h-full" ref={ref} onDoubleClick={handleCopy} />;
}
