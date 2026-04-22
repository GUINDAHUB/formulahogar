---
name: formula-hogar-brand
description: Apply Fórmula Hogar brand identity to any React component, page, or UI element. Use this skill whenever building or styling anything for the FórmulaHogar app — including layouts, buttons, cards, typography, color choices, icons, or any visual element. Even if the user doesn't mention "brand" explicitly, always consult this skill when working on the FórmulaHogar React project.
---

# Fórmula Hogar — Brand Guidelines for React Development

## Brand Concept

FórmulaHogar helps people access their first home. The brand communicates that homeownership is not a promise — it's the logical outcome of a well-built model. The identity is direct, clear, and human. Avoid aspirational luxury aesthetics; lean into approachable realism.

**Brand tagline:** "Tu propio hogar, es posible"

---

## Color Palette

Use these CSS custom properties. Define them in your root stylesheet or Tailwind config.

```css
:root {
  /* Primary */
  --color-brand:        #BFFF00; /* Lime green — the defining brand color */

  /* Grayscale */
  --color-gray-100:     #EBEBEB;
  --color-gray-200:     #D6D6D6;
  --color-gray-400:     #9D9D9D;
  --color-gray-600:     #545454;
  --color-black:        #141313;
  --color-white:        #FFFFFF;
}
```

### Color Usage Rules

| Context | Background | Text/Icon |
|---|---|---|
| Primary CTA buttons | `--color-brand` (#BFFF00) | `--color-black` (#141313) |
| Dark sections / hero | `--color-black` (#141313) | `--color-white` |
| Light/default background | `--color-gray-100` (#EBEBEB) | `--color-black` |
| Cards / surfaces | `--color-white` | `--color-black` |
| Muted text | — | `--color-gray-600` (#545454) |
| Dividers / borders | `--color-gray-200` (#D6D6D6) | — |

**Critical rule:** The brand green (#BFFF00) is HIGH contrast. Never use it as a text color on white. Only use it as a background or accent fill with black text on top.

---

## Typography

Import both fonts from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Or in CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
```

### Font Roles

| Role | Font | Weight | Use case |
|---|---|---|---|
| Display / Hero headings | Libre Baskerville | 700 | Large titles, hero text |
| Section headings (H2–H3) | Libre Baskerville | 400–700 | Section titles, card headings |
| UI body text | Manrope | 400–500 | Paragraphs, descriptions |
| Labels, captions, nav | Manrope | 500–600 | Buttons, tags, navigation |
| Data / stats | Manrope | 700–800 | Numbers, KPIs, metrics |

```css
.font-display  { font-family: 'Libre Baskerville', Georgia, serif; }
.font-body     { font-family: 'Manrope', Arial, sans-serif; }
```

---

## Brand Assets Catalog

All brand assets live in `.claude/skills/formula-hogar-brand/assets/`. Reference these files when implementing logos, icons, favicons, or custom fonts in the project. When copying assets into the app (e.g. to `/public/`), use these source files.

### Logo Files (Full logo = symbol + wordmark)

| File | Description | When to use |
|------|-------------|-------------|
| `Logo Principal Color Fórmula Hogar@2x.png` (1.7 MB) | Full-color logo: green ƒ icon + black "FórmulaHogar" wordmark | Default on white/light backgrounds — header, footer, landing pages |
| `Logo Princal Negativo Fórmula Hogar@2x.png` (1.6 MB) | Negative logo: white icon + white wordmark | On black, dark, or photographic backgrounds |
| `Logo Principal a una tinta Fórmula Hogar@2x.png` (1.7 MB) | One-tint logo: all black | Single-color printing, or on `#BFFF00` brand-green backgrounds |

All logo files are @2x retina-ready PNGs with transparency.

### Icon Files (Symbol only — the ƒ rounded square)

| File | Description | When to use |
|------|-------------|-------------|
| `Icono Color Formula Hogar.png` (946 KB) | Full-color icon: `#BFFF00` green bg + black ƒ glyph | Default app icon, favicons, light backgrounds |
| `Icono Negativo Fórmula Hogar.png` (860 KB) | Negative icon: white on transparent | Dark or photographic backgrounds |
| `Icono a una tinta Fórmula Hogar.png` (902 KB) | One-tint icon: all black | Watermarks, single-color contexts |
| `Icono Redes Color Fórmula Hogar.png` (35 KB) | Social media icon (optimized, small) | Open Graph images, social previews, profile pictures, og:image |

### Favicon Package

| File | Size | Where to place |
|------|------|----------------|
| `favicon.ico` (15 KB) | Multi-size ICO | `/app/favicon.ico` (Next.js auto-detects) |
| `favicon-32x32.png` (1 KB) | 32×32 PNG | `<link rel="icon" sizes="32x32">` in layout metadata |
| `favicon-16x16.png` (0.5 KB) | 16×16 PNG | `<link rel="icon" sizes="16x16">` in layout metadata |
| `favicon-apple-touch-icon.png` (7 KB) | Apple Touch Icon | `<link rel="apple-touch-icon">` in layout metadata |

### Brand Fonts (Variable Font TTF files)

| File | Font Family | Weight Range | Role |
|------|-------------|-------------|------|
| `Manrope-VariableFont_wght.ttf` (167 KB) | Manrope | 400–800 | Body text, UI labels, buttons, navigation, stats/KPIs |
| `LibreBaskerville-VariableFont_wght.ttf` (173 KB) | Libre Baskerville | 400–700 | Display headings, hero text, section titles, card headings |

These TTF files can be self-hosted via `@font-face` or placed in `/public/fonts/` for better performance and privacy instead of loading from Google Fonts.

### Which asset to pick (quick decision tree)

- **Full logo in header/footer?** → `Logo Principal Color` (light bg) or `Logo Princal Negativo` (dark bg)
- **Just the icon for tab, avatar, or small space?** → `Icono Color` or `Icono Negativo`
- **Social preview / OG image?** → `Icono Redes Color` (already optimized at 35 KB)
- **Setting up favicons?** → Copy the 4 favicon files to their respective locations
- **Self-hosting fonts?** → Use the `.ttf` variable font files with `@font-face`

### Public Directory Assets (already deployed)

These assets are already in the app's `/public/` directory:

| File | Description |
|------|-------------|
| `/public/logo-icon.png` | Large logo icon used in header/product areas |
| `/public/hero-house.png` | Hero section background — real house photography |
| `/public/logos/logo1.png` through `logo5.png` | Partner/client logos for the trust logo slider |

---

## Logo Usage

The logo has two parts: a **symbol** (rounded square with the ƒ glyph) + **wordmark** ("FórmulaHogar" in Libre Baskerville).

### Symbol

- Shape: rounded square (`border-radius: 16px` for typical app sizes)
- Background: `#BFFF00` (brand green) for full-color version
- Background: `#141313` (black) for one-tint version
- The ƒ glyph is always black inside the green icon; white inside the black icon
- Do NOT use the symbol in any other color

### Wordmark

- Set in Libre Baskerville, regular or bold
- Always black on light backgrounds, always white on dark backgrounds
- Never render the wordmark in any other color (no red, blue, green, etc.)

### Spacing (area de respeto)

The clear space around the logo equals the width of the gap between the symbol and the wordmark. Never place other elements closer than this distance.

### Logo versions

```
Full color:     [#BFFF00 icon] + [black "FórmulaHogar"]  → on white/light bg
Negative:       [white icon]   + [white "FórmulaHogar"]  → on black or dark bg
One-tint dark:  [black icon]   + [black "FórmulaHogar"]  → for single-color printing
One-tint green: [black icon]   + [black "FórmulaHogar"]  → on #BFFF00 background
```

---

## Iconography

Use the **Phosphor Icons** library, `fill` variant, in black (`#141313`).

```bash
npm install @phosphor-icons/react
```

```jsx
import { House, Buildings, ChartBar, Envelope } from '@phosphor-icons/react';

// Always use weight="fill"
<House size={24} weight="fill" color="#141313" />
```

On dark backgrounds, use white icons (`color="#FFFFFF"`). On brand-green backgrounds, use black icons.

---

## Component Patterns

### Primary Button

```jsx
// CTA — brand green background, black text, Manrope font
<button style={{
  backgroundColor: '#BFFF00',
  color: '#141313',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 700,
  fontSize: '15px',
  padding: '12px 24px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
}}>
  Calcula tu fórmula
</button>
```

### Secondary Button (outlined)

```jsx
<button style={{
  backgroundColor: 'transparent',
  color: '#141313',
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  fontSize: '15px',
  padding: '12px 24px',
  borderRadius: '8px',
  border: '2px solid #141313',
  cursor: 'pointer',
}}>
  Saber más
</button>
```

### Card

```jsx
<div style={{
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  border: '1px solid #D6D6D6',
  padding: '24px',
  fontFamily: "'Manrope', sans-serif",
}}>
  <h3 style={{ fontFamily: "'Libre Baskerville', serif", color: '#141313' }}>
    Título de la tarjeta
  </h3>
  <p style={{ color: '#545454', fontSize: '14px', lineHeight: 1.6 }}>
    Descripción del contenido.
  </p>
</div>
```

### Stat / KPI Block

```jsx
<div style={{ fontFamily: "'Manrope', sans-serif" }}>
  <span style={{ fontSize: '40px', fontWeight: 800, color: '#141313' }}>+500</span>
  <p style={{ fontSize: '14px', color: '#545454', fontWeight: 500 }}>hogares felices</p>
</div>
```

### Section with brand accent

```jsx
// Use the brand green sparingly — as a highlight block or accent strip
<section style={{ backgroundColor: '#BFFF00', padding: '48px 32px' }}>
  <h2 style={{ fontFamily: "'Libre Baskerville', serif", color: '#141313' }}>
    Tu propio hogar, es posible
  </h2>
</section>
```

---

## Photography / Imagery Style

When selecting or referencing images in the app (hero banners, testimonials, etc.):

- **Show:** Real moments of people accessing their first home for the first time
- **Show:** Couples or recently independent people surrounded by moving boxes, natural light
- **Show:** Unfinished spaces, everyday situations — relatable, not perfect
- **Avoid:** Aspirational luxury interiors, staged perfection, stock-photo genericness
- **Tone:** Human, credible, warm — the message is "it's possible", not "it's glamorous"
Images should feel like documentary photography, not advertising.

---

## Tailwind Config (if using Tailwind CSS)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand:      '#BFFF00',
        'gray-100': '#EBEBEB',
        'gray-200': '#D6D6D6',
        'gray-400': '#9D9D9D',
        'gray-600': '#545454',
        'near-black': '#141313',
      },
      fontFamily: {
        display: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body:    ['Manrope', 'Arial', 'sans-serif'],
      },
    },
  },
}
```

---

## Quick Reference Cheatsheet

```
BRAND GREEN:  #BFFF00   → backgrounds, CTAs, accents (black text on top)
BLACK:        #141313   → primary text, dark backgrounds
LIGHT BG:     #EBEBEB   → page backgrounds, subtle fills
MUTED TEXT:   #545454   → secondary text, captions
BORDER:       #D6D6D6   → card borders, dividers

HEADING FONT: Libre Baskerville (serif)
BODY FONT:    Manrope (sans-serif)

ICONS:        Phosphor Icons — fill weight — black (#141313) or white on dark
LOGO:         Never in color other than black or white. Green only for icon bg.
TAGLINE:      "Tu propio hogar, es posible"

ASSETS PATH:  .claude/skills/formula-hogar-brand/assets/
  Logos:      Logo Principal Color / Negativo / Una tinta (@2x PNG)
  Icons:      Icono Color / Negativo / Una tinta / Redes (PNG)
  Favicons:   favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon
  Fonts:      Manrope-VariableFont_wght.ttf, LibreBaskerville-VariableFont_wght.ttf
```
