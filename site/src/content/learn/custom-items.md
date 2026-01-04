---
title: 自定义数据项
---

数据项开发同样有一定复杂度，AntV Infographic 为[数据项](/learn/design#item)整理了可直接复用的 skill，基于 any-skills 管理，因此 Claude Code 或 Codex 都能读取并使用这些技能来生成代码。

## 开发提示词 {#development-prompt}

数据项相关的规则与模板已整理为 skill 的参考文档，位于：

- `.skills/infographic-item-creator/SKILL.md`
- `.skills/infographic-item-creator/references/item-prompt.md`

其中包含以下内容：

- 数据项核心概念
- 设计要求（完整性、自适应、数值处理）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板
- 主题色彩使用
- 渐变定义
- positionH/V 处理
- 常见问题和最佳实践

## 使用方法 {#usage}

### 方法一：使用 skills（推荐） {#use-cli-ai}

在 Claude Code 或 Codex 中**一次性提出需求**即可，例如：

```bash
请使用 skill: infographic-item-creator，帮我开发一个带图标与数值的卡片式数据项。
```

生成后 AI 会直接创建数据项文件并完成导出，只需在 Dev 环境验证效果即可。

### 方法二：在 AI 对话中手动使用 {#use-chat}

如果你更偏好手动复制提示内容，可以直接读取参考文档：

```bash
cat .skills/infographic-item-creator/references/item-prompt.md
```

将内容粘贴给 AI 后，描述需求并生成代码。

无论采用哪种方式，提交前都请在 Dev 环境验证效果。
