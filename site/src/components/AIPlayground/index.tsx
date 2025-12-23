import {InfographicOptions} from '@antv/infographic';
import {CopyToast, useCopyToast} from 'components/CopyToast';
import {Page} from 'components/Layout/Page';
import {motion} from 'framer-motion';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useRef, useState} from 'react';
import {IconStarTwinkle} from '../Icon/IconStarTwinkle';
import {ChatPanel} from './ChatPanel';
import {ConfigPanel} from './ConfigPanel';
import {PreviewPanel} from './PreviewPanel';
import {sendMessageStream} from './Service';
import {
  DEFAULT_CONFIG,
  FALLBACK_SYNTAX,
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
  syntax?: string;
  config?: Partial<InfographicOptions>;
};

const createTitle = (text: string) =>
  text.length > 18 ? `${text.slice(0, 18)}…` : text || '待输入';

const extractSyntaxContent = (text: string) => {
  if (!text) return '';
  const fenced = text.match(/```(?:[\w-]+)?\s*([\s\S]*?)```/);
  if (fenced) {
    const content = fenced[1] || '';
    return content.replace(/^\s*[\r\n]+/, '');
  }
  const startRegex = /```(?:[\w-]+)?\s*/;
  const match = text.match(startRegex);
  const startIndex = text.search(startRegex);
  if (match && startIndex !== -1) {
    return text.slice(startIndex + match[0].length).replace(/^\s*[\r\n]+/, '');
  }
  return text;
};

const toHistoryRecord = (input: {
  id: string;
  text: string;
  status: 'pending' | 'ready' | 'error';
  error?: string;
  syntax?: string;
  config?: Partial<InfographicOptions>;
}): HistoryRecord => ({
  id: input.id,
  text: input.text,
  status: input.status,
  error: input.error,
  syntax: input.syntax,
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
          config:
            msg.config && typeof msg.config === 'object'
              ? (msg.config as Partial<InfographicOptions>)
              : undefined,
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
    const syntax =
      typeof (item as any).syntax === 'string'
        ? (item as any).syntax
        : undefined;
    const config =
      item.config && typeof item.config === 'object'
        ? (item.config as Partial<InfographicOptions>)
        : undefined;
    normalized.push(
      toHistoryRecord({
        id: typeof item.id === 'string' ? item.id : createId(),
        text,
        status,
        error: typeof item.error === 'string' ? item.error : undefined,
        syntax,
        config,
      })
    );
  }
  return normalized;
};

export function AIPageContent() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [config, setConfig] = useState<AIConfig>(DEFAULT_CONFIG);
  const [configMap, setConfigMap] = useState<Config>({
    [DEFAULT_CONFIG.provider]: DEFAULT_CONFIG,
  } as Config);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editorText, setEditorText] = useState('');
  const [previewKind, setPreviewKind] = useState<'syntax' | 'json'>('syntax');
  const [jsonPreview, setJsonPreview] =
    useState<Partial<InfographicOptions> | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'syntax'>('preview');
  const [mounted, setMounted] = useState(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recoveredPendingRef = useRef(false);
  const autoStartRef = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const PANEL_HEIGHT_CLASS = 'min-h-[520px] h-[640px] max-h-[75vh]';
  const {message: copyHint, show: showCopyHint} = useCopyToast();

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
        const parsed = JSON.parse(savedInfographic);
        if (
          parsed &&
          typeof parsed === 'object' &&
          'kind' in parsed &&
          'value' in parsed
        ) {
          if (
            parsed.kind === 'json' &&
            parsed.value &&
            typeof parsed.value === 'object'
          ) {
            setPreviewKind('json');
            setJsonPreview(parsed.value as Partial<InfographicOptions>);
            setEditorText(formatJSON(parsed.value));
          } else if (
            parsed.kind === 'syntax' &&
            typeof parsed.value === 'string'
          ) {
            setPreviewKind('syntax');
            setJsonPreview(null);
            setEditorText(parsed.value);
          }
        } else if (typeof parsed === 'string') {
          setPreviewKind('syntax');
          setJsonPreview(null);
          setEditorText(parsed);
        } else if (
          parsed &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          setPreviewKind('json');
          setJsonPreview(parsed as Partial<InfographicOptions>);
          setEditorText(formatJSON(parsed));
        }
      } catch {
        setPreviewKind('syntax');
        setJsonPreview(null);
        setEditorText(savedInfographic);
      }
    }
    setHasHydrated(true);
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
      setActiveTab('preview');
    }
  }, [history, mounted, isGenerating]);

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
    if (!mounted) return;
    if (previewKind === 'json' && jsonPreview) {
      localStorage.setItem(
        STORAGE_KEYS.infographic,
        JSON.stringify({kind: 'json', value: jsonPreview})
      );
    } else if (previewKind === 'syntax' && editorText) {
      localStorage.setItem(
        STORAGE_KEYS.infographic,
        JSON.stringify({kind: 'syntax', value: editorText})
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.infographic);
    }
  }, [previewKind, jsonPreview, editorText, mounted]);

  const requestInfographic = useCallback(
    async (content: string, userId: string) => {
      setIsGenerating(true);
      setHistory((prev) =>
        prev.map((item) =>
          item.id === userId
            ? {
                ...item,
                status: 'pending',
                error: undefined,
                syntax: undefined,
                config: undefined,
              }
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

        let rawBuffer = '';
        let syntaxBuffer = '';
        setPreviewKind('syntax');
        setJsonPreview(null);
        setEditorText('');
        setPreviewError(null);
        setActiveTab('preview');

        await sendMessageStream(
          modelConfig,
          payloadMessages,
          (chunk) => {
            if (!chunk) return;
            rawBuffer += chunk;
            syntaxBuffer = extractSyntaxContent(rawBuffer);
            setPreviewKind('syntax');
            setJsonPreview(null);
            setEditorText(syntaxBuffer);
            setPreviewError(null);
          },
          () => {
            const hasSyntax = syntaxBuffer.trim().length > 0;
            setHistory((prev) =>
              prev.map((item) =>
                item.id === userId
                  ? {
                      ...item,
                      status: hasSyntax ? 'ready' : 'error',
                      error: hasSyntax ? undefined : '未接收到模型输出',
                      syntax: hasSyntax ? syntaxBuffer : undefined,
                      config: hasSyntax ? undefined : item.config,
                    }
                  : item
              )
            );
            if (!hasSyntax) {
              setPreviewError('模型未返回内容');
            }
          },
          (error) => {
            const message = error.message || '生成失败，请检查网络或稍后重试。';
            setHistory((prev) =>
              prev.map((item) =>
                item.id === userId
                  ? {
                      ...item,
                      status: 'error',
                      error: message,
                      syntax: undefined,
                    }
                  : item
              )
            );
            setPreviewError(message);
          }
        );
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : '生成失败，请检查网络或稍后重试。';
        setHistory((prev) =>
          prev.map((item) =>
            item.id === userId
              ? {
                  ...item,
                  status: 'error',
                  error: message,
                  syntax: undefined,
                  config: undefined,
                }
              : item
          )
        );
        setPreviewError(message);
      } finally {
        setIsGenerating(false);
        inputRef.current?.focus();
      }
    },
    [config]
  );

  const handleSend = useCallback(
    async (value?: string) => {
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
                  syntax: undefined,
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
    },
    [prompt, retryingId, history, requestInfographic]
  );

  useEffect(() => {
    if (!router.isReady || autoStartRef.current || !hasHydrated) return;
    const rawPrompt = router.query.prompt;
    const incoming = Array.isArray(rawPrompt)
      ? rawPrompt.join(' ')
      : rawPrompt || '';
    const normalized = incoming.replace(/\+/g, ' ').trim();
    if (!normalized) return;

    autoStartRef.current = true;
    setPrompt(normalized);
    void handleSend(normalized);
    const {prompt: _omit, ...rest} = router.query;
    void router.replace(
      {
        pathname: router.pathname,
        query: rest,
      },
      undefined,
      {shallow: true}
    );
  }, [router, router.isReady, router.query.prompt, hasHydrated, handleSend]);

  const handleCopyHint = useCallback(
    (hint: string) => showCopyHint(hint),
    [showCopyHint]
  );

  const handleClear = () => {
    setHistory([]);
    setRetryingId(null);
    setEditorText('');
    setJsonPreview(null);
    setPreviewKind('syntax');
    setPreviewError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.messages);
      localStorage.removeItem(STORAGE_KEYS.infographic);
    }
  };

  const historyItems = history;

  const handleSelectHistory = (
    syntax?: string,
    config?: Partial<InfographicOptions>
  ) => {
    if (syntax) {
      setPreviewKind('syntax');
      setJsonPreview(null);
      setEditorText(syntax);
    } else if (config) {
      setPreviewKind('json');
      setJsonPreview(config);
      setEditorText(formatJSON(config));
    } else {
      return;
    }
    setPreviewError(null);
    setActiveTab('preview');
  };

  const handleRetry = (id: string, text: string) => {
    const target = history.find((item) => item.id === id);
    if (!target) return;

    setPrompt(text);
    setRetryingId(id);
    inputRef.current?.focus();
  };

  const handleEditorChange = (value: string) => {
    setEditorText(value);
    if (previewKind === 'json') {
      try {
        const parsed = JSON.parse(value) as Partial<InfographicOptions>;
        setJsonPreview(parsed);
        setPreviewError(null);
      } catch (err) {
        setPreviewError(err instanceof Error ? err.message : 'JSON 解析失败');
      }
    } else {
      setPreviewError(null);
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
      section="ai"
      topNavOptions={{
        hideBrandWhenHeroVisible: true,
        overlayOnHome: true,
        heroAnchorId: 'ai-hero-anchor',
      }}>
      <div className="relative isolate overflow-hidden bg-wash dark:bg-wash-dark">
        {/* Background decorations */}
        <div className="pointer-events-none absolute -left-32 -top-40 h-96 w-96 rounded-full bg-gradient-to-br from-link/20 via-link/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-purple-40/15 via-transparent to-link/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-12 py-12 lg:py-16 flex flex-col gap-4">
          {/* Header Section */}
          <motion.header
            id="ai-hero-anchor"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className="space-y-6">
            <div>
              <h1 className="flex items-center gap-3 text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-primary dark:text-primary-dark">
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

            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-relaxed">
              将你在日常写作、汇报或其他文字工作中遇到的内容粘贴到这里，AI
              会理解语境并为你生成相匹配的信息图方案
            </p>
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
                onOpenConfig={() => setIsConfigOpen(true)}
                onClear={handleClear}
                panelClassName={PANEL_HEIGHT_CLASS}
              />

              {
                <PreviewPanel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isGenerating={isGenerating}
                  editorValue={editorText}
                  previewKind={previewKind}
                  jsonPreview={jsonPreview}
                  fallbackSyntax={FALLBACK_SYNTAX}
                  onEditorChange={handleEditorChange}
                  error={previewError}
                  panelClassName={PANEL_HEIGHT_CLASS}
                  onCopy={handleCopyHint}
                  onRenderError={setPreviewError}
                />
              }
            </div>
          </motion.section>

          <CopyToast message={copyHint} />
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
