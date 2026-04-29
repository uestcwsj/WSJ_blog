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

## GitHub Pages Environment Variables

The workflow passes `SITE_URL` and `BASE_PATH` from GitHub Pages setup into the Astro build. This keeps canonical URLs and asset paths correct for both user pages and project pages.

For a custom domain, configure the domain in GitHub Pages settings first, then rerun the workflow.
