# 结构组件 API

结构组件定义了数据项的组织和布局方式。每个结构组件都有特定的配置参数（Props）。

## 使用方式

> Coming Soon...

## 通用 Props

所有结构组件都继承 `BaseStructureProps`，包含以下基础属性：

| 参数    | 类型                     | 说明                           |
| ------- | ------------------------ | ------------------------------ |
| Title   | ComponentType            | 标题组件                       |
| Item    | ComponentType            | 数据项组件                     |
| Items   | ComponentType[]          | 多级数据项组件（用于层级结构） |
| data    | Data                     | 数据                           |
| options | ParsedInfographicOptions | 信息图配置                     |

这些参数由框架自动传递，无需手动配置。

## 相关链接

- [数据项组件 API](/api/items) - 查看所有数据项组件
- [配置选项](/api/options) - 了解如何配置结构
- [核心概念](/guide/concepts) - 理解结构的作用
