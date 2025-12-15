import {AnimatePresence, motion} from 'framer-motion';
import {Check, Code, Link, Search} from 'lucide-react';
import {ReactNode, useEffect, useState} from 'react';

interface PadViewProps {
  children?: ReactNode;
  minHeight?: number | string;
  minWidth?: number | string;
  width?: number | string;
  height?: number | string;
  enableIconSearch?: boolean;
}

function IconCard({
  url,
  index,
  onCopy,
}: {
  url: string;
  index: number;
  onCopy?: (msg: string) => void;
}) {
  const [copyingUrl, setCopyingUrl] = useState(false);
  const [copyingSvg, setCopyingSvg] = useState(false);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    const prefetchSvg = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setSvgContent(text);
      } catch (err) {
        console.error('Failed to prefetch SVG', err);
      }
    };
    prefetchSvg();
  }, [url]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyingUrl(true);
      onCopy?.('URL 已复制到剪贴板');
      setTimeout(() => setCopyingUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const handleCopySvg = async () => {
    try {
      const text = svgContent || (await fetch(url).then((r) => r.text()));
      await navigator.clipboard.writeText(text);
      setCopyingSvg(true);
      onCopy?.('SVG 代码已复制到剪贴板');
      setTimeout(() => setCopyingSvg(false), 2000);
    } catch (err) {
      console.error('Failed to copy SVG', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.5, filter: 'blur(10px)'}}
      animate={{opacity: 1, scale: 1, filter: 'blur(0px)'}}
      transition={{
        duration: 0.4,
        delay: index * 0.02,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{
        scale: 1.2,
        zIndex: 10,
        transition: {duration: 0.2},
      }}
      className="group relative aspect-square flex items-center justify-center rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:ring-1 hover:ring-black/5 dark:hover:ring-white/10 transition-all cursor-pointer">
      <div className="w-[65%] h-[65%] flex items-center justify-center transition-transform duration-300 group-hover:scale-100">
        <img
          src={url}
          alt={`Recommended icon ${index + 1}`}
          className="w-full h-full object-contain drop-shadow-sm"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(13%) sepia(8%) saturate(1046%) hue-rotate(184deg) brightness(96%) contrast(93%)',
          }}
        />
      </div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 group-hover:bottom-2 transition-all duration-200 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopyUrl();
          }}
          className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-pink-500 border border-pink-500/20 transition-colors"
          title="复制 URL">
          {copyingUrl ? (
            <Check className="w-3 h-3" />
          ) : (
            <Link className="w-3 h-3" />
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopySvg();
          }}
          className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-pink-500 border border-pink-500/20 transition-colors"
          title="复制 SVG 代码">
          {copyingSvg ? (
            <Check className="w-3 h-3" />
          ) : (
            <Code className="w-3 h-3" />
          )}
        </button>
      </div>
    </motion.div>
  );
}

export function PadView({
  children,
  minHeight,
  minWidth,
  width,
  height,
  enableIconSearch,
}: PadViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [inputText, setInputText] = useState('数据分析');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const fetchIcons = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        text: inputText,
        topK: '24',
      });
      const response = await fetch(`https://www.weavefox.cn/api/open/v1/icon?${params.toString()}`);
      const result = await response.json();
      if (result.status && result.data && result.data.success) {
        setIcons(result.data.data);
      } else {
        setError('获取图标失败');
      }
    } catch (err) {
      console.error(err);
      setError('获取图标时发生错误');
      // Mock more data for demo
      setIcons(
        Array(32).fill(
          'https://mdn.alipayobjects.com/infographicservice/afts/img/uDn5QZXHA5sAAAAAAAAAAAAAevFJAQFr/original'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enableIconSearch) {
      fetchIcons();
    }
  }, [enableIconSearch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const contentStyle: React.CSSProperties = {};
  if (minHeight) {
    const minHeightValue =
      typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
    contentStyle.minHeight = isMobile
      ? `min(${minHeightValue}, 70vw)`
      : minHeight;
  }
  if (minWidth) contentStyle.minWidth = minWidth;
  if (width) contentStyle.width = width;
  if (height) contentStyle.height = height;

  return (
    <figure
      className="mx-auto w-full h-auto"
      style={
        width
          ? {maxWidth: width}
          : {maxWidth: enableIconSearch ? '36rem' : '80rem'}
      }>
      {/* Mac Browser Chrome */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-t-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
        {/* Title Bar with Traffic Lights */}
        <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
          </div>
        </div>

        {/* Browser Address Bar */}
        <div className="bg-white dark:bg-gray-850 px-4 py-2 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-1.5 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {enableIconSearch
                ? '✨ 下方输入任意关键词，AI 帮你找到最合适的图标'
                : 'infographic.antv.antgroup.com'}
            </span>
          </div>
        </div>

        {/* Browser Content Area */}
        <div
          className="bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pb-8 overflow-auto transition-colors duration-500"
          style={
            Object.keys(contentStyle).length > 0 ? contentStyle : undefined
          }>
          <div className="flex flex-col items-start justify-center pt-6 gap-3">
            {enableIconSearch ? (
              <div className="w-full flex flex-col gap-6">
                <div className="relative group max-w-2xl mx-auto w-full">
                  {/* Animated border gradient */}
                  <div className="absolute -inset-[1px] rounded-xl opacity-75 blur-sm">
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      animate={{
                        background: [
                          'linear-gradient(90deg, rgba(236,72,153,0.8) 0%, rgba(168,85,247,0.8) 50%, rgba(59,130,246,0.8) 100%)',
                          'linear-gradient(180deg, rgba(59,130,246,0.8) 0%, rgba(236,72,153,0.8) 50%, rgba(168,85,247,0.8) 100%)',
                          'linear-gradient(270deg, rgba(168,85,247,0.8) 0%, rgba(59,130,246,0.8) 50%, rgba(236,72,153,0.8) 100%)',
                          'linear-gradient(360deg, rgba(236,72,153,0.8) 0%, rgba(168,85,247,0.8) 50%, rgba(59,130,246,0.8) 100%)',
                        ],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  </div>

                  {/* Main search container */}
                  <div className="relative flex items-center gap-1.5 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:shadow-xl backdrop-blur-sm">
                    <div className="flex-1 flex items-center px-3 py-1">
                      <Search className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 mr-2.5 transition-all duration-300 group-hover:text-pink-500 group-hover:scale-110" />
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchIcons()}
                        placeholder="搜索图标..."
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                      />
                    </div>
                    <button
                      onClick={fetchIcons}
                      disabled={loading}
                      className="px-4 py-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs tracking-wide">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{rotate: 360}}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: 'linear',
                            }}
                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                          />
                          <span>搜索中</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3 h-3" />
                          <span>搜索</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {toastMessage && (
                    <motion.div
                      initial={{opacity: 0, y: -20, x: '-50%'}}
                      animate={{opacity: 1, y: 0, x: '-50%'}}
                      exit={{opacity: 0, y: -20, x: '-50%'}}
                      transition={{duration: 0.2}}
                      className="absolute top-4 left-1/2 z-50 px-4 py-2 bg-gray-900/90 text-white text-sm rounded-full shadow-lg flex items-center gap-2 pointer-events-none backdrop-blur-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {toastMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-8 gap-3 sm:gap-5 w-full pb-8">
                  <AnimatePresence mode="wait">
                    {icons.map((iconUrl, index) => (
                      <IconCard
                        key={`${iconUrl}-${index}`}
                        url={iconUrl}
                        index={index}
                        onCopy={showToast}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}

function CurrentTime() {
  const [date, setDate] = useState(new Date());
  const currentTime = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
  });
  useEffect(() => {
    const msPerMinute = 60 * 1000;
    let nextMinute = Math.floor(+date / msPerMinute + 1) * msPerMinute;

    const timeout = setTimeout(() => {
      if (Date.now() > nextMinute) {
        setDate(new Date());
      }
    }, nextMinute - Date.now());
    return () => clearTimeout(timeout);
  }, [date]);

  return <span suppressHydrationWarning>{currentTime}</span>;
}
