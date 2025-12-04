import {InfographicOptions} from '@antv/infographic';
import {Page} from 'components/Layout/Page';
import {AnimatePresence, motion} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {IconStarTwinkle} from '../Icon/IconStarTwinkle';
import {ChatPanel} from './ChatPanel';
import {ConfigPanel} from './ConfigPanel';
import {PreviewPanel} from './PreviewPanel';
import {sendMessage} from './Service';
import {
  DEFAULT_CONFIG,
  FALLBACK_OPTIONS,
  PROVIDER_OPTIONS,
  STORAGE_KEYS,
} from './constants';
import {formatJSON} from './helpers';
import type {AIConfig, AIModelConfig, AIProvider, ChatMessage} from './types';

const createId = () => {
  try {
    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

type Config = Record<AIProvider, AIConfig>;

type HistoryRecord = {
  id: string;
  title: string;
  text: string;
  status: 'pending' | 'ready' | 'error';
  error?: string;
  config?: Partial<InfographicOptions>;
};

const createTitle = (text: string) =>
  text.length > 18 ? `${text.slice(0, 18)}…` : text || '待输入';

const toHistoryRecord = (input: {
  id: string;
  text: string;
  status: 'pending' | 'ready' | 'error';
  error?: string;
  config?: Partial<InfographicOptions>;
}): HistoryRecord => ({
  id: input.id,
  text: input.text,
  status: input.status,
  error: input.error,
  config: input.config,
  title: createTitle(input.text),
});

const normalizeLegacyMessages = (raw: ChatMessage[]): HistoryRecord[] => {
  const records: HistoryRecord[] = [];
  let pendingUser: ChatMessage | null = null;

  for (const msg of raw) {
    if (msg.role === 'user') {
      pendingUser = msg;
    } else if (msg.role === 'assistant' && pendingUser) {
      records.push(
        toHistoryRecord({
          id: pendingUser.id,
          text: pendingUser.text,
          status: msg.isError ? 'error' : 'ready',
          error: msg.error,
          config: msg.config,
        })
      );
      pendingUser = null;
    }
  }

  if (pendingUser) {
    records.push(
      toHistoryRecord({
        id: pendingUser.id,
        text: pendingUser.text,
        status: 'pending',
      })
    );
  }

  return records;
};

const normalizeStoredHistory = (raw: any): HistoryRecord[] => {
  if (!Array.isArray(raw)) return [];
  if (raw.some((item) => item && typeof item === 'object' && 'role' in item)) {
    return normalizeLegacyMessages(raw as ChatMessage[]);
  }

  const normalized: HistoryRecord[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const text = typeof item.text === 'string' ? item.text : '';
    const status =
      item.status === 'ready' || item.status === 'error'
        ? item.status
        : 'pending';
    normalized.push(
      toHistoryRecord({
        id: typeof item.id === 'string' ? item.id : createId(),
        text,
        status,
        error: typeof item.error === 'string' ? item.error : undefined,
        config:
          item.config && typeof item.config === 'object'
            ? (item.config as Partial<InfographicOptions>)
            : undefined,
      })
    );
  }
  return normalized;
};

export function AIPageContent() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [configMap, setConfigMap] = useState<Config>({
    [DEFAULT_CONFIG.provider]: DEFAULT_CONFIG,
  } as Config);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOptions, setPreviewOptions] =
    useState<Partial<InfographicOptions> | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [lastJSON, setLastJSON] = useState('');
  const [copyHint, setCopyHint] = useState('');
  const [mounted, setMounted] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recoveredPendingRef = useRef(false);
  const PANEL_HEIGHT_CLASS = 'min-h-[520px] h-[640px] max-h-[75vh]';

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const savedConfig = localStorage.getItem(STORAGE_KEYS.config);
    const savedMessages = localStorage.getItem(STORAGE_KEYS.messages);
    const savedInfographic = localStorage.getItem(STORAGE_KEYS.infographic);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        const {configs, currentProvider} = normalizeStoredConfigs(parsed);
        setConfigMap(configs);
        let targetProvider: AIProvider | undefined = undefined;
        if (currentProvider && configs[currentProvider]) {
          targetProvider = currentProvider;
        } else if (configs[DEFAULT_CONFIG.provider]) {
          targetProvider = DEFAULT_CONFIG.provider;
        }
        const fallbackProvider =
          targetProvider ||
          (Object.keys(configs)[0] as AIProvider | undefined) ||
          DEFAULT_CONFIG.provider;
        setConfig(configs[fallbackProvider] || DEFAULT_CONFIG);
      } catch {
        setConfigMap({[DEFAULT_CONFIG.provider]: DEFAULT_CONFIG} as Config);
        setConfig(DEFAULT_CONFIG);
      }
    }
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setHistory(normalizeStoredHistory(parsed));
      } catch {
        setHistory([]);
      }
    }
    if (savedInfographic) {
      try {
        setPreviewOptions(JSON.parse(savedInfographic));
      } catch {
        setPreviewOptions(null);
      }
    }
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || recoveredPendingRef.current || isGenerating) return;
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.status === 'pending') {
      recoveredPendingRef.current = true;
      setHistory((prev) => {
        const next = [...prev];
        next[next.length - 1] = {...last, status: 'error', error: '请求未完成'};
        return next;
      });
      if (previewOptions) {
        setLastJSON(formatJSON(previewOptions));
      } else {
        setLastJSON('');
      }
      setActiveTab('preview');
    }
  }, [history, mounted, isGenerating, previewOptions]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(
      STORAGE_KEYS.config,
      JSON.stringify({
        currentProvider: config.provider,
        configs: configMap,
      })
    );
  }, [config, configMap, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(history));
  }, [history, mounted]);

  useEffect(() => {
    if (!mounted || !previewOptions) return;
    localStorage.setItem(
      STORAGE_KEYS.infographic,
      JSON.stringify(previewOptions)
    );
  }, [previewOptions, mounted]);

  const effectivePreview = previewOptions || FALLBACK_OPTIONS;

  const requestInfographic = async (content: string, userId: string) => {
    setIsGenerating(true);
    setHistory((prev) =>
      prev.map((item) =>
        item.id === userId
          ? {...item, status: 'pending', error: undefined, config: undefined}
          : item
      )
    );

    try {
      const modelConfig: AIModelConfig = {
        provider: config.provider,
        baseURL: config.baseUrl.replace(/\/$/, ''),
        apiKey: config.apiKey,
        model: config.model || DEFAULT_CONFIG.model,
      };

      const payloadMessages: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
      }> = [
        {
          role: 'user',
          content,
        },
      ];

      const resMsg = await sendMessage(modelConfig, payloadMessages);
      let parsedConfig: Partial<InfographicOptions> | null = null;
      let parseError = '';

      try {
        const match = resMsg.match(/```(?:json)?\s*([\s\S]*?)```/);
        const candidate = match ? match[1] : resMsg;
        const raw = JSON.parse(candidate);
        parsedConfig =
          raw && typeof raw === 'object' && 'config' in raw
            ? (raw as {config: Partial<InfographicOptions>}).config
            : (raw as Partial<InfographicOptions>);
      } catch (err) {
        if (resMsg.includes('{')) {
          parseError = '无法解析模型返回内容';
        } else {
          parseError = resMsg;
        }
      }

      setHistory((prev) =>
        prev.map((item) =>
          item.id === userId
            ? {
                ...item,
                status: parsedConfig ? 'ready' : 'error',
                error: parsedConfig ? undefined : parseError,
                config: parsedConfig || undefined,
              }
            : item
        )
      );

      if (parsedConfig) {
        setPreviewOptions(parsedConfig);
        setPreviewError(null);
        setLastJSON(formatJSON(parsedConfig));
        setActiveTab('preview');
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '生成失败，请检查网络或稍后重试。';

      setHistory((prev) =>
        prev.map((item) =>
          item.id === userId
            ? {...item, status: 'error', error: message, config: undefined}
            : item
        )
      );
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = async (value?: string) => {
    const content = (value ?? prompt).trim();
    if (!content) return;

    const targetId =
      retryingId && history.some((item) => item.id === retryingId)
        ? retryingId
        : null;
    let requestId: string;

    if (targetId) {
      requestId = targetId;
      setHistory((prev) =>
        prev.map((item) =>
          item.id === targetId
            ? {
                ...item,
                text: content,
                title: createTitle(content),
                status: 'pending',
                error: undefined,
                config: undefined,
              }
            : item
        )
      );
    } else {
      const newRecord = toHistoryRecord({
        id: createId(),
        text: content,
        status: 'pending',
      });
      requestId = newRecord.id;
      setHistory((prev) => [...prev, newRecord]);
    }

    setPrompt('');
    if (retryingId) {
      setRetryingId(null);
    }

    await requestInfographic(content, requestId);
  };

  const handleCopyHint = (hint: string) => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopyHint(hint);
    copyTimerRef.current = setTimeout(() => setCopyHint(''), 1500);
  };

  const handleClear = () => {
    setHistory([]);
    setRetryingId(null);
    setPreviewOptions(null);
    setLastJSON('');
    setPreviewError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.messages);
      localStorage.removeItem(STORAGE_KEYS.infographic);
    }
  };

  const historyItems = history;

  const handleSelectHistory = (config?: Partial<InfographicOptions>) => {
    if (!config) return;
    setPreviewOptions(config);
    setPreviewError(null);
    setLastJSON(formatJSON(config));
    setActiveTab('preview');
  };

  const handleRetry = (id: string, text: string) => {
    const target = history.find((item) => item.id === id);
    if (!target) return;

    setPrompt(text);
    setRetryingId(id);
    inputRef.current?.focus();
  };

  const handleJsonChange = (value: string) => {
    setLastJSON(value);
    try {
      const parsed = JSON.parse(value) as Partial<InfographicOptions>;
      setPreviewOptions(parsed);
      setPreviewError(null);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'JSON 解析失败');
    }
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (retryingId === id) {
      setRetryingId(null);
      setPrompt('');
    }
  };

  return (
    <Page
      toc={[]}
      routeTree={{title: 'AI', path: '/ai', routes: []}}
      meta={{title: 'AI 生成信息图'}}
      section="ai">
      <div className="relative isolate overflow-hidden bg-wash dark:bg-wash-dark">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-12 py-12 lg:py-16 flex flex-col gap-12">
          {/* Header Section */}
          <motion.header
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className="max-w-4xl space-y-6">
            <div>
              <h1 className="flex items-center gap-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-primary dark:text-primary-dark select-none">
                <IconStarTwinkle className="w-10 h-10 md:w-12 md:h-12 text-link dark:text-link-dark" />
                <span>
                  AI
                  <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
                    {' '}
                    Infographic
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark max-w-3xl leading-relaxed select-none">
              将你在日常写作、汇报或其他文字工作中遇到的内容粘贴到这里，AI
              会理解语境并为你生成相匹配的信息图方案
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{y: -2, scale: 1.01}}
                whileTap={{scale: 0.98, y: 0}}
                onClick={() => setIsConfigOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-link text-white dark:bg-link-dark hover:bg-opacity-90 text-sm font-semibold shadow-secondary-button-stroke active:scale-[.98] transition-all">
                <svg
                  className="w-4 h-4"
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
                配置模型服务
              </motion.button>
              <motion.button
                whileHover={{y: -2, scale: 1.01}}
                whileTap={{scale: 0.98, y: 0}}
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary dark:text-primary-dark text-sm shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 font-semibold active:scale-[.98] transition-all">
                <svg
                  className="w-4 h-4"
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
                清空对话
              </motion.button>
            </div>
          </motion.header>

          <motion.section
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: 'easeOut', delay: 0.1}}
            className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-tertiary dark:text-tertiary-dark">
                AI 工作区
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChatPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                onSend={handleSend}
                isGenerating={isGenerating}
                textareaRef={inputRef}
                history={historyItems}
                onSelectHistory={handleSelectHistory}
                onRetry={handleRetry}
                onDelete={handleDelete}
                panelClassName={PANEL_HEIGHT_CLASS}
              />

              {
                <PreviewPanel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isGenerating={isGenerating}
                  previewOptions={effectivePreview}
                  json={lastJSON}
                  onJsonChange={handleJsonChange}
                  error={previewError}
                  panelClassName={PANEL_HEIGHT_CLASS}
                  onCopy={handleCopyHint}
                />
              }
            </div>
          </motion.section>

          <AnimatePresence>
            {copyHint && (
              <motion.div
                initial={{opacity: 0, y: 12}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 12}}
                transition={{duration: 0.25}}
                className="fixed bottom-8 right-8 rounded-full bg-link dark:bg-link-dark text-white px-5 py-2.5 shadow-lg font-medium text-sm">
                ✓ {copyHint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfigPanel
        open={isConfigOpen}
        value={config}
        savedConfigs={configMap}
        onClose={() => setIsConfigOpen(false)}
        onSave={(value) => {
          setConfigMap((prev) => ({
            ...prev,
            [value.provider]: value,
          }));
          setConfig(value);
          setIsConfigOpen(false);
        }}
      />
    </Page>
  );
}

function isAIProvider(value: any): value is AIProvider {
  return PROVIDER_OPTIONS.some((item) => item.value === value);
}

function normalizeConfig(
  partial: Partial<AIConfig> | null,
  provider?: AIProvider
): AIConfig {
  const safeProvider =
    (partial?.provider && isAIProvider(partial.provider)
      ? partial.provider
      : undefined) ||
    provider ||
    DEFAULT_CONFIG.provider;
  const preset = PROVIDER_OPTIONS.find((item) => item.value === safeProvider);
  return {
    provider: safeProvider,
    baseUrl: partial?.baseUrl || preset?.baseUrl || '',
    model: partial?.model || '',
    apiKey: partial?.apiKey || '',
  };
}

function normalizeStoredConfigs(raw: any): {
  configs: Record<AIProvider, AIConfig>;
  currentProvider?: AIProvider;
} {
  const configs: Record<AIProvider, AIConfig> = {} as Record<
    AIProvider,
    AIConfig
  >;

  const tryAdd = (cfg: any) => {
    if (!cfg || typeof cfg !== 'object') return;
    const providerCandidate = isAIProvider(cfg.provider)
      ? cfg.provider
      : undefined;
    const normalized = normalizeConfig(cfg, providerCandidate);
    configs[normalized.provider] = normalized;
  };

  if (raw && typeof raw === 'object') {
    if ('configs' in raw && raw.configs && typeof raw.configs === 'object') {
      Object.entries(raw.configs).forEach(([key, value]) => {
        const provider = isAIProvider(key) ? key : undefined;
        const merged = {...(value as any), provider: provider || undefined};
        tryAdd(merged);
      });
    } else if ('provider' in raw) {
      tryAdd(raw);
    }
  }

  if (!Object.keys(configs).length) {
    configs[DEFAULT_CONFIG.provider] = DEFAULT_CONFIG;
  }

  const currentProvider = isAIProvider(raw?.currentProvider)
    ? raw.currentProvider
    : undefined;

  return {configs, currentProvider};
}
