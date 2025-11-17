/**
 * AI 提供商类型
 */
export type AIProvider =
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'xai'
  | 'deepseek'
  | 'qwen';

/**
 * AI 模型配置
 */
export interface AIModelConfig {
  provider: AIProvider;
  baseURL: string;
  apiKey: string;
  model: string;
}

/**
 * 信息图配置
 */
export interface InfographicConfig {
  type: string;
  data: any;
  config?: any;
}

/**
 * 对话消息
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

/**
 * Token 使用统计
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * 提供商配置
 */
export interface ProviderConfig {
  name: string;
  defaultBaseURL: string;
  models: string[];
}

/**
 * 所有提供商的配置
 */
export const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  openai: {
    name: 'OpenAI',
    defaultBaseURL: 'https://api.openai.com/v1',
    models: [
      'gpt-5-chat',
      'gpt-5',
      'gpt-5-mini',
      'gpt-4.1',
      'gpt-4.1-mini',
      'o4-mini',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'o3-mini',
      'o1',
      'o1-mini',
    ],
  },
  anthropic: {
    name: 'Anthropic',
    defaultBaseURL: 'https://api.anthropic.com/v1',
    models: [
      'claude-sonnet-4-5',
      'claude-opus-4-1-20250805',
      'claude-sonnet-4-20250514',
      'claude-3-7-sonnet-20250219',
    ],
  },
  google: {
    name: 'Google',
    defaultBaseURL: 'https://generativelanguage.googleapis.com/v1',
    models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'],
  },
  xai: {
    name: 'xAI',
    defaultBaseURL: 'https://api.x.ai/v1',
    models: ['grok-beta'],
  },
  deepseek: {
    name: 'DeepSeek',
    defaultBaseURL: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  qwen: {
    name: 'Qwen',
    defaultBaseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: ['qwen3-max', 'qwen3-235b-a22b', 'qwen3-coder-plus'],
  },
};
