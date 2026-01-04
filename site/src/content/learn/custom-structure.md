---
title: 自定义结构
---

结构开发相对复杂，AntV Infographic 为[结构](/learn/design#structure)整理了可直接复用的 skill，基于 any-skills 管理，因此 Claude Code 或 Codex 都能读取并使用这些技能来生成高质量代码。

## 开发提示词 {#development-prompt}

结构相关的规则与模板已整理为 skill 的参考文档，位于：

- `.skills/infographic-structure-creator/SKILL.md`
- `.skills/infographic-structure-creator/references/structure-prompt.md`

其中包含以下内容：

- 结构分类体系（列表、对比、顺序、层级、关系、地理、统计图）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板（简单结构、层级结构）
- 布局计算要点
- 按钮布局原则
- 命名规范
- 生成流程
- 示例代码

## 使用方法 {#usage}

### 方法一：使用 skills（推荐） {#use-cli-ai}

在 Claude Code 或 Codex 中**一次性提出需求**即可，例如：

```bash
请使用 skill: infographic-structure-creator，帮我开发一个循环流程结构。数据项围成一个圆形排列，相邻项之间有箭头连接，形成闭环。每个数据项可以添加、删除。
```

生成后 AI 会直接创建结构文件并完成导出，只需在 Dev 环境验证布局与交互即可。

### 方法二：在 AI 对话中手动使用 {#use-chat}

如果你更偏好手动复制提示内容，可以直接读取参考文档：

```bash
cat .skills/infographic-structure-creator/references/structure-prompt.md
```

将内容粘贴给 AI 后，描述需求并生成代码。

无论采用哪种方式，提交前都请在 Dev 环境验证布局与交互是否符合预期。
