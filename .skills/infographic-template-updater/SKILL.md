---
name: infographic-template-updater
description: Update template catalogs and UI prompts after adding new infographic templates (src/templates/*.ts), including SKILL.md template list, site gallery template mappings, and the AIPlayground prompt list.
---

# Infographic Template Updater

## Overview

Update public template lists and gallery mappings when new templates are added in `src/templates`.

## Workflow

1. Collect new template names from the added `src/templates/*.ts` file (object keys).
2. Update template lists:
   - `SKILL.md` in the "Available Templates" list.
   - `site/src/components/AIPlayground/Prompt.ts` in the template list.
   Keep existing ordering/grouping; add new `list-*` entries near other list templates.
3. Update gallery mapping in `site/src/components/Gallery/templates.ts`:
   - Add entries to `TEMPLATE_ENTRIES` with the correct dataset (most list templates use `DATASET.LIST`).
   - If the template should be featured, add it to `PREMIUM_TEMPLATE_KEYS` in the desired order.
4. Sanity check with `rg -n "<template-name>"` across the three files to confirm presence.

## Notes

- Do not remove or rename existing entries.
- Keep template names exact and lower-case.
- If a template fits a different dataset, follow the dataset used by similar templates.
