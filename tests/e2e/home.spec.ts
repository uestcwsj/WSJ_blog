import { expect, test } from '@playwright/test';

test('normal path: homepage lists published posts and navigation', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/Mobinets Blog/);
  await expect(page.getByRole('link', { name: 'Hello World' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
});

test('boundary path: mobile homepage has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);
});

test('regression path: homepage does not render duplicate post links', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('link', { name: 'Hello World' })).toHaveCount(1);
});

test('regression path: homepage exposes RSS discovery metadata', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute('href', 'https://uestcwsj.github.io/WSJ_blog/rss.xml');
});
