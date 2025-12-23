import {AnimatePresence, motion} from 'framer-motion';
import {uniq} from 'lodash-es';
import {ArrowRight, Filter, Layers, Sparkles, X} from 'lucide-react';
import {useRouter} from 'next/router';
import {useMemo, useState} from 'react';
import {Infographic} from '../Infographic';
import {SERIES_DISPLAY_NAMES, TYPE_DISPLAY_NAMES} from './constants';
import {TEMPLATES} from './templates';

const getType = (templateString: string | undefined) => {
  if (!templateString) return 'general';
  const raw = templateString.split('-')[0];
  return raw || 'general';
};
const getSeries = (templateString: string | undefined) => {
  if (!templateString) return 'general';
  const parts = templateString.split('-');
  if (parts.length < 2) return 'general';
  return `${parts[0]}-${parts[1]}`;
};
const COLLAPSED_COUNT = 5;

// ==========================================
// 2. Component: Glass Tag (毛玻璃标签)
// ==========================================
const TypeTag = ({label}: {label: string}) => (
  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-link dark:bg-link-dark" />
    <span className="text-[11px] font-semibold tracking-wide text-primary dark:text-primary-dark uppercase">
      {TYPE_DISPLAY_NAMES[label as keyof typeof TYPE_DISPLAY_NAMES]}
    </span>
  </div>
);

// ==========================================
// 3. Component: Filter Chip (顶部筛选按钮)
// ==========================================
const FilterChip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3.5 py-1.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 border select-none
        ${
          isActive
            ? 'bg-link text-white border-link shadow-secondary-button-stroke transform scale-[1.02] dark:bg-link-dark dark:border-link-dark'
            : 'bg-card text-secondary border-primary/10 hover:border-link/50 hover:text-primary hover:bg-gray-40/5 dark:bg-card-dark dark:text-secondary-dark dark:border-primary-dark/15 dark:hover:border-link-dark/50 dark:hover:text-primary-dark dark:hover:bg-gray-60/5'
        }
      `}>
      {TYPE_DISPLAY_NAMES[label as keyof typeof TYPE_DISPLAY_NAMES]}
    </button>
  );
};

// ==========================================
// 4. Component: Gallery Card
// ==========================================
const GalleryCard = ({
  item,
  onClick,
}: {
  item: any;
  onClick: (id: string) => void;
}) => {
  const type = getType(item.template);

  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.95}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true, margin: '-50px'}}
      whileHover="hover"
      whileTap="tap"
      className="group relative w-full flex flex-col"
      style={{aspectRatio: '23 / 16'}}
      onClick={() => onClick(item.template)}>
      {/* Card Body */}
      <motion.div
        variants={{
          hover: {y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'},
          tap: {scale: 0.98, y: 0},
        }}
        transition={{type: 'spring', stiffness: 400, damping: 25}}
        className="relative flex-1 bg-wash dark:bg-card-dark rounded-[.5rem] overflow-hidden border border-primary/12 dark:border-primary-dark/15 group-hover:border-link/25 shadow-nav dark:shadow-nav-dark cursor-pointer transition-colors duration-300 ease-out"
        style={{transformStyle: 'preserve-3d'}}>
        {/* 1. 分类标签 */}
        <TypeTag label={type} />

        {/* 2. 内容展示区域 (Canvas) */}
        <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                'radial-gradient(var(--tw-prose-bullets, rgba(0,0,0,0.08)) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}></div>

          <div className="w-full h-full pointer-events-none flex items-center justify-center">
            <Infographic
              options={{width: '100%', height: '100%', padding: 20, ...item}}
            />
          </div>

          {/* 3. Hover Overlay Interaction */}
          <div className="absolute inset-0 bg-gradient-to-t from-wash/90 dark:from-card-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
            <motion.div
              variants={{
                hover: {y: 0, opacity: 1},
                initial: {y: 20, opacity: 0},
              }}
              className="flex items-center gap-2 text-link dark:text-link-dark font-semibold text-sm bg-wash dark:bg-card-dark px-6 py-3 rounded-full shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark border border-primary/10 dark:border-primary-dark/10">
              <Sparkles className="w-4 h-4" />
              <span>使用</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// 4. Page: Gallery Page
// ==========================================
export default function GalleryPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>(
    {}
  );
  const router = useRouter();

  // 计算分类
  const allCategories = useMemo(() => {
    const cats = TEMPLATES.map((t) => getType(t.template));
    return uniq(cats).sort();
  }, []);

  // 过滤数据
  const filteredTemplates = useMemo(() => {
    if (activeFilters.length === 0) return TEMPLATES;
    return TEMPLATES.filter((t) => activeFilters.includes(getType(t.template)));
  }, [activeFilters]);

  // 分组数据（保持原始顺序）
  const groupedTemplates = useMemo(() => {
    const groups = new Map<string, any[]>();
    filteredTemplates.forEach((item) => {
      const key = getSeries(item.template);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      label: SERIES_DISPLAY_NAMES[key] ?? key,
      items,
    }));
  }, [filteredTemplates]);

  const toggleSeries = (key: string) => {
    setExpandedSeries((prev) => ({...prev, [key]: !prev[key]}));
  };

  // 切换逻辑
  const toggleFilter = (type: string) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]
    );
  };

  // 跳转到详情页
  const handleCardClick = (template: string) => {
    router.push(`/examples/example?template=${template}`);
  };

  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-wash dark:bg-gradient-to-b dark:from-gray-95 dark:via-gray-95 dark:to-gray-90 text-primary dark:text-primary-dark selection:bg-link/20 selection:dark:bg-link-dark/20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

      {/* Header Area */}
      <div
        className="pt-20 pb-12 px-5 sm:px-12 max-w-7xl mx-auto text-center md:text-left relative z-10"
        id="gallery-hero-anchor">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary dark:text-primary-dark">
            Infographic{' '}
            <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-relaxed">
            探索我们精选的信息图模板库，高保真设计、灵活可定制，可即插即用地投入你的应用。
          </p>
        </motion.div>
      </div>

      {/* Filter Bar Area */}
      <div className="sticky top-16 z-40 dark:bg-gray-95/90 backdrop-blur-xl border-b border-primary/5 dark:border-primary-dark/5 py-4 mb-8 transition-all">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <div className="px-5 sm:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Filters Left */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-3 text-tertiary dark:text-tertiary-dark select-none">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Filter
                </span>
              </div>

              {allCategories.map((cat: string) => (
                <FilterChip
                  key={cat}
                  label={cat}
                  isActive={activeFilters.includes(cat)}
                  onClick={() => toggleFilter(cat)}
                />
              ))}

              <AnimatePresence>
                {activeFilters.length > 0 && (
                  <motion.button
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    exit={{opacity: 0, scale: 0.8}}
                    onClick={() => setActiveFilters([])}
                    className="ml-2 p-1.5 text-tertiary dark:text-tertiary-dark hover:text-link hover:dark:text-link-dark hover:bg-gray-40/5 dark:hover:bg-gray-60/5 rounded-full transition-colors"
                    title="Clear all">
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Counter Right (保持在 sticky bar 里，方便随时查看数量) */}
            <div className="flex items-center gap-3 text-tertiary dark:text-tertiary-dark bg-card/80 dark:bg-card-dark/80 px-4 py-1.5 rounded-full shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark border border-primary/10 dark:border-primary-dark/10 hidden sm:flex">
              <Layers className="w-3.5 h-3.5" />
              <div className="flex items-baseline gap-1 text-xs font-semibold tracking-wide">
                <span className="text-primary dark:text-primary-dark text-sm">
                  {filteredTemplates.length}
                </span>
                <span className="opacity-50">/ {TEMPLATES.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Area */}
      <main className="px-5 sm:px-12 pb-24 max-w-7xl mx-auto relative z-10 space-y-8">
        {groupedTemplates.map(({key, label, items}) => {
          const isExpanded = !!expandedSeries[key];
          const visibleItems = isExpanded
            ? items
            : items.slice(0, Math.min(items.length, COLLAPSED_COUNT));
          const canToggle = items.length > COLLAPSED_COUNT;

          return (
            <section
              key={key}
              className="rounded-xl border border-primary/8 dark:border-primary-dark/10 bg-card/60 dark:bg-card-dark/60 backdrop-blur-md shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-primary/8 dark:border-primary-dark/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary dark:text-primary-dark">
                  <span>{label}</span>
                  <span className="text-tertiary dark:text-tertiary-dark text-xs">
                    {items.length} 张
                  </span>
                </div>
                {canToggle && (
                  <button
                    onClick={() => toggleSeries(key)}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-wash dark:bg-card-dark border border-primary/10 dark:border-primary-dark/10 text-link dark:text-link-dark hover:border-link/40">
                    <span>{isExpanded ? '收起' : '展开全部'}</span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4 lg:gap-5">
                  {visibleItems.map((item) => (
                    <GalleryCard
                      key={item.template}
                      item={item}
                      onClick={() => handleCardClick(item.template!)}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>

      {/* Optional: Noise Texture Overlay for modern feel */}
    </div>
  );
}
