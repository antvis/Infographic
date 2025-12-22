import {InfographicOptions, Infographic as Renderer} from '@antv/infographic';
import {useTheme} from 'hooks/useTheme';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

export type InfographicHandle = {
  copyToClipboard: () => Promise<boolean>;
};

export const Infographic = forwardRef<
  InfographicHandle,
  {
    options: Partial<InfographicOptions> | string;
    init?: Partial<InfographicOptions>;
    onError?: (error: Error | null) => void;
  }
>(({init, onError, options}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);
  const theme = useTheme();
  const isDark = useMemo(() => theme === 'dark', [theme]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!instanceRef.current) {
      instanceRef.current = new Renderer({
        container: containerRef.current,
        svg: {
          style: {
            width: '100%',
            height: '100%',
          },
        },
        ...init,
      });
    }

    try {
      onError?.(null);
      if (typeof options === 'string') {
        instanceRef.current.render(options);
      } else {
        const finalOptions = {...options};
        delete (finalOptions as Partial<InfographicOptions>).container;

        if (isDark) {
          finalOptions.themeConfig = {...finalOptions.themeConfig};
          finalOptions.theme ||= 'dark';
          finalOptions.themeConfig!.colorBg = '#000';
        }

        instanceRef.current.render(finalOptions as InfographicOptions);
      }
    } catch (e) {
      console.error('Infographic render error', e);
      const error = e instanceof Error ? e : new Error(String(e));
      onError?.(error);
    }
  }, [init, onError, options, isDark]);

  useEffect(() => {
    return () => {
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const instance = instanceRef.current;
    if (!instance) {
      return false;
    }

    try {
      const dataUrl = await instance.toDataURL();
      if (!dataUrl) {
        return false;
      }

      const clipboard = navigator?.clipboard;
      if (!clipboard) {
        return false;
      }

      if ('write' in clipboard && typeof ClipboardItem !== 'undefined') {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        await clipboard.write([new ClipboardItem({[blob.type]: blob})]);
      } else if ('writeText' in clipboard) {
        await clipboard.writeText(dataUrl);
      } else {
        return false;
      }

      return true;
    } catch (e) {
      console.error('Infographic copy error', e);
      return false;
    }
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      copyToClipboard: handleCopy,
    }),
    [handleCopy]
  );

  return (
    <div
      className="w-full h-full"
      ref={containerRef}
      onDoubleClick={handleCopy}
    />
  );
});

Infographic.displayName = 'Infographic';
