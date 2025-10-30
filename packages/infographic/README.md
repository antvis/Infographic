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
