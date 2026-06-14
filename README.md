# Kech Mose — Website

Marketing website for **Kech Mose**, a Nigerian real estate, construction & investment company.
Positioning: *"The future of real estate,"* built on transparency. Headquartered in Nigeria, global outlook.

🔗 **Live site:** _add the URL once deployed_ · intended production domain: `https://www.kechmose.com`

---

## Stack

- **Static multi-page site** — plain HTML + CSS + vanilla JS. No build step, no framework, no bundler.
- Shared `assets/css/styles.css` and `assets/js/app.js` across every page.
- CDN libraries: **GSAP 3.12.5 + ScrollTrigger**, **Three.js r128** (home hero only), **Lenis 1.0.42** (smooth scroll).
- Fonts via Google Fonts: **Montserrat** (display) + **Fira Sans** (body).
- Degrades gracefully: if the CDN libraries fail, all content stays visible — only motion/3D is skipped.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — interactive 3D-blueprint hero + overview of every section |
| `about.html` | Story, mission/vision/values, the trust gap, founder + team |
| `services.html` | Real Estate / Construction / Investment |
| `projects.html` | Nexora Crest + Eco Savannah |
| `contact.html` | Contact details, enquiry form, locations |

Shared `assets/`, `favicon.ico`, and per-page `<head>` metadata (favicons, Open Graph / Twitter Card,
canonical link, `Organization` JSON-LD).

## Run locally

No build needed. Either:

```bash
# Open directly
start index.html          # Windows  (use `open` on macOS)

# …or serve the folder (recommended, so relative paths/fetch behave)
npx serve
```

Requires internet to load the CDN libraries.

## Deploy

It's a plain static site served from the repo root — no build command, no output folder.

**GitHub Pages (simplest):** repo **Settings → Pages → Build and deployment → Source: _Deploy from a branch_ → Branch: `main` / `/ (root)`** → Save.
Live within a minute at `https://immallexx.github.io/Kech-Mose-Website/`.
For the custom domain, set `www.kechmose.com` under Pages → Custom domain and point a `CNAME` DNS record at `immallexx.github.io`.

**Netlify / Cloudflare Pages:** connect the repo (or drag-and-drop the folder). Build command: _none_; publish directory: `/`.

## Accessibility

Skip link, visible `:focus-visible` rings, `aria-current` on the active nav item, an `inert` mobile menu
(Escape-to-close + focus management), and WCAG-AA-minded contrast. Respects `prefers-reduced-motion`.

## Open to-dos

- **Contact form** — wired for [Formspree](https://formspree.io) (one ID to paste into `contact.html`); falls back to a mailto link until then.
- **Team** — `about.html` still uses placeholder names/photos (`team1–8.jpg`); swap in real people (4:5 photos).

## Notes

- Brand system, JS animation hooks, and conventions are documented in [`CLAUDE.md`](CLAUDE.md).
- Not for production: `hero-2d-demo.html` (an alternative 2D hero preview) and `.claude/` (local preview-server config).

---

© Kech Mose — Real Estate · Construction · Investment
