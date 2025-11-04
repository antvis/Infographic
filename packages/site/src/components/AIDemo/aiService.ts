import { SYSTEM_PROMPT } from './systemPrompt';
import { AIModelConfig, AIProvider } from './types';

/**
 * 测试 AI 配置是否有效
 */
export async function testAIConfig(config: AIModelConfig): Promise<boolean> {
  try {
    const response = await callAI(
      config,
      [{ role: 'user', content: '你好' }],
      false,
    );

    // 非流式测试，直接返回结果
    return !!response;
  } catch (error) {
    console.error('AI config test failed:', error);
    throw error;
  }
}

/**
 * 统一的 AI 调用接口
 * 支持流式和非流式响应
 */
async function callAI(
  config: AIModelConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  stream: boolean = true,
): Promise<any> {
  const { provider, baseURL, apiKey, model } = config;

  // 添加系统提示词
  const messagesWithSystem = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
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
        stream,
      );

    case 'anthropic':
      return callAnthropic(baseURL, apiKey, model, messagesWithSystem, stream);

    case 'google':
      return callGoogle(baseURL, apiKey, model, messagesWithSystem, stream);

    default:
      throw new Error(`不支持的提供商: ${provider}`);
  }
}

/**
 * 调用 OpenAI 兼容的 API
 */
async function callOpenAICompatible(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  stream: boolean,
): Promise<any> {
  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  if (stream) {
    return response.body;
  } else {
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}

/**
 * 调用 Anthropic API
 */
async function callAnthropic(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  stream: boolean,
): Promise<any> {
  // Anthropic API 格式略有不同
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
      error.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  if (stream) {
    return response.body;
  } else {
    const data = await response.json();
    return data.content[0]?.text || '';
  }
}

/**
 * 调用 Google API
 */
async function callGoogle(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  stream: boolean,
): Promise<any> {
  // Google API 格式不同
  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemInstruction = messages.find((m) => m.role === 'system')?.content;

  const endpoint = stream ? 'streamGenerateContent' : 'generateContent';
  const response = await fetch(
    `${baseURL}/models/${model}:${endpoint}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: systemInstruction
          ? { parts: [{ text: systemInstruction }] }
          : undefined,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  if (stream) {
    return response.body;
  } else {
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || '';
  }
}

/**
 * 发送消息并流式返回响应
 */
export async function sendMessageStream(
  config: AIModelConfig,
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void,
) {
  try {
    const stream = await callAI(config, messages, true);

    if (!stream) {
      throw new Error('未能获取流式响应');
    }

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            const content = extractContentFromResponse(config.provider, parsed);

            if (content) {
              onChunk(content);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error: any) {
    console.error('Send message stream failed:', error);
    onError(error);
  }
}

/**
 * 从不同提供商的响应中提取内容
 */
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
