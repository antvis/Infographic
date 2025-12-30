import {IconCopy} from 'components/Icon/IconCopy';
import {IconDownload} from 'components/Icon/IconDownload';
import {Infographic, InfographicHandle} from 'components/Infographic';
import {useLocaleBundle} from 'hooks/useTranslation';
import {useEffect, useRef, useState} from 'react';

const TRANSLATIONS = {
  'zh-CN': {
    title: '实时预览',
    copyButton: '复制',
    pngButton: 'PNG',
    svgButton: 'SVG',
    fullscreenButton: '全屏',
    exitFullscreenButton: '退出',
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
  const [zoom, setZoom] = useState(1);
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
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    // Emit event for parent to handle topnav visibility
    if (newFullscreen) {
      window.dispatchEvent(
        new CustomEvent('preview-fullscreen', {detail: {fullscreen: true}})
      );
    } else {
      window.dispatchEvent(
        new CustomEvent('preview-fullscreen', {detail: {fullscreen: false}})
      );
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        window.dispatchEvent(
          new CustomEvent('preview-fullscreen', {detail: {fullscreen: false}})
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Clean up fullscreen state on unmount
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        window.dispatchEvent(
          new CustomEvent('preview-fullscreen', {detail: {fullscreen: false}})
        );
      }
    };
  }, [isFullscreen]);

  // Handle wheel zoom with Command/Ctrl key
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if Command (Mac) or Ctrl (Windows/Linux) is pressed
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();

        // Determine zoom direction (deltaY negative = zoom in, positive = zoom out)
        const delta = Math.sign(e.deltaY) * -0.1;

        setZoom((prev) => {
          const newZoom = prev + delta;
          return Math.min(Math.max(newZoom, 0.5), 2);
        });
      }
    };

    container.addEventListener('wheel', handleWheel, {passive: false});
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`bg-card dark:bg-card-dark rounded-xl shadow-xl flex flex-col h-full overflow-hidden border border-border dark:border-border-dark transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[1000] rounded-none' : ''
      }`}>
      <div className="flex items-center justify-between px-4 py-3 bg-wash dark:bg-wash-dark border-b border-border dark:border-border-dark">
        <h2 className="text-base font-semibold text-primary dark:text-primary-dark flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              error ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          {texts.title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            title={texts.copyButton}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-secondary hover:text-link hover:bg-link/10 rounded-md transition-all"
            aria-label={texts.copyButton}>
            <IconCopy className="w-4 h-4" />
            <span className="hidden sm:inline">{texts.copyButton}</span>
          </button>
          <div className="w-[1px] h-4 bg-border dark:bg-border-dark self-center mx-1" />
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded transition-all"
            aria-label={texts.pngButton}>
            <IconDownload className="w-3.5 h-3.5" />
            {texts.pngButton}
          </button>
          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded transition-all"
            aria-label={texts.svgButton}>
            <IconDownload className="w-3.5 h-3.5" />
            {texts.svgButton}
          </button>
        </div>
      </div>
      <div className="flex-1 relative bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
        {error && (
          <div className="absolute top-4 left-4 right-4 z-10 p-3 bg-red-50/90 dark:bg-red-900/40 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm shadow-lg">
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Error
            </div>
            {error}
          </div>
        )}
        {/* Floating Control Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-border dark:border-border-dark rounded-lg shadow-lg">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 text-secondary hover:text-link hover:bg-link/10 rounded transition-all"
            aria-label="Zoom Out">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
              />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="px-2 py-1 text-xs font-mono font-medium text-secondary hover:text-link hover:bg-link/10 rounded transition-all min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 text-secondary hover:text-link hover:bg-link/10 rounded transition-all"
            aria-label="Zoom In">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </button>
          <div className="w-[1px] h-5 bg-border dark:bg-border-dark" />
          <button
            onClick={handleToggleFullscreen}
            title={
              isFullscreen ? texts.exitFullscreenButton : texts.fullscreenButton
            }
            className="p-1.5 text-secondary hover:text-link hover:bg-link/10 rounded transition-all"
            aria-label={
              isFullscreen ? texts.exitFullscreenButton : texts.fullscreenButton
            }>
            {isFullscreen ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 9l6 6m0-6-6 6" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            )}
          </button>
        </div>
        <div
          className={`w-full h-full p-8 ${
            zoom === 1 ? 'overflow-auto' : 'overflow-hidden'
          }`}>
          <Infographic
            ref={infographicRef}
            options={displaySyntax}
            onError={handleError}
            enableEditor={true}
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
