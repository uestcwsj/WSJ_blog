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
