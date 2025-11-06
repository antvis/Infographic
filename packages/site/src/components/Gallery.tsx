import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { getTemplates, InfographicOptions } from '@antv/infographic';
import { Button, Card, Empty, Input, Select, Space, Tag } from 'antd';
import type { FC } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import InfographicWithDemo from './InfographicWithData';
import './ResourceLoader';
import ThemeProvider from './ThemeProvider';

// 类型定义
interface CategoryConfig {
  label: string;
  color: string;
  icon?: string;
  description?: string;
}

interface TemplateItem {
  key: string;
  category: string;
  config: CategoryConfig;
}

// 更新的类别配置
const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  compare: {
    label: '对比型',
    color: 'blue',
    icon: '⚖️',
    description: 'Comparison layouts',
  },
  hierarchy: {
    label: '层级型',
    color: 'cyan',
    icon: '🏗️',
    description: 'Tree structures',
  },
  list: {
    label: '列表型',
    color: 'cyan',
    icon: '📋',
    description: 'List layouts',
  },
  relation: {
    label: '关系型',
    color: 'magenta',
    icon: '🔗',
    description: 'Relationship diagrams',
  },
  sequence: {
    label: '顺序型',
    color: 'green',
    icon: '➡️',
    description: 'Sequential flows',
  },
  quadrant: {
    label: '四象限图',
    color: 'cyan',
    icon: '📊',
    description: 'Quadrant analysis',
  },
  chart: {
    label: '图表型',
    color: 'purple',
    icon: '📈',
    description: 'Chart-based layouts',
  },
};

// 获取类别配置
const getCategoryConfig = (key: string): CategoryConfig => {
  const category = key.split('-')[0];
  return (
    CATEGORY_CONFIG[category] || {
      label: category,
      color: 'default',
      icon: '📌',
      description: 'Template',
    }
  );
};

// 模板卡片组件
const TemplateCard: FC<{
  templateKey: string;
  categoryConfig: CategoryConfig;
  dataType: string;
  baseOptions?: Partial<InfographicOptions>;
}> = memo(({ templateKey, categoryConfig, dataType, baseOptions }) => {
  return (
    <Card
      className="gallery-card"
      hoverable
      styles={{
        body: { padding: 0 },
      }}
    >
      <div className="gallery-card-header">
        <InfographicWithDemo
          options={{
            ...baseOptions,
            template: templateKey,
          }}
          data={dataType}
          showActions={false}
        />
      </div>

      <div className="gallery-card-footer">
        <Space align="center" size="small" style={{ width: '100%' }}>
          <span style={{ fontSize: '1.2rem' }}>{categoryConfig.icon}</span>
          <Tag color={categoryConfig.color}>{categoryConfig.label}</Tag>
          <span className="template-id">{templateKey}</span>
        </Space>
      </div>
    </Card>
  );
});

// 主组件
const InfographicGallery: FC = () => {
  const [isDark, setIsDark] = useState(false);

  const templates = useMemo(() => getTemplates(), []);
  const rules: { rule: string; data: string }[] = [
    {
      rule: '^(sequence|relation)-',
      data: 'list',
    },
    {
      rule: '^quadrant-',
      data: 'list',
    },
    {
      rule: 'swot',
      data: 'swot',
    },
    {
      rule: '^compare-',
      data: 'compare',
    },
    {
      rule: '^(hierarchy)-',
      data: 'hierarchy',
    },
  ];

  const baseOptions: Partial<InfographicOptions> = useMemo(
    () => ({
      theme: isDark ? 'dark' : 'light',
      themeConfig: { palette: 'antv' },
    }),
    [isDark],
  );

  // 检测主题变化 (用于信息图渲染)
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const currentTheme = htmlElement.getAttribute('data-theme');
      setIsDark(currentTheme === 'dark');
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 准备模板数据
  const templateItems = useMemo((): TemplateItem[] => {
    return templates.map((key) => ({
      key,
      category: key.split('-')[0],
      config: getCategoryConfig(key),
    }));
  }, [templates]);

  // 获取所有类别
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(templateItems.map((item) => item.category)),
    );
    return [
      { value: 'all', label: '全部模板' },
      ...uniqueCategories.map((cat) => ({
        value: cat,
        label: CATEGORY_CONFIG[cat]?.label || cat,
      })),
    ];
  }, [templateItems]);

  // 过滤模板
  const filteredTemplates = useMemo(() => {
    return templateItems.filter((item) => {
      const matchesSearch =
        searchTerm === '' ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.config.label.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templateItems, searchTerm, selectedCategory]);

  // 获取数据类型
  const getDataType = useCallback(
    (key: string) => {
      return rules.find((r) => new RegExp(r.rule).test(key))?.data || 'list';
    },
    [rules],
  );

  // 动态样式
  const dynamicStyles = useMemo(() => {
    return `
      .infographic-gallery-container {
        padding: 2rem 0;
        margin: 0 auto;
        max-width: 100%;
      }

      .gallery-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .gallery-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        color: ${isDark ? '#fff' : 'var(--ifm-heading-color)'};
      }

      .gallery-subtitle {
        font-size: 1rem;
        margin-bottom: 2rem;
        color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--ifm-color-emphasis-700)'};
      }

      .results-info {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.9rem;
        color: ${isDark ? 'rgba(255, 255, 255, 0.65)' : 'var(--ifm-color-emphasis-700)'};
      }

      .results-info strong {
        color: var(--ifm-color-primary);
        font-weight: 600;
      }

      /* 网格布局 */
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 1.5rem;
        padding: 0 1rem;
      }

      /* 卡片样式 */
      .gallery-card {
        height: 100%;
        transition: all 0.3s ease;
        border-color: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'var(--ifm-color-emphasis-200)'};
        background: ${isDark ? '#1f1f1f' : '#fff'};
        overflow: hidden;
      }

      .gallery-card:hover {
        transform: translateY(-4px);
        box-shadow: ${
          isDark
            ? '0 8px 24px rgba(0, 0, 0, 0.5)'
            : '0 8px 24px rgba(0, 0, 0, 0.12)'
        };
      }

      .gallery-card-header {
        position: relative;
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: ${isDark ? '#141414' : 'var(--ifm-color-emphasis-100)'};
      }

      .infographic-wrapper {
        width: 100%;
        height: 100%;
        transition: transform 0.3s ease;
      }

      .infographic-wrapper.hovered {
        transform: scale(1.03);
      }

      .gallery-card-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .gallery-card:hover .gallery-card-actions {
        opacity: 1;
      }

      .gallery-card-footer {
        padding: 1rem;
        border-top: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'var(--ifm-color-emphasis-200)'};
        background: ${isDark ? '#1f1f1f' : '#fff'};
      }

      .template-id {
        font-size: 0.75rem;
        color: ${isDark ? 'rgba(255, 255, 255, 0.45)' : 'var(--ifm-color-emphasis-700)'};
        font-family: var(--ifm-font-family-monospace);
        margin-left: auto;
      }

      .empty-state {
        grid-column: 1 / -1;
        padding: 4rem 2rem;
        text-align: center;
      }

      .preview-content {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: ${isDark ? '#141414' : 'var(--ifm-color-emphasis-100)'};
        border-radius: 8px;
        padding: 2rem;
      }

      /* 响应式设计 */
      @media (max-width: 996px) {
        .gallery-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .gallery-card-header {
          height: 240px;
          padding: 1rem;
        }
      }

      @media (max-width: 768px) {
        .gallery-grid {
          grid-template-columns: 1fr;
          padding: 0;
        }

        .gallery-card-actions {
          opacity: 1;
        }

        .gallery-title {
          font-size: 1.5rem;
        }
      }
    `;
  }, [isDark]);

  return (
    <ThemeProvider>
      <div className="infographic-gallery-container">
        <style>{dynamicStyles}</style>

        <div className="gallery-header">
          <h2 className="gallery-title">信息图模板</h2>
          <p className="gallery-subtitle">浏览并选择我们的模板集合</p>

          <Space
            direction="vertical"
            size="middle"
            style={{ width: '100%', padding: '0 1em', margin: '0 auto' }}
          >
            <Input
              prefix={<SearchOutlined />}
              placeholder="搜索模板..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              size="large"
            />

            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              suffixIcon={<FilterOutlined />}
              options={categories}
              size="large"
              style={{ width: '100%' }}
            />
          </Space>

          {filteredTemplates.length > 0 && (
            <div className="results-info">
              找到 <strong>{filteredTemplates.length}</strong> 个模板
              {searchTerm && ` 匹配 "${searchTerm}"`}
            </div>
          )}
        </div>

        <div className="gallery-grid">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((item) => (
              <TemplateCard
                key={item.key}
                templateKey={item.key}
                categoryConfig={item.config}
                dataType={getDataType(item.key)}
                baseOptions={baseOptions}
              />
            ))
          ) : (
            <div className="empty-state">
              <Empty
                description={
                  <span>
                    没有找到模板
                    {searchTerm && <> 匹配 "{searchTerm}"</>}
                  </span>
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                >
                  重置筛选
                </Button>
              </Empty>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default InfographicGallery;
