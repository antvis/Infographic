import {Infographic, InfographicHandle} from 'components/Infographic';
import {useEffect, useRef, useState} from 'react';
import {useLocaleBundle} from 'hooks/useTranslation';

const TRANSLATIONS = {
  'zh-CN': {
    title: '实时预览',
    copyButton: '复制',
    pngButton: 'PNG',
    svgButton: 'SVG',
    fullscreenButton: '全屏',
    exitFullscreenButton: '退出全屏',
    pngExported: 'PNG 已导出',
    svgExported: 'SVG 已导出',
  },
  'en-US': {
    title: 'Live Preview',
    copyButton: 'Copy',
    pngButton: 'PNG',
    svgButton: 'SVG',
    fullscreenButton: 'Fullscreen',
    exitFullscreenButton: 'Exit',
    pngExported: 'PNG exported',
    svgExported: 'SVG exported',
  },
};

export function PreviewPanel({
  syntax,
  onError,
  error,
  onCopySuccess,
  onExportSuccess,
}: {
  syntax: string;
  onError: (error: string | null) => void;
  error: string | null;
  onCopySuccess: () => void;
  onExportSuccess: (message: string) => void;
}) {
  const texts = useLocaleBundle(TRANSLATIONS);
  const [displaySyntax, setDisplaySyntax] = useState(syntax);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const debounceTimerRef = useRef<number>(0);
  const infographicRef = useRef<InfographicHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce updates for better performance
    debounceTimerRef.current = window.setTimeout(() => {
      setDisplaySyntax(syntax);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [syntax]);

  const handleError = (err: Error | null) => {
    onError(err ? err.message : null);
  };

  const handleCopy = async () => {
    const success = await infographicRef.current?.copyToClipboard();
    if (success) {
      onCopySuccess();
    }
  };

  const handleExportPNG = async () => {
    await infographicRef.current?.exportPNG();
    onExportSuccess(texts.pngExported);
  };

  const handleExportSVG = async () => {
    await infographicRef.current?.exportSVG();
    onExportSuccess(texts.svgExported);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-card dark:bg-card-dark rounded-lg shadow-lg p-4 flex flex-col ${
        isFullscreen ? 'fixed top-16 left-0 right-0 bottom-0 z-50 rounded-none' : ''
      }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary dark:text-primary-dark">
          {texts.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-sm bg-link hover:bg-link-dark text-white rounded transition-colors">
            {texts.copyButton}
          </button>
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 text-sm bg-link hover:bg-link-dark text-white rounded transition-colors">
            {texts.pngButton}
          </button>
          <button
            onClick={handleExportSVG}
            className="px-3 py-1.5 text-sm bg-link hover:bg-link-dark text-white rounded transition-colors">
            {texts.svgButton}
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary text-primary dark:text-primary-dark rounded transition-colors">
            {isFullscreen ? texts.exitFullscreenButton : texts.fullscreenButton}
          </button>
        </div>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}
      <div className="flex-1 w-full flex items-center justify-center border border-border dark:border-border-dark rounded overflow-auto">
        <Infographic
          ref={infographicRef}
          options={displaySyntax}
          onError={handleError}
          enableEditor={true}
        />
      </div>
    </div>
  );
}
