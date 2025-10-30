# API 参考

欢迎查看 @antv/infographic 的 API 文档。

## 📚 文档导航

### 核心 API

- **[Infographic](/api/infographic)** - 主类 API，创建和渲染信息图
- **[配置选项](/api/options)** - 完整的配置选项说明

### 组件 API

- **[结构组件](/api/structures)** - 内置结构组件（list、sequence、hierarchy 等）
- **[数据项组件](/api/items)** - 内置数据项组件（card、badge、chart 等）

### 扩展 API

- **[资源加载](/api/resources)** - 图标和插图资源加载

## 💡 快速开始

创建一个信息图只需要几行代码：

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '我的信息图',
    items: [/* 数据项 */],
  },
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
});

infographic.render();
```

## 📖 类型定义

所有类型定义都已导出，支持 TypeScript 智能提示：

```typescript
import type {
  InfographicOptions,
  Data,
  ItemDatum,
  ThemeConfig,
} from '@antv/infographic';
```

## 🔗 相关链接

- [快速开始](/guide/getting-started) - 从零开始创建信息图
- [核心概念](/guide/concepts) - 理解框架设计理念
- [示例](/examples/) - 查看实际应用示例
