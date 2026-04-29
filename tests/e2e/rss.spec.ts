import { expect, test } from '@playwright/test';

test('normal path: RSS feed contains published posts', async ({ request }) => {
  const response = await request.get('rss.xml');
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain('<title>Mobinets Blog</title>');
  expect(body).toContain('Hello World');
});

test('boundary path: RSS feed is valid XML content', async ({ request }) => {
  const response = await request.get('rss.xml');
  expect(response.headers()['content-type']).toContain('xml');
  expect(await response.text()).toMatch(/^<\?xml|<rss/);
});

test('exception/regression path: RSS feed does not include drafts', async ({ request }) => {
  const response = await request.get('rss.xml');
  expect(await response.text()).not.toContain('draft');
});
