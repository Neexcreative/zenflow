---
name: Zenflow
description: A focus and flow environment for deep work
colors:
  void-base: "#08080f"
  bg-surface: "#0f0f16"
  bg-elevated: "#14141b"
  deep-indigo: "#6c63ff"
  arctic-teal: "#00d4aa"
  warm-amber: "#f59e0b"
  primary-text: "#eeeeff"
  secondary-text: "#7777aa"
  border-subtle: "#16161c"
  border-accent: "#2b2863"
typography:
  display:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "normal"
  headline:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 300
    lineHeight: 1.2
  title:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  body:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.9
  label:
    fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    letterSpacing: "0.12em"
  mono:
    fontFamily: "'Space Mono', ui-monospace, monospace"
    fontSize: "36px"
    fontWeight: 400
    letterSpacing: "-0.05em"
rounded:
  pill: "999px"
  widget: "18px"
  modal: "24px"
  card: "20px"
  input: "12px"
  action: "10px"
  icon: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "28px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "#6c63ff"
    textColor: "#eeeeff"
    rounded: "10px"
    padding: "0 16px"
    height: "34px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#7777aa"
    rounded: "8px"
    padding: "6px"
  widget-card:
    backgroundColor: "#0f0f16"
    textColor: "#eeeeff"
    rounded: "18px"
    padding: "14px 18px 18px"
  input-field:
    backgroundColor: "#131319"
    textColor: "#eeeeff"
    rounded: "12px"
    padding: "0 14px"
    height: "34px"
  chip-active:
    backgroundColor: "#2a2866"
    textColor: "#eeeeff"
    rounded: "999px"
    padding: "8px 14px"
  chip-inactive:
    backgroundColor: "transparent"
    textColor: "#7777aa"
    rounded: "999px"
    padding: "8px 14px"
---

# Design System: Zenflow

## 1. Overview

**Creative North Star: "The Midnight Studio"**

Zenflow is a professional's late-night workspace — dark, polished, everything exactly where it belongs. The interface should feel like premium gear in a quiet room: intentional, unhurried, and completely in service of the work happening inside it. When a user opens Zenflow, the environment should already be on their side.

The atmosphere is the product. Background themes, ambient sounds, and the breathing mesh animation are not decoration — they are first-class UI. Every design decision defers to the ambient experience. A new widget, a new panel, a new modal must first ask: does this interrupt the flow, or does it extend it?

This system explicitly rejects gamified productivity: no achievement toasts, no streak counters, no XP bars, no confetti. Zenflow earns loyalty through experience, not reward loops. It also rejects the generic dark-SaaS aesthetic — purple-gradient hero sections, neon borders, glassmorphism for its own sake. Every glass surface here must earn its opacity.

**Key Characteristics:**
- Near-void backgrounds (#08080f) with barely-there glass surfaces
- Two named accents: Deep Indigo (primary) + Arctic Teal (active/live states)
- Warm Amber reserved exclusively for upgrade/premium signals
- Outfit (light weight) + Space Mono pairing — calm prose + precise numbers
- Flat by default; depth comes from border glow, transparency, and blur — not shadow height
- Motion is ambient, not celebratory: mesh pulse, colon blink, weather animation — never a pop-in or confetti

## 2. Colors: The Void Palette

A near-monochromatic dark base with three precise accent roles. The dark void is the canvas; accents appear rarely and deliberately.

### Primary
- **Deep Indigo** (`#6c63ff`): The identity color. Used for active states, the sidebar logo, gradient buttons, accent borders, and the ambient mesh glow. Appears as a gradient endpoint paired with Arctic Teal on CTAs. Its opacity variant (`rgba(108,99,255,0.16)`) paints selected chips, active sidebar items, and focused inputs.

### Secondary
- **Arctic Teal** (`#00d4aa`): Live, active, flowing states. Playing indicators, active navigation items, quote attribution, weather city label, task completion. When something is *happening* in Zenflow — a timer running, a sound playing — Arctic Teal marks it.

### Tertiary
- **Warm Amber** (`#f59e0b`): Upgrade and premium signals only. The Plus badge, upgrade CTA buttons, the coffee widget draggable "passive" state. Never used for standard interactive elements.

### Neutral
- **Void Base** (`#08080f`): The deepest background. Page background, sidebar panel, modal overlays. Near-black with a barely perceptible purple undertone.
- **Glass Surface** (`#0f0f16`): Widget card backgrounds. Achieved via `rgba(255,255,255,0.028)` over Void Base.
- **Glass Elevated** (`#14141b`): Modal card backgrounds, elevated panels. `rgba(255,255,255,0.05)` over Void Base.
- **Primary Text** (`#eeeeff`): Headlines, widget titles, primary content. Warm white with a blue lean — never pure white.
- **Secondary Text** (`#7777aa`): Labels, metadata, placeholder states, inactive icons. Muted purple-grey.
- **Border Subtle** (`#16161c`): Widget card borders, dividers, input borders. `rgba(255,255,255,0.055)` — barely visible, structural.
- **Border Accent** (`#2b2863`): Focused inputs, hovered widget cards. `rgba(108,99,255,0.35)` — Indigo-tinted.

### Named Rules
**The One Accent Rule.** Deep Indigo and Arctic Teal never compete on the same element. Indigo owns identity and selection; Teal owns live state. A button that uses both uses them as a gradient — never side-by-side at equal weight.

**The Amber Cordon.** Warm Amber is reserved for upgrade and premium signals. It must not appear in interactive states, focus rings, hover effects, or any element that a free-tier user sees as a normal action prompt.

## 3. Typography

**Display/Body Font:** Outfit (weights 200, 300, 400, 600)
**Mono Font:** Space Mono (weights 400, 700)

**Character:** Outfit at weight 300 reads as premium restraint — contemporary, approachable, unhurried. Space Mono grounds the time and number readouts in precision: clocks, Pomodoro countdowns, and session data get the mono treatment to feel exact and trustworthy. The pairing is calm prose alongside precise numbers.

### Hierarchy
- **Display** (weight 200, `clamp(2rem, 5vw, 3.5rem)`, line-height 1): Large weather temperature readouts, hero numbers. The lightest weight — reads like a number engraved rather than printed.
- **Headline** (weight 300, `28px`, line-height 1.2): Modal titles (`h2` in `.modal-head`). The system's largest heading weight. Felt as quiet confidence, not announcement.
- **Title** (weight 400, `16px`, line-height 1.4): Side panel card headings, task section headers. The only weight that reads as "heading" at small scale.
- **Body** (weight 300, `14px`, line-height 1.9): Notes textarea, modal body copy, feature lists. The generous line-height (1.9) is intentional — it breathes. Max line length: 65ch in reading contexts.
- **Label** (weight 500, `10px`, letter-spacing `0.12em`, uppercase): Widget card headers (`FOCUS`, `WEATHER`, `NOTES`), sidebar labels. The all-caps + tracking treatment creates quiet visual hierarchy without increasing size.
- **Mono** (Space Mono 400, `36px` for clock / Pomodoro; `20px` for seconds; `40px` for pricing): Numeric readouts only. Letter-spacing `-0.05em` to offset Space Mono's naturally wide tracking.

### Named Rules
**The Featherweight Rule.** Default to weight 300. Use 400 only for titles and interactive control labels. Use 600 only for sidebar logo and pricing strong values. Never use 700 except in Space Mono bold accents (e.g. keyboard shortcut displays).

**The Mono Boundary.** Space Mono is for numbers and code-adjacent labels only: clock, timer, keyboard shortcut hints, pricing, monospace input fields. It must not appear in prose, navigation items, or widget body copy.

## 4. Elevation

Flat by default. Depth is expressed through background transparency, backdrop-filter blur, and border glow — not shadow height. The design vocabulary has no traditional drop shadows for structural hierarchy.

**The void is the foundation.** Every surface floats in `#08080f` at a different opacity level. Glass Surface (`rgba(255,255,255,0.028)`) for resting widgets; Glass Elevated (`rgba(255,255,255,0.05)`) for modals and overlays. Blur (typically `backdrop-filter: blur(24px)`) creates the frosted separation between layers.

Shadows exist only as ambient accent glow — not to communicate height, but to signal identity or hover feedback.

### Shadow Vocabulary
- **Widget ambient** (`0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`): Default widget card shadow. The inset top highlight simulates a glass edge.
- **Widget hover** (`0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(108,99,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)`): Adds a faint Indigo glow on hover — proximity to the surface, not elevation.
- **Accent glow** (`0 10px 30px rgba(108,99,255,0.25)`): Logo mark, primary CTA buttons, sidebar logo. Signals "identity", not depth.
- **Teal pulse glow** (`0 0 14px rgba(0,212,170,0.5)`): Custom cursor dot, playing indicators. Live-state signal only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The ambient shadow on widget cards is structural (glass edge simulation), not elevation. Add Indigo glow on hover only — never at rest. If something needs a visible shadow at rest, reconsider whether it belongs in the design at all.

## 5. Components

### Buttons
Buttons in Zenflow are small, purposeful, and rarely the most prominent element on screen. They defer to the ambient environment.

- **Shape:** Gently rounded (10px radius). Pills (999px) reserved for filter chips and upgrade CTAs only.
- **Primary (btn-accent):** Gradient `linear-gradient(135deg, rgba(108,99,255,0.95), rgba(0,212,170,0.8))` background; white text; 34px height; 16px horizontal padding. Carries a Deep Indigo glow shadow (`0 10px 30px rgba(108,99,255,0.25)`). On hover: `translateY(-1px)` + shadow intensity increase.
- **Ghost (btn-ghost):** No background, no border. Secondary text color (`#7777aa`) for icon buttons (6px padding, 8px radius). On hover: `rgba(255,255,255,0.07)` fill + Primary Text color. Used for header icon buttons, widget action icons.
- **Header chip:** 32px height, inline-flex, `rgba(255,255,255,0.043)` background, 1px Border Subtle border, 8px radius, 12px/400 text. On hover/active: Indigo-tinted background + Indigo border.

### Chips / Pills
Filter state and settings selection use pill-shaped chips (999px radius).

- **Active state:** `rgba(108,99,255,0.16)` background, 1px `rgba(108,99,255,0.35)` border, Primary Text color.
- **Inactive state:** Transparent background, 1px Border Subtle border, Secondary Text color.
- **Size:** `padding: 8px 14px`, `font-size: 11px`, `letter-spacing: 0.08em`, uppercase.

**The No-Decoration Rule.** Chips carry no icons, no indicators, no dots. The active/inactive border + color shift is the entire vocabulary.

### Cards / Widget Containers
The primary repeating unit of the interface.

- **Corner Style:** Gently curved (18px — `--radius`). The system's signature shape.
- **Background:** Glass Surface (`rgba(255,255,255,0.028)`) with `backdrop-filter: blur(24px)`.
- **Shadow:** Widget ambient shadow at rest; widget hover shadow on `translateY(-2px)` lift.
- **Border:** 1px Border Subtle (`rgba(255,255,255,0.055)`) at rest; transitions to Border Accent (`rgba(108,99,255,0.33)`) on hover.
- **Internal Padding:** `14px 18px 0` for the header; `12px 18px 18px` for the body.
- **Header:** 10px/500/uppercase/0.12em tracking label in Secondary Text; right-slotted ghost icon actions.

### Inputs / Fields
- **Style:** `rgba(255,255,255,0.04)` background, 1px Border Subtle border, 12px radius. No label above the field — context-implied.
- **Focus:** Border shifts to Border Accent (`rgba(108,99,255,0.35)`); background lightens slightly to `rgba(255,255,255,0.057)`. No glow ring.
- **Placeholder:** Secondary Text at 35% opacity (`rgba(238,238,255,0.35)`).
- **Disabled:** Not explicitly styled — the field is visually identical but inert. Avoid disabled states in favor of contextual hiding.

### Navigation (Sidebar)
A fixed 52px-wide icon sidebar. Navigation is implied, not labeled, by default.

- **Items:** 36px height, 100% width, 10px radius, 12px horizontal padding. Icon-only in collapsed state; labels expand in wider viewports.
- **Default:** Secondary Text color, no background.
- **Hover:** `rgba(255,255,255,0.05)` background, Primary Text color.
- **Active:** `rgba(108,99,255,0.15)` background, Arctic Teal color.
- **Upgrade item:** Warm Amber color (the only non-standard color in the nav).
- **Bottom section:** Same item style, separated by a 1px `rgba(255,255,255,0.05)` divider line.

### Signature: Ambient Background System
The five background themes (`default`, `deep-focus`, `sunset-flow`, `rainy-night`, `minimal-dark`) are radial gradient compositions applied to `.app-shell`. The `ambient-mesh` overlay — a fixed, pointer-events-none layer with pulsing elliptic gradients — animates at 20s ease-in-out infinite alternate on top of every theme.

**The Ambient Priority Rule.** Background theme changes and ambient mesh animations must never be blocked by UI state. Modals, panels, and sidebars use semi-transparent backgrounds and blur — never opaque fills that kill the ambient layer underneath.

## 6. Do's and Don'ts

### Do:
- **Do** use `backdrop-filter: blur(24px)` on every glass surface — widget cards, modals, header, sidebar. The blur is load-bearing; it separates layers without color contrast.
- **Do** treat Arctic Teal (`#00d4aa`) as the live/active signal. Any running process, playing media, or active timer gets a Teal treatment.
- **Do** keep Outfit at weight 300 as the default. The lightness is the brand. Reach for 400 only when a title must read as a heading.
- **Do** animate widget card hover as `translateY(-2px)` — the slight lift is the interface's primary gesture language.
- **Do** use Space Mono for all numeric readouts: clocks, countdown timers, pricing, keyboard hints.
- **Do** respect `prefers-reduced-motion`. The ambient mesh, weather animations, Pomodoro dial, and vinyl spin all have motion-off states. Expand this coverage with every new animated feature.
- **Do** let the ambient layer show through every surface. New components must have semi-transparent backgrounds — never solid fills that occlude the background theme.
- **Do** use uppercase labels (10px/500/0.12em tracking) as the only heading treatment at small scale. It works because Outfit 500 uppercase at 10px reads as purposeful, not aggressive.

### Don't:
- **Don't** add gamification mechanics — achievement toasts, streak counters, XP bars, level-up animations, or confetti. This is Zenflow's primary anti-pattern. Per PRODUCT.md: *"these feel juvenile and pull attention away from the work."*
- **Don't** use Warm Amber (`#f59e0b`) for anything a free-tier user interacts with in a normal session. It is the upgrade/premium signal exclusively.
- **Don't** place Deep Indigo and Arctic Teal side-by-side at equal saturation. They coexist as a gradient on primary buttons; otherwise they have distinct, non-competing roles.
- **Don't** add structural box-shadows that simulate real-world elevation (large blur, significant offset, dark color). The system is flat-by-default. If you reach for `box-shadow: 0 16px 40px rgba(0,0,0,0.5)`, stop and ask whether glassmorphism + border glow achieves the same result.
- **Don't** use solid opaque fills for any overlay, panel, or modal background. The ambient layer must always breathe through. Minimum: `rgba` + `backdrop-filter: blur(...)`.
- **Don't** use Space Mono for prose, navigation labels, or widget body copy. It belongs to numbers and precision readouts only.
- **Don't** interrupt the ambient environment with celebratory, alarming, or high-motion UI patterns. State changes should feel like weather — gradual and atmospheric — not like alerts.
- **Don't** design for the list: avoid feature-checklist UI that emphasizes quantity over experience. Every new widget or panel must first ask whether it reduces cognitive load or adds to it.
