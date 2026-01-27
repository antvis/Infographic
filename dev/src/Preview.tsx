import Editor from '@monaco-editor/react';
import { Button, Card, Checkbox, ColorPicker, Form, Select } from 'antd';
import { useCallback } from 'react';
import { Infographic } from './Infographic';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { usePreviewData } from './hooks/usePreviewData';
import { usePreviewInteractions } from './hooks/usePreviewInteractions';
import { usePreviewSettings } from './hooks/usePreviewSettings';

export const Preview = () => {
  const settings = usePreviewSettings();
  const dataState = usePreviewData(settings.isSettingsHydrated);
  const interactions = usePreviewInteractions(settings, dataState);

  // 键盘导航：上下或左右方向键切换模板
  useKeyboardNavigation({
    templates: settings.templates,
    currentTemplate: settings.template,
    onTemplateChange: interactions.applyTemplate,
  });

  const handleCopyTemplate = useCallback(async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(settings.template);
        return;
      }

      const textarea = document.createElement('textarea');
      textarea.value = settings.template;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    } catch (error) {
      console.warn('Failed to copy template name.', error);
    }
  }, [settings.template]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      dataState.setCustomData(value || '');
    },
    [dataState.setCustomData],
  );

  if (!interactions.isHydrated) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, flex: 1 }}>
      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflow: 'auto',
            paddingRight: 4,
          }}
        >
          <Card title="配置" size="small">
            <Form
              layout="horizontal"
              size="small"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              colon={false}
            >
              <Form.Item label="模板">
                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <Select
                    showSearch
                    value={settings.template}
                    options={settings.templateOptions}
                    onChange={(value) => interactions.applyTemplate(value)}
                    style={{ flex: 1, minWidth: 0 }}
                  />
                  <Button
                    size="small"
                    onClick={handleCopyTemplate}
                    style={{ flex: 'none' }}
                  >
                    复制
                  </Button>
                </div>
              </Form.Item>
              <Form.Item label="数据">
                <Select
                  value={settings.data}
                  options={settings.dataKeyOptions}
                  onChange={interactions.handleDataChange}
                />
              </Form.Item>
              <Form.Item label="主题">
                <Select
                  value={settings.theme}
                  options={[
                    { label: '亮色', value: 'light' },
                    { label: '暗色', value: 'dark' },
                    { label: '手绘风格', value: 'hand-drawn' },
                  ]}
                  onChange={(newTheme: string) => {
                    settings.setTheme(newTheme);
                  }}
                />
              </Form.Item>
              <Form.Item label="主色">
                <ColorPicker
                  value={settings.colorPrimary}
                  disabled={!settings.enablePrimary}
                  onChange={(color) => {
                    const hexColor = color.toHexString();
                    settings.setColorPrimary(hexColor);
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox
                  checked={settings.enablePrimary}
                  onChange={(e) => settings.setEnablePrimary(e.target.checked)}
                >
                  启用主色
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Checkbox
                  checked={settings.enablePalette}
                  onChange={(e) => {
                    settings.setEnablePalette(e.target.checked);
                  }}
                >
                  启用色板
                </Checkbox>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title="数据编辑器"
            size="small"
            extra={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {dataState.parseError && (
                  <span style={{ color: '#ff4d4f', fontSize: 12 }}>
                    {dataState.parseError}
                  </span>
                )}
                <Button
                  size="small"
                  type={!dataState.isDataDirty ? 'default' : 'primary'}
                  onClick={dataState.handleSaveCustomData}
                >
                  {dataState.isDataDirty ? '保存' : '已保存'}
                </Button>
                <Button
                  size="small"
                  danger
                  onClick={interactions.handleResetCustomData}
                >
                  重置
                </Button>
              </div>
            }
          >
            <div style={{ height: 300 }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={dataState.customData}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  contextmenu: true,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
                onChange={handleEditorChange}
              />
            </div>
          </Card>

          <Card title="模板配置" size="small">
            <div style={{ height: 300 }}>
              <Editor
                height="100%"
                defaultLanguage="json"
                value={interactions.templateConfig}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  contextmenu: false,
                }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card title="预览" size="small" style={{ height: '100%' }}>
          <Infographic
            options={{
              template: settings.template,
              // 如果解析出错 (null)，传空对象防止崩溃，错误提示已在编辑器上方显示
              data: dataState.parsedData || {},
              theme: settings.theme,
              themeConfig: interactions.themeConfig,
              editable: true,
            }}
          />
        </Card>
      </div>
    </div>
  );
};
