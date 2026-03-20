---
name: frontend-design
description: Design system rules and UI conventions for the 30-in-30 series. Auto-triggers when writing UI components, pages, layouts, or CSS.
---

# Frontend Design System — 30-in-30 Series

## Core Principles
- Dark mode by default (`.dark` class on html)
- Utility-first aesthetic — every pixel serves a function
- No gradients, no drop shadows, 1px borders only
- No rounded corners > 8px
- No hero images or illustrations
- No marketing copy in the UI
- No full-page loading spinners

## Color System (CSS Variables)
| Token | Dark | Light | Usage |
|-------|------|-------|-------|
| --background | #0A0A0A | #F8F5F0 | Page background |
| --surface | #111111 | #FFFFFF | Card/panel backgrounds |
| --surface-raised | #1A1A1A | #F0EDE8 | Hover/elevated states |
| --border | #262626 | #E5DDD5 | All borders (1px only) |
| --text-primary | #F5F0E8 | #1A1714 | Headings, body |
| --text-secondary | #8A8580 | #6B6560 | Metadata, secondary |
| --text-tertiary | #555250 | #9A9590 | Placeholders, disabled |
| --accent (amber) | #E8A020 | #E8A020 | CTAs, focus rings, active |
| --success | #22C55E | #22C55E | Success states |
| --error | #EF4444 | #EF4444 | Error states |

## Typography
- Display headings: `Instrument Serif` (next/font/google, weight 400)
- Body + UI labels: `DM Sans` (next/font/google, weights 400 + 500)
- Monospace: system stack (`font-mono`) for timestamps, domains only
- Never use Inter, Roboto, or Arial

## Spacing
4px base grid. Only use: 4, 8, 12, 16, 24, 32, 48px.

## Component Rules
- All colors via CSS variables — never hardcode hex in components
- Use shadcn/ui as base, customize with CSS variables
- Sonner for all toasts (dark theme)
- lucide-react for all icons
- Framer Motion for animations (when needed)

## Layout Patterns
- Mobile-first, single column < 768px
- Two-column at >= 1024px where appropriate
- Max content width: 1280px with auto margins
- Consistent px-4 horizontal padding
