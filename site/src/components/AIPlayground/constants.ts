import {InfographicOptions} from '@antv/infographic';
import {AIConfig, AIProvider} from './types';

export const STORAGE_KEYS = {
  config: 'ai-demo-config',
  messages: 'ai-demo-messages',
  infographic: 'ai-demo-infographic',
};

export const DEFAULT_CONFIG: AIConfig = {
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  apiKey: '',
};

export const PROVIDER_OPTIONS: Array<{
  value: AIProvider;
  label: string;
  baseUrl: string;
  logo?: string;
}> = [
  {
    value: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    logo: '/images/openai.svg',
  },
  {
    value: 'anthropic',
    label: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    logo: '/images/claude.svg',
  },
  {
    value: 'google',
    label: 'Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    logo: '/images/gemini.svg',
  },
  {
    value: 'xai',
    label: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    logo: '/images/xai.svg',
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    logo: '/images/deepseek.svg',
  },
  {
    value: 'qwen',
    label: 'Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    logo: '/images/qwen.svg',
  },
];

export const EXAMPLE_PROMPTS = [
  {
    title: '🎯产品生命周期管理',
    text: '产品从导入期到成长期，销量快速攀升，市场份额从5%增长至25%。成熟期达到峰值40%后保持稳定。衰退期开始下滑至15%。通过在成长期加大营销投入，成熟期优化成本结构，衰退期及时推出升级产品，实现平稳过渡。',
  },
  {
    title: '💰客户价值分层',
    text: '将客户分为四个层级：VIP客户占比5%但贡献45%营收，高价值客户占15%贡献30%营收，普通客户占30%贡献20%营收，低价值客户占50%仅贡献5%营收。针对不同层级制定差异化服务策略，重点维护高价值客群，激活潜力客户。',
  },
  {
    title: '🌍全球市场布局进展',
    text: '2020年聚焦亚太市场，营收占比60%。2021年拓展欧洲市场，占比提升至25%。2022年进军北美，三大市场形成均衡格局，分别为40%、30%、25%。2023年新兴市场突破，拉美和中东合计贡献15%，全球化布局初步完成。',
  },
];

export const FALLBACK_OPTIONS: Partial<InfographicOptions> | null = null;
