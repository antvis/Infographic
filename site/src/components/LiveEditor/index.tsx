import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {EditorPanel} from './EditorPanel';
import {PreviewPanel} from './PreviewPanel';
import {CopyToast, useCopyToast} from 'components/CopyToast';
import {useLocaleBundle} from 'hooks/useTranslation';
import {generateShareUrl, extractContentFromUrl} from './utils';

const DEFAULT_SYNTAX = `infographic list-row-simple-horizontal-arrow
data
  items
    - label 步骤 1
      desc 开始
    - label 步骤 2
      desc 进行中
    - label 步骤 3
      desc 完成`;

const STORAGE_KEY = 'live-editor-syntax';

const TRANSLATIONS = {
  'zh-CN': {
    title: 'Live Editor',
    description: '编辑 AntV Infographic 语法并查看实时预览',
    resetButton: '重置为默认',
    shareButton: '分享',
    imageCopied: '图片已复制到剪贴板',
    linkCopied: '分享链接已复制到剪贴板',
    shareFailed: '生成分享链接失败',
  },
  'en-US': {
    title: 'Live Editor',
    description: 'Edit AntV Infographic syntax and see real-time preview',
    resetButton: 'Reset to Default',
    shareButton: 'Share',
    imageCopied: 'Image copied to clipboard',
    linkCopied: 'Share link copied to clipboard',
    shareFailed: 'Failed to generate share link',
  },
};

export function EditorContent() {
  const router = useRouter();
  const [syntax, setSyntax] = useState(DEFAULT_SYNTAX);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const {message: copyHint, show: showCopyHint} = useCopyToast();
  const texts = useLocaleBundle(TRANSLATIONS);

  // Load from URL or localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Try URL first
    const urlContent = extractContentFromUrl();
    if (urlContent) {
      setSyntax(urlContent);
      return;
    }

    // Fall back to localStorage
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
    // Clear URL params
    router.replace('/editor', undefined, {shallow: true});
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl(syntax);
    if (!shareUrl) {
      showCopyHint(texts.shareFailed);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      showCopyHint(texts.linkCopied);
      // Update URL without reload
      router.replace(shareUrl, undefined, {shallow: true});
    } catch (e) {
      console.error('Failed to copy share link:', e);
      showCopyHint(texts.shareFailed);
    }
  };

  return (
    <div className="relative isolate overflow-hidden bg-wash dark:bg-wash-dark">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-12 py-12 lg:py-16">
        <header className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-primary dark:text-primary-dark">
              {texts.title}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="px-4 py-2 text-sm bg-link hover:bg-link-dark text-white rounded transition-colors">
                {texts.shareButton}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary-dark dark:bg-secondary-dark dark:hover:bg-secondary text-primary dark:text-primary-dark rounded transition-colors">
                {texts.resetButton}
              </button>
            </div>
          </div>
          <p className="text-lg text-secondary dark:text-secondary-dark leading-relaxed">
            {texts.description}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
          <EditorPanel value={syntax} onChange={setSyntax} />
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
