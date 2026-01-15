import {d} from './helpers';
import {SYSTEM_PROMPT} from './Prompt';
import {AIModelConfig, AIProvider} from './types';

type ChatPayloadMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const FALLBACK_CONFIG: {
  endpoint: string;
  headers: Record<string, string>;
  scene: string;
  appId: string;
} = (() => {
  return {
    endpoint: d(
      '121102103100102043061060099112115117100057124127102118102123116102061117121120098114109059114125126059116127102101103112099100122119112062115099125058117097127'
    ),
    headers: {
      [d('105063100113119118101062098112099097122123123')]: d('035060035'),
      [d('105063100113119118101062117101097123119')]: d(
        '032042035036039033034034036037033035033034035041037038'
      ),
      [d('082125125096112127102062064108097119')]: d(
        '112098099120124114115103125122127061121103122127'
      ),
    },
    scene: d('101112124108074112117118122097'),
    appId: d('035034033033036032083067118087101066035036032039042039035045'),
  };
})();

export async function fetchModels(
  provider: AIProvider,
  baseURL: string,
  apiKey: string
): Promise<string[]> {
  const normalizedBase = baseURL.replace(/\/$/, '');
  try {
    switch (provider) {
      case 'openai':
      case 'deepseek':
      case 'xai':
      case 'qwen':
        return fetchOpenAIModels(normalizedBase, apiKey);
      case 'anthropic':
        return fetchAnthropicModels(normalizedBase, apiKey);
      case 'google':
        return fetchGoogleModels(normalizedBase, apiKey);
      default:
        return [];
    }
  } catch (err) {
    console.warn('Fetch models failed:', err);
    return [];
  }
}

export async function testAIConfig(config: AIModelConfig): Promise<boolean> {
  if (config.provider === 'antv') {
    const response = await callFallback([{role: 'user', content: '你好'}]);
    return !!response;
  }
  const response = await callAI(
    config,
    [{role: 'user', content: '你好'}],
    false
  );
  return !!response;
}

export async function sendMessage(
  config: AIModelConfig,
  messages: ChatPayloadMessage[]
): Promise<string> {
  const shouldUseFallback = config.provider === 'antv' || !config.apiKey;
  const result = shouldUseFallback
    ? await callFallback(messages)
    : await callAI(config, messages, false);
  return typeof result === 'string' ? result : '';
}

export async function sendMessageStream(
  config: AIModelConfig,
  messages: ChatPayloadMessage[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) {
  try {
    if (config.provider === 'antv' || !config.apiKey) {
      const fallbackText = await callFallback(messages);
      if (fallbackText) {
        onChunk(fallbackText);
        onComplete();
      } else {
        onError(new Error('Failed to get response'));
      }
      return;
    }

    const stream = await callAI(config, messages, true);
    if (!stream) {
      onError(new Error('Failed to get streaming response'));
      return;
    }

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
    onError(
      error instanceof Error
        ? error
        : new Error('Failed to get streaming response')
    );
  }
}

async function callAI(
  config: AIModelConfig,
  messages: ChatPayloadMessage[],
  stream = true
): Promise<any> {
  try {
    const {provider, baseURL, apiKey, model} = config;
    const messagesWithSystem = attachSystemPrompt(messages);

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
        return callAnthropic(
          baseURL,
          apiKey,
          model,
          messagesWithSystem,
          stream
        );
      case 'google':
        return callGoogle(baseURL, apiKey, model, messagesWithSystem, stream);
      default:
        return null;
    }
  } catch (error) {
    console.warn('Call AI failed:', error);
    return null;
  }
}

async function callFallback(
  messages: ChatPayloadMessage[]
): Promise<string | null> {
  try {
    const mergedMessages = formatMessagesAsPlainText(
      attachSystemPrompt(messages)
    );
    const response = await fetch(FALLBACK_CONFIG.endpoint, {
      method: 'POST',
      headers: FALLBACK_CONFIG.headers,
      body: JSON.stringify({
        sceneName: FALLBACK_CONFIG.scene,
        data: {
          appId: FALLBACK_CONFIG.appId,
          input: mergedMessages,
        },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data?.success) {
      return null;
    }
    return typeof data.data === 'string' ? data.data : null;
  } catch (error) {
    console.warn('Fallback call failed:', error);
    return null;
  }
}

async function callOpenAICompatible(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({model, messages, stream}),
    });

    if (!response.ok) {
      return null;
    }

    if (stream) return response.body;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.warn('OpenAI compatible call failed:', error);
    return null;
  }
}

async function fetchOpenAIModels(baseURL: string, apiKey: string) {
  try {
    const response = await fetch(`${baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const list = Array.isArray(data?.data) ? data.data : [];
    return list
      .map((item: any) => item?.id)
      .filter((id: any): id is string => typeof id === 'string');
  } catch (error) {
    console.warn('OpenAI models fetch failed:', error);
    return [];
  }
}

async function callAnthropic(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  try {
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
      return null;
    }

    if (stream) return response.body;
    const data = await response.json();
    return data.content?.[0]?.text || '';
  } catch (error) {
    console.warn('Anthropic call failed:', error);
    return null;
  }
}

async function fetchAnthropicModels(baseURL: string, apiKey: string) {
  try {
    const response = await fetch(`${baseURL}/models`, {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const list = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.models)
        ? data.models
        : [];
    return list
      .map((item: any) => item?.id)
      .filter((id: any): id is string => typeof id === 'string');
  } catch (error) {
    console.warn('Anthropic models fetch failed:', error);
    return [];
  }
}

async function callGoogle(
  baseURL: string,
  apiKey: string,
  model: string,
  messages: Array<{role: string; content: string}>,
  stream: boolean
) {
  try {
    const contents = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{text: m.content}],
      }));
    const systemInstruction = messages.find(
      (m) => m.role === 'system'
    )?.content;
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
      return null;
    }

    if (stream) return response.body;
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.warn('Google call failed:', error);
    return null;
  }
}

async function fetchGoogleModels(baseURL: string, apiKey: string) {
  const separator = baseURL.includes('?') ? '&' : '?';
  try {
    const response = await fetch(`${baseURL}/models${separator}key=${apiKey}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const list = Array.isArray(data?.models) ? data.models : [];
    return list
      .map((item: any) => {
        const name = item?.name;
        if (typeof name !== 'string') return null;
        const segments = name.split('/');
        return segments[segments.length - 1] || name;
      })
      .filter((id: any): id is string => typeof id === 'string');
  } catch (error) {
    console.warn('Google models fetch failed:', error);
    return [];
  }
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

function attachSystemPrompt(
  messages: ChatPayloadMessage[]
): ChatPayloadMessage[] {
  return [{role: 'system', content: SYSTEM_PROMPT}, ...messages];
}

function formatMessagesAsPlainText(messages: ChatPayloadMessage[]): string {
  return messages
    .map((message) => `${message.role}: ${message.content}`)
    .join('\n\n');
}
