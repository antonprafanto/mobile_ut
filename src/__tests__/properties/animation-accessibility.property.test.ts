import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import {
  prefersReducedMotion,
  getAnimationDuration,
  getAnimationClass,
  shouldAnimate,
  getAnimationConfig,
} from '@/lib/animation';

describe('Animation Accessibility Properties', () => {
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Reset matchMedia mock
    vi.restoreAllMocks();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 19: Animation accessibility**
   * *For any* user with `prefers-reduced-motion: reduce` system setting, 
   * all non-essential animations SHALL be disabled or minimized.
   * **Validates: Requirements 5.4**
   */
  it('Property 19: animations are disabled when prefers-reduced-motion is set', () => {
    // Mock reduced motion preference
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 5000 }), // duration in ms
        fc.string({ minLength: 1, maxLength: 50 }), // animation class
        (duration, className) => {
          // With reduced motion, duration should be 0
          expect(getAnimationDuration(duration)).toBe(0);
          
          // With reduced motion, class should be empty
          expect(getAnimationClass(className)).toBe('');
          
          // Should not animate
          expect(shouldAnimate()).toBe(false);
          expect(prefersReducedMotion()).toBe(true);
          
          // Config should reflect disabled state
          const config = getAnimationConfig(duration, className);
          expect(config.duration).toBe(0);
          expect(config.enabled).toBe(false);
          expect(config.className).toBe('');
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 19: animations are enabled when prefers-reduced-motion is not set', () => {
    // Mock no reduced motion preference
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 5000 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (duration, className) => {
          // Without reduced motion, duration should be preserved
          expect(getAnimationDuration(duration)).toBe(duration);
          
          // Without reduced motion, class should be preserved
          expect(getAnimationClass(className)).toBe(className);
          
          // Should animate
          expect(shouldAnimate()).toBe(true);
          expect(prefersReducedMotion()).toBe(false);
          
          // Config should reflect enabled state
          const config = getAnimationConfig(duration, className);
          expect(config.duration).toBe(duration);
          expect(config.enabled).toBe(true);
          expect(config.className).toBe(className);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 19: animation config is consistent with preference', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // reduced motion preference
        fc.integer({ min: 100, max: 5000 }),
        fc.string({ minLength: 1, maxLength: 50 }),
        (reducedMotion, duration, className) => {
          // Mock the preference
          window.matchMedia = vi.fn().mockImplementation((query: string) => ({
            matches: reducedMotion && query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }));

          const config = getAnimationConfig(duration, className);
          
          if (reducedMotion) {
            expect(config.enabled).toBe(false);
            expect(config.duration).toBe(0);
            expect(config.className).toBe('');
          } else {
            expect(config.enabled).toBe(true);
            expect(config.duration).toBe(duration);
            expect(config.className).toBe(className);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
