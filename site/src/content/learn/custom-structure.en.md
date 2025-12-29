---
title: Custom Structure
---

Structure development is relatively complex. AntV Infographic provides reusable skills for [structures](/learn/design#structure), managed by any-skills, so both Claude Code and Codex can read and use them to generate high-quality code.

## Development Prompt {#development-prompt}

Structure rules and templates are packaged as a skill. The key files are:

- `.skills/infographic-structure-generator/SKILL.md`
- `.skills/infographic-structure-generator/references/structure-prompt.md`

They include the following:

- Structure classification system (list, comparison, sequence, hierarchy, relationship, geographic, statistical charts)
- Technical specifications (type definitions, available components, utility functions)
- Code templates (simple structure, hierarchical structure)
- Layout calculation essentials
- Button layout principles
- Naming conventions
- Generation process
- Example code

## Usage {#usage}

### Method 1: Use skills (Recommended) {#use-cli-ai}

In Claude Code or Codex, submit your request in one shot, for example:

```bash
Please use skill: infographic-structure-generator to build a circular flow structure. Items are arranged in a circle with arrows between neighbors to form a loop. Each item can be added or removed.
```

After generation, the AI will create the structure file and update exports. You only need to verify the layout and interactions in the Dev environment.

### Method 2: Manual use in an AI chat {#use-chat}

If you prefer to paste the reference yourself, read the skill reference:

```bash
cat .skills/infographic-structure-generator/references/structure-prompt.md
```

Paste the content into your AI chat, then describe your requirements and generate code.

Regardless of which method you use, please verify that the layout and interactions meet expectations in the Dev environment before submitting.
