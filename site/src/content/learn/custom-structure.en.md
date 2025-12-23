---
title: Custom Structure
---

Structure development is relatively complex. AntV Infographic has prepared a dedicated AI prompt for [structures](/learn/design#structure), making it easy to quickly generate high-quality code using large language models (Claude, GPT-4, etc.).

## Development Prompt {#development-prompt}

The prompt is located in the [src/designs/structures/prompt.md](https://github.com/antvis/Infographic/blob/main/src/designs/structures/prompt.md) file in the AntV Infographic [GitHub repository](https://github.com/antvis/infographic). It contains the following:

- Structure classification system (list, comparison, sequence, hierarchy, relationship, geographic, statistical charts)
- Technical specifications (type definitions, available components, utility functions)
- Code templates (simple structure, hierarchical structure)
- Layout calculation essentials
- Button layout principles
- Naming conventions
- Generation process
- Example code

## Usage {#usage}

### Method 1: Use in AI Conversations {#use-chat}

1. **Open the prompt file**:

```bash
cat src/designs/structures/prompt.md
```

2. **Copy the prompt content** to an AI chatbox (e.g., Claude, ChatGPT)

3. **Describe your requirements**, for example:

```
I want to develop a circular flow structure where data items are arranged in a circle with arrows connecting adjacent items to form a closed loop. Each data item can be added or deleted.
```

4. **AI generates code**, including:

   - Complete TypeScript type definitions
   - JSX component implementation
   - Registration statements
   - All required imports

5. **Copy the code** to your project:

```bash
src/designs/structures/MyStructure.tsx
```

6. **Add to exports**:

Export the developed structure in `src/designs/structures/index.ts`.

7. **Test in Dev environment**

### Method 2: Use Claude Code or Codex (Recommended) {#use-cli-ai}

If you use Claude Code or similar AI programming assistants:

1. **Directly reference the prompt file**:

```bash
Please read src/designs/structures/prompt.md,
then help me develop a circular flow structure.
```

2. **AI automatically reads the prompt and generates code**

3. **AI can directly create files and add to exports**

Regardless of which method you use, please verify that the layout and interactions meet expectations in the Dev environment before submitting.
