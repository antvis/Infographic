> [!TIP]
> 敬请期待 2025/11/22 开源活动

## AntV 信息图

<div align="center">
  <!-- <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uE8jRK4zrTgAAAAAVjAAAAgAemJ7AQ/original" alt="AntV Infographic Logo" height="200" /> -->
  <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZmBMQ4hQmAUAAAAAUOAAAAgAemJ7AQ/original" height="200">
</div>

<div align="center">

**信息图生成与渲染框架**

快速创建美观、专业的信息图表 | 多种风格 | 实时编辑 | 一键导出

[![Demo](https://img.shields.io/badge/🎮_在线体验-blue?style=for-the-badge)](https://www.tbox.cn/infographic)
[![License](https://img.shields.io/github/license/antvis/infographic?style=for-the-badge)](./LICENSE)
[![English](https://img.shields.io/badge/📖_English-blue?style=for-the-badge)](./README.md)

<!-- [![NPM Version](https://img.shields.io/npm/v/@antv/infographic?style=for-the-badge&label=NPM)](https://www.npmjs.com/package/@antv/infographic) -->

</div>

---

AntV AI 信息图是一款基于 `@antv/infographic` 构建的 AI 驱动信息图生成平台

<div align="center">
  <a href="https://www.tbox.cn/infographic">
    <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*F6B2TJnS6Y4AAAAAgBAAAAgAemJ7AQ/fmt.webp" alt="在线体验" width="600" style="border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
  </a>
  <p><em>👆 点击图片立即体验</em></p>
  <p><a href="https://www.tbox.cn/infographic"><em>https://www.tbox.cn/infographic</em></a></p>
</div>

---

## 📚 社区

<div align="center">

| 资源              | 链接                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 🎮 **在线体验**   | [tbox.cn/infographic](https://www.tbox.cn/infographic)                                                                                     |
| 💬 **讨论社区**   | [GitHub Discussions](https://github.com/antvis/infographic/discussions)                                                                    |
| 📱 **微信交流群** | <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*GoRsSIVZ3_gAAAAASBAAAAgAemJ7AQ/fmt.avif" alt="微信群二维码" width="80" /> |

</div>

<!-- ---

Will release in 2025/11/12

## ✨ 核心特色

### 🎨 丰富的内置资源

- **预置组件库**：图表、卡片、时间轴、流程图等常用信息图组件
- **设计元素**：图标、装饰线条、几何形状、分割线等视觉元素
- **布局模板**：多种预设布局，适用于不同类型的信息展示需求

### ⚡ 简洁的语法配置

- **信息图语法**：通过声明式语法快速组装信息图模板
- **组件化设计**：模块化的组件系统，支持灵活组合和复用
- **数据驱动**：分离模板与数据，支持动态内容渲染

### 🎭 多样化渲染风格

- **色板切换**：多套精心设计的配色方案，一键切换视觉风格
- **渲染风格**：
  - 手绘风格：模拟手绘效果，营造亲和感
  - 纹理风格：丰富的材质纹理，增强视觉层次
  - 更多风格持续添加中...

### ✏️ 强大的编辑能力

- **数据编辑**：实时修改信息图数据和文本内容
- **视觉元素替换**：自由更换图标、插图
- **内容插入**：支持添加文本框、几何图形等新元素
- **所见即所得**：实时预览编辑效果

---

## 🎯 快速开始

### 安装

```bash
# npm
npm install @antv/infographic
# pnpm
pnpm add @antv/infographic
```

### 5 分钟创建第一个信息图

```tsx
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: document.getElementById('container'),
  width: 800,
  height: 600,
  layout: 'vertical-list',
  design: { item: 'done-list' },
  data: {
    title: 'AntV',
    desc: 'AntV 是蚂蚁集团旗下的开源可视化解决方案，致力于为用户提供专业、易用、强大的可视化图表库和工具。',
    items: [
      { label: 'AntV G2', desc: '渐进式可视化语法' },
      { label: 'AntV G6', desc: '简单、易用、完备的图可视化引擎' },
      { label: 'AntV L7', desc: '大数据量的地理空间可视化引擎' },
      { label: 'AntV X6', desc: '图编辑引擎' },
      { label: 'AntV F2', desc: '移动端图表解决方案' },
      // ...
    ],
  },
});

infographic.render();
```

---

## 🎨 设计系统

### 色板

内置多套配色方案，支持自定义色板。

<details>
<summary><strong>内置色板</strong></summary>

**AntV 经典配色**

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*NYxQS5NEhqoAAAAAQEAAAAgAemJ7AQ/original" width="400">

**更多配色**

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*OetsTodEud8AAAAAQGAAAAgAemJ7AQ/original" width="400">

</details>

### 渲染风格

<div align="center">
  <img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*87omRpNbmC0AAAAARkAAAAgAemJ7AQ/original" alt="多种渲染风格" height="120" />
  <p><em>手绘 | 纹理 | 渐变 | 等多种风格</em></p>
</div>

---

## 🚧 开发进展

| 模块            | 状态 | 完成度 | 说明                    |
| --------------- | ---- | ------ | ----------------------- |
| ⚛️ **JSX 语法** | ✅   | 100%   | 支持 React 风格组件开发 |
| 🎨 **渲染引擎** | ✅   | 100%   | 支持多种风格和色板      |
| ✏️ **可视编辑** | ✅   | 90%    | 拖拽编辑、实时预览      |
| 📦 **组件库**   | 🚧   | 70%    | 持续增加新组件          |
| 📱 **移动适配** | 📋   | 20%    | 移动端体验优化中        |
| 🎬 **动画系统** | 📋   | 10%    | 过渡动画和微交互        |

> ✅ 已完成 | 🚧 进行中 | 📋 计划中

---

## 🤝 贡献指南

我们非常欢迎任何形式的贡献！

### 快速参与

```bash
# 1. Fork 并克隆项目
git clone git@github.com:antvis/Infographic.git

# 2. 安装依赖
pnpm install

# 3. 启动开发环境
pnpm run dev

# 4. 运行测试
pnpm test
```

### 贡献类型

- 🐛 **Bug 修复**: 修复已知问题
- ✨ **新功能**: 添加新的组件或功能
- 📝 **文档完善**: 改进文档和示例
- 🎨 **设计优化**: 提升 UI/UX 体验
- ⚡ **性能优化**: 提升渲染性能

--- -->

## 📄 许可证

本项目基于 [MIT License](./LICENSE) 开源协议，您可以自由使用、修改和分发。

---

<!-- ## 🙏 致谢

感谢所有为项目贡献的开发者和用户！

**特别感谢**:

- [AntV 团队](https://antv.antgroup.com/) - 核心技术支持
- [React 社区](https://reactjs.org/) - JSX 语法灵感来源
- 全体贡献者和用户的宝贵反馈

--- -->

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️！**

Made with ❤️ by [AntV Team](https://antv.antgroup.com/)

[官网](https://antv.antgroup.com/) • [在线体验](https://www.tbox.cn/infographic) • [GitHub](https://github.com/antvis/infographic)

</div>
