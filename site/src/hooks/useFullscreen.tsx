import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export interface FullscreenLayout {
  scale: number;
  width: number;
  height: number;
  left?: number;
  top?: number;
}

export interface UseFullscreenOptions {
  /**
   * 计算全屏布局的函数
   * @param size 原始尺寸
   * @returns 全屏布局参数
   */
  calculateLayout?: (size: {width: number; height: number}) => FullscreenLayout;
}

export interface UseFullscreenReturn {
  /** 是否处于全屏状态 */
  isFullscreen: boolean;
  /** 全屏布局参数 */
  fullscreenLayout: FullscreenLayout | null;
  /** 占位符高度（用于避免页面跳动） */
  placeholderSize: number | null;
  /** 切换全屏状态 */
  toggleFullscreen: () => void;
  /** 容器引用 */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Portal 容器引用 */
  portalContainerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * 渲染全屏 Portal
   * @param children 要在全屏中渲染的内容
   * @param backdrop 是否显示背景遮罩
   * @returns Portal 元素或 null
   */
  renderFullscreenPortal: (
    children: ReactNode,
    backdrop?: boolean
  ) => ReactNode;
}

/**
 * 默认的全屏布局计算函数
 */
const defaultCalculateLayout = (size: {
  width: number;
  height: number;
}): FullscreenLayout => {
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  const scaleX = (viewportWidth * 0.85) / size.width;
  const scaleY = (viewportHeight * 0.85) / size.height;

  // 使用较小的缩放比例以适应两个维度，并设置上限
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
};

/**
 * 全屏功能的可复用 Hook
 *
 * 提供完整的全屏交互功能，包括：
 * - 滚动锁定和滚动条宽度补偿
 * - Escape 键退出全屏
 * - 窗口 resize 响应
 * - Portal 管理
 * - 占位符避免页面跳动
 *
 * @example
 * ```tsx
 * const { isFullscreen, toggleFullscreen, renderFullscreenPortal, containerRef } = useFullscreen();
 *
 * return (
 *   <>
 *     <div ref={containerRef}>
 *       <button onClick={toggleFullscreen}>Toggle Fullscreen</button>
 *       {content}
 *     </div>
 *     {renderFullscreenPortal(content)}
 *   </>
 * );
 * ```
 */
export function useFullscreen(
  options: UseFullscreenOptions = {}
): UseFullscreenReturn {
  const {calculateLayout = defaultCalculateLayout} = options;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenLayout, setFullscreenLayout] =
    useState<FullscreenLayout | null>(null);
  const [placeholderSize, setPlaceholderSize] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const portalContainerRef = useRef<HTMLDivElement | null>(null);
  const baseSizeRef = useRef<{width: number; height: number} | null>(null);

  // 切换全屏状态
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const baseSize = {width: rect.width, height: rect.height};
      baseSizeRef.current = baseSize;
      setPlaceholderSize(rect.height);
      setFullscreenLayout(calculateLayout(baseSize));
    } else {
      baseSizeRef.current = null;
      setFullscreenLayout(null);
      setPlaceholderSize(null);
    }
    setIsFullscreen((prev) => !prev);
  }, [calculateLayout, isFullscreen]);

  // 处理 Escape 键和滚动锁定
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

  // 处理窗口 resize
  useEffect(() => {
    if (!isFullscreen) return;

    const handleResize = () => {
      if (!baseSizeRef.current) return;
      setFullscreenLayout(calculateLayout(baseSizeRef.current));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout, isFullscreen]);

  // 创建和清理 Portal 容器
  useEffect(() => {
    const portalDiv = document.createElement('div');
    portalDiv.className = 'fullscreen-portal';
    document.body.appendChild(portalDiv);
    portalContainerRef.current = portalDiv;
    return () => {
      if (portalContainerRef.current) {
        document.body.removeChild(portalDiv);
        portalContainerRef.current = null;
      }
    };
  }, []);

  // 退出全屏时清理状态
  useEffect(() => {
    if (isFullscreen) return;
    baseSizeRef.current = null;
    setFullscreenLayout(null);
    setPlaceholderSize(null);
  }, [isFullscreen]);

  // 渲染全屏 Portal
  const renderFullscreenPortal = useCallback(
    (children: ReactNode, backdrop: boolean = true) => {
      if (!isFullscreen || !portalContainerRef.current || !fullscreenLayout) {
        return null;
      }

      return createPortal(
        <>
          {backdrop && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
              onClick={toggleFullscreen}
            />
          )}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
            {children}
          </div>
        </>,
        portalContainerRef.current
      );
    },
    [isFullscreen, fullscreenLayout, toggleFullscreen]
  );

  return {
    isFullscreen,
    fullscreenLayout,
    placeholderSize,
    toggleFullscreen,
    containerRef,
    portalContainerRef,
    renderFullscreenPortal,
  };
}
