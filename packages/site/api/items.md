# 数据项组件 API

数据项组件定义了单个数据项的展示样式。每个数据项组件都有特定的配置参数（Props）。

## 使用方式

> Coming Soon...

## 通用 Props

所有数据项组件都继承 `BaseItemProps`，包含以下基础属性：

| 参数           | 类型                              | 说明           |
| -------------- | --------------------------------- | -------------- |
| datum          | Item                              | 当前数据项     |
| data           | Data                              | 完整数据       |
| indexes        | number[]                          | 数据项索引路径 |
| themeColors    | ThemeColors                       | 主题颜色配置   |
| valueFormatter | (value: number) => string         | 数值格式化函数 |
| positionH      | 'normal' \| 'center' \| 'flipped' | 水平位置       |
| positionV      | 'normal' \| 'center' \| 'flipped' | 垂直位置       |

这些参数由框架自动传递，无需手动配置。

## 数值格式化

可以为数据项提供自定义的数值格式化函数：

```typescript
design: {
  item: {
    type: 'badge-card',
    valueFormatter: (value: number) => {
      if (value >= 10000) {
        return (value / 10000).toFixed(1) + '万';
      }
      return value.toString();
    }
  }
}
```

## 相关链接

- [结构组件 API](/api/structures) - 查看所有结构组件
- [配置选项](/api/options) - 了解如何配置数据项
- [核心概念](/guide/concepts) - 理解数据项的作用
