# Repository Guidelines

## Project Structure & Module Organization
This monorepo hosts two Astro apps deployed separately on Cloudflare Pages.  
- `site/` — profile and link hub (`src/pages`, `src/lib/rss.ts`, `src/site.config.ts`), output `site/dist/`.  
- `blog/` — Markdown/MDX blog (`src/content/blog`, `src/layouts/BlogPost.astro`, `src/pages/rss.xml.js`), output `blog/dist/`.  
The root `package.json` only wires shared scripts; run `npm install` inside `site/` and `blog/` individually. Scope assets to each app’s `public/` or `src` tree.

## Build, Test, and Development Commands
- `npm run dev:site` / `npm run dev:blog` — wrappers for `npm --prefix <app> run dev`.  
- `npm run build:site` / `npm run build:blog` — install dependencies and execute `astro build`.  
- `npm run build` — runs both builds sequentially; fails fast if either app breaks.  
- `npm --prefix <app> run preview` — serves the built site locally.  
Run `npx astro check` inside each folder when editing TypeScript, content collections, or Astro components.

## Coding Style & Naming Conventions
Stick to Astro + TypeScript defaults: ES modules, 2-space indentation, single quotes, and trailing commas as Prettier would emit. Components stay PascalCase (`BaseHead.astro`), routes are lower-case (`pages/index.astro`, `pages/blog/[...slug].astro`). Shared data/config belongs in `*.config.ts` files with named exports. Blog posts live in `blog/src/content/blog/`, use kebab-case filenames, and must include full frontmatter (`title`, `description`, `pubDate`, `tags`, `draft`).

## Testing Guidelines
There is no Jest/Cypress suite; rely on framework checks. Before opening a PR, run `npm run build:site` and/or `npm run build:blog` (or `npm run build` if both apps changed), then preview via `npm --prefix <app> run preview` to confirm routing and styling. When editing `site/src/lib/rss.ts`, test with real RSS endpoints and remove temporary logging before committing.

## Commit & Pull Request Guidelines
Commit messages use a lightweight conventional prefix (`docs: rewrite README in English`, `fix: rss timeouts`); keep summaries imperative and under 72 characters where possible. PRs should describe the change, call out which app(s) are affected, list verification steps (commands run, screenshots for UI tweaks), and link related issues. Note any required Cloudflare or `SITE_URL` environment updates so deploys stay in sync.

## Deployment & Configuration Tips
Each Cloudflare Pages project must target its own root (`site` or `blog`) with build command `npm run build` and output directory `dist`. Set `SITE_URL` per project to generate correct canonical URLs, RSS feeds, and sitemaps. Do not commit `dist/`; Cloudflare builds assets during deployment.
