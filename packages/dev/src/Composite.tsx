import {
  Data,
  getItems,
  getStructures,
  InfographicOptions,
} from '@antv/infographic';
import { Button, Checkbox, ColorPicker, Flex, Form, Select } from 'antd';
import { useCallback, useMemo } from 'react';
import { Infographic } from './Infographic';
import { COMPARE_DATA, HIERARCHY_DATA, LIST_DATA } from './data';

const DATA: { label: string; key: string; value: Data }[] = [
  { label: '列表数据', key: 'list', value: LIST_DATA },
  { label: '层级数据', key: 'hierarchy', value: HIERARCHY_DATA },
  { label: '对比数据', key: 'compare', value: COMPARE_DATA },
];

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
    data: 'list',
    theme: 'light',
    colorPrimary: '#1890ff',
    enablePalette: false,
  };

  const initialValues = getStoredValues() || defaultValues;

  const [form] = Form.useForm<{
    structure: string;
    item: string;
    data: string;
    theme: 'light' | 'dark';
    colorPrimary: string;
    enablePalette: boolean;
  }>();
  const watch = Form.useWatch([], form);

  const options = useMemo<InfographicOptions | null>(() => {
    if (!watch) return null;
    const { structure, item, data, theme, colorPrimary, enablePalette } = watch;
    if (!structure || !item || !data) return null;

    setStoredValues(form.getFieldsValue());

    const value: InfographicOptions = {
      padding: 20,
      design: {
        title: 'default',
        structure: {
          type: structure,
        },
        items: [{ type: item }, 'pill-badge'],
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
  }, [watch]);

  const exportOptions = useCallback(() => {
    const { design, themeConfig } = options;
    return {
      design,
      themeConfig,
    };
  }, [options]);

  return (
    <Flex vertical>
      <Form
        layout="inline"
        size="small"
        form={form}
        initialValues={initialValues}
      >
        <Form.Item label="结构" name="structure">
          <Select
            style={{ width: 200 }}
            options={getStructures().map((value) => ({ label: value, value }))}
          />
        </Form.Item>
        <Form.Item label="数据项" name="item">
          <Select
            style={{ width: 200 }}
            options={getItems().map((value) => ({ label: value, value }))}
          />
        </Form.Item>
        <Form.Item label="数据" name="data">
          <Select
            style={{ width: 200 }}
            options={DATA.map(({ label, key }) => ({ label, value: key }))}
          />
        </Form.Item>
        <Form.Item label="主题" name="theme">
          <Select
            style={{ width: 200 }}
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
        <Form.Item name="enablePalette" valuePropName="checked">
          <Checkbox>启用色板</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              console.log(JSON.stringify(exportOptions(), null, 2));
            }}
          >
            导出配置
          </Button>
        </Form.Item>
      </Form>
      <Infographic options={options} />
    </Flex>
  );
};
