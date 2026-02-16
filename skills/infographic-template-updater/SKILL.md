---
name: infographic-template-updater
description: Update template catalogs and UI prompts after adding new infographic templates (src/templates/*.ts), including SKILL.md template list, site gallery template mappings, and the AIPlayground prompt list.
---

# Infographic Template Updater

## Overview

Update public template lists and gallery mappings when new templates are added in `src/templates`.

## Workflow

1. Collect new template names from the added `src/templates/*.ts` file (object keys).
   - If templates are composed via spreads (e.g. `...listZigzagTemplates`), also confirm the final keys in `src/templates/built-in.ts`.
2. Update template lists:
   - `.skills/infographic-creator/SKILL.md` in the "Available Templates" list.
   - `site/src/components/AIPlayground/Prompt.ts` in the template list.
   - `.skills/infographic-syntax-creator/references/prompt.md` in the template list.
   Keep existing ordering/grouping; add new `list-*` entries near other list templates.
3. Sanity check with `rg -n "<template-name>"` across the above files to confirm presence.

## Notes

- Do not remove or rename existing entries.
- Keep template names exact and lower-case.
- If a template needs example data, update or extend `site/src/components/Gallery/datasets.ts` to match its structure.
