---
title: Custom Items
---

Data item development also has a certain level of complexity. AntV Infographic provides reusable skills for [data items](/learn/design#item), managed by any-skills, so both Claude Code and Codex can read and use them to generate code.

## Development Prompt {#development-prompt}

Item rules and templates are packaged as a skill. The key files are:

- `.skills/infographic-item-creator/SKILL.md`
- `.skills/infographic-item-creator/references/item-prompt.md`

They include the following:

- Core concepts of data items
- Design requirements (completeness, responsiveness, numerical processing)
- Technical specifications (type definitions, available components, utility functions)
- Code templates
- Theme color usage
- Gradient definitions
- positionH/V handling
- Common issues and best practices

## Usage {#usage}

### Method 1: Use skills (Recommended) {#use-cli-ai}

In Claude Code or Codex, submit your request in one shot, for example:

```bash
Please use skill: infographic-item-creator to build a card-style item with icon and value.
```

After generation, the AI will create the item file and update exports. You only need to verify the result in the Dev environment.

### Method 2: Manual use in an AI chat {#use-chat}

If you prefer to paste the reference yourself, read the skill reference:

```bash
cat .skills/infographic-item-creator/references/item-prompt.md
```

Paste the content into your AI chat, then describe your requirements and generate code.

Regardless of which method you use, please verify the results in the Dev environment before submitting.
