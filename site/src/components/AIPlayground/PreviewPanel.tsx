import {InfographicOptions} from '@antv/infographic';
import {IconCodeBlock} from 'components/Icon/IconCodeBlock';
import {IconCopy} from 'components/Icon/IconCopy';
import {Infographic, type InfographicHandle} from 'components/Infographic';
import {BrowserChrome} from 'components/Layout/HomePage/BrowserChrome';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {AnimatePresence, motion} from 'framer-motion';
import {useCallback, useMemo, useRef} from 'react';
import {formatJSON} from './helpers';

type TabKey = 'preview' | 'json';

export function PreviewPanel({
  activeTab,
  onTabChange,
  isGenerating,
  previewOptions,
  json,
  onJsonChange,
  error,
  onCopy,
  panelClassName = 'min-h-[520px] h-[640px] max-h-[75vh]',
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isGenerating: boolean;
  previewOptions: Partial<InfographicOptions> | null;
  json: string;
  onJsonChange: (value: string) => void;
  error: string | null;
  onCopy?: (hint: string) => void;
  panelClassName?: string;
}) {
  const infographicRef = useRef<InfographicHandle | null>(null);

  const handleCopy = useCallback(async () => {
    const success = (await infographicRef.current?.copyToClipboard()) || false;
    if (success && onCopy) {
      onCopy('已复制图片');
    }
  }, [onCopy]);

  const navButtons = useMemo(
    () => (
      <div className="flex items-center gap-2 text-xs px-2">
        <button
          onClick={() => onTabChange('preview')}
          className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${
            activeTab === 'preview'
              ? 'bg-link text-white shadow-sm'
              : 'bg-[#ebecef] hover:bg-[#d3d7de] text-tertiary dark:text-tertiary-dark dark:bg-gray-70 dark:hover:bg-gray-60'
          }`}>
          <span className="sr-only">预览</span>
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
        </button>
        <button
          onClick={() => onTabChange('json')}
          className={`inline-flex items-center justify-center h-7 w-7 rounded-full ${
            activeTab === 'json'
              ? 'bg-link text-white shadow-sm'
              : 'bg-[#ebecef] hover:bg-[#d3d7de] text-tertiary dark:text-tertiary-dark dark:bg-gray-70 dark:hover:bg-gray-60'
          }`}>
          <span className="sr-only">JSON</span>
          <IconCodeBlock className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#ebecef] hover:bg-[#d3d7de] text-tertiary dark:text-tertiary-dark dark:bg-gray-70 dark:hover:bg-gray-60">
          <span className="sr-only">复制图片</span>
          <IconCopy className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    ),
    [activeTab, handleCopy, onTabChange]
  );

  return (
    <motion.div
      layout
      initial={{opacity: 0, y: 24}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, ease: 'easeOut'}}
      className={`rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-nav dark:shadow-nav-dark overflow-hidden flex flex-col ${panelClassName}`}>
      <BrowserChrome
        domain=""
        path={activeTab === 'preview' ? 'Preview' : 'Options'}
        hasRefresh
        error={error || null}
        hideDefaultActions
        toolbarContent={navButtons}>
        <div className="pt-14 h-full flex flex-col bg-wash dark:bg-wash-dark">
          <div
            className="relative flex-1 min-h-[400px] grid"
            style={{gridTemplateRows: '1fr'}}>
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{opacity: 0, y: 12}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.35, ease: 'easeOut'}}
                  className="relative bg-gradient-to-br from-card to-wash dark:from-gray-90 dark:to-gray-95 overflow-hidden rounded-b-2xl">
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div
                        key="loading"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.25}}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-link dark:border-link-dark" />
                          <p className="text-sm text-secondary dark:text-secondary-dark font-medium">
                            生成中...
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="relative h-full w-full p-4 lg:p-6">
                    {previewOptions && (
                      <Infographic
                        ref={infographicRef}
                        options={previewOptions}
                      />
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="json"
                  initial={{opacity: 0, y: 12}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -8}}
                  transition={{duration: 0.35, ease: 'easeOut'}}
                  className="relative bg-card dark:bg-card-dark border-t border-border dark:border-border-dark rounded-b-2xl overflow-hidden">
                  <CodeEditor
                    ariaLabel="AI JSON"
                    className="h-full overflow-auto"
                    language="json"
                    value={
                      json || formatJSON(previewOptions) || '// 等待生成结果'
                    }
                    onChange={onJsonChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </BrowserChrome>
    </motion.div>
  );
}
