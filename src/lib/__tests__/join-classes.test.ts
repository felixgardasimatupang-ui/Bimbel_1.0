import { describe, it, expect } from 'vitest';
import { joinClasses } from '@/lib/join-classes';

describe('joinClasses', () => {
  it('joins multiple classes with space', () => {
    expect(joinClasses('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out falsy values', () => {
    expect(joinClasses('a', false, 'b', null, 'c', undefined)).toBe('a b c');
  });

  it('returns empty string for no arguments', () => {
    expect(joinClasses()).toBe('');
  });

  it('returns empty string for all falsy', () => {
    expect(joinClasses(false, null, undefined)).toBe('');
  });
});
