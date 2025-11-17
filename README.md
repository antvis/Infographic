# @antv/infographic

一个强大、灵活的信息图生成与渲染框架，基于 SVG 技术，提供丰富的内置组件和灵活的扩展机制。

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/ci.yml)](https://github.com/antvis/infographic/actions)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

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

## 🚀 快速开始

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '产品开发流程',
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

## 📚 文档

- [入门教程](./packages/infographic/tutorial.md) - 从零开始学习 Infographic
- [API 文档](./packages/infographic/api.md) - 完整的 API 参考
- [数据项开发指南](./packages/infographic/src/designs/items/prompt.md) - 创建自定义数据项
- [结构开发指南](./packages/infographic/src/designs/structures/prompt.md) - 创建自定义结构

## 🏗️ 项目结构

```
packages/
├── infographic/          # 核心信息图框架
│   ├── src/
│   │   ├── designs/      # 设计资产
│   │   │   ├── items/            # 数据项组件
│   │   │   ├── structures/       # 结构组件
│   │   │   ├── components/       # 通用组件
│   │   │   ├── decorations/      # 装饰元素
│   │   │   └── layouts/          # 布局组件
│   │   ├── runtime/              # 运行时（入口）
│   │   │   └── Infographic.tsx   # 主类
│   │   ├── options/              # 选项解析
│   │   ├── resource/             # 资源加载
│   │   ├── renderer/             # SVG 渲染器
│   │   ├── themes/               # 主题系统
│   │   ├── templates/            # 模板注册
│   │   ├── types/                # 类型定义
│   │   └── utils/                # 工具函数
│   ├── api.md                    # API 文档
│   ├── tutorial.md               # 入门教程
│   └── README.md                 # 包文档
├── infographic-jsx/              # JSX 运行时
└── dev/                          # 开发调试环境
```

## 💻 开发

### 环境准备

```bash
# 安装依赖
npm install

# 启动开发环境
npm run dev

# 运行测试
npm run test

# 类型检查
npm run typecheck
```

### 构建命令

```bash
# 构建
npm run build
```

### 代码规范

```bash
# 代码检查
npm run lint
```

## 📝 核心概念

### 数据 (Data)

数据是信息图的内容来源，包含标题、描述和数据项：

```typescript
{
  title: '标题',
  desc: '描述',
  items: [
    {
      icon: 'icon-name',
      label: '标签',
      desc: '描述',
      value: 100,
      children: [],  // 用于层级结构
    }
  ]
}
```

### 结构 (Structure)

结构定义了数据项的组织和布局方式：

- **列表结构** (`list-*`): 信息项并列排布
- **对比结构** (`compare-*`): 二元或多元对比布局
- **顺序结构** (`sequence-*`): 具有方向性和顺序性
- **层级结构** (`hierarchy-*`): 树状或主次关系
- **关系结构** (`relation-*`): 展示元素间的连接关系

### 数据项 (Item)

数据项是信息图中的基本信息单元，框架提供了 30+ 种内置数据项组件。

### 主题 (Theme)

主题定义了信息图的视觉风格，支持颜色、字体、风格化等配置。

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出新功能建议！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 📄 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](./LICENSE) 文件

## 🔗 相关链接

- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈](https://github.com/antvis/infographic/issues)
- [更新日志](./CHANGELOG.md)

## 💬 社区

- 在 [GitHub Issues](https://github.com/antvis/infographic/issues) 提问
- 在 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 讨论

---

如有任何问题或建议，欢迎在 GitHub 上联系我们！
