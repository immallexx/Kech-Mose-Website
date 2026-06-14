# Kech Mose — Website

Marketing website for **Kech Mose**, a Nigerian real estate, construction & investment company.
Positioning: *"The future of real estate,"* built on transparency. Headquartered in Nigeria, global outlook.

## Stack
- **Static multi-page site.** Plain HTML + CSS + vanilla JS. No build step, no framework, no bundler.
- Shared `assets/css/styles.css` and `assets/js/app.js` across every page.
- Libraries via CDN: **GSAP 3.12.5 + ScrollTrigger**, **Three.js r128** (home hero only), **Lenis 1.0.42** (smooth scroll).
- Fonts via Google Fonts: **Montserrat** (display/headings) + **Fira Sans** (body).

## Run / preview
- Open `index.html` directly, or serve the folder: `npx serve` (then open the printed URL).
- Live reload during edits: VS Code "Live Server" or `npx live-server`.
- Requires internet to load the CDN libraries. The site degrades gracefully if they fail — all content stays visible, only motion/3D is skipped.

> **Do not deploy these local-only files** (they're dev helpers, not part of the production site):
> - `hero-2d-demo.html` — an isolated `noindex` preview of an alternative 2D-canvas blueprint homepage hero (not linked from anywhere; kept for comparison while we decide between it and the live 3D hero).
> - `.claude/` (`launch.json`, `serve.ps1`) — local static-preview server config.
>
> The deployable site is just the five `*.html` pages, `assets/`, `favicon.ico`, and `CLAUDE.md` is optional.

## File structure
```
index.html      Home — Three.js hero + overview of every section, links out to detail pages
about.html      Story, mission/vision/values, trust gap, Founder + full team grid
services.html   Real Estate / Construction / Investment (alternating feature rows)
projects.html   Nexora Crest + Eco Savannah (full specs)
contact.html    Contact details, enquiry form, locations
assets/css/styles.css   All styling (single file)
assets/js/app.js        All behaviour (single IIFE)
assets/img/             Photos, logos, generated team placeholders
```
Pages are assembled from shared partials (nav, mobile menu, footer). If you change the nav/footer, change it on **all five pages** to keep them in sync.

Each page `<head>` also carries favicons, **per-page** Open Graph + Twitter Card tags + `<link rel="canonical">`, and an `Organization` JSON-LD block (the JSON-LD is identical across pages; the OG/Twitter title, description and `og:url` are page-specific — keep them matching each page's `<title>`/`<meta description>`). Social share image: `assets/img/og.jpg` (1200×630, generated from `hero.jpg` + the white lockup). Absolute URLs assume the site is served from `https://www.kechmose.com/` — update them if the domain changes.

## Brand system — do not drift from this
Colours (CSS variables in `:root`, do not introduce new hues without reason):
- `--teal #447871` — primary / CTAs / accents (the brand's defining colour)
- `--teal-lum #6fb9ad` — a lighter screen-tint of teal, used sparingly for glows/accents on dark backgrounds only
- `--stone #8A8474` — supporting text, captions, borders
- `--forest #0D2626` — primary dark background
- `--forest-2 #0a1d1d` — deeper dark panels
- `--ivory #F5F3EF` — light sections
- `--white #FFFFFF`, `--charcoal #1A1A1A` (body text on light)

Typography: **Montserrat** for all headings/labels/buttons (weights 400–800), **Fira Sans** for body copy (300–500). Headings are intentionally restrained in size — keep them that way; don't inflate them.

Logo: `assets/img/lockup_white.png` (full lockup, on dark), `sym_white.png` / `sym_color.png` (standalone K symbol). The mark must never be recoloured, stretched, rotated, or given effects.

Tone of voice (for any new copy): lead with data, not promises. **Avoid** the words *guaranteed, 100%, no-risk, luxury, world-class*. **Prefer** *structured, transparent, data-led, disciplined, verified, trusted, delivered*.

## JS conventions (how animation is wired)
`app.js` reads these attributes — reuse them rather than writing new animation code:
- `data-reveal` — fades/translates element up on scroll.
- `data-split` — splits a heading into words and rises them in (skips `.hero`, handled by the intro timeline).
- `data-img` — clip-path reveal for image containers.
- `data-parallax` + `data-speed="-0.1"` — scroll parallax on inner images.
- `data-count="6"` — animated number count-up.
- `data-mag` — magnetic hover (desktop only).

Element IDs the script hooks into: `#pre` (preloader, home only), `#hero-canvas` + `#heroBg` (Three.js 3D-blueprint hero — a wireframe building massing on a receding site grid, on a slow turntable steered by the mouse; home only), `#pheroBg` (sub-page banner parallax), `#phero-canvas` (sub-page hero blueprint grid — a lightweight 2D `<canvas>` drafting grid with ruler ticks + a drifting plumb/level crosshair; the static grid is pre-rendered to an offscreen buffer, with a left-to-right draw-in; sub-pages only), `#ctaBg` (CTA banner), `#marq` (marquee), `#nav`, `#burger`, `#menu`, `#enquiry` (contact form — AJAX submit to Formspree with mailto fallback).

Rules:
- Animations must only **enhance** — never hide content via CSS that only JS reveals. If a library fails to load, the page must still read correctly.
- Respect `prefers-reduced-motion` (already handled) and disable cursor/3D on touch devices (already handled).
- Mobile-first; type uses `clamp()`; grids collapse at 1024px and 768px breakpoints.
- **Accessibility (keep it working):** every page has a `.skip` "Skip to content" link targeting `<main id="top" tabindex="-1">`, and a visible keyboard focus ring (`:focus-visible`, teal-lum on dark / teal on `.light` sections — see the *ACCESSIBILITY* block at the end of `styles.css`). The active nav link carries `aria-current="page"`. The mobile menu is kept out of the tab order with `inert` while closed; `app.js` toggles `inert` + `aria-expanded`, closes on `Escape`, and moves focus (into the menu on open, back to `#burger` on close). Colour choices target WCAG AA — when adding text, check contrast against its background (`--stone` on `--forest` and `--teal` eyebrows on `.light` are deliberately near the 4.5:1 line; don't darken backgrounds behind them).

## Content source
All copy is drawn from the official Kech Mose company profile. Real assets in `assets/img/`: the neon hero building, the Nexora Crest render, the Eco Savannah aerial, the founder headshot (`founder.jpg`), and the three service images.

Founder: **Emmanuel Ikechi Moses**, CEO & Founder (also founded 22Eleven).
Contact: kechmose@gmail.com · +234 903 251 9869 / +234 802 143 6728 · www.kechmose.com · @kechmose

## Open to-dos
1. **Contact form — DONE (needs your form ID to go live).** `contact.html` now POSTs to Formspree via the handler in `app.js`. Replace `your-form-id` in the form's `action` (create a free form at https://formspree.io) to receive enquiries by email. Until then it gracefully falls back to opening the visitor's mail app addressed to kechmose@gmail.com.
2. **Replace the team** — the 8 members on `about.html` use placeholder names/roles and generated duotone portraits (`team1.jpg`–`team8.jpg`). Swap in real names, roles, and photos (keep 4:5 aspect ratio). *(Still pending — needs real data.)*
3. **Real social links — DONE.** The `contact.html` icons now point to instagram.com/kechmose, facebook.com/kechmose, x.com/kechmose and wa.me/2349032519869. Update the handles/number if any differ.
4. **Favicon — DONE.** Generated from `sym_color.png`: `favicon.ico` (root) plus `assets/img/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, all linked in every page `<head>`.
5. **Optional:** add more project photos, a per-project detail page, and deploy (Netlify/Vercel/Cloudflare Pages — drag-and-drop the folder).
