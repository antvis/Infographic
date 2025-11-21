---
title: 自定义数据项
---

由于数据项开发较为复杂，AntV Infographic 为[数据项](/learn/design#item)提供了专门的 AI 提示词（`Prompt`），你可以使用大语言模型（如 Claude、GPT-4 等）快速生成高质量的设计资产代码。

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

> 使用方法与[自定义结构](/learn/custom-structure)类似。
