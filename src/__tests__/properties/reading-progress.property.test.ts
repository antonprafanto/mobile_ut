import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateScrollPercentage,
  createReadingProgressState,
  isValidPercentage,
} from '@/lib/reading-progress';

describe('Reading Progress Properties', () => {
  /**
   * **Feature: mobile-programming-learning-website, Property 16: Reading progress indicator accuracy**
   * *For any* scroll position within a module page, the reading progress indicator 
   * SHALL display a percentage value between 0 and 100 that accurately reflects 
   * the user's position relative to total scrollable content.
   * **Validates: Requirements 1.4**
   */
  it('Property 16: scroll percentage is always between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100000 }), // scrollTop
        fc.integer({ min: 100, max: 100000 }), // scrollHeight
        fc.integer({ min: 100, max: 10000 }), // clientHeight
        (scrollTop, scrollHeight, clientHeight) => {
          // Ensure scrollHeight >= clientHeight for valid scenario
          const validScrollHeight = Math.max(scrollHeight, clientHeight);
          
          const percentage = calculateScrollPercentage(scrollTop, validScrollHeight, clientHeight);
          
          expect(percentage).toBeGreaterThanOrEqual(0);
          expect(percentage).toBeLessThanOrEqual(100);
          expect(isValidPercentage(percentage)).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: percentage is 0 at top of page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 100000 }), // scrollHeight
        fc.integer({ min: 100, max: 1000 }), // clientHeight
        (scrollHeight, clientHeight) => {
          const percentage = calculateScrollPercentage(0, scrollHeight, clientHeight);
          
          expect(percentage).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: percentage is 100 at bottom of page', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 100000 }), // scrollHeight
        fc.integer({ min: 100, max: 999 }), // clientHeight (must be less than scrollHeight)
        (scrollHeight, clientHeight) => {
          const maxScroll = scrollHeight - clientHeight;
          const percentage = calculateScrollPercentage(maxScroll, scrollHeight, clientHeight);
          
          expect(percentage).toBe(100);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: percentage increases monotonically with scroll position', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 10000 }), // scrollHeight
        fc.integer({ min: 100, max: 500 }), // clientHeight
        (scrollHeight, clientHeight) => {
          const maxScroll = scrollHeight - clientHeight;
          
          let prevPercentage = -1;
          
          // Sample 10 scroll positions
          for (let i = 0; i <= 10; i++) {
            const scrollTop = (maxScroll * i) / 10;
            const percentage = calculateScrollPercentage(scrollTop, scrollHeight, clientHeight);
            
            expect(percentage).toBeGreaterThanOrEqual(prevPercentage);
            prevPercentage = percentage;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: content that fits in viewport shows 100%', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 1000 }), // clientHeight
        fc.integer({ min: 0, max: 100 }), // scrollTop
        (clientHeight, scrollTop) => {
          // scrollHeight <= clientHeight means content fits
          const scrollHeight = clientHeight;
          
          const percentage = calculateScrollPercentage(scrollTop, scrollHeight, clientHeight);
          
          expect(percentage).toBe(100);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 16: createReadingProgressState clamps percentage', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.integer({ min: -100, max: 200 }), // percentage can be out of bounds
        fc.string({ minLength: 0, maxLength: 50 }),
        (moduleId, percentage, section) => {
          const state = createReadingProgressState(moduleId, percentage, section);
          
          expect(state.scrollPercentage).toBeGreaterThanOrEqual(0);
          expect(state.scrollPercentage).toBeLessThanOrEqual(100);
          expect(state.moduleId).toBe(moduleId);
          expect(state.currentSection).toBe(section);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
