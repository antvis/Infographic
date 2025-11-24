---
title: 自定义结构
---

结构开发相对复杂，AntV Infographic 为[结构](/learn/design#structure)准备了专用 AI 提示词，便于使用大模型（Claude、GPT-4 等）快速生成高质量代码。

## 开发提示词 {#development-prompt}

提示词位于 AntV Infographic [GitHub 仓库](https://github.com/antvis/infographic)的中 [src/designs/structures/prompt.md](https://github.com/antvis/Infographic/blob/dev/src/designs/structures/prompt.md) 文件中。其中包含以下内容：

- 结构分类体系（列表、对比、顺序、层级、关系、地理、统计图）
- 技术规范（类型定义、可用组件、工具函数）
- 代码模板（简单结构、层级结构）
- 布局计算要点
- 按钮布局原则
- 命名规范
- 生成流程
- 示例代码

## 使用方法 {#usage}

### 方法一：在 AI 对话中使用 {#use-chat}

1. **打开提示词文件**：

```bash
cat src/designs/structures/prompt.md
```

2. **复制提示词内容**到 AI 对话框（如 Claude、ChatGPT）

3. **描述你的需求**，例如：

```
我想开发一个循环流程结构，数据项围成一个圆形排列，相邻项之间有箭头连接，形成闭环。每个数据项可以添加、删除。
```

4. **AI 生成代码**，包括：

   - 完整的 TypeScript 类型定义
   - JSX 组件实现
   - 注册语句
   - 所有必需的导入

5. **复制代码**到项目中：

```bash
src/designs/structures/MyStructure.tsx
```

6. **添加到导出**：

在 `src/designs/structures/index.ts` 中导出开发的结构。

7. **在 Dev 环境测试**

### 方法二：使用 Claude Code 或者 Codex（推荐） {#use-cli-ai}

如果你使用 Claude Code 或类似的 AI 编程助手：

1. **直接引用提示词文件**：

```bash
请阅读 src/designs/structures/prompt.md，
然后帮我开发一个循环流程结构。
```

2. **AI 自动读取提示词并生成代码**

3. **AI 可以直接创建文件并添加到导出**

无论采用哪种方式，提交前都请在 Dev 环境验证布局与交互是否符合预期。
