import {
  Data,
  getItems,
  getStructures,
  InfographicOptions,
} from '@antv/infographic';
import Editor from '@monaco-editor/react';
import {
  Button,
  Card,
  Checkbox,
  ColorPicker,
  Form,
  Select,
  Space,
  Tabs,
} from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Infographic } from './Infographic';
import { COMPARE_DATA, HIERARCHY_DATA, LIST_DATA, SWOT_DATA } from './data';

const DATA: { label: string; key: string; value: Data }[] = [
  { label: '列表数据', key: 'list', value: LIST_DATA },
  { label: '层级数据', key: 'hierarchy', value: HIERARCHY_DATA },
  { label: '对比数据', key: 'compare', value: COMPARE_DATA },
  { label: 'SWOT数据', key: 'swot', value: SWOT_DATA },
];

const items = getItems();

const STORAGE_KEY = 'composite-form-values';

const getStoredValues = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredValues = (values: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // Ignore storage errors
  }
};

export const Composite = () => {
  const defaultValues = {
    structure: 'list-grid',
    item: 'circular-progress',
    data: 'swot',
    theme: 'light',
    colorPrimary: '#1890ff',
    enablePalette: true,
  };

  const initialValues = getStoredValues() || defaultValues;

  const [form] = Form.useForm<{
    structure: string;
    item: string;
    item2: string;
    data: string;
    theme: 'light' | 'dark';
    colorPrimary: string;
    enablePalette: boolean;
  }>();
  const watch = Form.useWatch([], form);

  // Monaco Editor states for advanced configuration
  const [structureConfig, setStructureConfig] = useState<string>('{}');
  const [itemConfig, setItemConfig] = useState<string>('{}');
  const [item2Config, setItem2Config] = useState<string>('{}');
  const [useAdvancedConfig, setUseAdvancedConfig] = useState(false);

  // Debounced config states for applying changes
  const [debouncedStructureConfig, setDebouncedStructureConfig] =
    useState<string>('{}');
  const [debouncedItemConfig, setDebouncedItemConfig] = useState<string>('{}');
  const [debouncedItem2Config, setDebouncedItem2Config] =
    useState<string>('{}');

  // Refs to track if configs have changed
  const structureConfigRef = useRef<string>('{}');
  const itemConfigRef = useRef<string>('{}');
  const item2ConfigRef = useRef<string>('{}');

  // Track if there are pending changes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // Debounce timer
  const debounceTimerRef = useRef<number>(0);

  // Apply config changes
  const applyConfigChanges = useCallback(() => {
    setDebouncedStructureConfig(structureConfig);
    setDebouncedItemConfig(itemConfig);
    setDebouncedItem2Config(item2Config);
    structureConfigRef.current = structureConfig;
    itemConfigRef.current = itemConfig;
    item2ConfigRef.current = item2Config;
    setHasPendingChanges(false);
  }, [structureConfig, itemConfig, item2Config]);

  // Check for pending changes
  useEffect(() => {
    const hasChanges =
      structureConfig !== structureConfigRef.current ||
      itemConfig !== itemConfigRef.current ||
      item2Config !== item2ConfigRef.current;
    setHasPendingChanges(hasChanges);
  }, [structureConfig, itemConfig, item2Config]);

  // Debounce logic (optional auto-apply after 1 second)
  useEffect(() => {
    if (hasPendingChanges) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        applyConfigChanges();
      }, 1000);
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [hasPendingChanges, applyConfigChanges]);

  const options = useMemo<InfographicOptions | null>(() => {
    if (!watch) return null;
    const { structure, item, item2, data, theme, colorPrimary, enablePalette } =
      watch;
    if (!structure || !item || !data) return null;

    setStoredValues(form.getFieldsValue());

    let structureObj: any = { type: structure };
    let itemObj: any = { type: item };
    let item2Obj: any = item2 ? { type: item2 } : null;

    // Parse advanced configs if enabled
    if (useAdvancedConfig) {
      try {
        const parsedStructure = JSON.parse(debouncedStructureConfig);
        structureObj = { type: structure, ...parsedStructure };
      } catch (e) {
        console.error('Invalid structure config JSON:', e);
      }

      try {
        const parsedItem = JSON.parse(debouncedItemConfig);
        itemObj = { type: item, ...parsedItem };
      } catch (e) {
        console.error('Invalid item config JSON:', e);
      }

      if (item2) {
        try {
          const parsedItem2 = JSON.parse(debouncedItem2Config);
          item2Obj = { type: item2, ...parsedItem2 };
        } catch (e) {
          console.error('Invalid item2 config JSON:', e);
        }
      }
    }

    const value: InfographicOptions = {
      padding: 20,
      design: {
        title: 'default',
        structure: structureObj,
        items: item2Obj ? [itemObj, item2Obj] : [itemObj],
      },
      data: DATA.find((it) => it.key === data)?.value,
      themeConfig: {
        colorPrimary,
      },
    };

    if (theme === 'dark') {
      value.themeConfig.colorBg = '#333';
    }
    if (enablePalette) {
      value.themeConfig.palette = [
        '#1783FF',
        '#00C9C9',
        '#F0884D',
        '#D580FF',
        '#7863FF',
        '#60C42D',
        '#BD8F24',
        '#FF80CA',
        '#2491B3',
        '#17C76F',
        '#70CAF8',
      ];
    }

    return value;
  }, [
    watch,
    debouncedStructureConfig,
    debouncedItemConfig,
    debouncedItem2Config,
    useAdvancedConfig,
  ]);

  const exportOptions = useCallback(() => {
    const { design } = options;
    return { design };
  }, [options]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, flex: 1 }}>
      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 450,
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
          <Card title="基础配置" size="small">
            <Form
              layout="horizontal"
              size="small"
              form={form}
              initialValues={initialValues}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              colon={false}
            >
              <Form.Item label="结构" name="structure">
                <Select
                  showSearch
                  options={getStructures().map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              </Form.Item>
              <Form.Item label="数据项" name="item">
                <Select
                  showSearch
                  options={items.map((value) => ({ label: value, value }))}
                />
              </Form.Item>
              <Form.Item label="数据项" name="item2">
                <Select
                  showSearch
                  allowClear
                  placeholder="选择二级数据项"
                  options={items.map((value) => ({ label: value, value }))}
                />
              </Form.Item>
              <Form.Item label="数据" name="data">
                <Select
                  options={DATA.map(({ label, key }) => ({
                    label,
                    value: key,
                  }))}
                />
              </Form.Item>
              <Form.Item label="主题" name="theme">
                <Select
                  options={[
                    { label: '亮色', value: 'light' },
                    { label: '暗色', value: 'dark' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="主色"
                name="colorPrimary"
                normalize={(value) => value.toHexString()}
              >
                <ColorPicker />
              </Form.Item>
              <Form.Item
                label="色板"
                name="enablePalette"
                valuePropName="checked"
              >
                <Checkbox>启用色板</Checkbox>
              </Form.Item>
            </Form>
          </Card>

          <Card
            title="高级配置"
            size="small"
            extra={
              <Space size="small">
                {hasPendingChanges && useAdvancedConfig && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={applyConfigChanges}
                  >
                    应用修改
                  </Button>
                )}
                <Checkbox
                  checked={useAdvancedConfig}
                  onChange={(e) => setUseAdvancedConfig(e.target.checked)}
                >
                  启用
                </Checkbox>
              </Space>
            }
          >
            <Tabs
              size="small"
              items={[
                {
                  key: 'structure',
                  label: 'Structure',
                  children: (
                    <div style={{ height: 250 }}>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={structureConfig}
                        onChange={(value) => setStructureConfig(value || '{}')}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: 'off',
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  ),
                },
                {
                  key: 'item',
                  label: 'Item',
                  children: (
                    <div style={{ height: 250 }}>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={itemConfig}
                        onChange={(value) => setItemConfig(value || '{}')}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: 'off',
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  ),
                },
                {
                  key: 'item2',
                  label: 'Item 2',
                  children: (
                    <div style={{ height: 250 }}>
                      <Editor
                        height="100%"
                        defaultLanguage="json"
                        value={item2Config}
                        onChange={(value) => setItem2Config(value || '{}')}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 12,
                          lineNumbers: 'off',
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>

        <Space style={{ padding: '0 8px' }}>
          <Button
            type="primary"
            onClick={() => {
              const {
                design: { structure, items },
              } = options;
              const getType = (_: any) => (typeof _ === 'string' ? _ : _?.type);
              const name = `${getType(structure)}-${items
                .map(getType)
                .join('-')}`;
              const config = JSON.stringify(exportOptions(), null, 2);
              const output = `'${name}': ${config}`;
              console.log(output);
            }}
          >
            导出配置
          </Button>
          <Button
            onClick={() => {
              const config = JSON.stringify(options, null, 2);
              navigator.clipboard.writeText(config);
              console.log('Full options:', config);
            }}
          >
            复制完整配置
          </Button>
        </Space>
      </div>

      {/* Right Panel - Preview */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card title="预览" size="small" style={{ height: '100%' }}>
          <Infographic options={options} />
        </Card>
      </div>
    </div>
  );
};
