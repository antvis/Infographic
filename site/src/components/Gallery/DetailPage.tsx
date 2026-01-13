import {motion} from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useLocaleBundle} from '../../hooks/useTranslation';
import {Infographic} from '../Infographic';
import {CodeEditor} from '../MDX/CodeEditor';
import {TEMPLATES} from './templates';

const TRANSLATIONS = {
  'zh-CN': {
    back: '返回素材库',
    templateLabel: '模板',
    fileLabel: 'syntax.txt',
    errorBadge: '错误',
    reset: '重置代码',
    copy: '复制',
    copySuccess: '已复制',
    status: (line: number) => `第 ${line} 行，第 1 列`,
    footer: 'UTF-8 • Syntax',
    errors: {
      render: (msg: string) => `渲染错误：${msg}`,
    },
  },
  'en-US': {
    back: 'Back to Gallery',
    templateLabel: 'Template',
    fileLabel: 'syntax.txt',
    errorBadge: 'Error',
    reset: 'Reset Code',
    copy: 'Copy',
    copySuccess: 'Copied',
    status: (line: number) => `Line ${line}, Col 1`,
    footer: 'UTF-8 • Syntax',
    errors: {
      render: (msg: string) => `Render Error: ${msg}`,
    },
  },
};

export default function DetailPage({templateId}: {templateId?: string}) {
  const router = useRouter();
  const template = templateId || router.query.template;

  const initialTemplate =
    TEMPLATES.find((t) => t.template === template) || TEMPLATES[0];

  const [code, setCode] = useState(initialTemplate?.syntax || '');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const detailTexts = useLocaleBundle(TRANSLATIONS);

  // Initialize code template only when template ID changes (client-side)
  useEffect(() => {
    if (initialTemplate) {
      setCode(initialTemplate.syntax);
      setError(null);
    }
  }, [initialTemplate]);

  const handleCodeChange = (e: string) => {
    setCode(e);
    setError(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRenderError = (err: Error | null) => {
    setError(err ? detailTexts.errors.render(err.message) : null);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full bg-wash dark:bg-gray-95 flex overflow-hidden text-primary dark:text-primary-dark">
      {/* Left Panel: Canvas */}
      <div className="flex-1 relative bg-gray-10/60 dark:bg-gray-95 flex flex-col overflow-hidden">
        <motion.button
          initial={{opacity: 0, x: -20}}
          animate={{opacity: 1, x: 0}}
          onClick={handleBack}
          className="absolute top-6 left-6 z-30 p-3 bg-card dark:bg-card-dark rounded-full shadow-nav dark:shadow-nav-dark border border-primary/10 dark:border-primary-dark/10 text-secondary dark:text-secondary-dark hover:text-link hover:dark:text-link-dark hover:scale-105 transition-all group"
          title={detailTexts.back}>
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </motion.button>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4] z-0 dark:hidden"
          style={{
            backgroundImage:
              'radial-gradient(var(--tw-prose-bullets, #cbd5e1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}></div>

        <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar relative z-10">
          <div
            className="relative bg-card dark:bg-card-dark rounded-2xl shadow-nav dark:shadow-nav-dark border border-primary/10 dark:border-primary-dark/10 overflow-hidden transition-all duration-300"
            style={{width: '100%', height: '100%'}}>
            <div className="absolute top-4 right-4 opacity-0 hover:opacity-100 transition-opacity z-20">
              <button className="p-2 bg-card/90 dark:bg-card-dark/90 backdrop-blur rounded-lg shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark border border-primary/10 dark:border-primary-dark/10 text-secondary dark:text-secondary-dark hover:text-primary hover:dark:text-primary-dark">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas container */}
            <div
              className="w-full h-full p-8 flex items-center justify-center"
              style={{minHeight: '600px'}}>
              {code ? (
                <Infographic
                  init={{
                    width: '100%',
                    height: '100%',
                    padding: 20,
                    editable: true,
                  }}
                  onError={handleRenderError}
                  options={code}
                />
              ) : null}
            </div>

            {/* Error banner */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/95 dark:bg-card-dark/95 backdrop-blur">
                <div className="text-center p-6 max-w-md">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-sm text-red-600 font-mono">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="w-[480px] bg-card dark:bg-card-dark border-l border-primary/10 dark:border-primary-dark/10 flex flex-col z-20 shadow-[-10px_0_40px_rgba(0,0,0,0.08)] dark:shadow-nav-dark">
        <div className="h-14 border-b border-primary/10 dark:border-primary-dark/10 flex items-center justify-between px-4 bg-card dark:bg-card-dark shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-10 dark:bg-gray-90 rounded border border-primary/10 dark:border-primary-dark/15">
              <span className="text-[10px] font-semibold text-tertiary dark:text-tertiary-dark uppercase">
                {detailTexts.templateLabel}
              </span>
              <span className="text-xs font-mono text-primary dark:text-primary-dark font-semibold">
                {detailTexts.fileLabel}
              </span>
            </div>
            {error && (
              <span className="text-[11px] text-red-500 flex items-center gap-1 font-medium animate-pulse">
                <AlertCircle className="w-3 h-3" /> {detailTexts.errorBadge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCode(initialTemplate.syntax);
                setError(null);
              }}
              className="p-2 text-tertiary dark:text-tertiary-dark hover:text-primary hover:dark:text-primary-dark hover:bg-gray-40/5 dark:hover:bg-gray-60/5 rounded-md transition-colors"
              title={detailTexts.reset}>
              <RotateCcw className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-primary/10 dark:bg-primary-dark/15 mx-1" />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-primary dark:text-primary-dark hover:text-link hover:dark:text-link-dark hover:bg-gray-40/5 dark:hover:bg-gray-60/5 rounded-md text-xs font-semibold transition-colors">
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? detailTexts.copySuccess : detailTexts.copy}
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-gray-10/30 dark:bg-gray-90/30 overflow-hidden">
          <div className="h-full overflow-auto custom-scrollbar">
            <CodeEditor
              className="w-full resize-none font-mono text-sm lg:text-[15px] text-secondary dark:text-secondary-dark bg-transparent focus:outline-none selection:bg-link/20 dark:selection:bg-link-dark/20"
              language={'plaintext'}
              onChange={handleCodeChange}
              value={code}
            />
            {/* Hidden pre tag for SEO */}
            <pre className="sr-only" aria-hidden="true">
              {code}
            </pre>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-card/80 dark:bg-card-dark/80 backdrop-blur border-t border-primary/10 dark:border-primary-dark/10 text-[10px] text-tertiary dark:text-tertiary-dark flex justify-between items-center">
            <span>{detailTexts.status(code.split('\n').length)}</span>
            <span>{detailTexts.footer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
