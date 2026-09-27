# AGENTS.md

Christopher Jagoe's personal website. Static site built with Eleventy 3, deployed on Vercel.
Repo: https://github.com/jagoec/personal-website

## Commands

- `pnpm build` — build the site into `_site/` **and run Pagefind** to generate the client-side search index (`_site/pagefind/`)
- `pnpm start` or `pnpm serve` — local dev server with live reload (**no search** — Pagefind only runs on `pnpm build`)
- `pnpm og:image` — regenerate `src/img/og-default.png` (then commit it)
- **pnpm only** (enforced by a preinstall hook); never use npm or yarn
- `pnpm-workspace.yaml` allows sharp's install script (needed by eleventy-img and the og:image script).
- No test suite or linter. Verify changes with `pnpm build` and inspect the `_site/` output.

## Stack & structure

- Eleventy 3, CommonJS. All config lives in `.eleventy.js` at the repo root.
- Input: `src/` — output: `_site/` (gitignored). Templates are Nunjucks + Markdown.
- Markdown files are processed through Nunjucks (`markdownTemplateEngine: "njk"`), so `{% ... %}` template syntax works inside `.md` content.
- `src/_includes/layout.njk` — the base layout and nav (Home / About / Books / Blog). The `<head>` carries SEO/OG meta (from `src/_data/site.js`) plus the Vercel Web Analytics snippet — do not remove either.
- `src/_includes/post.njk` — blog post layout: title/date/tags header, `data-pagefind-body` (so Pagefind indexes posts), tag spans with `data-pagefind-filter="tags"`.
- `src/blog.md` — blog landing: Pagefind Component UI search (input + tag filter dropdown + results) and the full post list.
- `src/blog/*.md` — blog posts. Garden posts are blog posts tagged `garden` and are fully public.
- `src/_data/site.js` — site name / URL / default description; single source of truth for SEO tags.
- `src/sitemap.njk` — builds `/sitemap.xml` from all pages.
- `src/robots.txt` — allows all crawlers, points to the sitemap.
- `vercel.json` — sets the Vercel build command: `npx eleventy && npx pagefind --site _site`.
- `scripts/og-image.js` + `src/img/og-default.png` — default Open Graph card (Solarized Light); regenerate with `pnpm og:image` and commit the PNG.
- `src/_data/books.js` — fetches a published Google Sheet as CSV **at build time** (needs network); columns: Title, Author, Finished, Notes. Feeds the Books page.
- `src/quotes.md` — the quotation list (`permalink: false`, never renders as a page). `src/_data/quotes.js` parses it at build; the home page shows one quote per day (client-side pick by day-of-year, no rebuild needed).

## Conventions

- Blog posts: `src/blog/yyyymmdd_title-slug.md` (files sort chronologically by name). Frontmatter: `title`, `date` (YYYY-MM-DD — **keep in sync with the filename date**), `permalink: /blog/<slug>/` (keeps URLs clean regardless of filename), `layout: post.njk`, and free-form `tags` (e.g. `[garden]`, `[projects]`). Dates render with the `readableDate` filter (America/New_York). The `posts` collection sorts by frontmatter `date`, not filename.
- Search: Pagefind Component UI on the blog page; only post pages are indexed. The tag filter dropdown populates after the first search interaction (Pagefind behavior without faceted mode).
- URLs are directory-style: `/about/`, `/blog/<post-slug>/`.
- The `image` shortcode (`.eleventy.js`) generates optimized responsive WebP/JPEG — it **throws if `alt` text is missing**. Always pass alt text. Post images passthrough-copy from `src/blog/`.
- Excerpts for posts are auto-extracted from the first paragraph if not set in frontmatter.
- Per-page SEO overrides via frontmatter: `description:` (falls back to excerpt, then site default) and `image:` (falls back to `/img/og-default.png`).
- `showStats: true` frontmatter adds an automatic word/character count line to the page (layout.njk + `wordCount`/`charCount` filters in `.eleventy.js`).
- Quotes format in `src/quotes.md`: one per line as `- "Text" — Author` (em-dash separator; author optional; avoid double quotes inside the text). Editing the file is the only change needed — the widget updates on the next deploy.

## Deployment

- Vercel hosts the site (static output from `_site/`). Pushing to `master` on GitHub triggers a production deploy; PRs get preview deploys (check the PR comments for the preview URL).
- Production URL: https://christopherjagoe.com

## Workflow preference (IMPORTANT)

- **All new features/changes go on a NEW branch** — never commit directly to `master`.
- Flow: create branch → make changes → `pnpm build` to verify → commit → `git push -u origin <branch>` → `gh pr create` → Christopher reviews and merges on github.com.
- Never push to `master` and never merge a PR without Christopher's review. After merge: `git switch master && git pull`, delete the branch.
