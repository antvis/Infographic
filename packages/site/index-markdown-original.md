---
layout: home

hero:
  name: "@antv/infographic"
  text: "新一代信息图可视化引擎"
  tagline: 让数据叙事更简单、更优雅、更高效
  actions:
    - theme: brand
      text: 快速开始 →
      link: /guide/getting-started
    - theme: alt
      text: 在线示例
      link: /examples/
    - theme: alt
      text: GitHub
      link: https://github.com/antvis/infographic

features:
  - icon: 🚀
    title: 开箱即用
    details: 30+ 内置组件，15+ 结构布局，开箱即用的模板库，让你在几分钟内创建专业级信息图

  - icon: 🎨
    title: 强大主题系统
    details: 多套精心设计的主题风格，支持手绘风、扁平化、渐变等多种视觉效果，一键切换

  - icon: 🧩
    title: 极致灵活
    details: 组件化架构设计，数据、结构、样式完全解耦，支持自定义扩展，满足个性化需求

  - icon: 💎
    title: TypeScript 优先
    details: 完整的类型定义和智能提示，让开发过程更加高效、安全，减少运行时错误

  - icon: ⚡
    title: 高性能渲染
    details: 基于 SVG 的矢量渲染引擎，无损缩放，完美适配各种分辨率，支持多种导出格式

  - icon: 📖
    title: 声明式 API
    details: 简洁直观的配置语法，用数据驱动视图，专注于内容创作而非实现细节
---

## 为什么选择 Infographic？

### 🎯 专注信息图表达

与通用图表库不同，Infographic 专为信息图设计，提供了更贴合实际业务场景的组件和布局，让你的数据故事更具表现力。

### ⚡ 开发效率提升 10 倍

- **3 分钟**创建第一个信息图
- **30+ 模板**覆盖常见场景
- **零配置**开箱即用
- **智能提示**TypeScript 全面支持

### 🎨 视觉效果专业

精心打磨的视觉效果，内置多种主题风格，无需设计师也能产出专业级作品。

---

## 快速上手

### 安装

::: code-group

```bash [npm]
npm install @antv/infographic
```

```bash [pnpm]
pnpm add @antv/infographic
```

```bash [yarn]
yarn add @antv/infographic
```

:::

### 5 行代码，创建你的第一个信息图

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '🚀 产品开发全流程',
    items: [
      { icon: 'lightbulb', label: '需求分析', desc: '洞察用户痛点，定义产品价值' },
      { icon: 'design', label: '设计阶段', desc: '打造极致用户体验' },
      { icon: 'code', label: '开发实现', desc: '高质量代码交付' },
      { icon: 'test', label: '测试验证', desc: '全方位质量保障' },
      { icon: 'rocket', label: '上线发布', desc: '持续迭代优化' },
    ],
  },
  design: {
    structure: 'list-column',  // 垂直列表布局
    item: 'badge-card',          // 徽章卡片样式
  },
});

infographic.render();
```

::: tip 💡 提示
更换 `structure` 和 `item` 配置，即可切换不同的展示效果。查看 [在线示例](/examples/) 了解更多。
:::

## 核心能力

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 40px 0;">

### 🎨 丰富的视觉组件

**30+ 数据项组件**
- 图标卡片、徽章、标签、进度条
- 评分、统计数字、时间点
- 头像、Logo、图片展示

**15+ 结构布局**
- 列表（垂直/水平）、网格、时间轴
- 树形、路线图、对比图
- 四象限、金字塔、漏斗图

### 🎭 主题与风格

**多种视觉风格**
- 现代扁平 / 商务专业
- 手绘涂鸦 / 极简主义
- 科技未来 / 温暖人文

**完全可定制**
- 调色板配置
- 字体家族设置
- 风格化效果（渐变、阴影、纹理）

### 🔧 开发体验

**TypeScript 原生支持**
```typescript
// 完整的类型推导
const infographic = new Infographic({
  design: {
    structure: 'list-column', // ✅ 智能提示所有可用结构
    item: 'badge-card',        // ✅ 智能提示所有可用组件
  }
});
```

**热模块替换**
开发模式下，配置修改实时生效，极速预览。

### 🚀 性能优异

- **轻量级** - 核心库 < 50KB (gzipped)
- **按需加载** - 仅加载使用的组件
- **高性能** - 优化的 SVG 渲染引擎
- **导出灵活** - 支持 PNG、SVG、PDF 等格式

</div>

---

## 丰富的应用场景

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 32px 0;">

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**📊 业务展示**
- 产品特性介绍
- 服务流程说明
- 价值主张展示
- 商业模式图

</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**📈 数据可视化**
- 业绩报告
- 统计仪表板
- KPI 展示
- 对比分析

</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**🗓️ 时间叙事**
- 公司发展历程
- 项目里程碑
- 产品迭代路线
- 活动时间轴

</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**🏢 组织管理**
- 组织架构图
- 团队介绍
- 岗位职责
- 层级关系

</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**📋 流程图表**
- 工作流程
- 操作指南
- 决策树
- 业务流转

</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">

**🎓 教育培训**
- 知识框架
- 课程大纲
- 学习路径
- 概念图谱

</div>

</div>

---

## 立即开始

<div style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(82, 196, 26, 0.05) 100%); border-radius: 12px; margin: 40px 0;">

### 🚀 准备好创建精美的信息图了吗？

<div style="margin-top: 32px; display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">

[快速开始](/guide/getting-started){.vp-button .vp-button-brand}
[查看示例](/examples/){.vp-button .vp-button-alt}
[API 文档](/api/){.vp-button .vp-button-alt}

</div>

</div>

---

## 加入我们

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin: 40px 0;">

<div style="text-align: center; padding: 24px;">

**⭐ Star on GitHub**

给我们一个 Star，支持项目发展

[GitHub →](https://github.com/antvis/infographic)

</div>

<div style="text-align: center; padding: 24px;">

**💬 参与讨论**

分享想法，交流经验

[Discussions →](https://github.com/antvis/infographic/discussions)

</div>

<div style="text-align: center; padding: 24px;">

**🐛 反馈问题**

报告 Bug，提出建议

[Issues →](https://github.com/antvis/infographic/issues)

</div>

<div style="text-align: center; padding: 24px;">

**🤝 贡献代码**

一起让它变得更好

[Contributing →](https://github.com/antvis/infographic/blob/main/CONTRIBUTING.md)

</div>

</div>

---

<div style="text-align: center; padding: 40px 20px; color: var(--vp-c-text-2);">

### 开源协议

本项目基于 [MIT 许可证](https://github.com/antvis/infographic/blob/main/LICENSE) 开源

Made with ❤️ by [AntV Team](https://antv.antgroup.com/)

</div>
