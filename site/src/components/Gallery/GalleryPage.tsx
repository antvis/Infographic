import {AnimatePresence, motion} from 'framer-motion';
import {uniq} from 'lodash-es';
import {ArrowRight, Filter, Layers, Sparkles, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {Infographic} from '../Infographic';
import {TEMPLATES} from './templates';

const getCategory = (templateString: string) => {
  if (!templateString) return 'GENERAL';
  const raw = templateString.split('-')[0];
  return raw.toUpperCase();
};

// ==========================================
// 2. Component: Glass Tag (毛玻璃标签)
// ==========================================
const CategoryTag = ({label}: {label: string}) => (
  <div className="absolute top-4 left-4 z-20 overflow-hidden rounded-full">
    <div className="relative px-4 py-1.5 bg-white/80 backdrop-blur-md border border-white/50 shadow-sm flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#ff356a]" />
      <span className="text-xs font-bold tracking-wider text-slate-700">
        {label}
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
  label: string;
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
            ? 'bg-[#ff356a] border-[#ff356a] text-white shadow-md shadow-[#ff356a]/20 transform scale-105'
            : 'bg-white border-slate-200 text-slate-500 hover:border-[#ff356a]/30 hover:text-[#ff356a] hover:bg-slate-50'
        }
      `}>
      {label}
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
  const category = getCategory(item.template);

  return (
    <motion.div
      layout
      initial={{opacity: 0, scale: 0.95}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true, margin: '-50px'}}
      whileHover="hover"
      whileTap="tap"
      className="group relative w-full h-[300px] flex flex-col"
      onClick={() => onClick(item.id)}>
      {/* Card Body */}
      <motion.div
        variants={{
          hover: {y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)'},
          tap: {scale: 0.98, y: 0},
        }}
        transition={{type: 'spring', stiffness: 400, damping: 25}}
        className="relative flex-1 bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg cursor-pointer transition-colors duration-300 ease-out"
        // 悬停时边框颜色微变
        style={{transformStyle: 'preserve-3d'}}>
        {/* 1. 分类标签 */}
        <CategoryTag label={category} />

        {/* 2. 内容展示区域 (Canvas) */}
        <div className="w-full h-full relative flex items-center justify-center bg-slate-50/50 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}></div>

          <div className="w-full h-full px-2 pt-6 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center transform transition-transform duration-700 group-hover:scale-[1.02]">
              <Infographic
                options={{
                  width: '100%',
                  height: '100%',
                  padding: 20,
                  ...item,
                }}
              />
            </div>
          </div>

          {/* 3. Hover Overlay Interaction */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
            <motion.div
              variants={{
                hover: {y: 0, opacity: 1},
                initial: {y: 20, opacity: 0},
              }}
              className="flex items-center gap-2 text-[#ff356a] font-bold text-sm bg-white px-6 py-3 rounded-full shadow-lg border border-slate-100">
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

  // 1. 计算分类
  const allCategories = useMemo(() => {
    const cats = TEMPLATES.map((t) => getCategory(t.template));
    return uniq(cats).sort();
  }, []);

  // 2. 过滤数据
  const filteredTemplates = useMemo(() => {
    if (activeFilters.length === 0) return TEMPLATES;
    return TEMPLATES.filter((t) =>
      activeFilters.includes(getCategory(t.template))
    );
  }, [activeFilters]);

  // 3. 切换逻辑
  const toggleFilter = (category: string) => {
    setActiveFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCardClick = (id: string) => {
    // 你的路由跳转逻辑
    console.log('Navigating to:', id);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-800 font-sans selection:bg-[#ff356a]/20">
      {/* Header Area */}
      <div className="pt-20 pb-12 px-6 md:px-12 max-w-[1600px] mx-auto text-center md:text-left">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
            Infographic <span className="text-[#ff356a]">Gallery</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-light leading-relaxed">
            Explore our curated collection of visualization templates.
            High-fidelity, customizable, and ready to deploy.
          </p>
        </motion.div>
      </div>

      {/* Filter Bar Area */}
      <div className="sticky top-16 z-40 bg-[#F8F9FC]/85 backdrop-blur-xl border-b border-slate-200/60 py-4 mb-8 transition-all">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Filters Left */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-3 text-slate-400 select-none">
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
                  className="ml-2 p-1.5 text-slate-400 hover:text-[#ff356a] hover:bg-red-50 rounded-full transition-colors"
                  title="Clear all">
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Counter Right (保持在 sticky bar 里，方便随时查看数量) */}
          <div className="flex items-center gap-3 text-slate-400 bg-white/80 px-4 py-1.5 rounded-full shadow-sm border border-slate-200/50 hidden sm:flex">
            <Layers className="w-3.5 h-3.5" />
            <div className="flex items-baseline gap-1 text-xs font-bold tracking-wider">
              <span className="text-slate-700 text-sm">
                {filteredTemplates.length}
              </span>
              <span className="opacity-50">/ {TEMPLATES.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Area */}
      <main className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto">
        {/*
           Grid Config:
           大屏幕(2xl) 3列，普通桌面(lg) 2列，手机(1列)
           GAP 设置大一点 (gap-10) 增加呼吸感
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-12">
          {filteredTemplates.map((item) => (
            <GalleryCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      </main>

      {/* Optional: Noise Texture Overlay for modern feel */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}></div>
    </div>
  );
}
