import {InfographicOptions} from '@antv/infographic';
import {Tooltip} from 'antd';
import {motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {useLocaleBundle} from '../../hooks/useTranslation';
import {IconErrorCircle} from '../Icon/IconErrorCircle';

const TRANSLATIONS = {
  'zh-CN': {
    historyTitle: '生成记录',
    configure: '配置服务',
    clear: '清空对话',
    shortcut: '⌘/Ctrl + ↵',
    emptyTitle: '开始你的创作',
    emptyDescription: '还没有生成记录，使用下方示例或粘贴你的内容开始。',
    retry: '重试',
    deleteAria: '删除记录',
    placeholder: '提供你的数据，我会帮你生成信息图',
    helper: '明确图表类型、数据来源、配色/风格，会生成得更准',
    send: '生成信息图',
    sending: '生成中...',
    apiKeyError: '生成失败，请检查 API Key 或网络连接',
  },
  'en-US': {
    historyTitle: 'Generation History',
    configure: 'Configure Service',
    clear: 'Clear Conversation',
    shortcut: '⌘/Ctrl + ↵',
    emptyTitle: 'Start creating',
    emptyDescription:
      'No generations yet. Use the examples below or paste your content to get started.',
    retry: 'Retry',
    deleteAria: 'Delete record',
    placeholder: 'Provide your data and I will create an infographic for you',
    helper:
      'Specify chart types, data sources, and palette/style to get better results',
    send: 'Generate',
    sending: 'Generating...',
    apiKeyError:
      'Generation failed, please check your API key or network connection',
  },
};

export function ChatPanel({
  prompt,
  onPromptChange,
  onSend,
  isGenerating,
  textareaRef,
  history,
  onSelectHistory,
  onRetry,
  onDelete,
  onOpenConfig,
  onClear,
  examples,
  panelClassName = 'min-h-[520px] h-[640px] max-h-[75vh]',
}: {
  prompt: string;
  isGenerating: boolean;
  onPromptChange: (value: string) => void;
  onSend: (text?: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  history: Array<{
    id: string;
    title: string;
    text: string;
    status: 'pending' | 'ready' | 'error';
    error?: string;
    syntax?: string;
    config?: Partial<InfographicOptions>;
  }>;
  onSelectHistory: (
    syntax?: string,
    config?: Partial<InfographicOptions>
  ) => void;
  onRetry: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onOpenConfig: () => void;
  onClear: () => void;
  examples: Array<{title: string; text: string}>;
  panelClassName?: string;
}) {
  const historyRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const chatTexts = useLocaleBundle(TRANSLATIONS);

  useEffect(() => {
    if (!historyRef.current) return;
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [history.length]);

  const handleCardClick = (
    id: string,
    syntax?: string,
    config?: Partial<InfographicOptions>,
    disabled?: boolean
  ) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!disabled && (syntax || config)) {
      onSelectHistory(syntax, config);
    }
  };

  return (
    <motion.div
      layout
      initial={{opacity: 0, y: 24}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.45, ease: 'easeOut'}}
      className={`rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-nav dark:shadow-nav-dark p-5 lg:p-6 flex flex-col overflow-visible ${panelClassName}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <p className="text-base font-semibold text-primary dark:text-primary-dark">
          {chatTexts.historyTitle}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenConfig}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border dark:border-border-dark bg-wash dark:bg-wash-dark text-xs font-medium text-primary dark:text-primary-dark hover:border-link hover:text-link dark:hover:border-link-dark dark:hover:text-link-dark transition-colors">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {chatTexts.configure}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border dark:border-border-dark bg-wash dark:bg-wash-dark text-xs font-medium text-primary dark:text-primary-dark hover:border-link hover:text-link dark:hover:border-link-dark dark:hover:text-link-dark transition-colors">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {chatTexts.clear}
          </button>
          <span className="text-xs text-tertiary dark:text-tertiary-dark bg-wash dark:bg-wash-dark px-3 py-1 rounded-full font-medium">
            {chatTexts.shortcut}
          </span>
        </div>
      </div>

      <div
        ref={historyRef}
        className="flex-1 overflow-y-auto pr-1 py-1 mb-4 scrollbar-thin scrollbar-thumb-gray-20 dark:scrollbar-thumb-gray-60 scrollbar-track-transparent">
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-20 dark:border-gray-60 bg-gradient-to-br from-gray-5 to-transparent dark:from-gray-80 dark:to-transparent p-6 text-sm text-secondary dark:text-secondary-dark">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-link/10 to-link/5 dark:from-link-dark/10 dark:to-link-dark/5 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-link dark:text-link-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-primary dark:text-primary-dark mb-1.5 text-base">
                  {chatTexts.emptyTitle}
                </p>
                <p className="text-sm leading-relaxed">
                  {chatTexts.emptyDescription}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pr-1">
            {history.map((item) => {
              const isError = item.status === 'error';
              const disabledByRequest =
                isGenerating && item.status !== 'pending';
              const disabled =
                disabledByRequest ||
                item.status === 'pending' ||
                (!item.syntax && !item.config && !isError);
              const showError = item.status === 'error';
              const isExpanded = expandedId === item.id;
              const errorMessage = item.error || chatTexts.apiKeyError;

              const handleSelect = () => {
                if (isError || disabled) return;
                handleCardClick(item.id, item.syntax, item.config, disabled);
              };

              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={disabled || isError ? -1 : 0}
                  aria-disabled={disabled || isError}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                      e.preventDefault();
                      handleSelect();
                    }
                  }}
                  onClick={handleSelect}
                  className={`group relative w-full rounded-2xl border text-left transition-all duration-300 ease-out ${
                    showError ? 'px-3 py-3' : 'px-4 py-4'
                  } ${
                    disabled || isError
                      ? 'border-border dark:border-border-dark bg-card dark:bg-card-dark opacity-60 cursor-not-allowed'
                      : isExpanded
                        ? 'border-link/70 dark:border-link-dark/60 bg-wash dark:bg-wash-dark shadow-[0_18px_45px_-30px_rgba(22,35,70,0.32),0_12px_32px_-22px_rgba(77,116,202,0.55),0_0_0_1px_rgba(255,255,255,0.35)] dark:shadow-[0_18px_48px_-30px_rgba(0,0,0,0.55),0_12px_32px_-22px_rgba(120,150,220,0.5),0_0_0_1px_rgba(255,255,255,0.06)] -translate-y-0.5 cursor-pointer'
                        : 'border-border dark:border-border-dark bg-wash dark:bg-wash-dark hover:border-link/40 dark:hover:border-link-dark/50 cursor-pointer'
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
                          isExpanded ? 'max-h-[260px]' : 'max-h-[24px]'
                        }`}>
                        <p
                          className={`text-[13px] leading-relaxed text-secondary dark:text-secondary-dark ${
                            isExpanded ? '' : 'line-clamp-1'
                          }`}>
                          {item.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2 self-center">
                      {item.status === 'pending' && (
                        <svg
                          className="w-4 h-4 text-tertiary dark:text-tertiary-dark animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="3"
                          />
                          <path
                            className="opacity-80"
                            fill="currentColor"
                            d="M12 3a9 9 0 00-9 9h3a6 6 0 016-6V3z"
                          />
                        </svg>
                      )}

                      {showError ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetry(item.id, item.text);
                            }}
                            type="button"
                            className="inline-flex items-center justify-center h-7 px-2 text-[11px] font-semibold text-red-500 dark:text-red-400 hover:underline">
                            {chatTexts.retry}
                          </button>
                          <Tooltip
                            placement="topRight"
                            mouseEnterDelay={0.15}
                            title={
                              <div className="whitespace-pre-wrap break-words text-xs leading-relaxed max-w-xs">
                                {errorMessage}
                              </div>
                            }>
                            <span className="inline-flex">
                              <IconErrorCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            </span>
                          </Tooltip>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id);
                            }}
                            type="button"
                            aria-label={chatTexts.deleteAria}
                            className="inline-flex items-center justify-center h-8 w-8 text-tertiary dark:text-tertiary-dark hover:text-primary dark:hover:text-primary-dark transition-colors">
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round">
                              <path d="M6 6l12 12" />
                              <path d="M6 18L18 6" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        !disabled && (
                          <svg
                            className="w-4 h-4 text-link dark:text-link-dark transition-all duration-200 group-hover:translate-x-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {examples.map((example) => (
            <button
              key={example.title}
              onClick={() => {
                onPromptChange(example.text);
                textareaRef.current?.focus();
              }}
              className="group text-left rounded-lg border border-border dark:border-border-dark bg-wash dark:bg-wash-dark px-3.5 py-3 hover:border-link dark:hover:border-link-dark hover:bg-gradient-to-br hover:from-link/5 hover:to-transparent dark:hover:from-link-dark/5 dark:hover:to-transparent transition-all duration-200 hover:shadow-sm active:scale-[0.98]">
              <div className="flex items-start gap-2">
                <span className="text-[13px] leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-200">
                  {example.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="relative rounded-xl border border-border dark:border-border-dark bg-card dark:bg-card-dark focus-within:ring-2 focus-within:ring-link/30 dark:focus-within:ring-link-dark/30 focus-within:border-link dark:focus-within:border-link-dark transition-all shadow-sm overflow-hidden">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault();
                onSend();
              }
            }}
            rows={4}
            placeholder={chatTexts.placeholder}
            className="w-full bg-transparent outline-none resize-none text-[15px] leading-relaxed text-primary dark:text-primary-dark placeholder:text-tertiary dark:placeholder:text-tertiary-dark py-3.5 px-4"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 pb-3.5 pt-0">
            <div className="flex items-center gap-2 text-xs text-tertiary dark:text-tertiary-dark sm:max-w-[65%]">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="leading-tight select-none">
                {chatTexts.helper}
              </span>
            </div>
            <button
              onClick={() => onSend()}
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-link to-link/90 dark:from-link-dark dark:to-link-dark/90 text-white hover:from-link/90 hover:to-link/80 dark:hover:from-link-dark/90 dark:hover:to-link-dark/80 text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-link/25 dark:shadow-link-dark/25 active:scale-[.97] transition-all duration-200 disabled:active:scale-100 w-full sm:w-auto justify-center whitespace-nowrap">
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {chatTexts.sending}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {chatTexts.send}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
