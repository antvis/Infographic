import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, Space, Spin, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import InfographicCard from './InfographicCard';
import { sendMessageStream } from './aiService';
import { ConfigWithStats, getStorage } from './storage';
import { EXAMPLE_PROMPTS } from './systemPrompt';
import { ChatMessage } from './types';

const { TextArea } = Input;
const { Text } = Typography;

interface ChatInterfaceProps {
  config: ConfigWithStats;
}

/**
 * 对话界面组件
 */
export default function ChatInterface({ config }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载对话历史
  useEffect(() => {
    const loadHistory = async () => {
      const storage = getStorage();
      const savedMessages = await storage.getMessages();
      setMessages(savedMessages);
    };
    loadHistory();
  }, []);

  // 自动保存对话历史
  useEffect(() => {
    const saveHistory = async () => {
      if (messages.length > 0) {
        const storage = getStorage();
        await storage.saveMessages(messages);
      }
    };
    saveHistory();
  }, [messages]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // 发送消息
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingMessage('');

    // 准备发送给 AI 的消息历史
    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let accumulatedText = '';

    try {
      await sendMessageStream(
        config,
        apiMessages,
        (chunk) => {
          accumulatedText += chunk;
          setStreamingMessage(accumulatedText);
        },
        async () => {
          // 流式传输完成
          setLoading(false);

          const assistantMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: accumulatedText,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingMessage('');

          // 更新配置使用统计
          const storage = getStorage();
          await storage.updateConfigStats(config.id, {
            requests: 1,
          });
        },
        (error) => {
          // 错误处理
          setLoading(false);
          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `错误: ${error.message}`,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setStreamingMessage('');
        },
      );
    } catch (error: any) {
      setLoading(false);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `错误: ${error.message}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingMessage('');
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          background: 'var(--ifm-background-color)',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: 24,
              color: 'var(--ifm-color-emphasis-600)',
            }}
          >
            <Text type="secondary">开始对话，描述您想要生成的信息图...</Text>
            <div>
              <div style={{ marginBottom: 12, textAlign: 'center' }}>
                <Text strong>快速开始：</Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    type="default"
                    onClick={() => setInput(prompt.content)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      height: 'auto',
                      padding: '8px 16px',
                    }}
                  >
                    {prompt.label}
                  </Button>
                ))}
              </Space>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {/* 流式传输中的消息 */}
        {loading && streamingMessage && (
          <div style={{ marginBottom: 16 }}>
            <Space align="start" style={{ width: '100%' }}>
              <Avatar
                icon={<RobotOutlined />}
                style={{ background: '#1890ff' }}
              />
              <div style={{ flex: 1 }}>
                <Card bodyStyle={{ padding: 12 }}>
                  <div className="markdown-content">
                    <ReactMarkdown components={markdownComponents}>
                      {streamingMessage}
                    </ReactMarkdown>
                  </div>
                </Card>
              </div>
            </Space>
          </div>
        )}

        {/* 加载指示器 */}
        {loading && !streamingMessage && (
          <div style={{ marginBottom: 16 }}>
            <Space align="start" style={{ width: '100%' }}>
              <Avatar
                icon={<RobotOutlined />}
                style={{ background: '#1890ff' }}
              />
              <Spin size="small" />
            </Space>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid var(--ifm-color-emphasis-300)',
          background: 'var(--ifm-background-surface-color)',
        }}
      >
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="描述您想要生成的信息图... (Shift+Enter 换行)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            disabled={!input.trim()}
            style={{
              height: 32,
              flexShrink: 0,
            }}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 消息气泡组件
 */
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  if (isUser) {
    // 用户消息 - 右侧对齐
    return (
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Card
          className="ai-user-message"
          bodyStyle={{ padding: 12 }}
          style={{
            maxWidth: '70%',
            background: '#1890ff',
            color: 'white',
          }}
        >
          {message.content}
        </Card>
        <Avatar
          className="ai-user-avatar"
          icon={<UserOutlined />}
          style={{ background: '#87d068', marginLeft: 8 }}
        />
      </div>
    );
  }
  // AI 消息 - 左侧对齐
  return (
    <div style={{ marginBottom: 16 }}>
      <Space align="start" style={{ width: '100%' }}>
        <Avatar icon={<RobotOutlined />} style={{ background: '#1890ff' }} />
        <div style={{ flex: 1 }}>
          <Card bodyStyle={{ padding: 12 }}>
            <div className="markdown-content">
              <ReactMarkdown components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      </Space>
    </div>
  );
}

/**
 * 自定义 Markdown 渲染组件
 */
const markdownComponents = {
  pre: ({ node, children, ...props }: any) => {
    // 检查子元素是否是 infographic 代码块
    const child = children?.props;
    if (child?.className?.includes('language-infographic')) {
      // 直接返回子元素，不包裹在 pre 中
      return children;
    }
    // 普通代码块使用默认的 pre 渲染
    return <pre {...props}>{children}</pre>;
  },
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    // 处理 infographic 代码块
    if (!inline && language === 'infographic') {
      const code = String(children).replace(/\n$/, '');
      // 尝试解析 JSON
      try {
        const config = JSON.parse(code);
        return <InfographicCard options={config} />;
      } catch {
        // JSON 未完整或解析失败，显示 Loading
        return (
          <div
            style={{
              marginTop: 16,
              borderRadius: 8,
              padding: '2rem',
              background: 'var(--ifm-color-emphasis-100)',
              textAlign: 'center',
            }}
          >
            <Spin tip="正在生成信息图..." />
          </div>
        );
      }
    }

    // 普通代码块
    if (!inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    // 行内代码
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};
