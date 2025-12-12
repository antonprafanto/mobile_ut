import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Module, StoredProgress } from '@/types';
import {
  getProgressIndicators,
  validateProgressIndicators,
  countCompletedFromIndicators,
} from '@/lib/progress-indicator';

// Generator for valid Module objects
const moduleArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  slug: fc.string({ minLength: 1, maxLength: 50 }),
  order: fc.integer({ min: 1, max: 100 }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  learningObjectives: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
  estimatedTime: fc.integer({ min: 5, max: 180 }),
  summary: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }),
}) as fc.Arbitrary<Module>;

// Generator for modules with unique IDs
const uniqueIdModulesArbitrary = fc
  .array(moduleArbitrary, { minLength: 1, maxLength: 15 })
  .map((modules) => {
    const seen = new Set<string>();
    return modules.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  })
  .filter((modules) => modules.length > 0);

describe('Progress Indicator Properties', () => {
  /**
   * **Feature: mobile-programming-learning-website, Property 8: Progress indicator accuracy**
   * *For any* progress state containing completed module IDs, the module list display 
   * SHALL show correct visual indicators (completed vs incomplete) matching the stored state.
   * **Validates: Requirements 4.3**
   */
  it('Property 8: progress indicators match stored progress state', () => {
    fc.assert(
      fc.property(uniqueIdModulesArbitrary, (modules) => {
        // Generate random subset of completed modules
        const completedCount = Math.floor(Math.random() * (modules.length + 1));
        const shuffled = [...modules].sort(() => Math.random() - 0.5);
        const completedModules = shuffled.slice(0, completedCount).map((m) => m.id);

        const progress: StoredProgress = {
          version: 1,
          completedModules,
          lastVisited: '',
          lastUpdated: new Date().toISOString(),
          allCompleted: completedModules.length === modules.length,
        };

        const indicators = getProgressIndicators(modules, progress);

        // Verify each indicator matches the progress state
        for (const indicator of indicators) {
          const shouldBeComplete = completedModules.includes(indicator.moduleId);
          expect(indicator.isComplete).toBe(shouldBeComplete);
        }

        // Validate using the validation function
        expect(validateProgressIndicators(indicators, progress)).toBe(true);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: completed count matches progress state', () => {
    fc.assert(
      fc.property(
        uniqueIdModulesArbitrary,
        fc.integer({ min: 0, max: 100 }),
        (modules, seed) => {
          // Use seed to determine completion
          const completedModules = modules
            .filter((_, i) => (seed + i) % 3 === 0)
            .map((m) => m.id);

          const progress: StoredProgress = {
            version: 1,
            completedModules,
            lastVisited: '',
            lastUpdated: new Date().toISOString(),
            allCompleted: false,
          };

          const indicators = getProgressIndicators(modules, progress);
          const countFromIndicators = countCompletedFromIndicators(indicators);

          expect(countFromIndicators).toBe(completedModules.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 8: empty progress shows all incomplete', () => {
    fc.assert(
      fc.property(uniqueIdModulesArbitrary, (modules) => {
        const progress: StoredProgress = {
          version: 1,
          completedModules: [],
          lastVisited: '',
          lastUpdated: new Date().toISOString(),
          allCompleted: false,
        };

        const indicators = getProgressIndicators(modules, progress);

        // All should be incomplete
        for (const indicator of indicators) {
          expect(indicator.isComplete).toBe(false);
        }

        expect(countCompletedFromIndicators(indicators)).toBe(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 8: all completed progress shows all complete', () => {
    fc.assert(
      fc.property(uniqueIdModulesArbitrary, (modules) => {
        const completedModules = modules.map((m) => m.id);

        const progress: StoredProgress = {
          version: 1,
          completedModules,
          lastVisited: '',
          lastUpdated: new Date().toISOString(),
          allCompleted: true,
        };

        const indicators = getProgressIndicators(modules, progress);

        // All should be complete
        for (const indicator of indicators) {
          expect(indicator.isComplete).toBe(true);
        }

        expect(countCompletedFromIndicators(indicators)).toBe(modules.length);

        return true;
      }),
      { numRuns: 100 }
    );
  });
});
