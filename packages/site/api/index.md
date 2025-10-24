# API 参考

欢迎查看 @antv/infographic 的 API 文档。这里提供了框架所有 API 的详细说明。

## 文档导航

### 核心 API

- **[Infographic](/api/infographic)** - 主类 API，用于创建和渲染信息图
- **[配置选项](/api/options)** - 完整的配置选项说明
- **[数据结构](/api/data)** - 数据格式和类型定义

### 设计系统

- **[结构组件](/api/structures)** - 内置结构组件列表和使用方法
- **[数据项组件](/api/items)** - 内置数据项组件列表和使用方法
- **[主题 API](/api/theme)** - 主题配置和自定义

### 工具和扩展

- **[资源加载](/api/resources)** - 资源加载相关 API
- **工具函数** - 实用工具函数（即将推出）
- **注册器** - 注册自定义组件、主题和模板（即将推出）

## 快速查找

### 创建信息图

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic(options);
infographic.render();
```

详见 [Infographic API](/api/infographic)

### 配置选项

```typescript
interface InfographicOptions {
  container?: string | HTMLElement;
  width?: number;
  height?: number;
  data: Data;
  design?: DesignOptions;
  theme?: string;
  themeConfig?: ThemeConfig;
  // ...
}
```

详见[配置选项](/api/options)

### 数据格式

```typescript
interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  // ...
}
```

详见[数据结构](/api/data)

## 类型定义

所有的类型定义都已导出，可以在 TypeScript 项目中使用：

```typescript
import type {
  InfographicOptions,
  Data,
  ItemDatum,
  ThemeConfig,
  BaseItemProps,
  BaseStructureProps,
} from '@antv/infographic';
```

## 版本信息

当前文档对应的版本：`latest`

查看[更新日志](https://github.com/antvis/infographic/blob/main/CHANGELOG.md)了解版本变更。
