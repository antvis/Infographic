'use client';

import cn from 'classnames';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {IconRestart} from '../../Icon/IconRestart';

interface BrowserChromeProps {
  children: ReactNode;
  domain?: string;
  path?: string;
  hasRefresh?: boolean;
  hasPulse?: boolean;
  hasFullscreen?: boolean;
  onRestart?: () => void;
  error?: string | null;
}

/**
 * 浏览器窗口容器组件
 *
 * 模拟浏览器窗口的外观，包含地址栏和刷新按钮
 *
 * @example
 * <BrowserChrome domain="example.com" path="index.html" hasRefresh>
 *   <div>Your content here</div>
 * </BrowserChrome>
 */
export function BrowserChrome({
  children,
  domain = 'example.com',
  path,
  hasRefresh = false,
  hasPulse = false,
  hasFullscreen = false,
  onRestart,
  error,
}: BrowserChromeProps) {
  const [restartId, setRestartId] = useState(0);
  const isPulsing = hasPulse && restartId === 0;
  const [shouldAnimatePulse, setShouldAnimatePulse] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scaleAndPosition, setScaleAndPosition] = useState<{
    scale: number;
    translateX: number;
    translateY: number;
  } | null>(null);
  const refreshRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPulsing) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setShouldAnimatePulse(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: `0px 0px`,
      }
    );
    if (refreshRef.current) {
      observer.observe(refreshRef.current);
    }
    return () => observer.disconnect();
  }, [isPulsing]);

  function handleRestart() {
    setRestartId((i) => i + 1);
    onRestart?.();
  }

  function toggleFullscreen() {
    if (!isFullscreen && containerRef.current) {
      // 获取当前窗口的位置和尺寸
      const rect = containerRef.current.getBoundingClientRect();
      const originalWidth = rect.width;
      const originalHeight = rect.height;
      const originalCenterX = rect.left + originalWidth / 2;
      const originalCenterY = rect.top + originalHeight / 2;

      // 计算缩放比例
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // 使用视口高度的70%作为目标高度
      const targetHeight = viewportHeight * 0.7;
      let scale = targetHeight / originalHeight;

      // 如果宽度超过视口宽度的70%，则以宽度为准重新计算
      const scaledWidth = originalWidth * scale;
      if (scaledWidth > viewportWidth * 0.7) {
        const targetWidth = viewportWidth * 0.7;
        scale = targetWidth / originalWidth;
      }

      // 计算需要平移的距离（让中心点移动到视口中心）
      const viewportCenterX = viewportWidth / 2;
      const viewportCenterY = viewportHeight / 2;

      const translateX = viewportCenterX - originalCenterX;
      const translateY = viewportCenterY - originalCenterY;

      setScaleAndPosition({
        scale,
        translateX,
        translateY,
      });
    }
    setIsFullscreen((prev) => !prev);
  }

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    // 获取滚动条宽度
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // 禁用滚动并补偿滚动条宽度
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isFullscreen]);

  return (
    <>
      {/* 全屏遮罩 */}
      <div
        className={cn(
          'fixed inset-0 bg-black backdrop-blur-sm transition-opacity duration-400 ease-in-out pointer-events-none z-[9998]',
          isFullscreen && 'pointer-events-auto'
        )}
        style={{
          opacity: isFullscreen ? 0.8 : 0,
        }}
        onClick={isFullscreen ? toggleFullscreen : undefined}
      />

      <div
        ref={containerRef}
        className={cn(
          'shadow-nav dark:shadow-nav-dark overflow-hidden dark:border-opacity-10 flex flex-col rounded-2xl relative mx-auto max-w-3xl w-full h-full z-10',
          isFullscreen && 'z-[9999]'
        )}
        style={
          isFullscreen && scaleAndPosition
            ? {
                transform: `translate(${scaleAndPosition.translateX}px, ${scaleAndPosition.translateY}px) scale(${scaleAndPosition.scale})`,
                transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }
            : {
                transform: 'translate(0, 0) scale(1)',
                transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
              }
        }>
        {/* 地址栏 */}
        <div className="w-full h-14 rounded-t-2xl shadow-outer-border backdrop-filter overflow-visible backdrop-blur-lg backdrop-saturate-200 bg-wash dark:bg-card-dark z-50 absolute top-0 px-3 gap-2 flex flex-row items-center">
          <div className="select-none h-8 relative bg-gray-30/20 dark:bg-gray-950 text-sm text-tertiary dark:text-tertiary-dark text-center rounded-full w-full flex-row flex space-between items-center">
            {hasRefresh && <div className="h-4 w-6" />}
            <div className="w-full leading-snug flex flex-row items-center justify-center">
              {/* 锁图标或错误图标 */}
              {error ? (
                <div className="relative group">
                  <svg
                    className="text-red-500 dark:text-red-400 me-1"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="currentColor"
                    />
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block z-[100] w-64">
                    <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg p-3 shadow-xl">
                      <div className="font-semibold mb-1">JSON 语法错误</div>
                      <div className="font-mono text-[11px] break-words">
                        {error}
                      </div>
                      {/* 小三角 */}
                      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <svg
                  className="text-tertiary dark:text-tertiary-dark me-1 opacity-60"
                  width="12"
                  height="12"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22 4C17.0294 4 13 8.0294 13 13V16H12.3103C10.5296 16 8.8601 16.8343 8.2855 18.5198C7.6489 20.387 7 23.4148 7 28C7 32.5852 7.6489 35.613 8.2855 37.4802C8.8601 39.1657 10.5296 40 12.3102 40H31.6897C33.4704 40 35.1399 39.1657 35.7145 37.4802C36.3511 35.613 37 32.5852 37 28C37 23.4148 36.3511 20.387 35.7145 18.5198C35.1399 16.8343 33.4704 16 31.6897 16H31V13C31 8.0294 26.9706 4 22 4ZM25 16V13C25 11.3431 23.6569 10 22 10C20.3431 10 19 11.3431 19 13V16H25Z"
                    fill="currentColor"
                  />
                </svg>
              )}

              <span className="text-gray-30 dark:text-gray-60">
                {domain}
                {path != null && '/'}
              </span>
              {path}
            </div>

            {/* 刷新按钮 */}
            {hasRefresh && (
              <div
                ref={refreshRef}
                className={cn(
                  'relative rounded-full flex justify-center items-center',
                  isPulsing && shouldAnimatePulse && 'animation-pulse-button'
                )}>
                {isPulsing && shouldAnimatePulse && (
                  <div className="z-0 absolute shadow-[0_0_0_8px_rgba(0,0,0,0.5)] inset-0 rounded-full animation-pulse-shadow" />
                )}
                <button
                  aria-label="Reload"
                  onClick={handleRestart}
                  className={
                    'z-10 flex items-center p-1.5 rounded-full cursor-pointer justify-center bg-[#ebecef] hover:bg-[#d3d7de] dark:bg-gray-70 dark:hover:bg-gray-60'
                  }>
                  <IconRestart className="text-tertiary dark:text-tertiary-dark text-lg" />
                </button>
              </div>
            )}

            {/* 全屏按钮 */}
            {hasFullscreen && (
              <button
                aria-label={
                  isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                }
                onClick={toggleFullscreen}
                className="flex items-center p-1.5 rounded-full cursor-pointer justify-center bg-[#ebecef] hover:bg-[#d3d7de] dark:bg-gray-70 dark:hover:bg-gray-60 transition-colors">
                {isFullscreen ? (
                  <svg
                    className="text-tertiary dark:text-tertiary-dark"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 14h6m0 0v6m0-6l-7 7m17-11h-6m0 0V4m0 6l7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="text-tertiary dark:text-tertiary-dark"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* 加载进度条 */}
          {restartId > 0 && (
            <div
              key={restartId}
              className="z-10 loading h-0.5 bg-link dark:bg-link-dark transition-all duration-200 absolute bottom-0 start-0"
              style={{
                animation: `progressbar 2000ms ease-in-out`,
              }}
            />
          )}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 flex flex-col min-h-0" key={restartId}>
          {children}
        </div>
      </div>
    </>
  );
}
