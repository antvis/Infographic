import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  GiftOutlined,
  LockOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { ConfigWithStats, getStorage } from './storage';
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

interface ConfigPanelProps {
  open: boolean;
  onClose: () => void;
  onConfigSelected: (config: ConfigWithStats) => void;
}

/**
 * API 配置面板组件
 * 支持多个配置管理
 */
export default function ConfigPanel({
  open,
  onClose,
  onConfigSelected,
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('list');
  const [configs, setConfigs] = useState<ConfigWithStats[]>([]);
  const [editingConfig, setEditingConfig] = useState<ConfigWithStats | null>(
    null,
  );

  // 加载所有配置
  const loadConfigs = async () => {
    const storage = getStorage();
    const allConfigs = await storage.getAllConfigs();
    setConfigs(allConfigs);
  };

  useEffect(() => {
    if (open) {
      loadConfigs();
      setEditingConfig(null);
    }
  }, [open]);

  // 删除配置
  const handleDelete = async (id: string) => {
    const storage = getStorage();
    await storage.deleteConfig(id);
    message.success('配置已删除');
    loadConfigs();
  };

  // 编辑配置
  const handleEdit = (config: ConfigWithStats) => {
    setEditingConfig(config);
    setActiveTab('new');
  };

  // 选择配置
  const handleSelect = async (config: ConfigWithStats) => {
    const storage = getStorage();
    await storage.setActiveConfigId(config.id);
    onConfigSelected(config);
    onClose();
  };

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>API 配置管理</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ width: '100%', marginBottom: 24 }}
      >
        <Alert
          message={
            <Space>
              <LockOutlined />
              <span>
                <strong>隐私保护：</strong>您的 API Key 仅存储在浏览器本地，
                我们不会收集、存储或传输您的任何数据和密钥。
              </span>
            </Space>
          }
          type="info"
          showIcon={false}
        />
        <Alert
          message={
            <span style={{ display: 'flex' }}>
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
              平台快速创建，
              <Tag
                color="gold"
                icon={<GiftOutlined />}
                style={{ marginLeft: 4 }}
              >
                限时优惠
              </Tag>
            </span>
          }
          type="success"
          showIcon={false}
        />
      </Space>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key as 'list' | 'new');
          if (key === 'list') {
            setEditingConfig(null);
          }
        }}
        items={[
          {
            key: 'list',
            label: '配置列表',
            children: (
              <ConfigList
                configs={configs}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ),
          },
          {
            key: 'new',
            label: editingConfig ? (
              <span>
                <EditOutlined /> 编辑配置
              </span>
            ) : (
              <span>
                <PlusOutlined /> 新建配置
              </span>
            ),
            children: (
              <ConfigForm
                editingConfig={editingConfig}
                onSuccess={() => {
                  loadConfigs();
                  setActiveTab('list');
                  setEditingConfig(null);
                }}
                onCancel={() => {
                  setEditingConfig(null);
                  setActiveTab('list');
                }}
              />
            ),
          },
        ]}
      />
    </Modal>
  );
}

/**
 * 配置列表
 */
function ConfigList({
  configs,
  onSelect,
  onEdit,
  onDelete,
}: {
  configs: ConfigWithStats[];
  onSelect: (config: ConfigWithStats) => void;
  onEdit: (config: ConfigWithStats) => void;
  onDelete: (id: string) => void;
}) {
  if (configs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Text type="secondary">暂无配置，请新建一个配置</Text>
      </div>
    );
  }

  return (
    <List
      dataSource={configs}
      renderItem={(config) => (
        <List.Item style={{ padding: '8px 0' }}>
          <Card
            hoverable
            onClick={() => onSelect(config)}
            style={{
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            bodyStyle={{ padding: 16 }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={PROVIDER_LOGOS[config.provider]}
                  alt={PROVIDER_CONFIGS[config.provider].name}
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 15 }}>
                    {config.name}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {config.model}
                  </Text>
                </div>
              </div>
            }
            extra={
              <Space size="small">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(config);
                  }}
                >
                  编辑
                </Button>
                <Popconfirm
                  title="确定删除此配置？"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    onDelete(config.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Space size={16} wrap style={{ width: '100%' }}>
              <Space size={4}>
                <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(config.lastUsedAt).toLocaleString('zh-CN', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Space>
              <Badge
                count={`${config.totalUsage.requests} 次请求`}
                style={{ backgroundColor: 'var(--ifm-color-primary)' }}
              />
              <Badge
                count={`${config.totalUsage.totalTokens.toLocaleString()} Token`}
                style={{ backgroundColor: '#faad14' }}
              />
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );
}

/**
 * 配置表单
 */
function ConfigForm({
  editingConfig,
  onSuccess,
  onCancel,
}: {
  editingConfig?: ConfigWithStats | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form] = Form.useForm();
  const [testing, setTesting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(
    editingConfig?.provider || 'openai',
  );

  // 当编辑配置时，填充表单
  useEffect(() => {
    if (editingConfig) {
      form.setFieldsValue({
        name: editingConfig.name,
        provider: editingConfig.provider,
        baseURL: editingConfig.baseURL,
        apiKey: editingConfig.apiKey,
        model: editingConfig.model,
      });
      setSelectedProvider(editingConfig.provider);
    } else {
      form.resetFields();
      setSelectedProvider('openai');
    }
  }, [editingConfig, form]);

  // 当提供商改变时，更新 baseURL 和模型选项
  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    const config = PROVIDER_CONFIGS[provider];
    form.setFieldsValue({
      baseURL: config.defaultBaseURL,
      model: config.models[0],
    });
  };

  // 生成默认配置名
  const generateDefaultName = (provider: AIProvider, model: string) => {
    const providerName = PROVIDER_CONFIGS[provider].name;
    return `${providerName} ${model}`;
  };

  // 测试并保存配置
  const handleTest = async () => {
    try {
      const values = await form.validateFields();
      setTesting(true);

      // 动态导入 aiService 避免 SSR 问题
      const { testAIConfig } = await import('./aiService');

      // 测试配置
      await testAIConfig(values);

      message.success('配置测试成功！');

      // 保存配置
      const storage = getStorage();
      const configName =
        values.name?.trim() ||
        generateDefaultName(values.provider, values.model);

      if (editingConfig) {
        // 编辑模式：更新现有配置
        const updatedConfig: ConfigWithStats = {
          ...editingConfig,
          name: configName,
          provider: values.provider,
          baseURL: values.baseURL,
          apiKey: values.apiKey,
          model: values.model,
        };

        await storage.saveConfig(updatedConfig);
        message.success('配置已更新');
      } else {
        // 新建模式：创建新配置
        const newConfig: ConfigWithStats = {
          id: Date.now().toString(),
          name: configName,
          provider: values.provider,
          baseURL: values.baseURL,
          apiKey: values.apiKey,
          model: values.model,
          createdAt: Date.now(),
          lastUsedAt: Date.now(),
          totalUsage: {
            requests: 0,
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
          },
        };

        await storage.saveConfig(newConfig);
        await storage.setActiveConfigId(newConfig.id);
        message.success('配置已创建');
      }

      form.resetFields();
      onSuccess();
    } catch (error: any) {
      console.error('Test failed:', error);
      message.error(`测试失败: ${error.message || '请检查配置'}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        provider: 'openai',
        baseURL: PROVIDER_CONFIGS.openai.defaultBaseURL,
        model: PROVIDER_CONFIGS.openai.models[0],
      }}
    >
      <Form.Item label="配置名称" name="name">
        <Input size="large" />
      </Form.Item>

      <Form.Item
        label="AI 提供商"
        name="provider"
        rules={[{ required: true, message: '请选择 AI 提供商' }]}
      >
        <Select onChange={handleProviderChange} size="large">
          {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => (
            <Select.Option key={key} value={key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img
                  src={PROVIDER_LOGOS[key as AIProvider]}
                  alt={config.name}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'contain',
                  }}
                />
                <span>{config.name}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Base URL"
        name="baseURL"
        rules={[{ required: true, message: '请输入 Base URL' }]}
      >
        <Input size="large" placeholder="https://api.openai.com/v1" />
      </Form.Item>

      <Form.Item
        label="API Key"
        name="apiKey"
        rules={[{ required: true, message: '请输入 API Key' }]}
      >
        <Input.Password size="large" placeholder="sk-..." />
      </Form.Item>

      <Form.Item
        label="模型"
        name="model"
        rules={[{ required: true, message: '请选择模型' }]}
      >
        <Select size="large">
          {PROVIDER_CONFIGS[selectedProvider].models.map((model) => (
            <Select.Option key={model} value={model}>
              {model}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%' }} direction="vertical" size="middle">
          <Button
            type="primary"
            size="large"
            block
            loading={testing}
            onClick={handleTest}
          >
            {editingConfig ? '测试并更新' : '测试并保存'}
          </Button>
          {editingConfig && (
            <Button size="large" block onClick={onCancel}>
              取消编辑
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}
