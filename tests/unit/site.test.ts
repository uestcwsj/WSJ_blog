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
