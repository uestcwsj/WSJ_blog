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
