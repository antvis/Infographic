import { CheckOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Infographic as InfographicCore,
  InfographicOptions,
} from '@antv/infographic';
import { Button, message, Modal, Space, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import '../ResourceLoader';

interface InfographicProps {
  /** 信息图配置选项 */
  options: Partial<InfographicOptions>;
  /** 是否显示操作按钮（预览、复制） */
  showActions?: boolean;
  /** 容器样式 */
  containerStyle?: React.CSSProperties;
  /** 是否加载中 */
  loading?: boolean;
}

/**
 * 信息图组件
 * 支持传入 options 渲染信息图，可点击预览大图，复制配置
 */
export default function Infographic({
  options,
  showActions = true,
  containerStyle = {},
  loading = false,
}: InfographicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<InfographicCore | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 渲染信息图
  useEffect(() => {
    if (!options || !ref.current) return;

    // 清理旧实例
    if (instanceRef.current) {
      instanceRef.current = null;
    }

    const instance = new InfographicCore({
      container: ref.current,
      svg: {
        attributes: {
          width: '100%',
          height: '100%',
        },
      },
      ...options,
    } as InfographicOptions);

    instance.render();
    instanceRef.current = instance;

    return () => {
      if (instanceRef.current) {
        instanceRef.current = null;
      }
    };
  }, [options]);

  // 复制配置到剪贴板
  const handleCopy = async () => {
    try {
      const configText = JSON.stringify(options, null, 2);
      await navigator.clipboard.writeText(configText);
      setCopied(true);
      messageApi.success('配置已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      messageApi.error('复制失败');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 8,
          padding: 16,
          background: 'var(--ifm-color-emphasis-100)',
          textAlign: 'center',
          ...containerStyle,
        }}
      >
        <div style={{ height: 200 }} />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <style>
        {`
          .infographic-container {
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.03));
            transition: filter 0.3s ease;
            max-width: 100%;
            max-height: 100%;
          }

          .infographic-actions {
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .infographic-wrapper:hover .infographic-actions {
            opacity: 1;
          }
        `}
      </style>

      <div
        className="infographic-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          ...containerStyle,
        }}
      >
        {/* 操作按钮 */}
        {showActions && (
          <div
            className="infographic-actions"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
            }}
          >
            <Space size="small">
              <Tooltip title="放大预览" placement="bottom">
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewVisible(true)}
                />
              </Tooltip>
              <Tooltip
                title={copied ? '已复制!' : '复制配置'}
                placement="bottom"
              >
                <Button
                  type={copied ? 'primary' : 'default'}
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={handleCopy}
                />
              </Tooltip>
            </Space>
          </div>
        )}

        {/* 信息图内容 */}
        <div
          ref={ref}
          className="infographic-container"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </div>

      {/* 预览模态框 */}
      {showActions && (
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
          styles={{
            body: {
              padding: '2rem',
              background: 'var(--ifm-color-emphasis-100)',
              height: '60vh',
              overflow: 'auto',
            },
          }}
        >
          <Infographic options={options} showActions={false} />
        </Modal>
      )}
    </>
  );
}
