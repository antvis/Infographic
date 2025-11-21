import {InfographicOptions} from '@antv/infographic';
import {IconCodeBlock} from 'components/Icon/IconCodeBlock';
import {IconCopy} from 'components/Icon/IconCopy';
import {Infographic} from 'components/Infographic';
import {BrowserChrome} from 'components/Layout/HomePage/BrowserChrome';
import {CodeEditor} from 'components/MDX/CodeEditor';
import {useMemo} from 'react';
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
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  isGenerating: boolean;
  previewOptions: Partial<InfographicOptions> | null;
  json: string;
  onJsonChange: (value: string) => void;
  error: string | null;
  onCopy: () => void;
}) {
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
          onClick={onCopy}
          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#ebecef] hover:bg-[#d3d7de] text-tertiary dark:text-tertiary-dark dark:bg-gray-70 dark:hover:bg-gray-60">
          <span className="sr-only">复制配置</span>
          <IconCopy className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    ),
    [activeTab, onCopy, onTabChange]
  );

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-nav dark:shadow-nav-dark min-h-[520px] h-[640px] max-h-[75vh] overflow-hidden flex flex-col">
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
            {activeTab === 'preview' ? (
              <div className="relative bg-gradient-to-br from-card to-wash dark:from-gray-90 dark:to-gray-95 overflow-hidden rounded-b-2xl">
                {isGenerating && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-link dark:border-link-dark" />
                      <p className="text-sm text-secondary dark:text-secondary-dark font-medium">
                        生成中...
                      </p>
                    </div>
                  </div>
                )}
                <div className="relative h-full w-full p-4 lg:p-6">
                  {previewOptions && <Infographic options={previewOptions} />}
                </div>
              </div>
            ) : (
              <div className="relative bg-card dark:bg-card-dark border-t border-border dark:border-border-dark rounded-b-2xl overflow-hidden">
                <CodeEditor
                  ariaLabel="AI JSON"
                  className="h-full overflow-auto"
                  language="json"
                  value={
                    json || formatJSON(previewOptions) || '// 等待生成结果'
                  }
                  onChange={onJsonChange}
                />
              </div>
            )}
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
}
