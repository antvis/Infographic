import {useInView} from 'framer-motion';
import NextLink from 'next/link';
import {CSSProperties, useCallback, useEffect, useRef, useState} from 'react';
import {useFullscreen} from '../../../hooks/useFullscreen';
import {useLocaleBundle} from '../../../hooks/useTranslation';

import {Infographic} from '../../Infographic';

type StreamingSyntaxShowcaseProps = {
  cta: string;
  highlights: string[];
  title?: string;
};

// 翻译文本
const TRANSLATIONS = {
  'zh-CN': {
    description: '简洁、高容错的信息图语法，专为生成式 AI 设计',
    timeline: {
      syntax: `infographic list-row-horizontal-icon-arrow
data
  title 产品研发全流程
  desc 从需求到上线的完整链路
  lists
    - label 需求调研
      value 15
      desc 用户访谈与竞品分析
      icon mdi/account-search
    - label 需求评审
      value 28
      desc 技术方案与排期确认
      icon mdi/file-document-edit
    - label UI设计
      value 42
      desc 交互原型与视觉设计
      icon mdi/palette
    - label 前端开发
      value 58
      desc 页面实现与组件封装
      icon mdi/code-tags
    - label 后端开发
      value 65
      desc 接口开发与数据库设计
      icon mdi/database
    - label 联调测试
      value 78
      desc 功能测试与问题修复
      icon mdi/bug
    - label 灰度发布
      value 88
      desc 小范围验证与数据监控
      icon mdi/test-tube
    - label 全量上线
      value 100
      desc 正式发布与用户反馈
      icon mdi/rocket-launch
themeConfig
  palette antv`,
    },
    mindmap: {
      syntax: `infographic hierarchy-mindmap-level-gradient-compact-card
data
  title 现代前端技术体系
  desc 从基础到工程化的完整知识图谱
  root
    label 前端技术体系
    desc 从基础到工程化的完整知识图谱
    children
      - label 前端基础
        icon mdi/language-html5
        children
          - label HTML/CSS
            desc 页面结构与样式
            icon mdi/language-css3
            children
              - label 语义化标签
                icon mdi/xml
              - label Flex布局
                icon mdi/page-layout-body
              - label Grid布局
                icon mdi/grid
              - label 响应式设计
                icon mdi/responsive
          - label JavaScript
            desc 核心语言能力
            icon mdi/language-javascript
            children
              - label ES6+语法
                icon mdi/code-braces
              - label 异步编程
                icon mdi/timer-sand
              - label 函数式编程
                icon mdi/function
              - label 面向对象
                icon mdi/shape
      - label 框架生态
        icon mdi/react
        children
          - label React
            desc 组件化开发
            icon mdi/react
            children
              - label Hooks
                icon mdi/hook
              - label 状态管理
                icon mdi/state-machine
              - label 性能优化
                icon mdi/speedometer
          - label Vue
            desc 渐进式框架
            icon mdi/vuejs
            children
              - label 组合式API
                icon mdi/puzzle
              - label 响应式原理
                icon mdi/flash
              - label 路由管理
                icon mdi/routes
      - label 工程化
        icon mdi/wrench
        children
          - label 构建工具
            desc 打包与编译
            icon mdi/package-variant
            children
              - label Webpack
                icon mdi/webpack
              - label Vite
                icon mdi/lightning-bolt
              - label Rollup
                icon mdi/package
          - label 代码质量
            desc 规范与检查
            icon mdi/shield-check
            children
              - label ESLint
                icon mdi/check-circle
              - label Prettier
                icon mdi/format-paint
              - label TypeScript
                icon mdi/language-typescript
      - label 测试
        icon mdi/test-tube
        children
          - label 单元测试
            desc 函数级别测试
            icon mdi/beaker
            children
              - label Jest
                icon mdi/test-tube
              - label Vitest
                icon mdi/flash
          - label E2E测试
            desc 端到端测试
            icon mdi/monitor
            children
              - label Playwright
                icon mdi/drama-masks
              - label Cypress
                icon mdi/check-all
themeConfig
  palette ribbonCandy`,
    },
  },
  'en-US': {
    description:
      'Concise and fault-tolerant infographic syntax, designed for generative AI',
    timeline: {
      syntax: `infographic list-row-horizontal-icon-arrow
data
  title Product Development Lifecycle
  desc Complete process from requirements to launch
  lists
    - label Research
      value 15
      desc User interviews and competitive analysis
      icon mdi/account-search
    - label Review
      value 28
      desc Technical solution and schedule confirmation
      icon mdi/file-document-edit
    - label UI Design
      value 42
      desc Interaction prototype and visual design
      icon mdi/palette
    - label Frontend Dev
      value 58
      desc Page implementation and component encapsulation
      icon mdi/code-tags
    - label Backend Dev
      value 65
      desc API development and database design
      icon mdi/database
    - label Integration Test
      value 78
      desc Function testing and bug fixing
      icon mdi/bug
    - label Canary Release
      value 88
      desc Small-scale validation and data monitoring
      icon mdi/test-tube
    - label Full Launch
      value 100
      desc Official release and user feedback
      icon mdi/rocket-launch
themeConfig
  palette antv`,
    },
    mindmap: {
      syntax: `infographic hierarchy-mindmap-level-gradient-compact-card
data
  title Modern Frontend Technology
  desc Complete knowledge map from basics to engineering
  root
    label Frontend Tech Stack
    desc Complete knowledge map from basics to engineering
    children
      - label Frontend Basics
        icon mdi/language-html5
        children
          - label HTML/CSS
            desc Page structure and styling
            icon mdi/language-css3
            children
              - label Semantic Tags
                icon mdi/xml
              - label Flex Layout
                icon mdi/page-layout-body
              - label Grid Layout
                icon mdi/grid
              - label Responsive Design
                icon mdi/responsive
          - label JavaScript
            desc Core language capabilities
            icon mdi/language-javascript
            children
              - label ES6+ Syntax
                icon mdi/code-braces
              - label Async Programming
                icon mdi/timer-sand
              - label Functional Programming
                icon mdi/function
              - label OOP
                icon mdi/shape
      - label Framework Ecosystem
        icon mdi/react
        children
          - label React
            desc Component-based development
            icon mdi/react
            children
              - label Hooks
                icon mdi/hook
              - label State Management
                icon mdi/state-machine
              - label Performance Optimization
                icon mdi/speedometer
          - label Vue
            desc Progressive framework
            icon mdi/vuejs
            children
              - label Composition API
                icon mdi/puzzle
              - label Reactivity System
                icon mdi/flash
              - label Router Management
                icon mdi/routes
      - label Engineering
        icon mdi/wrench
        children
          - label Build Tools
            desc Bundling and compilation
            icon mdi/package-variant
            children
              - label Webpack
                icon mdi/webpack
              - label Vite
                icon mdi/lightning-bolt
              - label Rollup
                icon mdi/package
          - label Code Quality
            desc Standards and linting
            icon mdi/shield-check
            children
              - label ESLint
                icon mdi/check-circle
              - label Prettier
                icon mdi/format-paint
              - label TypeScript
                icon mdi/language-typescript
      - label Testing
        icon mdi/test-tube
        children
          - label Unit Testing
            desc Function-level testing
            icon mdi/beaker
            children
              - label Jest
                icon mdi/test-tube
              - label Vitest
                icon mdi/flash
          - label E2E Testing
            desc End-to-end testing
            icon mdi/monitor
            children
              - label Playwright
                icon mdi/drama-masks
              - label Cypress
                icon mdi/check-all
themeConfig
  palette ribbonCandy`,
    },
  },
};
const STREAM_INTERVAL_MS = 50; // 更快的刷新频率
const STREAM_STEP_PERCENT = 2; // 更小的步进，更流畅
const STREAM_RESTART_DELAY = 2000; // 稍长的暂停时间

export function StreamingSyntaxShowcase({
  cta,
  highlights,
}: StreamingSyntaxShowcaseProps) {
  const translation = useLocaleBundle(TRANSLATIONS);
  const [caseType, setCaseType] = useState<'timeline' | 'mindmap'>('timeline');
  const FULL_STREAM_TEXT = translation[caseType].syntax;

  const containerRef = useRef<HTMLDivElement>(null);
  const bufferRef = useRef<HTMLDivElement>(null);
  const lineCountRef = useRef(0);
  const isInView = useInView(containerRef, {margin: '-120px', once: false});
  const isInViewRef = useRef(false);
  const [displayCode, setDisplayCode] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 自定义全屏布局计算
  const calculateFullscreenLayout = useCallback(
    (size: {width: number; height: number}) => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const scaleX = (viewportWidth * 0.85) / size.width;
      const scaleY = (viewportHeight * 0.85) / size.height;

      const scale = Math.min(scaleX, scaleY, 1.5);

      return {
        scale,
        width: size.width,
        height: size.height,
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
    containerRef: infographicContainerRef,
    renderFullscreenPortal,
  } = useFullscreen({
    calculateLayout: calculateFullscreenLayout,
  });

  const streamTimerRef = useRef<number | null>(null);
  const restartTimerRef = useRef<number | null>(null);
  const progressRef = useRef(0); // 保存当前进度
  const scrollStateRef = useRef<{
    animId: number | null;
    target: number;
  }>({animId: null, target: 0});

  const stopStreaming = useCallback(() => {
    if (streamTimerRef.current) {
      window.clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (scrollStateRef.current.animId) {
      window.cancelAnimationFrame(scrollStateRef.current.animId);
      scrollStateRef.current.animId = null;
    }
    setIsStreaming(false);
  }, []);

  const startStreamingRef = useRef<(() => void) | null>(null);
  const startStreaming = useCallback(() => {
    stopStreaming();
    if (!FULL_STREAM_TEXT) return;

    // 如果进度为0，重置显示
    if (progressRef.current === 0) {
      setDisplayCode('');
      setRenderError(null);
    }

    setIsStreaming(true);

    const totalLength = FULL_STREAM_TEXT.length;

    streamTimerRef.current = window.setInterval(() => {
      progressRef.current = Math.min(
        100,
        progressRef.current + STREAM_STEP_PERCENT
      );
      const nextLength = Math.floor((totalLength * progressRef.current) / 100);
      const nextText = FULL_STREAM_TEXT.slice(0, nextLength);
      setDisplayCode(nextText);

      if (progressRef.current >= 100) {
        if (streamTimerRef.current) {
          window.clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
        }
        setIsStreaming(false);
        restartTimerRef.current = window.setTimeout(() => {
          if (!isInViewRef.current || isPaused) return;
          progressRef.current = 0; // 重置进度
          startStreamingRef.current?.();
        }, STREAM_RESTART_DELAY) as unknown as number;
      }
    }, STREAM_INTERVAL_MS) as unknown as number;
  }, [stopStreaming, isPaused, FULL_STREAM_TEXT]);

  useEffect(() => {
    startStreamingRef.current = startStreaming;
  }, [startStreaming]);

  useEffect(() => {
    isInViewRef.current = isInView;
    if (isInView && !isPaused) {
      startStreaming();
    } else {
      stopStreaming();
    }

    return () => {
      stopStreaming();
      // 离开视口时重置进度
      if (!isInView) {
        progressRef.current = 0;
      }
    };
  }, [isInView, startStreaming, stopStreaming, isPaused]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const newPaused = !prev;
      if (!newPaused && isInViewRef.current) {
        // 恢复播放 - 从当前进度继续
        startStreamingRef.current?.();
      } else if (newPaused) {
        // 暂停 - 停止计时器但保留进度
        stopStreaming();
      }
      return newPaused;
    });
  }, [stopStreaming]);

  const shouldAutoScroll = useCallback(() => {
    const el = bufferRef.current;
    if (!el) return false;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    return distanceToBottom < 160;
  }, []);

  const requestSmoothScroll = useCallback(() => {
    const el = bufferRef.current;
    if (!el || !shouldAutoScroll()) return;
    scrollStateRef.current.target = Math.max(
      0,
      el.scrollHeight - el.clientHeight
    );
    if (scrollStateRef.current.animId) return;

    const step = () => {
      const node = bufferRef.current;
      if (!node) {
        scrollStateRef.current.animId = null;
        return;
      }
      const {target} = scrollStateRef.current;
      const current = node.scrollTop;
      const next = current + (target - current) * 0.12;
      if (Math.abs(next - target) < 0.5) {
        node.scrollTop = target;
        scrollStateRef.current.animId = null;
        return;
      }
      node.scrollTop = next;
      scrollStateRef.current.animId = window.requestAnimationFrame(step);
    };

    scrollStateRef.current.animId = window.requestAnimationFrame(step);
  }, [shouldAutoScroll]);

  useEffect(() => {
    const lineCount = displayCode.split('\n').length;
    const hasNewLine = lineCount > lineCountRef.current;
    lineCountRef.current = lineCount;
    if (hasNewLine) {
      requestSmoothScroll();
    }
  }, [displayCode, requestSmoothScroll]);

  const renderInfographicCard = (
    style?: CSSProperties,
    extraClassName?: string
  ) => (
    <div
      ref={infographicContainerRef}
      className={`rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-lg hover:shadow-xl overflow-hidden flex flex-col transition-shadow duration-300 ${
        extraClassName ?? ''
      }`}
      style={style}>
      <div className="border-b border-border dark:border-border-dark bg-wash dark:bg-gray-950/70 px-5 py-3 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-primary dark:text-primary-dark tracking-[0.08em]">
            Streaming Render
          </span>
          <div className="flex border border-border dark:border-border-dark bg-card dark:bg-card-dark overflow-hidden">
            <button
              onClick={() => {
                setCaseType('timeline');
                progressRef.current = 0;
                stopStreaming();
                setDisplayCode('');
                if (isInViewRef.current && !isPaused) {
                  setTimeout(() => startStreamingRef.current?.(), 100);
                }
              }}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                caseType === 'timeline'
                  ? 'bg-link/10 dark:bg-link-dark/10 text-link dark:text-link-dark'
                  : 'text-tertiary dark:text-tertiary-dark hover:text-secondary dark:hover:text-secondary-dark'
              }`}>
              Timeline
            </button>
            <div className="w-px bg-border dark:bg-border-dark" />
            <button
              onClick={() => {
                setCaseType('mindmap');
                progressRef.current = 0;
                stopStreaming();
                setDisplayCode('');
                if (isInViewRef.current && !isPaused) {
                  setTimeout(() => startStreamingRef.current?.(), 100);
                }
              }}
              className={`px-2.5 py-1 text-[11px] font-medium transition-colors ${
                caseType === 'mindmap'
                  ? 'bg-link/10 dark:bg-link-dark/10 text-link dark:text-link-dark'
                  : 'text-tertiary dark:text-tertiary-dark hover:text-secondary dark:hover:text-secondary-dark'
              }`}>
              Mindmap
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePause}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 dark:border-border-dark/70 bg-card/50 dark:bg-card-dark/50 px-2.5 py-1 text-[11px] text-tertiary dark:text-tertiary-dark font-medium hover:bg-card dark:hover:bg-card-dark transition-colors cursor-pointer"
            aria-label={isPaused ? 'Resume streaming' : 'Pause streaming'}>
            <span className="relative flex items-center justify-center w-1.5 h-1.5">
              {!isPaused && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 dark:bg-green-400 opacity-75 animate-ping" />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isPaused
                    ? 'bg-yellow-500 dark:bg-yellow-400'
                    : 'bg-green-500 dark:bg-green-400'
                }`}
              />
            </span>
            Live Preview
          </button>
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            className="flex items-center p-1.5 rounded-full cursor-pointer justify-center bg-card/50 dark:bg-card-dark/50 hover:bg-card dark:hover:bg-card-dark border border-border/70 dark:border-border-dark/70 transition-colors">
            {isFullscreen ? (
              <svg
                className="text-tertiary dark:text-tertiary-dark"
                width="14"
                height="14"
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
                width="14"
                height="14"
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
        </div>
      </div>
      <div className="grid md:grid-cols-2 h-[450px] md:h-[500px] divide-y md:divide-y-0 md:divide-x divide-border dark:divide-border-dark">
        <div className="relative bg-wash dark:bg-gray-95 overflow-hidden">
          <div
            ref={bufferRef}
            className="absolute inset-0 overflow-y-scroll overflow-x-hidden scrollbar-hide"
            style={{
              overscrollBehavior: 'contain',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}>
            <pre className="text-[13px] leading-relaxed text-secondary dark:text-secondary-dark font-mono p-4 md:p-6 m-0 whitespace-pre">
              {displayCode}
            </pre>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/5 to-transparent dark:from-gray-900/70 dark:via-gray-900/10 dark:to-transparent" />
          {isStreaming && (
            <svg
              className="pointer-events-none absolute bottom-4 right-4 animate-spin h-4 w-4 text-link dark:text-link-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </div>
        <div className="relative bg-white dark:bg-gray-950 overflow-hidden">
          {renderError ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 dark:bg-black/80 backdrop-blur-sm text-sm text-red-600 dark:text-red-400 px-4 text-center font-medium">
              {renderError}
            </div>
          ) : null}
          <Infographic
            options={displayCode}
            init={{width: 720, height: 480, padding: 24}}
            onError={(err) => setRenderError(err ? err.message : null)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && placeholderSize && (
        <div style={{height: placeholderSize}} aria-hidden />
      )}
      {renderFullscreenPortal(
        renderInfographicCard(
          fullscreenLayout
            ? {
                width: fullscreenLayout.width,
                height: fullscreenLayout.height,
                transform: `scale(${fullscreenLayout.scale})`,
                transformOrigin: 'center',
              }
            : undefined,
          'pointer-events-auto'
        )
      )}
      <div ref={containerRef} className="w-full max-w-7xl mx-auto px-5 lg:px-0">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
          }}
        />
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[0.5fr,1.5fr] items-stretch">
          <div className="relative flex flex-col justify-center gap-6 py-8 text-secondary dark:text-secondary-dark">
            <p className="max-w-3xl mx-auto text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-normal">
              {translation.description}
            </p>
            <ul className="space-y-4">
              {highlights.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-base lg:text-lg leading-relaxed group"
                  style={{
                    animation: 'fadeInUp 0.4s ease-out forwards',
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}>
                  <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-link dark:bg-link-dark" />
                  <span className="group-hover:text-primary dark:group-hover:text-primary-dark transition-colors duration-200">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <NextLink
                className="inline-flex items-center gap-2 text-link dark:text-link-dark font-semibold text-[15px] transition-all duration-200 hover:gap-3 group"
                href="/learn/infographic-syntax">
                {cta}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 rtl:rotate-180 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m0 0-6-6m6 6-6 6"
                  />
                </svg>
              </NextLink>
            </div>
          </div>

          {isFullscreen && placeholderSize ? (
            <div style={{height: placeholderSize}} aria-hidden />
          ) : (
            renderInfographicCard()
          )}
        </div>
      </div>
    </>
  );
}
