# Echo — Design System Tokens
**Version:** 1.0 · **Mode:** Dark  
**Brand:** Echo Digital Marketing Agency · Cairo, Egypt

---

## Color Tokens

### Brand Core
| Token | Value | Usage |
|---|---|---|
| `--echo-orange` | `#D95F2B` | Primary accent — CTA buttons, headlines emphasis, active states |
| `--echo-orange-hover` | `#E8784A` | Button hover, link hover |
| `--echo-orange-muted` | `rgba(217,95,43,0.10)` | Badge backgrounds, subtle tints |
| `--echo-orange-glow` | `rgba(217,95,43,0.25)` | Shadow/glow behind CTAs |

### Surface
| Token | Value | Usage |
|---|---|---|
| `--echo-bg` | `#0A0A0A` | Page background, cell fill — the sticky canvas |
| `--echo-surface-1` | `#101010` | Elevated panels, right-side illustration areas |
| `--echo-surface-2` | `#161616` | Nested interactive elements |

### Text
| Token | Value | Contrast vs `#0A0A0A` | Usage |
|---|---|---|---|
| `--echo-text-1` | `#E8E8E8` | 15:1 ✓ AA | Headlines, metric values, names |
| `--echo-text-2` | `#AAAAAA` | 8.5:1 ✓ AA | Body copy, descriptions |
| `--echo-text-3` | `#808080` | 5.0:1 ✓ AA | Labels, Space Mono captions |

### Borders
| Token | Value | Usage |
|---|---|---|
| `--echo-border` | `rgba(255,255,255,0.07)` | Section dividers, card outlines |
| `--echo-border-subtle` | `rgba(255,255,255,0.04)` | Inner row separators |
| `--echo-border-orange` | `2px solid #D95F2B` | Active state, selected item |
| `--echo-border-transparent` | `2px solid transparent` | Default unselected state |

---

## Typography Tokens

### Font Families
| Token | Value | Role |
|---|---|---|
| `--echo-ff` | `'Fredoka', sans-serif` | Display — headlines, service names, metric values, logo |
| `--echo-fb` | `'Manrope', sans-serif` | Body — descriptions, body copy, paragraphs |
| `--echo-fm` | `'Space Mono', monospace` | Labels — badges, nav links, tags, captions, section labels |

### Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Manrope:wght@400;500;600&family=Space+Mono:wght@400&display=swap');
```

### Type Scale
| Role | Family | Size | Weight | Letter-spacing | Color |
|---|---|---|---|---|---|
| Display / Hero | Fredoka | `clamp(60px, 8.5vw, 116px)` | 700 | `-0.03em` | `--echo-text-1` |
| Section Headline | Fredoka | `clamp(28px, 4vw, 44px)` | 700 | `-0.02em` | `--echo-text-1` |
| Card Title | Fredoka | `16–18px` | 600 | `-0.01em` | `--echo-text-1` / `--echo-text-2` |
| Metric Value | Fredoka | `20–42px` | 700 | `-0.02em` | `--echo-orange` |
| Body Copy | Manrope | `14–15px` | 400 | `0` | `--echo-text-2` |
| Body Emphasis | Manrope | `14–15px` | 600 | `0` | `--echo-text-1` |
| Small Body | Manrope | `12–13px` | 400 | `0` | `--echo-text-2` |
| Section Label | Space Mono | `9–10px` | 400 | `0.12–0.14em` | `--echo-orange` |
| Nav Links | Space Mono | `10px` | 400 | `0.10em` | `--echo-text-3` |
| Tags / Badges | Space Mono | `8–9px` | 400 | `0.08em` | `--echo-text-3` |

### Typography Rules
- **Fredoka** is always used for anything the eye lands on first — title, number, name. Never for body.
- **Manrope** handles sustained reading. Minimum size: `12px`. Weight `400` for body, `600` for emphasis inline.
- **Space Mono** is used exclusively for metadata — things you read after the content, not instead of it. Never sentence-length.
- All `text-transform: uppercase` applies to Space Mono labels only.
- Letter-spacing on Fredoka: negative (`-0.02em`) at large sizes, zero at small.
- Letter-spacing on Space Mono: `0.10–0.14em` always — it needs breathing room.

---

## Spacing Scale
| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Gap between icon and label |
| `--space-sm` | `8px` | Between inline elements |
| `--space-md` | `12px` | Badge padding, tight internal gaps |
| `--space-base` | `16px` | Table cell padding |
| `--space-lg` | `24px` | Between components within a section |
| `--space-xl` | `40px` | Section internal padding (horizontal) |
| `--space-2xl` | `64px` | Between major grid columns |
| `--space-3xl` | `88–96px` | Section vertical padding |

---

## Radius Scale
| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` | Buttons, badges, inputs |
| `--radius-md` | `8px` | Panels, grid containers, cards |
| `--radius-lg` | `12px` | Modals, large containers |

---

## Border System
- All structural borders: `0.5px` — never `1px` for section-level elements
- Active / selected: `2px solid #D95F2B` (left-side accent only)
- Grid gap: `1px` filled with `rgba(255,255,255,0.07)` — creates hairline divider between cells

---

## Motion Tokens
| Token | Value | Usage |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22,1,0.36,1)` | Entrance animations, slide-in |
| `--ease-default` | `ease` | Opacity fades |
| `--duration-fast` | `0.15s` | Hover state color transitions |
| `--duration-base` | `0.3s` | Nav background transition |
| `--duration-slow` | `0.65s` | Section entrance animations |
| `--stagger` | `0.08s` | Per-element delay increment |

### Motion Rules
- Section entrances: `translateY(20px) → translateY(0)` + `opacity 0→1`, triggered by IntersectionObserver at `threshold: 0.1`
- Hover state transitions: `0.15s ease` only — no easing above `150ms` on interactive state changes
- No looping animations except pulse dot on live indicators

---

## Layout
| Token | Value | Usage |
|---|---|---|
| `--max-width` | `1100px` | Centered content column |
| `--nav-height` | `52px` | Fixed navigation bar |
| `--full-width` | `100%` | Ticker strip, CTA section |

### Layout Rules
- Content is centered at `max-width: 1100px`. Background extends full-width.
- Two sections break the centered layout: **Ticker** (full-width scrolling strip) and **CTA** (full-width dark section).
- Case studies use a full-width alternating two-column grid with no `max-width` constraint.
- The sticky background canvas is `position: fixed; inset: 0` — content scrolls above it at `z-index: 1`.

---

## Component Patterns

### Grid Box
```css
display: grid;
gap: 1px;
background: rgba(255,255,255,0.07); /* the 1px gap becomes a hairline border */
border: 0.5px solid rgba(255,255,255,0.07);
border-radius: 8px;
overflow: hidden;
```
Each cell: `background: #0A0A0A` — the gap color shows through as the divider.

### Active State (Services, FAQ, Testimonials)
```css
background: rgba(217,95,43,0.04);
border-left: 2px solid #D95F2B;
```

### Hover State (rows, cells)
```css
background: rgba(255,255,255,0.02);
transition: background 0.15s;
```

### CTA Button (Primary)
```css
font-family: 'Manrope', sans-serif;
font-size: 14px;
font-weight: 600;
color: #0A0A0A;
background: #D95F2B;
border-radius: 5px;
padding: 12px 26px;
transition: background 0.15s;
```

### Section Label
```css
font-family: 'Space Mono', monospace;
font-size: 9px;
letter-spacing: 0.13em;
text-transform: uppercase;
color: #D95F2B;
display: inline-block;
margin-bottom: 14px;
```

---

## Forbidden Patterns
| Pattern | Reason |
|---|---|
| Template literals inside JSX style props | Artifact renderer (Babel) rejects `${variable}` inside style attributes |
| Gradients as backgrounds | Flat dark surfaces only — the orange glow is one radial at 4% opacity max |
| `1px` structural borders | Always `0.5px` — heavier reads heavy on black |
| Pill-shaped badges | `4px` or `8px` radius only |
| Full-saturation orange on dark | Always use `#D95F2B` — never `#FF6600` or similar |
| Multiple accent colors | Orange is the only color. No secondary palette. |
| Body copy in Space Mono | Space Mono is metadata-only — never sentences |
| Nested filled cards | Surfaces are defined by borders, not fills |

---

*Echo Design System · echo.etriplesoft.com · May 2026*