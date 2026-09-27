# AGENTS.md

Christopher Jagoe's personal website. Static site built with Eleventy 3, deployed on Vercel.
Repo: https://github.com/jagoec/personal-website

## Commands

- `pnpm build` — build the site into `_site/`
- `pnpm start` or `pnpm serve` — local dev server with live reload
- `pnpm og:image` — regenerate `src/img/og-default.png` (then commit it)
- **pnpm only** (enforced by a preinstall hook); never use npm or yarn
- `pnpm-workspace.yaml` allows sharp's install script (needed by eleventy-img and the og:image script).
- No test suite or linter. Verify changes with `pnpm build` and inspect the `_site/` output.

## Stack & structure

- Eleventy 3, CommonJS. All config lives in `.eleventy.js` at the repo root.
- Input: `src/` — output: `_site/` (gitignored). Templates are Nunjucks + Markdown.
- Markdown files are processed through Nunjucks (`markdownTemplateEngine: "njk"`), so `{% ... %}` template syntax works inside `.md` content.
- `src/_includes/layout.njk` — the single shared layout and nav (Home / About / Books). The Garden page and posts still build, but are intentionally NOT linked in the nav (hidden, reachable only by direct URL) — do not re-add the link. The `<head>` carries SEO/OG meta (from `src/_data/site.js`) plus the Vercel Web Analytics snippet — do not remove either.
- `src/_data/site.js` — site name / URL / default description; single source of truth for SEO tags.
- `src/sitemap.njk` — builds `/sitemap.xml`; excludes `/garden/*` (intentional — do not re-add).
- `src/robots.txt` — allows all crawlers, points to the sitemap.
- `vercel.json` — sends `X-Robots-Tag: noindex` on `/garden/*` so search engines skip garden pages (intentional — do not remove).
- `scripts/og-image.js` + `src/img/og-default.png` — default Open Graph card (Solarized Light); regenerate with `pnpm og:image` and commit the PNG.
- `src/css/style.css` — the only stylesheet, passthrough-copied to `/style.css`. Solarized Light color palette.
- `src/_data/books.js` — fetches a published Google Sheet as CSV **at build time** (needs network); columns: Title, Author, Finished, Notes. Feeds the Books page.
- `src/garden/*.md` — garden journal posts, with images passthrough-copied from `src/garden/`.

## Conventions

- Garden posts: `src/garden/garden-YYYYMMDD.md` with `title` and `date` (YYYY-MM-DD) frontmatter. Dates are interpreted in America/New_York; render them with the `readableDate` filter.
- URLs are directory-style: `/about/`, `/books/`, `/garden/<post-slug>/`.
- The `image` shortcode (`.eleventy.js`) generates optimized responsive WebP/JPEG — it **throws if `alt` text is missing**. Always pass alt text.
- Excerpts for garden posts are auto-extracted from the first paragraphs if not set in frontmatter.
- Per-page SEO overrides via frontmatter: `description:` (falls back to excerpt, then site default) and `image:` (falls back to `/img/og-default.png`).
- `showStats: true` frontmatter adds an automatic word/character count line to the page (layout.njk + `wordCount`/`charCount` filters in `.eleventy.js`).

## Deployment

- Vercel hosts the site (static output from `_site/`). Pushing to `master` on GitHub triggers a production deploy; PRs get preview deploys (check the PR comments for the preview URL).
- Production URL: https://christopherjagoe.com

## Workflow preference (IMPORTANT)

- **All new features/changes go on a NEW branch** — never commit directly to `master`.
- Flow: create branch → make changes → `pnpm build` to verify → commit → `git push -u origin <branch>` → `gh pr create` → Christopher reviews and merges on github.com.
- Never push to `master` and never merge a PR without Christopher's review. After merge: `git switch master && git pull`, delete the branch.
