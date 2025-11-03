import { CheckOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Space, Tooltip, message } from 'antd';
import { useState } from 'react';
import Infographic from '../Infographic';
import '../ResourceLoader';
import { InfographicConfig } from './types';

interface InfographicCardProps {
  options: InfographicConfig;
  loading?: boolean;
}

/**
 * 信息图渲染卡片组件
 * 参考 Gallery 实现悬浮显示复制和放大按钮
 */
export default function InfographicCard({
  options,
  loading = false,
}: InfographicCardProps) {
  const [copied, setCopied] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  // 复制配置到剪贴板
  const handleCopy = async () => {
    try {
      const configText = JSON.stringify(options, null, 2);
      await navigator.clipboard.writeText(configText);
      setCopied(true);
      message.success('配置已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      message.error('复制失败');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          marginTop: 16,
          borderRadius: 8,
          padding: 16,
          background: 'var(--ifm-color-emphasis-100)',
          textAlign: 'center',
        }}
      >
        <div style={{ height: 200 }} />
      </div>
    );
  }

  return (
    <>
      <div
        className="ai-infographic-card"
        style={{
          position: 'relative',
          width: '100%',
          minWidth: 300,
          borderRadius: 8,
          border: 'none',
          outline: 'none',
        }}
      >
        {/* 悬浮操作按钮 */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Space size="small">
            <Tooltip title="放大预览" placement="bottom">
              <Button
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
              />
            </Tooltip>
            <Tooltip title={copied ? '已复制!' : '复制配置'} placement="bottom">
              <Button
                type={copied ? 'primary' : 'default'}
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={handleCopy}
              />
            </Tooltip>
          </Space>
        </div>

        {/* 信息图内容 */}
        <div style={{ width: '100%' }}>
          <Infographic
            options={{ themeConfig: { palette: 'antv' }, ...options }}
          />
        </div>
      </div>

      {/* 预览模态框 */}
      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopy}>
            复制配置
          </Button>,
          <Button
            key="close"
            type="primary"
            onClick={() => setPreviewVisible(false)}
          >
            关闭
          </Button>,
        ]}
        width={1000}
        centered
        title="信息图预览"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            background: 'var(--ifm-color-emphasis-100)',
            borderRadius: 8,
            padding: '2rem',
          }}
        >
          <Infographic
            options={{ themeConfig: { palette: 'antv' }, ...options }}
          />
        </div>
      </Modal>
    </>
  );
}
