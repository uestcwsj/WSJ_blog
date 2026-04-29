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

  it('orders equal-date boundary posts by slug for stable rendering', () => {
    const tied = [
      { slug: 'b-post', data: { title: 'B', pubDate: new Date('2026-01-01'), draft: false } },
      { slug: 'a-post', data: { title: 'A', pubDate: new Date('2026-01-01'), draft: false } },
    ];

    expect(sortPostsByDateDesc(tied).map((post) => post.slug)).toEqual(['a-post', 'b-post']);
  });
});
