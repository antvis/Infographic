# @antv/infographic

一个强大、灵活的信息图生成与渲染框架，基于 SVG 技术，提供丰富的内置组件和灵活的扩展机制。

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/ci.yml)](https://github.com/antvis/infographic/actions)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](https://github.com/antvis/infographic/blob/main/LICENSE)

## ✨ 特性

- 📦 **开箱即用** - 提供丰富的内置组件和模板，快速创建信息图
- 🎨 **灵活主题** - 强大的主题系统，支持多种风格和自定义配置
- 🧩 **组件化设计** - 数据项、结构、布局完全组件化，易于扩展
- 🔧 **类型安全** - 完整的 TypeScript 类型定义
- 📐 **SVG 渲染** - 基于 SVG 技术，高质量矢量图形输出
- 🎯 **声明式配置** - 简单直观的配置方式

## 📦 安装

```bash
npm install @antv/infographic
```

或使用其他包管理器：

```bash
# pnpm
pnpm add @antv/infographic

# yarn
yarn add @antv/infographic
```

## 🚀 快速开始

### 基础示例

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '产品开发流程',
    desc: '从需求到上线的完整流程',
    items: [
      { icon: 'lightbulb', label: '需求分析', desc: '收集和分析用户需求' },
      { icon: 'design', label: '设计阶段', desc: '完成 UI/UX 设计' },
      { icon: 'code', label: '开发实现', desc: '编码和单元测试' },
      { icon: 'test', label: '测试验证', desc: '功能和性能测试' },
      { icon: 'rocket', label: '上线发布', desc: '部署到生产环境' },
    ],
  },
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
});

infographic.render();
```

### HTML 页面示例

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Infographic Demo</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="https://unpkg.com/@antv/infographic"></script>
    <script>
      const infographic = new Infographic({
        container: '#container',
        data: {
          title: '快速示例',
          items: [
            { label: '步骤 1' },
            { label: '步骤 2' },
            { label: '步骤 3' },
          ],
        },
      });
      infographic.render();
    </script>
  </body>
</html>
```

## 📚 核心概念

### 数据 (Data)

数据是信息图的内容来源：

```typescript
const data = {
  title: '标题',
  desc: '描述',
  items: [
    {
      icon: 'icon-name',      // 图标
      label: '标签',          // 标签
      desc: '描述文本',       // 描述
      value: 100,             // 数值
      children: [],           // 子项（层级结构）
    },
  ],
};
```

### 结构 (Structure)

结构定义了数据项的组织和布局方式：

- **列表结构** (`list-*`): `list-column`, `list-row`, `list-grid`, `list-waterfall`, `list-sector`
- **对比结构** (`compare-*`): `compare-left-right`, `compare-mirror`
- **顺序结构** (`sequence-*`): `sequence-timeline`, `sequence-steps`, `sequence-roadmap-vertical`
- **层级结构** (`hierarchy-*`): `hierarchy-tree`, `hierarchy-pyramid`
- **关系结构** (`relation-*`): `relation-circle`, `relation-network`

### 数据项 (Item)

数据项是信息图中的基本信息单元：

- 卡片类: `badge-card`, `compact-card`, `progress-card`, `ribbon-card`
- 图表类: `chart-column`, `circular-progress`
- 箭头类: `horizontal-icon-arrow`, `vertical-icon-arrow`
- 文本类: `plain-text`, `bullet-text`, `done-list`
- 等等...

### 主题 (Theme)

主题定义了信息图的视觉风格：

```typescript
{
  theme: 'default',
  themeConfig: {
    colorPrimary: '#1890ff',
    fontFamily: 'Arial, sans-serif',
    stylize: 'rough',  // 手绘风格
  }
}
```

## 📖 文档

- [入门教程](./tutorial.md) - 从零开始学习 Infographic
- [API 文档](./api.md) - 完整的 API 参考
- [数据项开发指南](./src/designs/items/prompt.md) - 创建自定义数据项
- [结构开发指南](./src/designs/structures/prompt.md) - 创建自定义结构

## 🎨 示例

### 对比图

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '产品版本对比',
    items: [
      { label: '基础版', value: 99, desc: '适合个人用户' },
      { label: '专业版', value: 299, desc: '适合团队使用' },
      { label: '企业版', value: 999, desc: '企业级解决方案' },
    ],
  },
  design: {
    structure: 'compare-left-right',
    item: 'progress-card',
  },
}).render();
```

### 层级结构

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '组织架构',
    items: [
      {
        label: 'CEO',
        children: [
          {
            label: 'CTO',
            children: [
              { label: '前端团队' },
              { label: '后端团队' },
            ],
          },
          {
            label: 'CMO',
            children: [
              { label: '市场部' },
              { label: '销售部' },
            ],
          },
        ],
      },
    ],
  },
  design: {
    structure: 'hierarchy-tree',
    item: 'rounded-rect-node',
  },
}).render();
```

### 使用模板

```typescript
import { Infographic } from '@antv/infographic';

new Infographic({
  container: '#container',
  template: 'process-flow',
  data: {
    title: '用户注册流程',
    items: [
      { label: '填写信息' },
      { label: '验证邮箱' },
      { label: '完成注册' },
    ],
  },
}).render();
```

## 🔧 配置选项

### InfographicOptions

```typescript
interface InfographicOptions {
  container?: string | HTMLElement;  // 容器
  width?: number;                    // 宽度
  height?: number;                   // 高度
  padding?: Padding;                 // 内边距
  template?: string;                 // 模板
  design?: DesignOptions;            // 设计配置
  data: Data;                        // 数据
  theme?: string;                    // 主题
  themeConfig?: ThemeConfig;         // 主题配置
}
```

详细配置请参考 [API 文档](./api.md)。

## 🎯 扩展开发

### 注册自定义主题

```typescript
import { registerTheme } from '@antv/infographic';

registerTheme('my-theme', {
  seed: {
    colorPrimary: '#722ed1',
    fontFamily: 'Georgia, serif',
  },
});
```

### 注册自定义模板

```typescript
import { registerTemplate } from '@antv/infographic';

registerTemplate('my-template', {
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
  theme: 'default',
});
```

### 创建自定义数据项

详见 [数据项开发指南](./src/designs/items/prompt.md)

### 创建自定义结构

详见 [结构开发指南](./src/designs/structures/prompt.md)

## 🏗️ 项目结构

```
packages/infographic/
├── src/
│   ├── designs/              # 设计资产
│   │   ├── items/            # 数据项组件
│   │   ├── structures/       # 结构组件
│   │   ├── components/       # 通用组件
│   │   ├── decorations/      # 装饰元素
│   │   └── layouts/          # 布局组件
│   ├── runtime/              # 运行时（入口）
│   │   └── Infographic.tsx   # 主类
│   ├── options/              # 选项解析
│   ├── resource/             # 资源加载
│   ├── renderer/             # SVG 渲染器
│   ├── themes/               # 主题系统
│   ├── templates/            # 模板注册
│   ├── types/                # 类型定义
│   └── utils/                # 工具函数
├── api.md                    # API 文档
├── tutorial.md               # 入门教程
└── README.md                 # 本文件
```

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出新功能建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](../../LICENSE) 文件

## 🔗 相关链接

- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈](https://github.com/antvis/infographic/issues)
- [更新日志](../../CHANGELOG.md)

## 💬 社区

- 在 [GitHub Issues](https://github.com/antvis/infographic/issues) 提问
- 在 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 讨论

---

如有任何问题或建议，欢迎在 GitHub 上联系我们！
