import {
  DeleteOutlined,
  RobotOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Empty, Select, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ChatInterface from './ChatInterface';
import ConfigPanel from './ConfigPanel';
import { ConfigWithStats, getStorage } from './storage';
import './styles.css';
import { EXAMPLE_PROMPTS } from './systemPrompt';
import { PROVIDER_CONFIGS } from './types';

const { Title, Text, Paragraph } = Typography;

/**
 * AI 信息图生成 Demo 主组件
 */
export default function AIDemo() {
  const [config, setConfig] = useState<ConfigWithStats | null>(null);
  const [allConfigs, setAllConfigs] = useState<ConfigWithStats[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  // 加载配置
  const loadConfigs = async () => {
    const storage = getStorage();
    const configs = await storage.getAllConfigs();
    setAllConfigs(configs);

    // 加载当前激活的配置
    const activeId = await storage.getActiveConfigId();
    if (activeId) {
      const activeConfig = configs.find((c) => c.id === activeId);
      if (activeConfig) {
        setConfig(activeConfig);
        return;
      }
    }

    // 如果没有激活的配置，使用第一个
    if (configs.length > 0) {
      setConfig(configs[0]);
      await storage.setActiveConfigId(configs[0].id);
    }
  };

  // 客户端挂载后加载配置
  useEffect(() => {
    setMounted(true);
    loadConfigs();
  }, []);

  // 避免 SSR 问题
  if (!mounted) {
    return null;
  }

  // 配置选择后的回调
  const handleConfigSelected = (newConfig: ConfigWithStats) => {
    setConfig(newConfig);
    loadConfigs(); // 重新加载配置列表以更新统计信息
  };

  // 切换配置
  const handleConfigChange = async (configId: string) => {
    const newConfig = allConfigs.find((c) => c.id === configId);
    if (newConfig) {
      const storage = getStorage();
      await storage.setActiveConfigId(configId);
      setConfig(newConfig);
    }
  };

  // 清空对话历史
  const handleClearHistory = async () => {
    if (confirm('确定要清空对话历史吗？')) {
      const storage = getStorage();
      await storage.clearMessages();
      // 通过改变 key 来重新渲染 ChatInterface 组件
      setChatKey((prev) => prev + 1);
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* 头部 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Space direction="vertical" size={0}>
          <Title level={2} style={{ margin: 0 }}>
            <RobotOutlined /> AI 生成信息图
          </Title>
          <Text type="secondary">通过对话生成各种类型的信息图</Text>
        </Space>

        <Space>
          {config && (
            <>
              <Button icon={<DeleteOutlined />} onClick={handleClearHistory}>
                清空对话
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setShowConfig(true)}
              >
                配置
              </Button>
            </>
          )}
        </Space>
      </div>

      {/* 主内容区 */}
      {config ? (
        <>
          {/* 当前配置信息 */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Space>
              <Text strong>当前配置:</Text>
              {allConfigs.length > 1 ? (
                <Select
                  value={config.id}
                  onChange={handleConfigChange}
                  style={{ minWidth: 200 }}
                >
                  {allConfigs.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name} ({PROVIDER_CONFIGS[c.provider].name})
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <>
                  <Tag color="blue">
                    {PROVIDER_CONFIGS[config.provider].name}
                  </Tag>
                  <Tag>{config.model}</Tag>
                  <Text type="secondary">{config.name}</Text>
                </>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                使用 {config.totalUsage.requests} 次 | Token{' '}
                {config.totalUsage.totalTokens.toLocaleString()}
              </Text>
            </Space>
          </Card>

          {/* 对话界面 */}
          <ChatInterface key={chatKey} config={config} />
        </>
      ) : (
        <WelcomeScreen onConfigClick={() => setShowConfig(true)} />
      )}

      {/* 配置面板 */}
      <ConfigPanel
        open={showConfig}
        onClose={() => setShowConfig(false)}
        onConfigSelected={handleConfigSelected}
      />
    </div>
  );
}

/**
 * 欢迎屏幕（首次访问）
 */
function WelcomeScreen({ onConfigClick }: { onConfigClick: () => void }) {
  return (
    <Card>
      <Empty
        image={<RobotOutlined style={{ fontSize: 80, color: '#1890ff' }} />}
        imageStyle={{ height: 100 }}
        description={
          <Space direction="vertical" size={16} style={{ marginTop: 16 }}>
            <div>
              <Title level={4}>欢迎使用 AI 生成信息图</Title>
              <Paragraph type="secondary">
                通过对话描述您的需求， AI 会自动生成对应的信息图配置。
              </Paragraph>
            </div>

            <div>
              <Text strong>开始之前，请先配置您的 AI API</Text>
              <Paragraph type="secondary" style={{ marginTop: 8 }}>
                支持 OpenAI、Anthropic、Google、xAI、DeepSeek、Qwen 等多种提供商
              </Paragraph>
            </div>

            <Button type="primary" size="large" onClick={onConfigClick}>
              配置 API Key
            </Button>

            <div style={{ marginTop: 24 }}>
              <Text strong>示例问题：</Text>
              <div style={{ marginTop: 8 }}>
                {EXAMPLE_PROMPTS.map((prompt, index) => (
                  <Tag key={index} style={{ marginBottom: 8 }}>
                    {prompt.label}
                  </Tag>
                ))}
              </div>
            </div>
          </Space>
        }
      />
    </Card>
  );
}
