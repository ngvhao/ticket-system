<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system

Before writing or changing UI in `apps/web` (pages, components, styles), read `DESIGN.md` at the repo root and apply its tokens.

## Required workflow

1. Read `DESIGN.md` (colors, typography, spacing, rounded, components).
2. Map UI to named component tokens (`button-primary`, `feature-card`, `text-input`, `status-badge`, etc.).
3. Use CSS variables from `app/globals.css` when available; add missing tokens there instead of hardcoding hex in components.
4. After editing `DESIGN.md`, run `npx @google/design.md lint DESIGN.md`.

## Non‑negotiables

- Dark canvas only: `{colors.canvas}` (#010102), not light mode or true black.
- Single accent: `{colors.primary}` (#5e6ad2) — brand, primary CTA, focus, link emphasis only.
- Cards: `{colors.surface-1}` + 1px `{colors.hairline}`; hierarchy via surface ladder, not shadows or gradients.
- Semantic color on marketing UI: `{colors.semantic-success}` only; no decorative emerald/amber/rose badges.
- Button radius `{rounded.md}` (8px); card radius `{rounded.lg}` (12px).
- Typography: display/headline negative tracking; body `{typography.body}` at weight 400.

## Do not

- Ship light-mode pages or `zinc-50` / white marketing backgrounds.
- Use indigo/violet Tailwind defaults as a substitute for `{colors.primary}`.
- Add atmospheric gradients or multi-color status chips unless spec explicitly allows.
