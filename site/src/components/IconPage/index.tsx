/* eslint-disable @next/next/no-img-element */
import {CopyToast, useCopyToast} from 'components/CopyToast';
import {Page} from 'components/Layout/Page';
import {motion} from 'framer-motion';
import {Check, Copy, Link2, RefreshCw, Search} from 'lucide-react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {IconCopy} from '../Icon/IconCopy';
import {IconEllipsis} from '../Icon/IconEllipsis';
import {Select} from '../ui/select';

const presetQueries = [
  '数据分析',
  '人机协作',
  '金融',
  '安全防护',
  '可视化',
  '出行',
];

function IconCard({
  url,
  index,
  onCopy,
  isPlaceholder = false,
}: {
  url: string;
  index: number;
  onCopy: (msg: string) => void;
  isPlaceholder?: boolean;
}) {
  const [copying, setCopying] = useState<'url' | 'svg' | null>(null);

  const copyUrl = async () => {
    if (isPlaceholder) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopying('url');
      onCopy('图标链接已复制');
      setTimeout(() => setCopying(null), 1500);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  const copySvg = async () => {
    if (isPlaceholder) return;
    try {
      const svg = await fetch(url).then((res) => res.text());
      await navigator.clipboard.writeText(svg);
      setCopying('svg');
      onCopy('SVG 代码已复制');
      setTimeout(() => setCopying(null), 1500);
    } catch (err) {
      console.error('Failed to copy SVG', err);
    }
  };

  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.9, y: 10}}
      animate={{opacity: 1, scale: 1, y: 0}}
      transition={{duration: 0.25, delay: index * 0.01}}
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-link/5 via-transparent to-purple-40/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-4 flex items-center justify-center aspect-square">
        {isPlaceholder ? (
          <IconEllipsis className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        ) : (
          <span
            aria-label={`推荐图标 ${index + 1}`}
            className="block w-12 h-12 sm:w-14 sm:h-14 text-primary dark:text-primary-dark transition duration-200 group-hover:scale-105"
            style={{
              backgroundColor: 'currentColor',
              mask: `url(${url}) center / contain no-repeat`,
              WebkitMask: `url(${url}) center / contain no-repeat`,
            }}
          />
        )}
      </div>
      {!isPlaceholder && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/80 dark:bg-gray-900/90 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-800 shadow-lg">
          <button
            onClick={copyUrl}
            className="inline-flex items-center gap-1 text-xs text-primary dark:text-primary-dark hover:text-link dark:hover:text-link"
            title="复制链接">
            {copying === 'url' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Link2 className="w-3 h-3" />
            )}
            链接
          </button>
          <span className="h-4 w-px bg-gray-200 dark:bg-gray-800" />
          <button
            onClick={copySvg}
            className="inline-flex items-center gap-1 text-xs text-primary dark:text-primary-dark hover:text-link dark:hover:text-link"
            title="复制 SVG">
            {copying === 'svg' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            SVG
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function IconPageContent() {
  const [query, setQuery] = useState('数据分析');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topK, setTopK] = useState(20);
  const {message: toast, show: showToast} = useCopyToast();

  const sampleFallback = useMemo(
    () => Array.from({length: topK}, (_, idx) => `placeholder-${idx}`),
    [topK]
  );

  const fetchIcons = useCallback(
    async (text: string) => {
      const keyword = text.trim();
      if (!keyword) return;

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          text: keyword,
          topK: topK.toString(),
        });
        const response = await fetch(
          `https://www.weavefox.cn/api/open/v1/icon?${params.toString()}`
        );
        const result = await response.json();
        if (result.status && result.data && result.data.success) {
          setIcons(result.data.data);
        } else {
          setError('未获取到结果，请稍后再试');
        }
      } catch (err) {
        console.error(err);
        setError('获取图标时发生错误');
        setIcons(sampleFallback);
      } finally {
        setLoading(false);
      }
    },
    [topK, sampleFallback]
  );

  useEffect(() => {
    fetchIcons(query);
  }, [fetchIcons, query]);

  const handleCopy = (msg: string) => {
    showToast(msg);
  };

  const endpointParams = useMemo(
    () => ({
      text: query.trim() || '数据分析',
      topK: topK.toString(),
    }),
    [query, topK]
  );

  const endpointUrl = useMemo(() => {
    const params = new URLSearchParams({
      text: endpointParams.text,
      topK: endpointParams.topK,
    });
    return `https://www.weavefox.cn/api/open/v1/icon?${params.toString()}`;
  }, [endpointParams]);

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(endpointUrl);
      handleCopy('接口地址已复制');
    } catch (err) {
      console.error('Failed to copy endpoint', err);
    }
  };

  const usingFallback = loading || icons === sampleFallback;

  return (
    <Page
      toc={[]}
      routeTree={{title: 'Icon', path: '/icon', routes: []}}
      meta={{title: 'Icon 智能推荐'}}
      section="icon"
      topNavOptions={{
        hideBrandWhenHeroVisible: true,
        overlayOnHome: true,
        heroAnchorId: 'icon-hero-anchor',
      }}>
      <div className="relative isolate overflow-hidden min-h-screen bg-wash dark:bg-gradient-to-b dark:from-gray-95 dark:via-gray-95 dark:to-gray-90 text-primary dark:text-primary-dark selection:bg-link/20 selection:dark:bg-link-dark/20">
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

        <div className="pt-20 pb-10 px-5 sm:px-12 max-w-7xl mx-auto text-center md:text-left relative z-10">
          <motion.header
            id="icon-hero-anchor"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 text-primary dark:text-primary-dark">
              Infographic{' '}
              <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
                Icons
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-relaxed">
              提供 100,000+ 图标，支持语义化查询检索
            </p>
          </motion.header>
        </div>

        <div className="px-5 sm:px-12 pb-20 max-w-[90rem] mx-auto relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-10 items-stretch">
            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.15}}
              className="w-full h-full">
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-850 shadow-lg overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-850 flex flex-wrap items-center gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500">
                      ICON SEARCH
                    </div>
                    <div className="text-2xl font-semibold text-primary dark:text-primary-dark">
                      语义化检索图标
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <div className="flex-1 flex items-center gap-3 bg-gray-5 dark:bg-gray-900 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === 'Enter' && fetchIcons(query)
                          }
                          placeholder="例如：笔记本电脑"
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-primary dark:text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => fetchIcons(query)}
                          disabled={loading}
                          className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl text-white font-medium text-sm shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r from-link to-link/90 dark:from-link-dark dark:to-link-dark/90 hover:from-link/90 hover:to-link/80 dark:hover:from-link-dark/90 dark:hover:to-link-dark/80">
                          {loading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              搜索中
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4" />
                              搜索
                            </>
                          )}
                        </button>
                        <Select
                          value={String(topK)}
                          onValueChange={(value) => setTopK(Number(value))}
                          placeholder={`Top ${topK}`}
                          width={80}
                          className="shrink-0 bg-white dark:bg-gray-900 text-sm border-gray-200 dark:border-gray-800"
                          options={[1, 5, 10, 20].map((option) => ({
                            value: String(option),
                            label: `Top ${option}`,
                          }))}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {presetQueries.map((item) => (
                        <span
                          key={item}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setQuery(item);
                            fetchIcons(item);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setQuery(item);
                              fetchIcons(item);
                            }
                          }}
                          className="text-xs px-3 py-1 rounded-lg border border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900 text-secondary dark:text-secondary-dark hover:border-link hover:text-link hover:bg-link/5 dark:hover:bg-link/10 cursor-pointer select-none transition">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-300/70 dark:border-red-400/60 bg-transparent text-red-500 dark:text-red-400 text-sm px-4 py-3 flex gap-2">
                      {error}
                    </div>
                  )}

                  <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(usingFallback ? sampleFallback : icons).map(
                        (url, index) => (
                          <IconCard
                            key={`${url}-${index}`}
                            url={url}
                            index={index}
                            onCopy={handleCopy}
                            isPlaceholder={usingFallback}
                          />
                        )
                      )}
                    </div>
                    <CopyToast message={toast} />
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.25}}
              className="w-full h-full">
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-850 shadow-lg p-6 sticky top-24 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark flex items-center gap-2">
                  <div className="w-1 h-6 bg-link rounded-full" />
                  OpenAPI
                </h2>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">
                        Endpoint
                      </h3>
                      <button
                        onClick={copyEndpoint}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-5 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm text-secondary dark:text-secondary-dark hover:text-link hover:border-link transition">
                        <IconCopy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-gray-5 dark:bg-gray-90 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-10 dark:border-gray-80 text-secondary dark:text-secondary-dark">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">
                        GET
                      </span>
                      <span className="whitespace-pre-wrap break-words">
                        https://www.weavefox.cn/api/open/v1/icon?
                        <span className="font-semibold text-primary dark:text-primary-dark">
                          text
                        </span>
                        =
                        <span className="italic text-primary dark:text-primary-dark">
                          {endpointParams.text}
                        </span>
                        &
                        <span className="font-semibold text-primary dark:text-primary-dark">
                          topK
                        </span>
                        =
                        <span className="italic text-primary dark:text-primary-dark">
                          {endpointParams.topK}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Search Parameters
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-primary-dark/20">
                        <div className="flex items-baseline gap-2 mb-2">
                          <code className="text-base font-mono text-secondary dark:text-secondary-dark">
                            text
                          </code>
                          <span className="text-sm font-mono text-pink-500">
                            string
                          </span>
                          <span className="text-sm text-red-500">*</span>
                        </div>
                        <p className="text-sm text-secondary dark:text-secondary-dark">
                          查询文本，如 &quot;数据分析&quot;。
                        </p>
                      </div>
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-primary-dark/20">
                        <div className="flex items-baseline gap-2 mb-2">
                          <code className="text-base font-mono text-secondary dark:text-secondary-dark">
                            topK
                          </code>
                          <span className="text-sm font-mono text-pink-500">
                            number
                          </span>
                          <span className="text-sm text-gray-40 dark:text-gray-60">
                            default: 5
                          </span>
                        </div>
                        <p className="text-sm text-secondary dark:text-secondary-dark">
                          查询图标数量 (1-20)。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Response
                    </h3>
                    <div className="bg-gray-5 dark:bg-gray-90 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-10 dark:border-gray-80">
                      <pre className="text-secondary dark:text-secondary-dark">
                        {`{
  "status": true,
  "message": "success",
  "data": {
    "success": true,
    "data": [
      "https://example.com/icon1.svg",
      "https://example.com/icon2.svg"
    ]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </Page>
  );
}
