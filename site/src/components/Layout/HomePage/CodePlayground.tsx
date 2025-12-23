'use client';

import {InfographicOptions} from '@antv/infographic';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {getStoredLanguage, type Language} from '../../../utils/i18n';
import {Infographic} from '../../Infographic';
import {CodeEditor} from '../../MDX/CodeEditor';
import {BrowserChrome} from './BrowserChrome';

interface ConfigOption {
  label: string;
  init?: Partial<InfographicOptions>;
  syntax: string;
}

// 翻译文本
const translations = {
  'zh-CN': {
    syntaxLabel: 'Infographic 语法',
    presetLabels: ['金字塔型', '过程型', '统计图'],
    pyramid: {
      title: '企业数字化转型层级',
      desc: '从基础设施到战略创新的五层进阶路径',
      items: [
        {label: '战略创新', desc: '数据驱动决策，引领行业变革'},
        {label: '智能运营', desc: 'AI赋能业务，实现自动化管理'},
        {label: '数据整合', desc: '打通数据孤岛，建立统一平台'},
        {label: '流程优化', desc: '数字化核心业务流程和协作'},
        {label: '基础设施', desc: '构建云计算和网络基础架构'},
      ],
    },
    process: {
      title: '智能业务流程构建',
      desc: '从洞察到执行，智能化工具驱动高效业务协同流程',
      items: [
        {
          label: '业务洞察',
          desc: '基于数据分析洞察业务现状，识别核心增长点与潜在问题。',
        },
        {
          label: '流程设计',
          desc: '梳理关键节点，构建结构化流程蓝图，确保整体流程可控可视。',
        },
        {
          label: '方案原型',
          desc: '将流程转化为可落地的原型方案，快速验证业务可行性与合理性。',
        },
        {
          label: '团队协作',
          desc: '跨团队协作推进实施，确保设计、研发、运营保持一致目标。',
        },
        {
          label: '过程监控',
          desc: '实时跟踪项目进度与数据表现，实现业务全链路的透明化管理。',
        },
        {
          label: '结果达成',
          desc: '最终达成业务目标，形成可复制的成功经验与流程规范。',
        },
      ],
    },
    chart: {
      title: '年度业务指标',
      desc: '核心业务关键指标的年度变化趋势展示',
      items: [
        '产品创新指数',
        '用户满意度',
        '技术稳定性',
        '市场扩展能力',
        '渠道协同效率',
        '安全合规能力',
        '行业竞争力',
      ],
    },
  },
  en: {
    syntaxLabel: 'Infographic Syntax',
    presetLabels: ['Pyramid', 'Process', 'Chart'],
    pyramid: {
      title: 'Enterprise Digital Transformation',
      desc: 'Five-layer roadmap from infrastructure to strategic innovation',
      items: [
        {
          label: 'Strategic Innovation',
          desc: 'Data-driven decisions, leading industry transformation',
        },
        {
          label: 'Intelligent Operations',
          desc: 'AI-powered business automation',
        },
        {
          label: 'Data Integration',
          desc: 'Break data silos, build unified platform',
        },
        {
          label: 'Process Optimization',
          desc: 'Digitize core business processes',
        },
        {
          label: 'Infrastructure',
          desc: 'Build cloud computing and network foundation',
        },
      ],
    },
    process: {
      title: 'Intelligent Business Process',
      desc: 'From insight to execution, AI-driven efficient collaboration',
      items: [
        {
          label: 'Business Insight',
          desc: 'Analyze current state, identify growth opportunities and issues.',
        },
        {
          label: 'Process Design',
          desc: 'Build structured process blueprint, ensure controllability.',
        },
        {
          label: 'Solution Prototype',
          desc: 'Transform process into prototype, validate feasibility.',
        },
        {
          label: 'Team Collaboration',
          desc: 'Cross-team implementation, align design, dev, and ops.',
        },
        {
          label: 'Process Monitoring',
          desc: 'Real-time tracking of project progress and data performance.',
        },
        {
          label: 'Result Achievement',
          desc: 'Achieve business goals, form replicable best practices.',
        },
      ],
    },
    chart: {
      title: 'Annual Business Metrics',
      desc: 'Key business indicators and annual trend analysis',
      items: [
        'Product Innovation',
        'User Satisfaction',
        'Technical Stability',
        'Market Expansion',
        'Channel Synergy',
        'Security Compliance',
        'Industry Competitiveness',
      ],
    },
  },
};

const t = (lang: Language, key: keyof (typeof translations)['en']): string => {
  const langTranslations = translations[lang] || translations.en;
  return langTranslations[key] as string;
};

const getPresetLabel = (lang: Language, index: number): string => {
  const labels =
    translations[lang]?.presetLabels || translations.en.presetLabels;
  return labels[index] || labels[0];
};

// 内置三个配置
const getPresetConfigs = (lang: Language): ConfigOption[] => {
  const t = translations[lang] || translations.en;

  return [
    {
      label: getPresetLabel(lang, 0),
      init: {
        editable: true,
      },
      syntax: `
infographic sequence-pyramid-simple
data
  title ${t.pyramid.title}
  desc ${t.pyramid.desc}
  items
    - label ${t.pyramid.items[0].label}
      desc ${t.pyramid.items[0].desc}
      icon mdi/lightbulb-on
    - label ${t.pyramid.items[1].label}
      desc ${t.pyramid.items[1].desc}
      icon mdi/robot
    - label ${t.pyramid.items[2].label}
      desc ${t.pyramid.items[2].desc}
      icon mdi/database-sync
    - label ${t.pyramid.items[3].label}
      desc ${t.pyramid.items[3].desc}
      icon mdi/workflow
    - label ${t.pyramid.items[4].label}
      desc ${t.pyramid.items[4].desc}
      icon mdi/server-network
theme
  colorPrimary #7f5539
  palette
    - #e76f51
    - #f4a261
    - #e9c46a
    - #2a9d8f
    - #264653
    `,
    },
    {
      label: getPresetLabel(lang, 1),
      init: {
        editable: true,
      },
      syntax: `
infographic sequence-horizontal-zigzag-simple-illus
theme light
  palette antv
data
  title ${t.process.title}
  desc ${t.process.desc}
  items
    - illus analysis
      label ${t.process.items[0].label}
      desc ${t.process.items[0].desc}
    - illus process
      label ${t.process.items[1].label}
      desc ${t.process.items[1].desc}
    - illus prototyping-process
      label ${t.process.items[2].label}
      desc ${t.process.items[2].desc}
    - illus collaboration
      label ${t.process.items[3].label}
      desc ${t.process.items[3].desc}
    - illus progress-data
      label ${t.process.items[4].label}
      desc ${t.process.items[4].desc}
    - illus result
      label ${t.process.items[5].label}
      desc ${t.process.items[5].desc}
    `,
    },
    {
      label: getPresetLabel(lang, 2),
      init: {
        editable: true,
      },
      syntax: `
infographic chart-column-simple
theme light
  palette
    - #001219
    - #005f73
    - #0a9396
    - #94d2bd
    - #ee9b00
    - #ca6702
    - #bb3e03
    - #ae2012
    - #9b2226
data
  title ${t.chart.title}
  desc ${t.chart.desc}
  items
    - label ${t.chart.items[0]}
      value 62
    - label ${t.chart.items[1]}
      value 75
    - label ${t.chart.items[2]}
      value 88
    - label ${t.chart.items[3]}
      value 73
    - label ${t.chart.items[4]}
      value 80
    - label ${t.chart.items[5]}
      value 92
    - label ${t.chart.items[6]}
      value 96
    `,
    },
  ];
};

/**
 * 内部组件:处理代码监听和预览
 */
function CodePlaygroundInner({
  lang,
  currentConfigIndex,
  code,
  onConfigChange,
  onCodeChange,
  error,
  onRenderError,
}: {
  lang: Language;
  currentConfigIndex: number;
  code: string;
  onConfigChange: (index: number) => void;
  onCodeChange: (code: string) => void;
  error: string | null;
  onRenderError: (error: Error | null) => void;
}) {
  const [renderKey, setRenderKey] = useState(0);
  const presetConfigs = useMemo(() => getPresetConfigs(lang), [lang]);
  const currentConfig = presetConfigs[currentConfigIndex];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：语法编辑器 */}
        <div className="flex flex-col">
          <div className="shadow-nav dark:shadow-nav-dark rounded-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="bg-wash dark:bg-card-dark h-10 rounded-t-2xl flex items-center px-4 lg:px-6 border-b border-border dark:border-border-dark flex-shrink-0">
              <span className="text-sm text-secondary dark:text-secondary-dark font-medium">
                {t(lang, 'syntaxLabel')}
              </span>
            </div>
            <div className="bg-white dark:bg-card-dark sp-layout !block flex-1 min-h-0 rounded-b-2xl overflow-auto">
              <div className="sp-stack h-full">
                <div className="sp-code-editor h-full [&_.cm-editor]:h-full [&_.cm-scroller]:h-full">
                  <CodeEditor
                    ariaLabel="Infographic syntax configuration editor"
                    className="bg-transparent"
                    language="plaintext"
                    onChange={onCodeChange}
                    value={code}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：浏览器容器 */}
        <div className="flex flex-col h-[480px]">
          <BrowserChrome
            domain="infographic.antv.vision"
            hasRefresh={false}
            hasFullscreen={true}
            onRestart={() => setRenderKey((k) => k + 1)}
            error={error}>
            <div className="w-full h-full pt-14 bg-white dark:bg-gray-950 overflow-auto">
              <div className="p-6 h-full">
                {code ? (
                  <Infographic
                    key={renderKey}
                    init={currentConfig.init}
                    onError={onRenderError}
                    options={code}
                  />
                ) : null}
              </div>
            </div>
          </BrowserChrome>
        </div>
      </div>

      {/* 底部：配置切换按钮组 */}
      <div className="flex justify-center gap-3">
        {presetConfigs.map((config, index) => (
          <button
            key={index}
            onClick={() => onConfigChange(index)}
            className={`
              relative px-6 py-2.5 rounded-full font-medium text-sm
              transition-all duration-300 ease-in-out
              focus:outline-none focus-visible:outline focus-visible:outline-link
              focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark
              ${
                currentConfigIndex === index
                  ? 'bg-link dark:bg-link-dark text-white shadow-lg scale-105'
                  : 'bg-gray-40/5 dark:bg-gray-60/5 text-primary dark:text-primary-dark hover:bg-gray-40/10 dark:hover:bg-gray-60/10 active:bg-gray-40/20 dark:active:bg-gray-60/20 shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark'
              }
            `}>
            {config.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * 代码演示 Playground
 *
 * 左侧语法编辑器，右侧浏览器容器显示 Infographic 预览
 * 底部提供配置切换按钮组
 *
 * @example
 * <CodePlayground />
 */
export function CodePlayground() {
  const [lang, setLang] = useState<Language>('zh-CN');

  useEffect(() => {
    setLang(getStoredLanguage());
  }, []);

  const presetConfigs = useMemo(() => getPresetConfigs(lang), [lang]);

  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const initialCode = useMemo(
    () => presetConfigs[currentConfigIndex].syntax.trim(),
    [presetConfigs, currentConfigIndex]
  );
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const handleRenderError = useCallback((err: Error | null) => {
    setError(err ? err.message : null);
  }, []);

  const handleConfigChange = (index: number) => {
    setCurrentConfigIndex(index);
  };

  useEffect(() => {
    setCode(initialCode);
    setError(null);
  }, [currentConfigIndex, initialCode]);

  return (
    <div className="sandpack sandpack--playground w-full max-w-7xl mx-auto my-8">
      <CodePlaygroundInner
        lang={lang}
        code={code}
        currentConfigIndex={currentConfigIndex}
        onCodeChange={setCode}
        onConfigChange={handleConfigChange}
        error={error}
        onRenderError={handleRenderError}
      />
    </div>
  );
}
