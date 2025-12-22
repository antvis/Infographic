export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  error?: string;
  isError?: boolean;
  config?: Record<string, unknown>;
};

export type AIProvider =
  | 'antv'
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'xai'
  | 'deepseek'
  | 'qwen';

export type AIConfig = {
  provider: AIProvider;
  baseUrl: string;
  model: string;
  apiKey: string;
};

export type AIModelConfig = {
  provider: AIProvider;
  baseURL: string;
  model: string;
  apiKey: string;
};
