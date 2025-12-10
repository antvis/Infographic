/* eslint-disable @next/next/no-img-element */
import {Page} from 'components/Layout/Page';
import {motion} from 'framer-motion';
import {Check, Copy, Link2, RefreshCw, Search, Sparkles} from 'lucide-react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

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
}: {
  url: string;
  index: number;
  onCopy: (msg: string) => void;
}) {
  const [copying, setCopying] = useState<'url' | 'svg' | null>(null);

  const copyUrl = async () => {
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
      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-link/5 via-transparent to-purple-40/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-4 flex items-center justify-center aspect-square">
        <img
          src={url}
          alt={`推荐图标 ${index + 1}`}
          className="max-h-20 max-w-full object-contain drop-shadow-sm transition duration-200 group-hover:scale-105"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(12%) sepia(7%) saturate(1123%) hue-rotate(182deg) brightness(92%) contrast(90%)',
          }}
        />
      </div>
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
    </motion.div>
  );
}

export function IconPageContent() {
  const [query, setQuery] = useState('数据分析');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const topK = 16;

  const sampleFallback = useMemo(
    () =>
      Array(12).fill(
        'https://mdn.alipayobjects.com/infographicservice/afts/img/uDn5QZXHA5sAAAAAAAAAAAAAevFJAQFr/original'
      ),
    []
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
        setError('获取图标时发生错误，已为你展示示例数据');
        setIcons(sampleFallback);
      } finally {
        setLoading(false);
      }
    },
    [topK, sampleFallback]
  );

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    fetchIcons(query);
  }, [fetchIcons, query]);

  const handleCopy = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

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
      <div className="relative isolate overflow-hidden min-h-screen bg-wash dark:bg-wash-dark text-primary dark:text-primary-dark selection:bg-link/20 selection:dark:bg-link-dark/20">
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

        <div className="pt-20 pb-10 px-5 sm:px-12 max-w-7xl mx-auto text-center md:text-left relative z-10">
          <motion.header
            id="icon-hero-anchor"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 text-primary dark:text-primary-dark select-none">
              Infographic{' '}
              <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
                Icons
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark max-w-3xl leading-relaxed select-none">
              以自然语言描述需求，实时推荐 100,000+
              图标库中的最佳匹配，支持一键复制链接与 SVG。
            </p>
          </motion.header>
        </div>

        <div className="px-5 sm:px-12 pb-20 max-w-[90rem] mx-auto relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.15}}
              className="w-full">
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-850 shadow-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-850 flex flex-wrap items-center gap-4">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-500">
                      ICON SEARCH
                    </div>
                    <div className="text-2xl font-semibold text-primary dark:text-primary-dark">
                      语义检索你的专属图标
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-5">
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
                      描述你的图标
                    </label>
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
                          placeholder="例如：扁平风格的数据可视化图标"
                          className="w-full bg-transparent border-none focus:ring-0 text-primary dark:text-primary-dark placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm"
                        />
                      </div>
                      <button
                        onClick={() => fetchIcons(query)}
                        disabled={loading}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-medium text-sm shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            搜索中
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            生成推荐
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {presetQueries.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setQuery(item);
                            fetchIcons(item);
                          }}
                          className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 text-secondary dark:text-secondary-dark hover:border-link hover:text-link transition">
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/70 dark:bg-red-900/10 text-red-600 dark:text-red-300 text-sm px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {(loading ? sampleFallback : icons).map((url, index) => (
                        <IconCard
                          key={`${url}-${index}`}
                          url={url}
                          index={index}
                          onCopy={handleCopy}
                        />
                      ))}
                    </div>
                    {toast && (
                      <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.2}}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 text-white text-sm rounded-full shadow-xl border border-gray-800">
                        {toast}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.25}}
              className="w-full">
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-850 shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-dark flex items-center gap-2">
                  <div className="w-1 h-6 bg-link rounded-full" />
                  OpenAPI
                </h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Endpoint
                    </h3>
                    <div className="bg-gray-5 dark:bg-gray-90 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-10 dark:border-gray-80 text-secondary dark:text-secondary-dark">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mr-2">
                        GET
                      </span>
                      https://www.weavefox.cn/api/open/v1/icon
                      <span className="text-xs text-gray-40 dark:text-gray-60">
                        ?text=数据分析&topK=5
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-primary dark:text-primary-dark">
                      Request
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-gray-80">
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
                          图标描述文本，例如 &quot;数据分析&quot;。通过 query
                          string 传递，如 <code>?text=数据分析</code>
                        </p>
                      </div>
                      <div className="bg-white dark:bg-card-dark p-4 rounded-lg border border-gray-10 dark:border-gray-80">
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
                          返回结果数量 (1-30)。通过 query string 传递，如{' '}
                          <code>&topK=5</code>
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

        <div
          className="fixed inset-0 opacity-[0.02] pointer-events-none z-0 dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}></div>
      </div>
    </Page>
  );
}
