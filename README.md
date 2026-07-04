# Shaik Luqman — Portfolio

Personal portfolio of **Shaik Luqman** — full-stack engineer building applied-AI systems, secure infrastructure, and real products. Light, Apple-inspired single-page site — floating product cards, bento grids, and scroll-driven motion with a warm amber accent.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (via `@tailwindcss/vite` — design tokens live in `src/index.css` under `@theme`)
- [Motion](https://motion.dev/) (framer-motion) for all animation, with full `prefers-reduced-motion` support
- [lucide-react](https://lucide.dev/) icons
- Self-hosted fonts via `@fontsource/inter` and `@fontsource/jetbrains-mono` — no font CDN
- Fully static, no backend

## Local development

Requires Node.js 18+.

```bash
npm install
npm run dev        # start dev server at http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## Deploying to Vercel

Zero configuration needed — Vercel auto-detects Vite.

**Option A — Git integration (recommended):**

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repo.
3. Vercel detects the Vite preset (build: `npm run build`, output: `dist`). Click **Deploy**.

**Option B — CLI:**

```bash
npx vercel         # preview deploy
npx vercel --prod  # production deploy
```

## ⚠️ Before you ship

- **Add your résumé at `public/resume.pdf`** — the Résumé buttons in the nav, hero, contact section, and footer all point to `/resume.pdf`.
- **Drop in real repo links** — search for `TODO` in `src/components/Projects.tsx`; both project cards currently point at the GitHub profile as a placeholder.

## Project structure

```
├── index.html                  # SEO meta, OpenGraph/Twitter tags, favicon
├── public/
│   ├── favicon.svg
│   └── resume.pdf              # ← add this yourself (not committed)
└── src/
    ├── main.tsx                # entry: fonts + global CSS + React root
    ├── App.tsx                 # section composition + MotionConfig (reduced motion)
    ├── index.css               # Tailwind + design tokens (@theme) + base styles
    ├── lib/
    │   └── motion.ts           # shared easing, variants, viewport config
    └── components/
        ├── Nav.tsx             # sticky glass nav, scroll progress bar, mobile menu
        ├── Hero.tsx            # word-by-word masked headline + parallax backdrop
        ├── About.tsx           # statement card with quick-facts sidebar
        ├── Skills.tsx          # bento grid (white / dark / amber tiles)
        ├── Projects.tsx        # project data + bespoke animated card artwork
        ├── ProjectCard.tsx     # Apple-style product card (light & dark variants)
        ├── Achievements.tsx    # achievement tiles
        ├── Contact.tsx         # dark finale card with email CTA
        ├── Footer.tsx
        ├── Section.tsx         # numbered shell + parallax ghost index + reveal
        ├── Marquee.tsx         # scroll-velocity outlined tech ticker
        ├── Tilt.tsx            # 3D tilt micro-interaction wrapper
        └── Magnetic.tsx        # magnetic hover wrapper for buttons
```

## Design tokens

Everything is themed through CSS variables in `src/index.css`:

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F6F5F2` | warm off-white page background |
| `card` | `#FFFFFF` | floating cards / tiles |
| `ink` | `#1B1B1E` | primary text |
| `mute` | `#52525B` | secondary text |
| `dim` | `#6E6E76` | captions, mono labels |
| `line` | `#E6E4DD` | hairline borders |
| `noir` | `#101013` | dark contrast cards (AI tile, Suraksha, contact) |
| `brand` | `#F5A623` | bright amber — fills, buttons, graphics |
| `accent` | `#B45309` | deep amber — text-safe links and labels |

Type: **Inter** for UI and headings, **JetBrains Mono** for section numbers, tech tags, and technical labels.
