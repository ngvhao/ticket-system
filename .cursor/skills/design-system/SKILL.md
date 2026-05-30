---
name: design-system
description: >-
  Apply the ticket-system UI design tokens from DESIGN.md when building or
  editing pages, components, or styles in apps/web. Use when creating UI,
  styling components, choosing colors/typography/spacing, or when the user
  mentions design system, DESIGN.md, or Linear-style dark UI.
---

# Design system (ticket-system)

## When to use

- Any new or changed UI in `apps/web`
- User asks about styling, theming, or design consistency
- Reviewing whether existing UI matches the spec

## Instructions

1. **Read the source of truth**: `DESIGN.md` at the repository root (full file, especially front-matter tokens and Components section).
2. **Read implementation hooks**:
   - `apps/web/app/globals.css` — CSS variables / `@theme` tokens
   - `apps/web/AGENTS.md` — web-specific design rules
3. **Implement with tokens**, not one-off colors:
   - Primary: `#5e6ad2` (`{colors.primary}`)
   - Canvas: `#010102`, surfaces `#0f1011`–`#191a1b`
   - Ink: `#f7f8f8`, muted/subtle per spec
4. **Match component recipes** from `DESIGN.md` `components:` block (padding, radius, typography).
5. **Validate** after `DESIGN.md` edits: `npx @google/design.md lint DESIGN.md`

## Quick token reference

| Use | Token |
|-----|--------|
| Page bg | `{colors.canvas}` |
| Card | `{colors.surface-1}` + `{colors.hairline}` border |
| Primary button | `button-primary` |
| Secondary button | `button-secondary` |
| Input | `text-input` / `text-input-focused` |
| Status pill | `status-badge` |
| Success only | `{colors.semantic-success}` |

## Anti-patterns (reject in review)

- Light backgrounds (`bg-white`, `bg-zinc-50`) on marketing/app shell pages
- Tailwind `indigo-*` instead of `{colors.primary}`
- `rounded-2xl` pill CTAs, gradient hero backgrounds
- Multiple semantic colors (rose/amber/emerald) on one screen

## Output

When implementing UI, briefly note which `DESIGN.md` component tokens you applied (e.g. `feature-card`, `button-primary`).
