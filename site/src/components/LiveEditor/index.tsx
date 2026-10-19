import {CopyToast, useCopyToast} from 'components/CopyToast';
import {motion} from 'framer-motion';
import {useLocaleBundle} from 'hooks/useTranslation';
import {useEffect, useState} from 'react';
import {DEFAULT_SYNTAX} from './defaultSyntax';
import {EditorPanel} from './EditorPanel';
import {PreviewPanel} from './PreviewPanel';

const STORAGE_KEY = 'live-editor-syntax';

const TRANSLATIONS = {
  'zh-CN': {
    title: 'Live Editor',
    description: '编辑 AntV Infographic Syntax 并查看实时预览',
    resetButton: '重置为默认',
    imageCopied: '图片已复制到剪贴板',
  },
  'en-US': {
    title: 'Live Editor',
    description: 'Edit AntV Infographic Syntax and see real-time preview',
    resetButton: 'Reset to Default',
    imageCopied: 'Image copied to clipboard',
  },
};

export function EditorContent() {
  const [syntax, setSyntax] = useState(DEFAULT_SYNTAX);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const {message: copyHint, show: showCopyHint} = useCopyToast(2500);
  const texts = useLocaleBundle(TRANSLATIONS);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSyntax(saved);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEY, syntax);
  }, [syntax, mounted]);

  const handleReset = () => {
    setSyntax(DEFAULT_SYNTAX);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-wash dark:bg-gradient-to-b dark:from-gray-95 dark:via-gray-95 dark:to-gray-90 text-primary dark:text-primary-dark selection:bg-link/20 selection:dark:bg-link-dark/20">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

      {/* Header Area */}
      <motion.header
        id="editor-hero-anchor"
        className="pt-16 pb-8 px-5 sm:px-12 max-w-7xl mx-auto text-center md:text-left relative z-10">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4 text-primary dark:text-primary-dark">
            {texts.title}
          </h1>
          <p className="text-base lg:text-lg text-secondary dark:text-secondary-dark leading-relaxed">
            {texts.description}
          </p>
        </motion.div>
      </motion.header>
      <div className="px-5 sm:px-12 pb-10 max-w-[100rem] mx-auto relative z-10 h-[calc(100vh-220px)] min-h-[700px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <EditorPanel
            value={syntax}
            onChange={setSyntax}
            onReset={handleReset}
          />
          <PreviewPanel
            syntax={syntax}
            onError={setError}
            error={error}
            onCopySuccess={() => showCopyHint(texts.imageCopied)}
            onExportSuccess={showCopyHint}
          />
        </div>
      </div>
      <CopyToast message={copyHint} />
    </div>
  );
}
