import {InfographicOptions, Infographic as Renderer} from '@antv/infographic';
import {useTheme} from 'hooks/useTheme';
import {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export type InfographicHandle = {
  copyToClipboard: (options?: {removeBackground?: boolean}) => Promise<boolean>;
  exportPNG: (options?: {removeBackground?: boolean}) => Promise<void>;
  exportSVG: (options?: {removeBackground?: boolean}) => Promise<void>;
};

export const Infographic = forwardRef<
  InfographicHandle,
  {
    options: Partial<InfographicOptions> | string;
    init?: Partial<InfographicOptions>;
    onError?: (error: Error | null) => void;
    enableEditor?: boolean;
    className?: string;
    style?: CSSProperties;
  }
>(({init, onError, options, enableEditor = false, className, style}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<Renderer | null>(null);
  const theme = useTheme();
  const isDark = useMemo(() => theme === 'dark', [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!instanceRef.current) {
      instanceRef.current = new Renderer({
        container,
        svg: {
          style: {
            width: '100%',
            height: '100%',
          },
        },
        editable: enableEditor,
        ...init,
      });
    }

    try {
      onError?.(null);
      if (typeof options === 'string') {
        instanceRef.current!.render(options as string);
      } else if (options) {
        const finalOptions = {...options};
        delete (finalOptions as Partial<InfographicOptions>).container;

        if (isDark) {
          finalOptions.themeConfig = {...finalOptions.themeConfig};
          finalOptions.theme ||= 'dark';
          finalOptions.themeConfig!.colorBg = '#000';
        }

        instanceRef.current!.render(finalOptions as InfographicOptions);
      }
    } catch (e) {
      console.error('Infographic render error', e);
      const error = e instanceof Error ? e : new Error(String(e));
      onError?.(error);
    }
  }, [init, onError, options, isDark, enableEditor]);

  useEffect(() => {
    return () => {
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, []);

  const handleCopy = useCallback(
    async (options?: {removeBackground?: boolean}) => {
      const instance = instanceRef.current;
      if (!instance) {
        return false;
      }

      try {
        const dataUrl = await instance.toDataURL({
          type: 'png',
          removeBackground: options?.removeBackground ?? false,
        });
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
    },
    []
  );

  const handleDoubleClick = useCallback(() => {
    void handleCopy();
  }, [handleCopy]);

  const getFilename = useCallback((extension: string) => {
    const instance = instanceRef.current;
    if (!instance) return `infographic-${Date.now()}.${extension}`;

    try {
      const options = instance.getOptions();
      const title = options?.data?.title;
      if (title && typeof title === 'string') {
        // Sanitize title for filename (remove invalid characters)
        const sanitized = title.replace(/[<>:"/\\|?*]/g, '-').trim();
        return `${sanitized}.${extension}`;
      }
    } catch (e) {
      console.error('Error getting filename from title:', e);
    }

    return `infographic-${Date.now()}.${extension}`;
  }, []);

  const handleExportPNG = useCallback(
    async (options?: {removeBackground?: boolean}) => {
      const instance = instanceRef.current;
      if (!instance) return;

      try {
        const dataUrl = await instance.toDataURL({
          type: 'png',
          removeBackground: options?.removeBackground ?? false,
        });
        if (!dataUrl) return;
        downloadFile(dataUrl, getFilename('png'));
      } catch (e) {
        console.error('PNG export error', e);
      }
    },
    [getFilename]
  );

  const handleExportSVG = useCallback(
    async (options?: {removeBackground?: boolean}) => {
      const instance = instanceRef.current;
      if (!instance) return;

      try {
        const svgDataUrl = await instance.toDataURL({
          type: 'svg',
          removeBackground: options?.removeBackground ?? false,
        });
        if (!svgDataUrl) return;

        // Convert data URL to blob
        const response = await fetch(svgDataUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        downloadFile(url, getFilename('svg'));
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('SVG export error', e);
      }
    },
    [getFilename]
  );

  useImperativeHandle(
    ref,
    () => ({
      copyToClipboard: handleCopy,
      exportPNG: handleExportPNG,
      exportSVG: handleExportSVG,
    }),
    [handleCopy, handleExportPNG, handleExportSVG]
  );

  return (
    <div
      className={['w-full h-full', className].filter(Boolean).join(' ')}
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      style={style}
    />
  );
});

Infographic.displayName = 'Infographic';
