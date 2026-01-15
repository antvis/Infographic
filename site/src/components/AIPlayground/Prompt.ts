import rawSkillPrompt from '../../../../.skills/infographic-syntax-creator/references/prompt.md?raw';

export const SYSTEM_PROMPT = rawSkillPrompt
  .replace(/^---[\s\S]*?---\s*/, '')
  .trim();
