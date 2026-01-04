import {InfographicOptions} from '@antv/infographic';
import {CopyToast, useCopyToast} from 'components/CopyToast';
import {Page} from 'components/Layout/Page';
import CodeBlock from 'components/MDX/CodeBlock';
import {motion} from 'framer-motion';
import {useRouter} from 'next/router';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocaleBundle} from '../../hooks/useTranslation';
import {IconStarTwinkle} from '../Icon/IconStarTwinkle';
import {ChatPanel} from './ChatPanel';
import {ConfigPanel} from './ConfigPanel';
import {PreviewPanel} from './PreviewPanel';
import {sendMessageStream} from './Service';
import {DEFAULT_CONFIG, PROVIDER_OPTIONS, STORAGE_KEYS} from './constants';
import {formatJSON} from './helpers';
import type {AIConfig, AIModelConfig, AIProvider, ChatMessage} from './types';

const TRANSLATIONS = {
  'zh-CN': {
    pending: '待输入',
    metaTitle: 'AI 生成信息图',
    hero: {
      title: 'AI',
      highlight: 'Infographic',
      description:
        '将你在日常写作、汇报或其他文字工作中遇到的内容粘贴到这里，AI 会理解语境并为你生成相匹配的信息图方案',
    },
    workspaceLabel: 'AI 工作区',
    skills: {
      title: 'Skills 集成',
      description:
        '以下 skills 帮助你生成语法、结构与模板，适配 Codex / Claude Code。',
      items: [
        {
          name: 'infographic-creator',
          desc: '创建渲染信息图的 HTML 文件',
        },
        {
          name: 'infographic-syntax-creator',
          desc: '根据描述生成信息图语法',
        },
        {
          name: 'infographic-structure-creator',
          desc: '生成自定义的结构设计',
        },
        {
          name: 'infographic-item-creator',
          desc: '生成自定义的数据项设计',
        },
        {
          name: 'infographic-template-updater',
          desc: '（开发者使用）更新信息图模板库',
        },
      ],
      usageTitle: '使用方式',
      claudeTitle: 'Claude Code',
      claudeCommands: `set -e

VERSION=0.2.4 # 将 VERSION 替换为最新版本号，例如 0.2.4
BASE_URL=https://github.com/antvis/Infographic/archive/refs/tags
mkdir -p .claude/skills

curl -L -o skills.zip "$BASE_URL/$VERSION/skills.zip"
tar -xf skills.zip -C ./claude/skills
rm -f skills.zip
`,
      codexTitle: 'Codex',
      codexCommands: `# 将 <SKILL> 替换为需要安装的 skill 名称，例如 infographic-creator
# https://github.com/antvis/Infographic/tree/main/.skills/<SKILL>
$skill-installer install https://github.com/antvis/Infographic/tree/main/.skills/infographic-creator
`,
    },
    preview: {
      tabPreview: '预览',
      tabSyntax: '语法',
      copyImage: '复制图片',
      generating: '生成中...',
      empty: '输入提示语以生成信息图语法',
    },
    notifications: {
      copyImage: '已复制图片',
      copySkill: '已复制到剪贴板',
    },
    errors: {
      requestIncomplete: '请求未完成',
      noOutput: '未接收到模型输出',
      noModel: '模型未返回内容',
      generationFailed: '生成失败，请检查网络或稍后重试。',
      jsonParse: 'JSON 解析失败',
    },
    examples: [
      {
        title: '🎯 产品生命周期管理',
        text: '产品从导入期到成长期，销量快速攀升，市场份额从5%增长至25%。成熟期达到峰值40%后保持稳定。衰退期开始下滑至15%。通过在成长期加大营销投入，成熟期优化成本结构，衰退期及时推出升级产品，实现平稳过渡。',
      },
      {
        title: '💰 客户价值分层',
        text: '将客户分为四个层级：VIP客户占比5%但贡献45%营收，高价值客户占15%贡献30%营收，普通客户占30%贡献20%营收，低价值客户占50%仅贡献5%营收。针对不同层级制定差异化服务策略，重点维护高价值客群，激活潜力客户。',
      },
      {
        title: '🌍 全球市场布局进展',
        text: '2020年聚焦亚太市场，营收占比60%。2021年拓展欧洲市场，占比提升至25%。2022年进军北美，三大市场形成均衡格局，分别为40%、30%、25%。2023年新兴市场突破，拉美和中东合计贡献15%，全球化布局初步完成。',
      },
    ],
    fallbackSyntax: `infographic list-row-horizontal-icon-arrow\ndata\n  title 客户增长引擎\n  desc 多渠道触达与复购提升\n  items\n    - label 线索获取\n      value 18.6\n      desc 渠道投放与内容获客\n      icon mdi/rocket-launch\n    - label 转化提效\n      value 12.4\n      desc 线索评分与自动跟进\n      icon mdi/progress-check\n    - label 复购提升\n      value 9.8\n      desc 会员体系与权益运营\n      icon mdi/account-sync\n    - label 产品增长\n      value 10.2\n      desc 试用转化与功能引导\n      icon mdi/chart-line`,
  },
  'en-US': {
    pending: 'Pending input',
    metaTitle: 'AI Infographic',
    hero: {
      title: 'AI',
      highlight: 'Infographic',
      description:
        'Paste content from writing, reporting, or any text task and AI will understand the context and output an infographic plan.',
    },
    workspaceLabel: 'AI Workspace',
    skills: {
      title: 'Skills Integration',
      description:
        'These skills help you generate syntax, structures, and templates for infographics.',
      items: [
        {
          name: 'infographic-creator',
          desc: 'Create an HTML file that renders an infographic',
        },
        {
          name: 'infographic-syntax-creator',
          desc: 'Generate infographic syntax from descriptions',
        },
        {
          name: 'infographic-structure-creator',
          desc: 'Generate custom structure designs',
        },
        {
          name: 'infographic-item-creator',
          desc: 'Generate custom item designs',
        },
        {
          name: 'infographic-template-updater',
          desc: 'Update the template library (for developers)',
        },
      ],
      usageTitle: 'How to use',
      claudeTitle: 'Claude Code',
      claudeCommands: `set -e

VERSION=0.2.4 # Replace <VERSION> with the latest tag, e.g. 0.2.4
BASE_URL=https://github.com/antvis/Infographic/archive/refs/tags
mkdir -p .claude/skills

curl -L -o skills.zip "$BASE_URL/$VERSION/skills.zip"
tar -xf skills.zip -C ./claude/skills
rm -f skills.zip`,
      codexTitle: 'Codex',
      codexCommands: `# Replace <SKILL> with the skill name, e.g. infographic-creator
# https://github.com/antvis/Infographic/tree/main/.skills/<SKILL>
$skill-installer install https://github.com/antvis/Infographic/tree/main/.skills/infographic-creator
`,
    },
    preview: {
      tabPreview: 'Preview',
      tabSyntax: 'Syntax',
      copyImage: 'Copy image',
      generating: 'Generating...',
      empty: 'Enter a prompt to generate infographic syntax',
    },
    notifications: {
      copyImage: 'Image copied',
      copySkill: 'Copied to clipboard',
    },
    errors: {
      requestIncomplete: 'Request was not completed',
      noOutput: 'No model output received',
      noModel: 'The model did not return content',
      generationFailed:
        'Generation failed. Check the network or try again later.',
      jsonParse: 'JSON parse error',
    },
    examples: [
      {
        title: '🎯 Product Lifecycle Management',
        text: 'From introduction to growth phase, sales rapidly increased and market share grew from 5% to 25%. During maturity, it peaked at 40% and remained stable. In the decline phase, it dropped to 15%. By increasing marketing investment during growth, optimizing cost structure during maturity, and timely launching upgraded products during decline, a smooth transition was achieved.',
      },
      {
        title: '💰 Customer Value Segmentation',
        text: 'Customers are divided into four tiers: VIP customers account for 5% but contribute 45% of revenue, high-value customers 15% contribute 30% of revenue, regular customers 30% contribute 20% of revenue, and low-value customers 50% contribute only 5% of revenue. Differentiated service strategies are developed for different tiers, focusing on maintaining high-value customer groups and activating potential customers.',
      },
      {
        title: '🌍 Global Market Expansion',
        text: 'In 2020, focused on the Asia-Pacific market, accounting for 60% of revenue. In 2021, expanded to the European market, increasing to 25%. In 2022, entered North America, forming a balanced pattern across three major markets at 40%, 30%, and 25% respectively. In 2023, emerging markets broke through, with Latin America and the Middle East contributing a combined 15%, completing the initial globalization layout.',
      },
    ],
    fallbackSyntax: `infographic list-row-horizontal-icon-arrow\ndata\n  title Customer Growth Engine\n  desc Multi-channel reach and retention\n  items\n    - label Lead Acquisition\n      value 18.6\n      desc Paid media and content marketing\n      icon mdi/rocket-launch\n    - label Conversion Boost\n      value 12.4\n      desc Lead scoring with automated follow-ups\n      icon mdi/progress-check\n    - label Loyalty Growth\n      value 9.8\n      desc Membership programs and benefits\n      icon mdi/account-sync\n    - label Product Growth\n      value 10.2\n      desc Trial conversion and feature onboarding\n      icon mdi/chart-line`,
  },
};

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

const createTitle = (text: string, pendingText: string) =>
  text.length > 18 ? `${text.slice(0, 18)}…` : text || pendingText;

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

const toHistoryRecord = (
  input: {
    id: string;
    text: string;
    status: 'pending' | 'ready' | 'error';
    error?: string;
    syntax?: string;
    config?: Partial<InfographicOptions>;
  },
  pendingText: string
): HistoryRecord => ({
  id: input.id,
  text: input.text,
  status: input.status,
  error: input.error,
  syntax: input.syntax,
  config: input.config,
  title: createTitle(input.text, pendingText),
});

const normalizeLegacyMessages = (
  raw: ChatMessage[],
  pendingText: string
): HistoryRecord[] => {
  const records: HistoryRecord[] = [];
  let pendingUser: ChatMessage | null = null;

  for (const msg of raw) {
    if (msg.role === 'user') {
      pendingUser = msg;
    } else if (msg.role === 'assistant' && pendingUser) {
      records.push(
        toHistoryRecord(
          {
            id: pendingUser.id,
            text: pendingUser.text,
            status: msg.isError ? 'error' : 'ready',
            error: msg.error,
            config:
              msg.config && typeof msg.config === 'object'
                ? (msg.config as Partial<InfographicOptions>)
                : undefined,
          },
          pendingText
        )
      );
      pendingUser = null;
    }
  }

  if (pendingUser) {
    records.push(
      toHistoryRecord(
        {
          id: pendingUser.id,
          text: pendingUser.text,
          status: 'pending',
        },
        pendingText
      )
    );
  }

  return records;
};

const normalizeStoredHistory = (
  raw: any,
  pendingText: string
): HistoryRecord[] => {
  if (!Array.isArray(raw)) return [];
  if (raw.some((item) => item && typeof item === 'object' && 'role' in item)) {
    return normalizeLegacyMessages(raw as ChatMessage[], pendingText);
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
      toHistoryRecord(
        {
          id: typeof item.id === 'string' ? item.id : createId(),
          text,
          status,
          error: typeof item.error === 'string' ? item.error : undefined,
          syntax,
          config,
        },
        pendingText
      )
    );
  }
  return normalized;
};

export function AIPageContent() {
  const router = useRouter();
  const aiTexts = useLocaleBundle(TRANSLATIONS);
  const heroTexts = aiTexts.hero;
  const workspaceLabel = aiTexts.workspaceLabel;
  const skillsSection = aiTexts.skills;
  const notifications = aiTexts.notifications;
  const examplePrompts = aiTexts.examples;
  const fallbackSyntax = aiTexts.fallbackSyntax;
  const metaTitle = aiTexts.metaTitle;
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
        setHistory(normalizeStoredHistory(parsed, aiTexts.pending));
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
  }, [aiTexts.pending]);

  useEffect(() => {
    if (!mounted || recoveredPendingRef.current || isGenerating) return;
    if (history.length === 0) return;
    const last = history[history.length - 1];
    if (last.status === 'pending') {
      recoveredPendingRef.current = true;
      setHistory((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...last,
          status: 'error',
          error: aiTexts.errors.requestIncomplete,
        };
        return next;
      });
      setActiveTab('preview');
    }
  }, [history, mounted, isGenerating, aiTexts.errors.requestIncomplete]);

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
                      error: hasSyntax ? undefined : aiTexts.errors.noOutput,
                      syntax: hasSyntax ? syntaxBuffer : undefined,
                      config: hasSyntax ? undefined : item.config,
                    }
                  : item
              )
            );
            if (!hasSyntax) {
              setPreviewError(aiTexts.errors.noModel);
            }
          },
          (error) => {
            const message = error.message || aiTexts.errors.generationFailed;
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
            : aiTexts.errors.generationFailed;
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
    [
      config,
      aiTexts.errors.noOutput,
      aiTexts.errors.noModel,
      aiTexts.errors.generationFailed,
    ]
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
                  title: createTitle(content, aiTexts.pending),
                  status: 'pending',
                  error: undefined,
                  syntax: undefined,
                  config: undefined,
                }
              : item
          )
        );
      } else {
        const newRecord = toHistoryRecord(
          {
            id: createId(),
            text: content,
            status: 'pending',
          },
          aiTexts.pending
        );
        requestId = newRecord.id;
        setHistory((prev) => [...prev, newRecord]);
      }

      setPrompt('');
      if (retryingId) {
        setRetryingId(null);
      }

      await requestInfographic(content, requestId);
    },
    [prompt, retryingId, history, requestInfographic, aiTexts.pending]
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

  const handleCopySkill = useCallback(
    (name: string) => {
      if (typeof navigator === 'undefined' || !navigator.clipboard) return;
      void navigator.clipboard.writeText(name).then(() => {
        showCopyHint(notifications.copySkill);
      });
    },
    [notifications.copySkill, showCopyHint]
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
        setPreviewError(
          err instanceof Error ? err.message : aiTexts.errors.jsonParse
        );
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
      meta={{title: metaTitle}}
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
                  {heroTexts.title}
                  <span className="bg-gradient-to-r from-link to-purple-40 bg-clip-text text-transparent">
                    {' '}
                    {heroTexts.highlight}
                  </span>
                </span>
              </h1>
            </div>

            <p className="text-lg lg:text-xl text-secondary dark:text-secondary-dark leading-relaxed">
              {heroTexts.description}
            </p>
          </motion.header>

          <motion.section
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: 'easeOut', delay: 0.1}}
            className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-tertiary dark:text-tertiary-dark">
                {workspaceLabel}
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
                examples={examplePrompts}
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
                  fallbackSyntax={fallbackSyntax}
                  onEditorChange={handleEditorChange}
                  error={previewError}
                  panelClassName={PANEL_HEIGHT_CLASS}
                  onCopy={handleCopyHint}
                  onRenderError={setPreviewError}
                />
              }
            </div>
          </motion.section>

          <motion.section
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: 'easeOut', delay: 0.2}}
            className="mt-6 rounded-2xl border border-border dark:border-border-dark bg-card/70 dark:bg-card-dark/80 backdrop-blur-sm p-5 lg:p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-base font-semibold text-primary dark:text-primary-dark">
                {skillsSection.title}
              </p>
              <p className="text-sm text-secondary dark:text-secondary-dark leading-relaxed">
                {skillsSection.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {skillsSection.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border/70 dark:border-border-dark/70 bg-wash/70 dark:bg-wash-dark/70 p-3">
                  <button
                    type="button"
                    onClick={() => handleCopySkill(item.name)}
                    className="text-xs font-mono text-link dark:text-link-dark mb-1 inline-flex items-center gap-1 hover:underline">
                    {item.name}
                  </button>
                  <p className="text-sm text-secondary dark:text-secondary-dark leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-primary dark:text-primary-dark">
                {skillsSection.usageTitle}
              </p>
              <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
                <CodeBlock
                  noMargin
                  label={skillsSection.claudeTitle}
                  className="lg:self-stretch">
                  <div className="language-bash">
                    {skillsSection.claudeCommands}
                  </div>
                </CodeBlock>
                <CodeBlock
                  noMargin
                  label={skillsSection.codexTitle}
                  className="lg:self-stretch">
                  <div className="language-bash">
                    {skillsSection.codexCommands}
                  </div>
                </CodeBlock>
              </div>
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
