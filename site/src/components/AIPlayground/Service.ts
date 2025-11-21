import {SYSTEM_PROMPT} from './Prompt';
import {AIModelConfig, AIProvider} from './types';

export async function testAIConfig(config: AIModelConfig): Promise<boolean> {
  const response = await callAI(
    config,
    [{role: 'user', content: '你好'}],
    false
  );
  return !!response;
}

export async function sendMessage(
  config: AIModelConfig,
  messages: Array<{role: 'user' | 'assistant' | 'system'; content: string}>
): Promise<string> {
  const result = await callAI(config, messages, false);
  return typeof result === 'string' ? result : '';
}

export async function sendMessageStream(
  config: AIModelConfig,
  messages: Array<{role: 'user' | 'assistant' | 'system'; content: string}>,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    const stream = await callAI(config, messages, true);
    if (!stream) throw new Error('未能获取流式响应');

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const {done, value} = await reader.read();
      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = extractContentFromResponse(config.provider, parsed);
          if (content) onChunk(content);
        } catch {
          /* ignore */
        }
      }
    }
  } catch (error: any) {
    console.error('Send message stream failed:', error);
    onError(error);
  }
}

async function callAI(
  config: AIModelConfig,
  messages: Array<{role: 'user' | 'assistant' | 'system'; content: string}>,
  stream = true
): Promise<any> {
  const {provider, baseURL, apiKey, model} = config;
  const messagesWithSystem = [
    {role: 'system' as const, content: SYSTEM_PROMPT},
    ...messages,
  ];

  switch (provider) {
    case 'openai':
    case 'deepseek':
    case 'xai':
    case 'qwen':
      return callOpenAICompatible(
        baseURL,
        apiKey,
        model,
        messagesWithSystem,
        stream
      );
    case 'anthropic':
      return callAnthropic(baseURL, apiKey, model, messagesWithSystem, stream);
    case 'google':
      return callGoogle(baseURL, apiKey, model, messagesWithSystem, stream);
    default:
      throw new Error(`不支持的提供商: ${provider}`);
  }
}

async function callOpenAICompatible(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({model, messages, stream}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  if (stream) return response.body;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function callAnthropic(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  const systemMessage = messages.find((m) => m.role === 'system');
  const conversationMessages = messages.filter((m) => m.role !== 'system');

  const response = await fetch(`${baseURL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      messages: conversationMessages,
      system: systemMessage?.content,
      stream,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  if (stream) return response.body;
  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function callGoogle(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{text: m.content}],
    }));
  const systemInstruction = messages.find((m) => m.role === 'system')?.content;
  const endpoint = stream ? 'streamGenerateContent' : 'generateContent';
  const response = await fetch(`${baseURL}/models/${model}:${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents,
      systemInstruction: systemInstruction
        ? {parts: [{text: systemInstruction}]}
        : undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  if (stream) return response.body;
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractContentFromResponse(provider: AIProvider, data: any): string {
  switch (provider) {
    case 'openai':
    case 'deepseek':
    case 'xai':
    case 'qwen':
      return data.choices?.[0]?.delta?.content || '';
    case 'anthropic':
      if (data.type === 'content_block_delta') {
        return data.delta?.text || '';
      }
      return '';
    case 'google':
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    default:
      return '';
  }
}
