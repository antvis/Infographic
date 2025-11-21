import {InfographicOptions} from '@antv/infographic';
import {useEffect, useRef, useState} from 'react';
import {IconErrorCircle} from '../Icon/IconErrorCircle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {EXAMPLE_PROMPTS} from './constants';

export function ChatPanel({
  prompt,
  onPromptChange,
  onSend,
  isGenerating,
  textareaRef,
  history,
  onSelectHistory,
  onRetry,
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
    summary?: string;
    config?: Partial<InfographicOptions>;
  }>;
  onSelectHistory: (config?: Partial<InfographicOptions>) => void;
  onRetry: (text: string) => void;
}) {
  const historyRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!historyRef.current) return;
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [history.length]);

  const handleCardClick = (
    id: string,
    config?: Partial<InfographicOptions>,
    disabled?: boolean
  ) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!disabled && config) {
      onSelectHistory(config);
    }
  };

  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark shadow-nav dark:shadow-nav-dark p-5 lg:p-6 flex flex-col min-h-[520px] h-[620px] max-h-[75vh] overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-base font-semibold text-primary dark:text-primary-dark">
            生成记录
          </p>
        </div>
        <span className="text-xs text-tertiary dark:text-tertiary-dark bg-wash dark:bg-wash-dark px-2.5 py-1 rounded-full font-medium">
          ⌘/Ctrl + ↵
        </span>
      </div>

      <TooltipProvider delayDuration={150}>
        <div
          ref={historyRef}
          className="flex-1 overflow-y-auto pr-1 mb-4 scrollbar-thin scrollbar-thumb-gray-20 dark:scrollbar-thumb-gray-60 scrollbar-track-transparent">
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
                    开始你的创作
                  </p>
                  <p className="text-sm leading-relaxed">
                    还没有生成记录，使用下方示例或粘贴你的内容开始。
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
                  (!item.config && !isError);
                const showError = item.status === 'error';
                const isExpanded = expandedId === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      isError
                        ? undefined
                        : handleCardClick(item.id, item.config, disabled)
                    }
                    disabled={disabled || isError}
                    className={`group relative w-full rounded-2xl border text-left disabled:cursor-not-allowed transition-all duration-300 ease-out px-4 py-4 ${
                      disabled
                        ? 'border-border dark:border-border-dark bg-card dark:bg-card-dark opacity-60'
                        : isExpanded
                        ? 'border-link/70 dark:border-link-dark/60 bg-wash dark:bg-wash-dark shadow-[0_20px_55px_-30px_rgba(64,99,164,0.65)] -translate-y-0.5'
                        : 'border-border dark:border-border-dark bg-wash dark:bg-wash-dark hover:border-link/40 dark:hover:border-link-dark/50'
                    }`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div
                          className={`overflow-hidden transition-[max-height] duration-400 ease-out ${
                            isExpanded ? 'max-h-64' : 'max-h-[24px]'
                          }`}>
                          <p
                            className={`text-[13px] leading-relaxed text-secondary dark:text-secondary-dark transition-[opacity,transform] duration-400 ${
                              isExpanded
                                ? 'line-clamp-none opacity-100 translate-y-0'
                                : 'line-clamp-1 opacity-90 translate-y-[1px]'
                            }`}>
                            {item.summary || item.text}
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
                                onRetry(item.text);
                              }}
                              className="inline-flex items-center justify-center h-7 px-2 rounded-full border border-red-50/50 dark:border-red-50/40 text-[11px] font-semibold text-red-500 dark:text-red-400 bg-red-50/10 dark:bg-red-50/10 hover:bg-red-50/20 dark:hover:bg-red-50/20">
                              重试
                            </button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <IconErrorCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" align="end">
                                生成失败，请检查 API Key 或网络连接
                              </TooltipContent>
                            </Tooltip>
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
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </TooltipProvider>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
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
            placeholder="提供你的数据，我会帮你生成信息图"
            className="w-full bg-transparent outline-none resize-none text-[15px] leading-relaxed text-primary dark:text-primary-dark placeholder:text-tertiary dark:placeholder:text-tertiary-dark py-3.5 px-4"
          />
          <div className="flex items-center justify-between px-4 pb-3.5 pt-0">
            <div className="flex items-center gap-2 text-xs text-tertiary dark:text-tertiary-dark">
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
              <span className="leading-tight">
                明确图表类型、数据来源、配色/风格，会生成得更准
              </span>
            </div>
            <button
              onClick={() => onSend()}
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-link to-link/90 dark:from-link-dark dark:to-link-dark/90 text-white hover:from-link/90 hover:to-link/80 dark:hover:from-link-dark/90 dark:hover:to-link-dark/80 text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-link/25 dark:shadow-link-dark/25 active:scale-[.97] transition-all duration-200 disabled:active:scale-100">
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
                  生成中...
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
                  生成信息图
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
