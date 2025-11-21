'use client';

import {InfographicOptions} from '@antv/infographic';
import {useEffect, useMemo, useState} from 'react';
import {Infographic} from '../../Infographic';
import {CodeEditor} from '../../MDX/CodeEditor';
import {BrowserChrome} from './BrowserChrome';

interface ConfigOption {
  label: string;
  options: Partial<InfographicOptions>;
}

// 内置三个配置
const PRESET_CONFIGS: ConfigOption[] = [
  {
    label: '金字塔型',
    options: {
      template: 'sequence-pyramid-simple',
      data: {
        title: '企业数字化转型层级',
        desc: '从基础设施到战略创新的五层进阶路径',
        items: [
          {
            label: '战略创新',
            desc: '数据驱动决策，引领行业变革',
            icon: 'icon:mdi/lightbulb-on',
          },
          {
            label: '智能运营',
            desc: 'AI赋能业务，实现自动化管理',
            icon: 'icon:mdi/robot',
          },
          {
            label: '数据整合',
            desc: '打通数据孤岛，建立统一平台',
            icon: 'icon:mdi/database-sync',
          },
          {
            label: '流程优化',
            desc: '数字化核心业务流程和协作',
            icon: 'icon:mdi/workflow',
          },
          {
            label: '基础设施',
            desc: '构建云计算和网络基础架构',
            icon: 'icon:mdi/server-network',
          },
        ],
      },
      themeConfig: {
        colorPrimary: '#7f5539',
        palette: ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653'],
      },
    },
  },
  {
    label: '过程型',
    options: {
      theme: 'light',
      themeConfig: {
        palette: 'antv',
      },
      template: 'sequence-horizontal-zigzag-simple-illus',
      data: {
        title: '智能业务流程构建',
        desc: '从洞察到执行，智能化工具驱动高效业务协同流程',
        items: [
          {
            illus: 'illus:analysis',
            label: '业务洞察',
            desc: '基于数据分析洞察业务现状，识别核心增长点与潜在问题。',
          },
          {
            illus: 'illus:process',
            label: '流程设计',
            desc: '梳理关键节点，构建结构化流程蓝图，确保整体流程可控可视。',
          },
          {
            illus: 'illus:prototyping-process',
            label: '方案原型',
            desc: '将流程转化为可落地的原型方案，快速验证业务可行性与合理性。',
          },
          {
            illus: 'illus:collaboration',
            label: '团队协作',
            desc: '跨团队协作推进实施，确保设计、研发、运营保持一致目标。',
          },
          {
            illus: 'illus:progress-data',
            label: '过程监控',
            desc: '实时跟踪项目进度与数据表现，实现业务全链路的透明化管理。',
          },
          {
            illus: 'illus:result',
            label: '结果达成',
            desc: '最终达成业务目标，形成可复制的成功经验与流程规范。',
          },
        ],
      },
    },
  },
  {
    label: '统计图',
    options: {
      theme: 'light',
      themeConfig: {
        palette: [
          '#001219',
          '#005f73',
          '#0a9396',
          '#94d2bd',
          '#ee9b00',
          '#ca6702',
          '#bb3e03',
          '#ae2012',
          '#9b2226',
        ],
      },
      template: 'chart-column-simple',
      data: {
        title: '年度业务指标',
        desc: '核心业务关键指标的年度变化趋势展示',
        items: [
          {
            label: '产品创新指数',
            value: 62,
          },
          {
            label: '用户满意度',
            value: 75,
          },
          {
            label: '技术稳定性',
            value: 88,
          },
          {
            label: '市场扩展能力',
            value: 73,
          },
          {
            label: '渠道协同效率',
            value: 80,
          },
          {
            label: '安全合规能力',
            value: 92,
          },
          {
            label: '行业竞争力',
            value: 96,
          },
        ],
      },
    },
  },
];

const parse = (code: string) => {
  return new Function(`return ${code}`)();
};

/**
 * 内部组件:处理代码监听和预览
 */
function CodePlaygroundInner({
  currentConfigIndex,
  code,
  onConfigChange,
  onCodeChange,
  parsedConfig,
  error,
}: {
  currentConfigIndex: number;
  code: string;
  onConfigChange: (index: number) => void;
  onCodeChange: (code: string) => void;
  parsedConfig: Partial<InfographicOptions>;
  error: string | null;
}) {
  const [renderKey, setRenderKey] = useState(0);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：JSON 编辑器 */}
        <div className="flex flex-col">
          <div className="shadow-nav dark:shadow-nav-dark rounded-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="bg-wash dark:bg-card-dark h-10 rounded-t-2xl flex items-center px-4 lg:px-6 border-b border-border dark:border-border-dark flex-shrink-0">
              <span className="text-sm text-secondary dark:text-secondary-dark font-medium">
                spec.json
              </span>
            </div>
            <div className="bg-white dark:bg-card-dark sp-layout !block flex-1 min-h-0 rounded-b-2xl overflow-hidden">
              <div className="sp-stack h-full">
                <div className="sp-code-editor h-full [&_.cm-editor]:h-full [&_.cm-scroller]:h-full">
                  <CodeEditor
                    ariaLabel="Infographic JSON configuration editor"
                    className="bg-transparent"
                    language="json"
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
                {parsedConfig ? (
                  <Infographic key={renderKey} options={parsedConfig} />
                ) : null}
              </div>
            </div>
          </BrowserChrome>
        </div>
      </div>

      {/* 底部：配置切换按钮组 */}
      <div className="flex justify-center gap-3">
        {PRESET_CONFIGS.map((config, index) => (
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
 * 左侧 JSON 编辑器，右侧浏览器容器显示 Infographic 预览
 * 底部提供配置切换按钮组
 *
 * @example
 * <CodePlayground />
 */
export function CodePlayground() {
  const [currentConfigIndex, setCurrentConfigIndex] = useState(0);
  const initialCode = useMemo(
    () => JSON.stringify(PRESET_CONFIGS[currentConfigIndex].options, null, 2),
    [currentConfigIndex]
  );
  const [code, setCode] = useState(initialCode);
  const [lastValidConfig, setLastValidConfig] = useState(
    PRESET_CONFIGS[0].options
  );
  const [error, setError] = useState<string | null>(null);

  const handleConfigChange = (index: number) => {
    setCurrentConfigIndex(index);
  };

  useEffect(() => {
    setCode(initialCode);
    setLastValidConfig(PRESET_CONFIGS[currentConfigIndex].options);
    setError(null);
  }, [currentConfigIndex, initialCode]);

  useEffect(() => {
    try {
      const parsed = parse(code);
      setLastValidConfig(parsed);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [code]);

  return (
    <div className="sandpack sandpack--playground w-full max-w-7xl mx-auto my-8">
      <CodePlaygroundInner
        code={code}
        currentConfigIndex={currentConfigIndex}
        onCodeChange={setCode}
        onConfigChange={handleConfigChange}
        parsedConfig={lastValidConfig}
        error={error}
      />
    </div>
  );
}
