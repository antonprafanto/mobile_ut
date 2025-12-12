import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  getCurrentTheme,
  saveTheme,
  toggleTheme,
  clearTheme,
  getStoredTheme,
  ThemeMode,
} from '@/lib/theme';

describe('Theme Toggle Properties', () => {
  beforeEach(() => {
    clearTheme();
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 9: Dark mode toggle round-trip**
   * *For any* initial theme state, toggling dark mode twice SHALL return 
   * the theme to its original state.
   * **Validates: Requirements 5.1**
   */
  it('Property 9: toggling theme twice returns to original state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ThemeMode>('light', 'dark'),
        (initialTheme) => {
          // Set initial theme
          clearTheme();
          saveTheme(initialTheme);
          
          const before = getCurrentTheme();
          expect(before).toBe(initialTheme);

          // Toggle twice
          toggleTheme();
          toggleTheme();

          const after = getCurrentTheme();
          
          // Should return to original
          expect(after).toBe(initialTheme);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: toggle changes theme to opposite', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ThemeMode>('light', 'dark'),
        (initialTheme) => {
          clearTheme();
          saveTheme(initialTheme);

          const before = getCurrentTheme();
          const after = toggleTheme();

          // Should be opposite
          expect(after).not.toBe(before);
          expect(after).toBe(initialTheme === 'light' ? 'dark' : 'light');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: save and retrieve theme is consistent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<ThemeMode>('light', 'dark'),
        (theme) => {
          clearTheme();
          saveTheme(theme);

          const stored = getStoredTheme();
          const current = getCurrentTheme();

          expect(stored).toBe(theme);
          expect(current).toBe(theme);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 9: theme is always light or dark', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        (toggleCount) => {
          clearTheme();
          saveTheme('light');

          for (let i = 0; i < toggleCount; i++) {
            toggleTheme();
          }

          const current = getCurrentTheme();
          expect(['light', 'dark']).toContain(current);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
