---
name: infographic-syntax-generator
description: Generate AntV Infographic syntax outputs. Use when asked to turn user content into the Infographic DSL (template selection, data structuring, theme), or to output `infographic <template>` plain syntax.
---

# Infographic Syntax Generator

## Overview

Generate AntV Infographic syntax output from user content, following the rules in `references/prompt.md`.

## Workflow

1. Read `references/prompt.md` for syntax rules, templates, and output constraints.
2. Extract the user's key structure: title, desc, items, hierarchy, metrics; infer missing pieces if needed.
3. Select a template that matches the structure (sequence/list/compare/hierarchy/chart).
4. Compose the syntax using `references/prompt.md` as the formatting baseline.
5. Preserve hard constraints in every output:
   - Output is a single `plain` code block; no extra text.
   - First line is `infographic <template-name>`.
   - Use two-space indentation; key/value pairs are `key value`; arrays use `-`.
   - Compare templates (`compare-*`) must have exactly two root nodes with children.
