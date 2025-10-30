# 快速开始

欢迎使用 @antv/infographic！本指南将帮助你快速上手并创建第一个信息图。

## 安装

使用你喜欢的包管理器安装 @antv/infographic：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm">
```bash
npm install @antv/infographic
```
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
```bash
pnpm add @antv/infographic
```
  </TabItem>
  <TabItem value="yarn" label="yarn">
```bash
yarn add @antv/infographic
```
  </TabItem>
</Tabs>

## 最简单的示例

创建你的第一个信息图只需要几行代码：

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container', // 容器选择器或 HTMLElement
  data: {
    title: '我的第一个信息图',
    items: [
      { label: '步骤 1', desc: '开始' },
      { label: '步骤 2', desc: '进行中' },
      { label: '步骤 3', desc: '完成' },
    ],
  },
});

infographic.render();
```

### HTML 页面示例

如果你在浏览器环境中使用，可以这样引入：

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

## 完整示例

让我们创建一个更完整的信息图：

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: 800,
  height: 600,
  data: {
    title: '产品开发流程',
    desc: '从需求到上线的完整流程',
    items: [
      {
        icon: 'lightbulb',
        label: '需求分析',
        desc: '收集和分析用户需求',
        value: 1,
      },
      {
        icon: 'design',
        label: '设计阶段',
        desc: '完成 UI/UX 设计',
        value: 2,
      },
      {
        icon: 'code',
        label: '开发实现',
        desc: '编码和单元测试',
        value: 3,
      },
      {
        icon: 'test',
        label: '测试验证',
        desc: '功能和性能测试',
        value: 4,
      },
      {
        icon: 'rocket',
        label: '上线发布',
        desc: '部署到生产环境',
        value: 5,
      },
    ],
  },
  design: {
    structure: 'list-column', // 使用纵向列表结构
    item: 'badge-card', // 使用徽章卡片样式
  },
  theme: 'default',
  themeConfig: {
    colorPrimary: '#1890ff',
  },
});

infographic.render();
```

## 下一步

现在你已经创建了第一个信息图，接下来可以：

- 学习[核心概念](/guide/concepts)了解框架的设计理念
- 查看[示例](/examples/)获取更多灵感
- 阅读 [API 文档](/api/)了解详细配置选项
- 探索[主题系统](/guide/theme)自定义视觉风格
- 了解[资源加载器](/guide/resource-loader)加载图标和插图资源
