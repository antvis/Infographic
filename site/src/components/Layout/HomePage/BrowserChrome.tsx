'use client';

import {Tooltip} from 'antd';
import cn from 'classnames';
import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {useFullscreen} from '../../../hooks/useFullscreen';
import {IconErrorCircle} from '../../Icon/IconErrorCircle';
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
  errorTitle?: string;
  toolbarContent?: ReactNode;
  hideDefaultActions?: boolean;
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
  errorTitle,
  toolbarContent,
  hideDefaultActions = false,
}: BrowserChromeProps) {
  const [restartId, setRestartId] = useState(0);
  const isPulsing = hasPulse && restartId === 0;
  const [shouldAnimatePulse, setShouldAnimatePulse] = useState(false);
  const refreshRef = useRef<HTMLDivElement>(null);

  // 使用自定义布局计算函数
  const calculateFullscreenLayout = useCallback(
    (size: {width: number; height: number}) => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const scaleX = (viewportWidth * 0.8) / size.width;
      const scaleY = (viewportHeight * 0.8) / size.height;

      // Use the smaller scale to fit both dimensions, with an upper bound
      const scale = Math.min(scaleX, scaleY, 1.5);

      const finalWidth = size.width * scale;
      const finalHeight = size.height * scale;

      const left = (viewportWidth - finalWidth) / 2;
      const top = (viewportHeight - finalHeight) / 2;

      return {
        scale,
        width: size.width,
        height: size.height,
        left,
        top,
      };
    },
    []
  );

  // 使用 useFullscreen hook
  const {
    isFullscreen,
    fullscreenLayout,
    placeholderSize,
    toggleFullscreen,
    containerRef,
    renderFullscreenPortal,
  } = useFullscreen({
    calculateLayout: calculateFullscreenLayout,
  });

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

  const chromeContent = (
    <>
      {/* 地址栏 */}
      <div className="w-full h-14 rounded-t-2xl shadow-outer-border backdrop-filter overflow-visible backdrop-blur-lg backdrop-saturate-200 bg-wash dark:bg-card-dark z-50 absolute top-0 px-3 gap-2 flex flex-row items-center">
        <div className="h-8 relative bg-gray-30/20 dark:bg-gray-950 text-sm text-tertiary dark:text-tertiary-dark text-center rounded-full flex-1 min-w-0 flex-row flex items-center justify-center px-3">
          {hasRefresh && <div className="h-4 w-6" />}
          <div className="w-full leading-snug flex flex-row items-center justify-center truncate">
            {/* 锁图标或错误图标 */}
            {error ? (
              <Tooltip
                placement="bottom"
                mouseEnterDelay={0.15}
                title={
                  <div className="space-y-1 max-w-xs">
                    {errorTitle && (
                      <div className="font-semibold">{errorTitle}</div>
                    )}
                    <div className="font-mono text-[11px] break-words whitespace-pre-wrap leading-relaxed">
                      {error}
                    </div>
                  </div>
                }>
                <span className="inline-flex">
                  <IconErrorCircle className="text-red-500 dark:text-red-400 me-1" />
                </span>
              </Tooltip>
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
              {!!domain && '/'}
            </span>
            {path}
          </div>
        </div>

        {toolbarContent && (
          <div className="flex items-center gap-1.5 shrink-0 ps-1">
            {toolbarContent}
          </div>
        )}

        {!hideDefaultActions && (
          <div className="flex items-center gap-1.5 shrink-0 ps-1">
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
        )}

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
    </>
  );

  // 渲染全屏模式
  if (isFullscreen && fullscreenLayout) {
    return (
      <>
        {placeholderSize ? (
          <div style={{height: placeholderSize}} aria-hidden />
        ) : null}
        {renderFullscreenPortal(
          <div
            ref={containerRef}
            className="shadow-nav dark:shadow-nav-dark overflow-hidden dark:border-opacity-10 flex flex-col rounded-2xl relative pointer-events-auto bg-white dark:bg-gray-950"
            style={{
              width: fullscreenLayout.width,
              height: fullscreenLayout.height,
              transform: `scale(${fullscreenLayout.scale})`,
              transformOrigin: 'center',
            }}>
            {chromeContent}
          </div>
        )}
      </>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'shadow-nav dark:shadow-nav-dark overflow-hidden dark:border-opacity-10 flex flex-col rounded-2xl relative mx-auto max-w-3xl w-full h-full z-10'
      )}>
      {chromeContent}
    </div>
  );
}
