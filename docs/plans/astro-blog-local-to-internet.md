# Astro Blog Local To Internet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal blog in the repository root, verify it locally, then publish it to the public internet.

**Architecture:** Initialize an Astro static site in the existing empty repo root. Use Markdown/MDX content collections for posts, small reusable Astro components for layout/navigation/cards, Vitest for content and helper logic, and Playwright for page-level regression checks against the local production preview. Deploy the static `dist/` output to GitHub Pages with GitHub Actions.

**Tech Stack:** Astro, TypeScript, Markdown/MDX content collections, RSS plugin, sitemap plugin, Vitest, Playwright, GitHub Actions, GitHub Pages.

---

## Current Project Context

The repository at `D:\mobinets\blog` currently contains only `.git`. There are no commits, no application files, no package manager lockfile, and no existing framework conventions to preserve. All implementation should happen at this repo root.

Because the repo is empty, the implementation should create a minimal but production-shaped static blog rather than trying to retrofit an existing app. The first deployment target should be GitHub Pages because it is a natural fit for a static blog and can deploy directly from a GitHub Actions workflow. Netlify or Vercel can be added later if GitHub Pages constraints become limiting.

## Selected Design From Brainstorming

Recommended approach: Astro static blog with GitHub Pages deployment.

Why this approach:
- Astro is purpose-built for content-heavy static sites and keeps JavaScript minimal by default.
- Markdown content collections provide typed frontmatter validation for posts.
- Static output is easy to run locally, preview, test, and roll back.
- GitHub Pages avoids needing a separate server for the first public release.

Alternatives considered:
- Next.js static export: strong ecosystem, but more moving parts than needed for a content-first blog.
- Plain HTML/CSS/JS: simplest runtime, but weaker content organization, validation, RSS, sitemap, and route generation.
- Hugo: very fast and mature, but adds a separate Go-based toolchain and is less natural if future interactive components are expected.

## Target Project Structure

Create these functional files:

```text
.
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- astro.config.mjs
|-- package.json
|-- package-lock.json
|-- playwright.config.ts
|-- tsconfig.json
|-- vitest.config.ts
|-- src/
|   |-- components/
|   |   |-- BlogCard.astro
|   |   |-- Footer.astro
|   |   |-- Header.astro
|   |   `-- SeoHead.astro
|   |-- content/
|   |   |-- config.ts
|   |   `-- posts/
|   |       |-- hello-world.md
|   |       `-- local-deploy-notes.md
|   |-- layouts/
|   |   |-- BaseLayout.astro
|   |   `-- PostLayout.astro
|   |-- lib/
|   |   |-- dates.ts
|   |   |-- posts.ts
|   |   `-- site.ts
|   |-- pages/
|   |   |-- 404.astro
|   |   |-- about.astro
|   |   |-- index.astro
|   |   |-- rss.xml.js
|   |   `-- posts/
|   |       `-- [slug].astro
|   `-- styles/
|       `-- global.css
|-- tests/
|   |-- e2e/
|   |   |-- home.spec.ts
|   |   |-- post.spec.ts
|   |   `-- rss.spec.ts
|   `-- unit/
|       |-- dates.test.ts
|       |-- posts.test.ts
|       `-- site.test.ts
`-- docs/
    `-- deployment.md
```

## Functional Code File Responsibilities

- Create `package.json`: scripts for dev, build, preview, unit tests, e2e tests, and combined CI checks.
- Create `astro.config.mjs`: Astro integrations, static output, site URL, and GitHub Pages base path behavior.
- Create `tsconfig.json`: TypeScript settings using Astro defaults.
- Create `vitest.config.ts`: unit test environment.
- Create `playwright.config.ts`: local preview server and browser test settings.
- Create `src/lib/site.ts`: canonical site metadata, navigation items, and URL helpers that respect the build-time site URL.
- Create `src/lib/dates.ts`: date parsing and formatting helpers.
- Create `src/lib/posts.ts`: post sorting, filtering draft posts, and deriving post summaries.
- Create `src/content/config.ts`: frontmatter schema for posts.
- Create `src/content/posts/*.md`: starter posts used by the app and tests.
- Create `src/layouts/BaseLayout.astro`: shared document shell, header, footer, CSS import.
- Create `src/layouts/PostLayout.astro`: post detail layout with title, date, tags, and content slot.
- Create `src/components/Header.astro`: responsive navigation.
- Create `src/components/Footer.astro`: footer with copyright and links.
- Create `src/components/BlogCard.astro`: list item component for a post preview.
- Create `src/components/SeoHead.astro`: canonical title, description, Open Graph, and RSS link tags.
- Create `src/pages/index.astro`: home page showing latest published posts.
- Create `src/pages/about.astro`: simple about page.
- Create `src/pages/posts/[slug].astro`: generated post detail routes.
- Create `src/pages/rss.xml.js`: RSS feed.
- Create `src/pages/404.astro`: static not-found page.
- Create `src/styles/global.css`: site styling and responsive layout.
- Create `.github/workflows/deploy.yml`: build/test/deploy workflow for GitHub Pages.
- Create `docs/deployment.md`: local deployment and public deployment runbook.

## Test Code File Responsibilities

- Create `tests/unit/dates.test.ts`: normal, boundary, exception, and regression coverage for date helpers.
- Create `tests/unit/posts.test.ts`: normal, boundary, exception, and regression coverage for post sorting/filtering helpers.
- Create `tests/unit/site.test.ts`: normal, boundary, exception, and regression coverage for site metadata and URL helpers.
- Create `tests/e2e/home.spec.ts`: browser tests for homepage post listing, navigation, responsiveness, and missing empty states.
- Create `tests/e2e/post.spec.ts`: browser tests for post detail pages, frontmatter rendering, non-existent post behavior, and layout regression.
- Create `tests/e2e/rss.spec.ts`: browser/API tests for RSS availability and published-only content.

## Feature-To-Test Matrix

| Feature | Normal Path Test | Boundary Test | Exception Test | Regression Test | Auto Runnable |
| --- | --- | --- | --- | --- | --- |
| Project scaffold and scripts | `npm run build` creates `dist/` | `npm run check` works from clean install | missing dependency fails CI clearly | scripts remain stable across changes | Yes |
| Post content schema | valid post frontmatter builds | empty tags and long description accepted or rejected by schema rules | missing `title` or invalid `pubDate` fails build | draft posts never appear in public routes | Yes |
| Post sorting/filtering | newest published posts appear first | posts with equal dates sort by title/slug | invalid date helper input throws readable error | draft filtering remains enforced | Yes |
| Home page | homepage lists starter posts and links to details | one published post still renders cleanly | zero published posts shows empty state | no duplicate post links | Yes |
| Post detail page | `/posts/hello-world/` renders title/date/content | very long title wraps without layout break | unknown slug returns 404 | generated static paths match collection slugs | Yes |
| SEO metadata | page title, description, canonical URL render | missing per-post description falls back to site description | invalid site URL fails unit validation | RSS link remains present in `<head>` | Yes |
| RSS feed | `/rss.xml` returns XML with published posts | empty published list returns valid empty channel | draft post does not leak into feed | feed URL stays absolute after base path changes | Yes |
| Styling/responsive UI | desktop homepage has readable layout | mobile viewport has no horizontal overflow | missing asset does not block text rendering | header/footer remain visible after CSS changes | Yes |
| Local deployment | `npm run preview` serves built site | non-root base path preview documented | port conflict handled by choosing another port | `dist/` is never committed | Partly: commands yes, port conflict manual |
| GitHub Pages deployment | workflow builds and deploys on `main` | repository project page base path supported | failed tests block deployment | rollback to previous commit redeploys known-good site | CI yes, rollback manual |

## Automated Test Commands

These tests can run automatically:

```bash
npm run test:unit
npm run test:e2e
npm run build
npm run check
```

The GitHub Actions workflow should run `npm ci`, `npm run check`, and deploy only after successful checks.

These checks require manual confirmation:
- Visit local preview URL and visually inspect typography/content.
- Verify public GitHub Pages URL after first deployment.
- Configure DNS/custom domain if used later.

## Risks And Mitigations

- GitHub Pages base path risk: project pages often need a base path matching the repository name. Mitigate by defining `site` and `base` in `astro.config.mjs` from environment variables and testing URLs in e2e.
- Draft leakage risk: draft posts may appear in lists, routes, or RSS. Mitigate with centralized `getPublishedPosts()` in `src/lib/posts.ts` and tests for list, detail, and RSS behavior.
- Content schema drift risk: loose frontmatter can break layouts later. Mitigate with Astro content collection schema tests and build-time validation.
- Empty blog risk: a new blog with zero posts can look broken. Mitigate with a tested empty state on the homepage.
- Deployment secret/config risk: GitHub Pages requires repository settings and permissions. Mitigate with documented setup in `docs/deployment.md` and least-privilege workflow permissions.
- Asset path risk: CSS and generated route URLs may break under a non-root base path. Mitigate by using Astro-managed URLs and e2e checks against production preview.
- Overbuilding risk: comments, CMS, search, analytics, tags pages, and custom domains are intentionally out of scope for the first release.

## Rollback Plan

- Before implementation, keep this plan committed separately from functional code.
- During implementation, commit each task independently.
- If local build or tests fail after a task, revert only that task commit with `git revert <commit>`.
- If public deployment fails, disable the GitHub Actions workflow temporarily or revert the deployment workflow commit.
- If a bad version is published, revert to the last known-good commit on `main`; GitHub Pages will redeploy the older static output.
- Do not commit `dist/`; regenerated static output should always come from source.
- Keep starter content small so rollback does not require data migrations.

## Implementation Tasks

### Task 1: Initialize Astro Project And Tooling

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.gitignore`
- Test: package scripts are verified by commands in this task.

- [ ] **Step 1: Create package metadata and scripts**

Use this `package.json` content:

```json
{
  "name": "mobinets-blog",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "check": "npm run test:unit && npm run build && npm run test:e2e"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "@astrojs/rss": "latest",
    "@astrojs/sitemap": "latest",
    "astro": "latest",
    "typescript": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and dependencies install without errors.

- [ ] **Step 3: Configure Astro**

Create `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [sitemap()],
});
```

- [ ] **Step 4: Configure TypeScript, Vitest, Playwright, and ignores**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }
  ],
});
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
coverage/
test-results/
playwright-report/
.env
```

- [ ] **Step 5: Run scaffold verification**

Run:

```bash
npm run build
```

Expected: build reaches Astro validation. It may fail until pages exist; if it fails only because no pages/content exist yet, continue to Task 2.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts .gitignore
git commit -m "chore: initialize astro blog tooling"
```

### Task 2: Add Site Metadata And Unit-Tested Helpers

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/dates.ts`
- Create: `src/lib/posts.ts`
- Create: `tests/unit/site.test.ts`
- Create: `tests/unit/dates.test.ts`
- Create: `tests/unit/posts.test.ts`

- [ ] **Step 1: Write failing site metadata tests**

Create `tests/unit/site.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildAbsoluteUrl, siteConfig } from '../../src/lib/site';

describe('siteConfig', () => {
  it('has required public metadata for normal rendering', () => {
    expect(siteConfig.title).toBe('Mobinets Blog');
    expect(siteConfig.description.length).toBeGreaterThan(20);
    expect(siteConfig.navItems.map((item) => item.href)).toEqual(['/', '/about/']);
  });

  it('builds absolute URLs for boundary paths with or without a leading slash', () => {
    expect(buildAbsoluteUrl('/posts/hello-world/', 'http://localhost:4321')).toBe('http://localhost:4321/posts/hello-world/');
    expect(buildAbsoluteUrl('about/', 'http://localhost:4321')).toBe('http://localhost:4321/about/');
  });

  it('throws a readable error for exception paths with an empty href', () => {
    expect(() => buildAbsoluteUrl('', 'http://localhost:4321')).toThrow('href is required');
  });

  it('keeps RSS path stable for regression coverage', () => {
    expect(buildAbsoluteUrl('/rss.xml', 'http://localhost:4321')).toBe('http://localhost:4321/rss.xml');
  });
});
```

- [ ] **Step 2: Write failing date tests**

Create `tests/unit/dates.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPostDate, parsePostDate } from '../../src/lib/dates';

describe('date helpers', () => {
  it('formats a normal ISO date for display', () => {
    expect(formatPostDate(new Date('2026-04-29T00:00:00.000Z'))).toBe('Apr 29, 2026');
  });

  it('accepts the boundary date at the Unix epoch', () => {
    expect(parsePostDate('1970-01-01').toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  it('throws on invalid exception input', () => {
    expect(() => parsePostDate('not-a-date')).toThrow('Invalid post date');
  });

  it('keeps UTC formatting stable for regression coverage', () => {
    expect(formatPostDate(new Date('2026-12-31T23:59:59.000Z'))).toBe('Dec 31, 2026');
  });
});
```

- [ ] **Step 3: Write failing post helper tests**

Create `tests/unit/posts.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getPublishedPosts, sortPostsByDateDesc } from '../../src/lib/posts';

const posts = [
  { slug: 'older', data: { title: 'Older', pubDate: new Date('2026-01-01'), draft: false } },
  { slug: 'draft', data: { title: 'Draft', pubDate: new Date('2026-03-01'), draft: true } },
  { slug: 'newer', data: { title: 'Newer', pubDate: new Date('2026-02-01'), draft: false } },
] as const;

describe('post helpers', () => {
  it('returns normal published posts newest first', () => {
    expect(getPublishedPosts([...posts]).map((post) => post.slug)).toEqual(['newer', 'older']);
  });

  it('handles the boundary of an empty post list', () => {
    expect(getPublishedPosts([])).toEqual([]);
  });

  it('throws on exception input with a missing slug', () => {
    expect(() =>
      sortPostsByDateDesc([{ data: { title: 'Bad', pubDate: new Date('2026-01-01') } } as never]),
    ).toThrow('Post slug is required');
  });

  it('does not leak drafts for regression coverage', () => {
    expect(getPublishedPosts([...posts]).some((post) => post.slug === 'draft')).toBe(false);
  });
});
```

- [ ] **Step 4: Run tests to verify failure**

Run:

```bash
npm run test:unit
```

Expected: FAIL because `src/lib/site.ts`, `src/lib/dates.ts`, and `src/lib/posts.ts` do not exist yet.

- [ ] **Step 5: Implement helpers**

Create `src/lib/site.ts`:

```ts
export const siteConfig = {
  title: 'Mobinets Blog',
  description: 'Notes on engineering, networks, local experiments, and internet deployment.',
  navItems: [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
  ],
};

export function buildAbsoluteUrl(href: string, siteUrl: string): string {
  if (!href) {
    throw new Error('href is required');
  }

  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  return new URL(normalizedHref, siteUrl).toString();
}
```

Create `src/lib/dates.ts`:

```ts
export function parsePostDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid post date: ${value}`);
  }

  return date;
}

export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
```

Create `src/lib/posts.ts`:

```ts
type PostLike = {
  slug: string;
  data: {
    title: string;
    pubDate: Date;
    draft?: boolean;
  };
};

export function sortPostsByDateDesc<TPost extends PostLike>(posts: TPost[]): TPost[] {
  posts.forEach((post) => {
    if (!post.slug) {
      throw new Error('Post slug is required');
    }
  });

  return [...posts].sort((a, b) => {
    const dateDiff = b.data.pubDate.getTime() - a.data.pubDate.getTime();
    return dateDiff === 0 ? a.slug.localeCompare(b.slug) : dateDiff;
  });
}

export function getPublishedPosts<TPost extends PostLike>(posts: TPost[]): TPost[] {
  return sortPostsByDateDesc(posts.filter((post) => !post.data.draft));
}
```

- [ ] **Step 6: Run tests to verify pass**

Run:

```bash
npm run test:unit
```

Expected: PASS for all unit tests.

- [ ] **Step 7: Commit**

```bash
git add src/lib tests/unit
git commit -m "test: cover blog helper behavior"
```

### Task 3: Add Content Collection And Starter Posts

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/hello-world.md`
- Create: `src/content/posts/local-deploy-notes.md`
- Modify: `tests/unit/posts.test.ts`

- [ ] **Step 1: Extend post tests for schema-shaped data**

Add this test to `tests/unit/posts.test.ts`:

```ts
it('orders equal-date boundary posts by slug for stable rendering', () => {
  const tied = [
    { slug: 'b-post', data: { title: 'B', pubDate: new Date('2026-01-01'), draft: false } },
    { slug: 'a-post', data: { title: 'A', pubDate: new Date('2026-01-01'), draft: false } },
  ];

  expect(sortPostsByDateDesc(tied).map((post) => post.slug)).toEqual(['a-post', 'b-post']);
});
```

- [ ] **Step 2: Run unit tests and verify the new regression**

Run:

```bash
npm run test:unit
```

Expected: PASS because Task 2 already implemented slug tiebreaking.

- [ ] **Step 3: Create content schema**

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(20).max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

- [ ] **Step 4: Add starter posts**

Create `src/content/posts/hello-world.md`:

```markdown
---
title: Hello World
description: The first published note for the Mobinets Blog.
pubDate: 2026-04-29
tags:
  - notes
  - launch
draft: false
---

This is the first post on the blog. It exists to prove that local rendering, static generation, RSS, and public deployment all work together.
```

Create `src/content/posts/local-deploy-notes.md`:

```markdown
---
title: Local Deploy Notes
description: A short checklist for building and previewing the blog locally.
pubDate: 2026-04-28
tags:
  - deployment
draft: false
---

Build the site, preview the generated output, and only publish after the automated checks pass.
```

- [ ] **Step 5: Verify content schema during build**

Run:

```bash
npm run build
```

Expected: build may still fail until pages exist in Task 4. It must not fail because of invalid post frontmatter.

- [ ] **Step 6: Commit**

```bash
git add src/content tests/unit/posts.test.ts
git commit -m "feat: add typed starter posts"
```

### Task 4: Build Layout, Components, And Pages

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/BlogCard.astro`
- Create: `src/components/SeoHead.astro`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/pages/404.astro`
- Test: `tests/e2e/home.spec.ts`
- Test: `tests/e2e/post.spec.ts`

- [ ] **Step 1: Write failing homepage e2e tests**

Create `tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('normal path: homepage lists published posts and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Mobinets Blog/);
  await expect(page.getByRole('link', { name: 'Hello World' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
});

test('boundary path: mobile homepage has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});

test('regression path: homepage does not render duplicate post links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Hello World' })).toHaveCount(1);
});
```

- [ ] **Step 2: Write failing post page e2e tests**

Create `tests/e2e/post.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('normal path: post detail renders frontmatter and content', async ({ page }) => {
  await page.goto('/posts/hello-world/');
  await expect(page.getByRole('heading', { level: 1, name: 'Hello World' })).toBeVisible();
  await expect(page.getByText('Apr 29, 2026')).toBeVisible();
  await expect(page.getByText(/first post on the blog/i)).toBeVisible();
});

test('boundary path: long content area remains readable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/posts/local-deploy-notes/');
  await expect(page.locator('article')).toBeVisible();
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});

test('exception path: unknown post returns a 404 page', async ({ page }) => {
  const response = await page.goto('/posts/not-real/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /not found/i })).toBeVisible();
});

test('regression path: generated post routes are linked from home', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Local Deploy Notes' }).click();
  await expect(page).toHaveURL(/\/posts\/local-deploy-notes\/$/);
});
```

- [ ] **Step 3: Run e2e tests and verify failure**

Run:

```bash
npm run build
npm run test:e2e
```

Expected: FAIL because pages and components do not exist yet.

- [ ] **Step 4: Implement global styles**

Create `src/styles/global.css`:

```css
:root {
  color-scheme: light;
  --bg: #f7f7f3;
  --surface: #ffffff;
  --text: #1f2933;
  --muted: #5f6b7a;
  --line: #d8ddd3;
  --accent: #0f766e;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

a {
  color: var(--accent);
}

.site-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  width: min(100% - 2rem, 960px);
  margin-inline: auto;
}

.site-main {
  flex: 1;
  padding: 3rem 0;
}

.post-list {
  display: grid;
  gap: 1rem;
  padding: 0;
  list-style: none;
}

article {
  max-width: 720px;
}

img,
pre,
code {
  max-width: 100%;
}
```

- [ ] **Step 5: Implement components and layouts**

Create `src/components/Header.astro`:

```astro
---
import { siteConfig } from '../lib/site';
---

<header class="container header">
  <a class="brand" href="/">{siteConfig.title}</a>
  <nav aria-label="Primary navigation">
    {siteConfig.navItems.map((item) => <a href={item.href}>{item.label}</a>)}
  </nav>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--line);
  }

  .brand {
    color: var(--text);
    font-weight: 700;
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
```

Create `src/components/Footer.astro`:

```astro
<footer class="container footer">
  <p>&copy; 2026 Mobinets Blog</p>
</footer>

<style>
  .footer {
    padding: 2rem 0;
    border-top: 1px solid var(--line);
    color: var(--muted);
  }
</style>
```

Create `src/components/BlogCard.astro`:

```astro
---
import { formatPostDate } from '../lib/dates';

const { post } = Astro.props;
---

<li class="card">
  <a href={`/posts/${post.slug}/`}>{post.data.title}</a>
  <p>{post.data.description}</p>
  <time datetime={post.data.pubDate.toISOString()}>{formatPostDate(post.data.pubDate)}</time>
</li>

<style>
  .card {
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 8px;
  }

  .card a {
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
  }

  .card p {
    margin: 0.5rem 0;
    color: var(--muted);
  }
</style>
```

Create `src/components/SeoHead.astro`:

```astro
---
import { buildAbsoluteUrl, siteConfig } from '../lib/site';

const {
  title = siteConfig.title,
  description = siteConfig.description,
  path = '/',
} = Astro.props;

const pageTitle = title === siteConfig.title ? title : `${title} | ${siteConfig.title}`;
const siteUrl = Astro.site?.toString() ?? 'http://localhost:4321';
const canonicalUrl = buildAbsoluteUrl(path, siteUrl);
---

<title>{pageTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
<link rel="alternate" type="application/rss+xml" title={siteConfig.title} href={buildAbsoluteUrl('/rss.xml', siteUrl)} />
<meta property="og:title" content={pageTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
```

Create `src/layouts/BaseLayout.astro`:

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import SeoHead from '../components/SeoHead.astro';
import '../styles/global.css';

const { title, description, path } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <SeoHead title={title} description={description} path={path} />
  </head>
  <body>
    <div class="site-shell">
      <Header />
      <main class="container site-main">
        <slot />
      </main>
      <Footer />
    </div>
  </body>
</html>
```

Create `src/layouts/PostLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import { formatPostDate } from '../lib/dates';

const { post } = Astro.props;
---

<BaseLayout title={post.data.title} description={post.data.description} path={`/posts/${post.slug}/`}>
  <article>
    <h1>{post.data.title}</h1>
    <time datetime={post.data.pubDate.toISOString()}>{formatPostDate(post.data.pubDate)}</time>
    <slot />
  </article>
</BaseLayout>
```

- [ ] **Step 6: Implement pages**

Create `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogCard from '../components/BlogCard.astro';
import BaseLayout from '../layouts/BaseLayout.astro';
import { getPublishedPosts } from '../lib/posts';

const posts = getPublishedPosts(await getCollection('posts'));
---

<BaseLayout>
  <h1>Mobinets Blog</h1>
  <p>Notes on engineering, networks, local experiments, and internet deployment.</p>
  {posts.length > 0 ? (
    <ul class="post-list">
      {posts.map((post) => <BlogCard post={post} />)}
    </ul>
  ) : (
    <p>No published posts yet.</p>
  )}
</BaseLayout>
```

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About" description="About the Mobinets Blog." path="/about/">
  <h1>About</h1>
  <p>This blog collects practical notes while building, testing, and deploying projects from a local machine to the internet.</p>
</BaseLayout>
```

Create `src/pages/posts/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';
import { getPublishedPosts } from '../../lib/posts';

export async function getStaticPaths() {
  const posts = getPublishedPosts(await getCollection('posts'));

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout post={post}>
  <Content />
</PostLayout>
```

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Not Found" description="The requested page could not be found." path="/404/">
  <h1>Not Found</h1>
  <p>The page you requested does not exist.</p>
</BaseLayout>
```

- [ ] **Step 7: Run browser tests**

Run:

```bash
npm run build
npm run test:e2e
```

Expected: PASS for homepage and post page tests.

- [ ] **Step 8: Commit**

```bash
git add src/styles src/components src/layouts src/pages tests/e2e
git commit -m "feat: build blog pages"
```

### Task 5: Add RSS, Sitemap, And SEO Regression Coverage

**Files:**
- Create: `src/pages/rss.xml.js`
- Modify: `tests/e2e/rss.spec.ts`
- Modify: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Write failing RSS tests**

Create `tests/e2e/rss.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('normal path: RSS feed contains published posts', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain('<title>Mobinets Blog</title>');
  expect(body).toContain('Hello World');
});

test('boundary path: RSS feed is valid XML content', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(response.headers()['content-type']).toContain('xml');
  expect(await response.text()).toMatch(/^<\?xml|<rss/);
});

test('exception/regression path: RSS feed does not include drafts', async ({ request }) => {
  const response = await request.get('/rss.xml');
  expect(await response.text()).not.toContain('draft');
});
```

Add this regression test to `tests/e2e/home.spec.ts`:

```ts
test('regression path: homepage exposes RSS discovery metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute('href', 'http://localhost:4321/rss.xml');
});
```

- [ ] **Step 2: Run RSS tests and verify failure**

Run:

```bash
npm run build
npm run test:e2e -- rss.spec.ts
```

Expected: FAIL because `src/pages/rss.xml.js` does not exist.

- [ ] **Step 3: Implement RSS route**

Create `src/pages/rss.xml.js`:

```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPublishedPosts } from '../lib/posts';
import { siteConfig } from '../lib/site';

export async function GET(context) {
  const posts = getPublishedPosts(await getCollection('posts'));

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.slug}/`,
    })),
  });
}
```

- [ ] **Step 4: Run RSS and full e2e tests**

Run:

```bash
npm run build
npm run test:e2e
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/rss.xml.js tests/e2e
git commit -m "feat: add rss feed"
```

### Task 6: Add Local Deployment Runbook

**Files:**
- Create: `docs/deployment.md`
- Test: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Add local deployment documentation**

Create `docs/deployment.md`:

````markdown
# Deployment Runbook

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Local Production Preview

Build the static site:

```bash
npm run build
```

Preview the generated output:

```bash
npm run preview
```

Open the local URL printed by Astro. If port 4321 is already in use, stop the existing process or pass another port to Astro preview.

## Public Deployment

The first public target is GitHub Pages through `.github/workflows/deploy.yml`.

Required repository settings:

- Enable GitHub Pages.
- Set the Pages source to GitHub Actions.
- Push to the `main` branch.

## Rollback

Revert the bad commit and push `main` again:

```bash
git revert <bad-commit-sha>
git push origin main
```

GitHub Actions will rebuild and redeploy the previous source state.
````

- [ ] **Step 2: Ensure preview is covered by e2e**

No new code is required because `playwright.config.ts` already runs `npm run preview`. This is the automated regression that proves local production preview works.

- [ ] **Step 3: Run local deployment check**

Run:

```bash
npm run check
```

Expected: PASS for unit tests, Astro build, and e2e tests against local preview.

- [ ] **Step 4: Commit**

```bash
git add docs/deployment.md
git commit -m "docs: add local deployment runbook"
```

### Task 7: Add GitHub Pages Deployment Workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `astro.config.mjs`
- Modify: `docs/deployment.md`
- Test: deployment workflow is validated by GitHub Actions and local `npm run check`.

- [ ] **Step 1: Update Astro config for GitHub Pages base path**

Modify `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL ?? 'http://localhost:4321';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [sitemap()],
});
```

- [ ] **Step 2: Create GitHub Pages workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Blog

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Install dependencies
        run: npm ci

      - name: Run checks
        run: npm run check
        env:
          SITE_URL: ${{ steps.pages.outputs.origin }}
          BASE_PATH: ${{ steps.pages.outputs.base_path }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Document public deployment**

Append to `docs/deployment.md`:

```markdown
## GitHub Pages Environment Variables

The workflow passes `SITE_URL` and `BASE_PATH` from GitHub Pages setup into the Astro build. This keeps canonical URLs and asset paths correct for both user pages and project pages.

For a custom domain, configure the domain in GitHub Pages settings first, then rerun the workflow.
```

- [ ] **Step 4: Run local checks**

Run:

```bash
npm run check
```

Expected: PASS before pushing to `main`.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml astro.config.mjs docs/deployment.md
git commit -m "ci: deploy blog to github pages"
```

### Task 8: Final Verification And Release

**Files:**
- Modify only if previous tasks reveal test or documentation defects.
- Test: all unit, e2e, build, local preview, and GitHub Actions checks.

- [ ] **Step 1: Run full automated checks locally**

Run:

```bash
npm run check
```

Expected: PASS.

- [ ] **Step 2: Verify generated output is not tracked**

Run:

```bash
git status --short
```

Expected: no `dist/`, `.astro/`, `test-results/`, or `playwright-report/` files are staged.

- [ ] **Step 3: Push to GitHub**

Run after a remote exists:

```bash
git push origin main
```

Expected: GitHub Actions starts the `Deploy Blog` workflow.

- [ ] **Step 4: Verify public URL**

Open the GitHub Pages URL from the workflow summary.

Expected:
- Homepage loads.
- `Hello World` post loads.
- `/rss.xml` loads.
- Header navigation works.
- Mobile viewport has no horizontal scrolling.

- [ ] **Step 5: Record release status**

Append to `docs/deployment.md`:

```markdown
## First Public Release

- Release date: 2026-04-29
- Deployment target: GitHub Pages
- Verification: `npm run check` passed locally and GitHub Actions deployment succeeded.
```

- [ ] **Step 6: Commit release notes**

```bash
git add docs/deployment.md
git commit -m "docs: record first public release"
```

## Self-Review Checklist

- Spec coverage: the plan covers local implementation, local preview, public deployment, root-level project structure, code structure, risks, tests, automation, and rollback.
- Placeholder scan: no unresolved placeholder markers or vague "add tests later" items remain.
- Type consistency: helper names used in tests match implementation names: `siteConfig`, `buildAbsoluteUrl`, `parsePostDate`, `formatPostDate`, `sortPostsByDateDesc`, and `getPublishedPosts`.
- Test coverage: every feature in the feature matrix has normal, boundary, exception, and regression coverage identified.
- Planner boundary: this document is the only planned artifact; no business code should be created by the Planner agent.

## Reference Sources

- Astro documentation: content collections, static output, integrations, and deployment concepts: https://docs.astro.build/en/guides/content-collections/, https://docs.astro.build/en/guides/deploy/github/, https://docs.astro.build/en/recipes/rss/
- GitHub Pages documentation: GitHub Actions deployment, Pages source settings, HTTPS/custom domain behavior: https://docs.github.com/en/pages
- Playwright documentation: test runner, web server integration, browser projects: https://playwright.dev/docs/test-webserver
- Vitest documentation: TypeScript unit test runner configuration: https://vitest.dev/config/
