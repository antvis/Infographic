import {AnimatePresence, motion} from 'framer-motion';
import {uniq} from 'lodash-es';
import {ArrowRight, Filter, Layers, Sparkles, X} from 'lucide-react';
import {useRouter} from 'next/router';
import {useMemo, useState} from 'react';
import {Infographic} from '../Infographic';
import {TYPE_DISPLAY_NAMES} from './constants';
import {TEMPLATES} from './templates';

const getType = (templateString: string | undefined) => {
  if (!templateString) return 'general';
  const raw = templateString.split('-')[0];
  return raw || 'general';
};

// ==========================================
// 2. Component: Glass Tag (毛玻璃标签)
// ==========================================
const TypeTag = ({label}: {label: keyof typeof TYPE_DISPLAY_NAMES}) => (
  <div className="absolute top-4 left-4 z-20 overflow-hidden rounded-full">
    <div className="relative px-4 py-1.5 bg-white/80 dark:bg-[#23232a]/80 backdrop-blur-md border border-white/50 dark:border-[#23232a]/50 shadow-sm flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#ff356a]" />
      <span className="text-xs font-bold tracking-wider text-slate-700 dark:text-slate-100">
        {TYPE_DISPLAY_NAMES[label]}
      </span>
    </div>
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
  label: keyof typeof TYPE_DISPLAY_NAMES;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-200 border select-none
        ${
          isActive
            ? 'bg-[#ff356a] border-[#ff356a] text-white shadow-md shadow-[#ff356a]/20 transform scale-105 dark:bg-[#ff356a] dark:border-[#ff356a] dark:text-white'
            : 'bg-white border-slate-200 text-slate-500 hover:border-[#ff356a]/30 hover:text-[#ff356a] hover:bg-slate-50 dark:bg-[#23232a] dark:border-[#23232a] dark:text-slate-300 dark:hover:border-[#ff356a]/30 dark:hover:text-[#ff356a] dark:hover:bg-[#23232a]/80'
        }
      `}>
      {TYPE_DISPLAY_NAMES[label]}
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
      className="group relative w-full h-[320px] flex flex-col"
      onClick={() => onClick(item.template)}>
      {/* Card Body */}
      <motion.div
        variants={{
          hover: {y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'},
          tap: {scale: 0.98, y: 0},
        }}
        transition={{type: 'spring', stiffness: 400, damping: 25}}
        className="relative flex-1 bg-white dark:bg-[#18181c] rounded-[1.6rem] overflow-hidden border border-slate-100 dark:border-[#23232a] shadow-lg dark:shadow-black/40 cursor-pointer transition-colors duration-300 ease-out"
        // 悬停时边框颜色微变
        style={{transformStyle: 'preserve-3d'}}>
        {/* 1. 分类标签 */}
        <TypeTag label={type} />

        {/* 2. 内容展示区域 (Canvas) */}
        <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 dark:bg-[#23232a]/50 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(var(--tw-prose-bullets, #cbd5e1) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}></div>

          <div className="w-full h-full px-4 pt-6 pointer-events-none flex items-center justify-center">
            <Infographic
              options={{width: '100%', height: '100%', padding: 20, ...item}}
            />
          </div>

          {/* 3. Hover Overlay Interaction */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#23232a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
            <motion.div
              variants={{
                hover: {y: 0, opacity: 1},
                initial: {y: 20, opacity: 0},
              }}
              className="flex items-center gap-2 text-[#ff356a] font-bold text-sm bg-white dark:bg-[#23232a] px-6 py-3 rounded-full shadow-lg border border-slate-100 dark:border-[#23232a]">
              <Sparkles className="w-4 h-4" />
              <span>Use Template</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </div>

        {/* Active Border Glow */}
        <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-[#ff356a]/10 transition-colors duration-300 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// 4. Page: Gallery Page
// ==========================================
export default function GalleryPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
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
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#18181c] text-slate-800 dark:text-slate-100 font-sans selection:bg-[#ff356a]/20 dark:selection:bg-[#ff356a]/40">
      {/* Header Area */}
  <div className="pt-20 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto text-center md:text-left">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white">
            Infographic <span className="text-[#ff356a]">Gallery</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-300 max-w-2xl font-light leading-relaxed">
            探索我们精选的信息图模板库，高保真设计、灵活可定制，可即插即用地投入你的应用。
          </p>
        </motion.div>
      </div>

      {/* Filter Bar Area */}
  <div className="sticky top-16 z-40 bg-[#F8F9FC]/85 dark:bg-[#18181c]/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 py-4 mb-8 transition-all">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <div className="px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Filters Left */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 mr-3 text-slate-400 dark:text-slate-500 select-none">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
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
                    className="ml-2 p-1.5 text-slate-400 dark:text-slate-500 hover:text-[#ff356a] hover:bg-red-50 dark:hover:bg-[#23232a]/60 rounded-full transition-colors"
                    title="Clear all">
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Counter Right (保持在 sticky bar 里，方便随时查看数量) */}
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-[#23232a]/80 px-4 py-1.5 rounded-full shadow-sm border border-slate-200/50 dark:border-[#23232a]/50 hidden sm:flex">
              <Layers className="w-3.5 h-3.5" />
              <div className="flex items-baseline gap-1 text-xs font-bold tracking-wider">
                <span className="text-slate-700 dark:text-slate-100 text-sm">
                  {filteredTemplates.length}
                </span>
                <span className="opacity-50">/ {TEMPLATES.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grid Area */}
  <main className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-12">
          {filteredTemplates.map((item, index) => (
            <GalleryCard
              key={index}
              item={item}
              onClick={() => handleCardClick(item.template!)}
            />
          ))}
        </div>
      </main>

      {/* Optional: Noise Texture Overlay for modern feel */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0 dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
    </div>
  );
}
