import {AIConfig, AIProvider} from './types';

export const STORAGE_KEYS = {
  config: 'ai-demo-config',
  messages: 'ai-demo-messages',
  infographic: 'ai-demo-infographic',
};

export const DEFAULT_CONFIG: AIConfig = {
  provider: 'antv',
  baseUrl: '',
  model: '',
  apiKey: '',
};

export const PROVIDER_OPTIONS: Array<{
  value: AIProvider;
  label: string;
  baseUrl: string;
  logo?: string;
}> = [
  {
    value: 'antv',
    label: 'AntV',
    baseUrl: '',
    logo: '/images/antv.svg',
  },
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
