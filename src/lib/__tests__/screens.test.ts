import { describe, it, expect } from 'vitest';
import { screens, screenMap, defaultScreenSlug } from '@/lib/screens';

describe('screens', () => {
  it('contains exactly 16 screens', () => {
    expect(screens).toHaveLength(16);
  });

  it('each screen has required fields', () => {
    for (const screen of screens) {
      expect(screen.slug).toBeDefined();
      expect(screen.index).toBeDefined();
      expect(screen.title).toBeDefined();
      expect(screen.subtitle).toBeDefined();
      expect(screen.category).toBeDefined();
      expect(screen.kind).toBeDefined();
    }
  });

  it('all slugs start with a two-digit index', () => {
    for (const screen of screens) {
      expect(screen.slug).toMatch(/^\d{2}_/);
    }
  });

  it('index field matches slug prefix', () => {
    for (const screen of screens) {
      expect(screen.slug.startsWith(screen.index + '_')).toBe(true);
    }
  });

  it('screenMap contains all screens keyed by slug', () => {
    expect(screenMap.size).toBe(screens.length);
    for (const screen of screens) {
      expect(screenMap.get(screen.slug)).toEqual(screen);
    }
  });

  it('defaultScreenSlug is 16_dashboard_utama', () => {
    expect(defaultScreenSlug).toBe('16_dashboard_utama');
  });

  it('dashboard screen has kind dashboard', () => {
    const dashboard = screens.find(s => s.kind === 'dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.slug).toBe('16_dashboard_utama');
  });

  it('all screen kinds are unique', () => {
    const kinds = screens.map(s => s.kind);
    const uniqueKinds = new Set(kinds);
    expect(uniqueKinds.size).toBe(kinds.length);
  });
});
