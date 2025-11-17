import {
  getItem,
  getItems,
  getThemeColors,
  ItemDatum,
  renderSVG,
} from '@antv/infographic';
import { Card, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { getStoredValues, setStoredValues } from './utils/storage';

const items = getItems();
const STORAGE_KEY = 'item-preview-form-values';

const FULL_DATA = {
  icon: 'achievment-050_v1_lineal',
  label: '企业营销优势',
  desc: '产品优势详细说明产品优势详细说明',
  value: 90,
  time: '2020',
  illus: 'illus:mathematics-cuate-7503',
};

export const ItemPreview = () => {
  // Get stored values with validation
  const storedValues = getStoredValues<{
    selectedItem: string;
    theme: 'light' | 'dark';
  }>(STORAGE_KEY, (stored) => {
    const fallbacks: any = {};

    // Validate item
    if (stored.selectedItem && !items.includes(stored.selectedItem)) {
      fallbacks.selectedItem = items[0];
    }

    return fallbacks;
  });

  const initialItem = storedValues?.selectedItem || items[0];
  const initialTheme = storedValues?.theme || 'light';

  const [selectedItem, setSelectedItem] = useState(initialItem);
  const [theme, setTheme] = useState<'light' | 'dark'>(initialTheme);
  const [themeConfig, setThemeConfig] = useState({
    colorPrimary: '#1890ff',
    colorBg: initialTheme === 'dark' ? '#333' : '#fff',
  });

  // Save to localStorage when values change
  useEffect(() => {
    setStoredValues(STORAGE_KEY, { selectedItem, theme });
  }, [selectedItem, theme]);

  const variants: { title: string; datum: ItemDatum; props?: any }[] = [
    {
      title: '完整实例',
      datum: FULL_DATA,
    },
    {
      title: '默认样式',
      datum: {
        label: '企业营销优势',
        desc: '产品优势详细说明产品优势详细说明',
      },
    },
    {
      title: '无描述',
      datum: {
        label: '企业营销优势',
      },
    },
    {
      title: '图标',
      datum: {
        icon: 'antenna-bars-5_v1_lineal',
        label: '综合实力优势',
        desc: '产品优势详细说明产品优势详细说明',
      },
    },
    {
      title: '值',
      datum: {
        label: '企业营销优势',
        desc: '产品优势详细说明产品优势详细说明',
        value: 90,
      },
    },
    {
      title: '插图',
      datum: {
        label: '企业营销优势',
        desc: '产品优势详细说明产品优势详细说明',
        illus: 'illus:mathematics-cuate-7503',
      },
    },
    {
      title: '时间',
      datum: {
        label: '企业营销优势',
        desc: '产品优势详细说明产品优势详细说明',
        time: '2024',
      },
    },
    {
      title: '长文本',
      datum: {
        icon: 'company-021_v1_lineal',
        label: '企业形象优势企业形象优势',
        desc: '产品优势详细说明产品优势详细说明产品优势详细说明产品优势详细说明',
        value: 90,
      },
    },
    {
      title: '水平居中',
      datum: FULL_DATA,
      props: {
        positionH: 'center',
      },
    },
    {
      title: '水平翻转',
      datum: FULL_DATA,
      props: {
        positionH: 'flipped',
      },
    },
    {
      title: '垂直居中',
      datum: FULL_DATA,
      props: {
        positionV: 'center',
      },
    },
    {
      title: '垂直翻转',
      datum: FULL_DATA,
      props: {
        positionV: 'flipped',
      },
    },
    {
      title: '水平垂直居中',
      datum: FULL_DATA,
      props: {
        positionH: 'center',
        positionV: 'center',
      },
    },
    {
      title: '小尺寸: 160',
      datum: FULL_DATA,
      props: {
        width: 160,
        height: 120,
      },
    },
    {
      title: '大尺寸: 300',
      datum: FULL_DATA,
      props: {
        width: 300,
        height: 200,
      },
    },
    {
      title: '颜色',
      datum: FULL_DATA,
      props: {
        themeColors: getThemeColors({
          colorPrimary: '#f0884d',
          colorBg: '#fff',
        }),
      },
    },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, flex: 1 }}>
      {/* Left Panel - Configuration */}
      <div
        style={{
          width: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <Card title="配置" size="small">
          <Form layout="vertical" size="small">
            <Form.Item label="选择 Item">
              <Select
                showSearch
                value={selectedItem}
                options={items.map((value) => ({ label: value, value }))}
                onChange={(value) => setSelectedItem(value)}
              />
            </Form.Item>
            <Form.Item label="主题">
              <Select
                value={theme}
                options={[
                  { label: '亮色', value: 'light' },
                  { label: '暗色', value: 'dark' },
                ]}
                onChange={(newTheme: 'light' | 'dark') => {
                  setTheme(newTheme);
                  setThemeConfig((pre) => ({
                    ...pre,
                    colorBg: newTheme === 'dark' ? '#333' : '#fff',
                  }));
                }}
              />
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Right Panel - Preview Grid */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
          {variants.map(({ title, datum, props }, index) => (
            <Card
              key={index}
              title={title}
              size="small"
              style={{ height: 200, background: themeConfig.colorBg }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: renderSVG(
                    getItem(selectedItem)?.component({
                      indexes: [0],
                      datum,
                      data: { items: [datum] },
                      themeColors: getThemeColors(themeConfig),
                      ...props,
                    }),
                    {
                      style: {
                        border: '1px dashed #aaa',
                        maxWidth: '300px',
                        maxHeight: '140px',
                      },
                    },
                  ),
                }}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
