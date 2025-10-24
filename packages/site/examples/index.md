# 示例

这里提供了各种类型的信息图示例，帮助你快速上手并获取灵感。

## 基础示例

### 简单列表

最基础的纵向列表布局：

```typescript
import { Infographic } from '@antv/infographic';

new Infographic({
  container: '#container',
  data: {
    title: '产品特性',
    items: [
      { label: '高性能', desc: '快速渲染' },
      { label: '易用性', desc: '简单配置' },
      { label: '可扩展', desc: '灵活定制' },
    ],
  },
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
}).render();
```

### 横向展示

使用横向布局展示并列信息：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '开发流程',
    items: [
      { icon: 'edit', label: '需求' },
      { icon: 'code', label: '开发' },
      { icon: 'test', label: '测试' },
      { icon: 'rocket', label: '上线' },
    ],
  },
  design: {
    structure: 'list-row',
    item: 'icon-badge',
  },
}).render();
```

### 网格布局

多项内容使用网格排列：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '技术栈',
    items: [
      { label: 'React' },
      { label: 'Vue' },
      { label: 'Angular' },
      { label: 'TypeScript' },
      { label: 'Node.js' },
      { label: 'Deno' },
    ],
  },
  design: {
    structure: 'list-grid',
    item: 'simple-item',
  },
}).render();
```

## 流程和时间线

### 步骤流程

展示按顺序进行的步骤：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '用户注册流程',
    items: [
      {
        label: '访问注册页',
        desc: '用户点击注册按钮',
      },
      {
        label: '填写信息',
        desc: '输入邮箱和密码',
      },
      {
        label: '验证邮箱',
        desc: '点击邮件中的验证链接',
      },
      {
        label: '完成注册',
        desc: '进入个人主页',
      },
    ],
  },
  design: {
    structure: 'sequence-steps',
    item: 'compact-card',
  },
}).render();
```

### 时间轴

展示按时间顺序的事件：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '产品发展历程',
    items: [
      {
        label: '2020',
        desc: '项目启动',
        value: 2020,
      },
      {
        label: '2021',
        desc: '发布 1.0 版本',
        value: 2021,
      },
      {
        label: '2022',
        desc: '用户突破 10 万',
        value: 2022,
      },
      {
        label: '2023',
        desc: '国际化上线',
        value: 2023,
      },
    ],
  },
  design: {
    structure: 'sequence-timeline',
    item: 'badge-card',
  },
}).render();
```

## 对比和数据

### 左右对比

对比两个方案或产品：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '版本对比',
    items: [
      {
        label: '免费版',
        desc: '适合个人用户',
        value: 0,
      },
      {
        label: '专业版',
        desc: '适合小团队',
        value: 99,
      },
      {
        label: '企业版',
        desc: '企业级方案',
        value: 999,
      },
    ],
  },
  design: {
    structure: 'compare-left-right',
    item: 'progress-card',
  },
}).render();
```

### 数据展示

展示带数值的信息：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '季度业绩',
    items: [
      { label: 'Q1', value: 125 },
      { label: 'Q2', value: 132 },
      { label: 'Q3', value: 141 },
      { label: 'Q4', value: 150 },
    ],
  },
  design: {
    structure: 'list-row',
    item: {
      type: 'chart-column',
      valueFormatter: (v) => `${v}%`,
    },
  },
}).render();
```

## 层级和关系

### 组织架构

展示层级关系：

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
              { label: '前端' },
              { label: '后端' },
            ],
          },
          {
            label: 'CMO',
            children: [
              { label: '市场' },
              { label: '销售' },
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

### 关系网络

展示元素间的关系：

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '技术生态',
    items: [
      { label: 'Frontend' },
      { label: 'Backend' },
      { label: 'Database' },
      { label: 'DevOps' },
    ],
  },
  design: {
    structure: 'relation-circle',
    item: 'circle-node',
  },
}).render();
```

## 主题样式

### 使用不同主题

```typescript
// 深色主题
new Infographic({
  container: '#container',
  theme: 'dark',
  data: { /* ... */ },
}).render();

// 手绘风格
new Infographic({
  container: '#container',
  themeConfig: {
    stylize: 'rough',
  },
  data: { /* ... */ },
}).render();

// 自定义颜色
new Infographic({
  container: '#container',
  themeConfig: {
    colorPrimary: '#52c41a',
    stylize: 'gradient',
  },
  data: { /* ... */ },
}).render();
```

## 高级用法

### 自定义数值格式化

```typescript
new Infographic({
  container: '#container',
  data: {
    title: '销售数据',
    items: [
      { label: '销售额', value: 1234567 },
      { label: '利润', value: 234567 },
    ],
  },
  design: {
    item: {
      type: 'badge-card',
      valueFormatter: (value) => {
        if (value >= 10000) {
          return (value / 10000).toFixed(1) + '万';
        }
        return value.toString();
      },
    },
  },
}).render();
```

### 加载外部图标

```typescript
new Infographic({
  container: '#container',
  data: {
    items: [
      {
        icon: { url: 'https://example.com/icon1.svg' },
        label: '功能 1',
      },
      {
        icon: { url: 'https://example.com/icon2.svg' },
        label: '功能 2',
      },
    ],
  },
}).render();
```

## 更多示例

- 查看[入门指南](/guide/getting-started)了解基础用法
- 查看[核心概念](/guide/concepts)理解框架设计
- 查看[高级用法](/guide/advanced)探索进阶特性
- 查看 [API 文档](/api/)了解完整配置
