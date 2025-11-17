import {
  ApiOutlined,
  DeleteOutlined,
  GiftOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Button, Card, Select, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ThemeProvider from '../ThemeProvider';
import ChatInterface from './ChatInterface';
import ConfigPanel from './ConfigPanel';
import { ConfigWithStats, getStorage } from './storage';
import './styles.css';
import styles from './styles.module.css';
import { EXAMPLE_PROMPTS } from './systemPrompt';
import { AIProvider, PROVIDER_CONFIGS } from './types';

const { Text } = Typography;

// 提供商图标映射
const PROVIDER_LOGOS: Record<AIProvider, string> = {
  openai: '/img/openai.svg',
  anthropic: '/img/claude.svg',
  google: '/img/gemini.svg',
  xai: '/img/xai.svg',
  deepseek: '/img/deepseek.svg',
  qwen: '/img/qwen.svg',
};

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
    <ThemeProvider>
      <div className={styles.container}>
        {config && (
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <Button
              icon={<DeleteOutlined />}
              onClick={handleClearHistory}
              size="large"
            >
              清空对话
            </Button>
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => setShowConfig(true)}
              size="large"
            >
              配置
            </Button>
          </div>
        )}

        {/* 主内容区 */}
        {config ? (
          <>
            {/* 当前配置信息 */}
            <Card className={styles.configCard} size="small">
              <div className={styles.configContent}>
                <div className={styles.providerInfo}>
                  {allConfigs.length > 1 ? (
                    <Select
                      value={config.id}
                      onChange={handleConfigChange}
                      style={{ minWidth: 200 }}
                      size="large"
                    >
                      {allConfigs.map((c) => (
                        <Select.Option key={c.id} value={c.id}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <img
                              src={PROVIDER_LOGOS[c.provider]}
                              alt={PROVIDER_CONFIGS[c.provider].name}
                              style={{
                                width: 20,
                                height: 20,
                                objectFit: 'contain',
                              }}
                            />
                            <span>
                              {c.name} ({PROVIDER_CONFIGS[c.provider].name})
                            </span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <>
                      <img
                        src={PROVIDER_LOGOS[config.provider]}
                        alt={PROVIDER_CONFIGS[config.provider].name}
                        className={styles.providerLogo}
                      />
                      <div>
                        <div className={styles.providerName}>
                          {PROVIDER_CONFIGS[config.provider].name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {config.model}
                        </Text>
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.configStats}>
                  <div className={styles.statItem}>
                    <ThunderboltOutlined />
                    <span>{config.totalUsage.requests} 次请求</span>
                  </div>
                  <div className={styles.statItem}>
                    <ApiOutlined />
                    <span>
                      {config.totalUsage.totalTokens.toLocaleString()} Token
                    </span>
                  </div>
                </div>
              </div>
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
    </ThemeProvider>
  );
}

/**
 * 欢迎屏幕（首次访问）
 */
function WelcomeScreen({ onConfigClick }: { onConfigClick: () => void }) {
  return (
    <Card className={styles.welcomeCard}>
      <div className={styles.welcomeContent}>
        <div className={styles.welcomeIcon}>
          <img
            src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*2mTZQakV9LYAAAAAWzAAAAgAemJ7AQ/original"
            alt="AI Assistant"
          />
        </div>

        <div className={styles.welcomeTitle}>欢迎使用 AI 生成信息图</div>
        <div className={styles.welcomeDescription}>
          通过自然语言对话，让 AI 帮您快速创建专业的信息图表
          <br />
          无需设计经验，即可生成精美的可视化内容
        </div>

        <div className={styles.welcomeBox}>
          <div className={styles.welcomeBoxTitle}>
            <SettingOutlined />
            开始之前，请先配置您的 AI API
          </div>
          <div className={styles.welcomeBoxContent}>
            我们支持多种主流 AI 提供商，您可以选择最适合您的服务
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 13, display: 'flex' }}>
                💡 还没有 API Key？推荐在
                <a
                  href="https://zenmux.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <img
                    src="/img/zenmux.svg"
                    alt="ZenMux"
                    style={{ width: 16, height: 16, verticalAlign: 'middle' }}
                  />
                  ZenMux.ai
                </a>
                平台快速创建
              </Text>
              <Tag
                color="gold"
                icon={<GiftOutlined />}
                style={{ marginLeft: 8, fontSize: 12 }}
              >
                限时优惠
              </Tag>
            </div>
          </div>

          <div className={styles.providerLogos}>
            <div className={styles.providerLogoItem}>
              <img src="/img/openai.svg" alt="OpenAI" />
              <span>OpenAI</span>
            </div>
            <div className={styles.providerLogoItem}>
              <img src="/img/claude.svg" alt="Claude" />
              <span>Anthropic</span>
            </div>
            <div className={styles.providerLogoItem}>
              <img src="/img/gemini.svg" alt="Gemini" />
              <span>Google</span>
            </div>
            <div className={styles.providerLogoItem}>
              <img src="/img/xai.svg" alt="xAI" />
              <span>xAI</span>
            </div>
            <div className={styles.providerLogoItem}>
              <img src="/img/deepseek.svg" alt="DeepSeek" />
              <span>DeepSeek</span>
            </div>
            <div className={styles.providerLogoItem}>
              <img src="/img/qwen.svg" alt="Qwen" />
              <span>Qwen</span>
            </div>
          </div>
        </div>

        <div className={styles.ctaButton}>
          <Button
            type="primary"
            size="large"
            icon={<ApiOutlined />}
            onClick={onConfigClick}
          >
            配置 API Key 开始使用
          </Button>
        </div>

        <div className={styles.examplesSection}>
          <div className={styles.examplesTitle}>💡 示例问题</div>
          <div className={styles.exampleTags}>
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <Tag key={index} color="blue">
                {prompt.label}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
