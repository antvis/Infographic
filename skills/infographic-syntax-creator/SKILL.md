---
name: infographic-syntax-creator
description: Generate AntV Infographic syntax only. Use when asked to turn notes, outlines, reports, or other user content into the Infographic DSL with template selection, data structuring, and theme hints. Do not use for HTML rendering or TS/TSX component implementation.
---

# Infographic Syntax Creator

## Overview

Generate AntV Infographic syntax output from user content, following the rules in `references/prompt.md`.

## Workflow

1. Read `references/prompt.md` for syntax rules, templates, and output constraints.
2. If the user explicitly names a valid template or template family, honor it first; otherwise choose the best matching template for the structure (sequence/list/compare/hierarchy/chart).
3. Extract the user's key structure: title, desc, items, hierarchy, metrics; infer missing pieces if needed.
4. Compose the syntax using `references/prompt.md` as the formatting baseline.
5. Preserve hard constraints in every output:
   - Output is a single fenced code block containing only syntax; no extra text.
   - First line is `infographic <template-name>`.
   - Use two-space indentation; key/value pairs are `key value`; arrays use `-`.
   - Keep all user-facing text in the same language as the user's input unless the user explicitly asks for translation or bilingual output.
   - Prefer generating `icon` for semantic data items by default. If a list item, step, node, compare branch, or compare child has a clear concept, include an `icon` unless the user explicitly wants text-only output or the template is chart-only.
   - If the chosen template name or item style implies icons, treat `icon` as expected on every primary datum rather than optional.
   - When `icon` is written as a keyword phrase, separate words with spaces rather than hyphens. Exact icon IDs may keep their native punctuation.
   - `compare-binary-*` / `compare-hierarchy-left-right-*` must have exactly two root nodes, and the actual comparison points belong in each root node's `children`.
   - `compare-swot` / `compare-quadrant-*` follow their own root-node counts and should not be forced into a binary structure.

## Notes

- This skill returns syntax only. If the user wants a rendered HTML file or a complete deliverable, prefer `infographic-creator`.
- The template list in `references/prompt.md` is representative rather than exhaustive; prefer structurally correct registered templates over forcing a bad match.
