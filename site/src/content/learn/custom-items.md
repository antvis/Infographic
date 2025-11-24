---
title: 自定义数据项
---

数据项开发同样有一定复杂度，AntV Infographic 为[数据项](/learn/design#item)准备了专用 AI 提示词，便于用大模型快速生成代码。

## 开发提示词 {#development-prompt}

提示词位于 AntV Infographic [GitHub 仓库](https://github.com/antvis/infographic)的中 [src/designs/items/prompt.md](https://github.com/antvis/Infographic/blob/dev/src/designs/items/prompt.md) 文件中。其中包含以下内容：

- 数据项核心概念
- 设计要求（完整性、自适应、数值处理）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板
- 主题色彩使用
- 渐变定义
- positionH/V 处理
- 常见问题和最佳实践

> 使用方法与[自定义结构](/learn/custom-structure)类似，生成后请在 Dev 环境验证效果。
