import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  getProgress,
  saveProgress,
  markModuleComplete,
  markModuleIncomplete,
  isModuleComplete,
  clearProgress,
  validateProgressData,
} from '@/lib/progress';
import { StoredProgress } from '@/types';

describe('Progress Persistence Properties', () => {
  beforeEach(() => {
    clearProgress();
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 7: Progress persistence round-trip**
   * *For any* module ID, marking it as complete and then reading from storage 
   * SHALL return that module in the completed modules list. Additionally, 
   * saving progress and restoring it SHALL produce equivalent progress state.
   * **Validates: Requirements 4.1, 4.2**
   */
  it('Property 7: marking module complete persists and restores correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.integer({ min: 1, max: 20 }),
        (moduleId, totalModules) => {
          // Clear before test
          clearProgress();

          // Mark module as complete
          markModuleComplete(moduleId, totalModules);

          // Read from storage
          const restored = getProgress();

          // Module should be in completed list
          expect(restored.completedModules).toContain(moduleId);
          expect(isModuleComplete(moduleId)).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: save and restore produces equivalent state', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 0, maxLength: 10 }),
        fc.string({ minLength: 0, maxLength: 20 }),
        (completedModules, lastVisited) => {
          const uniqueModules = [...new Set(completedModules)];
          
          const progress: StoredProgress = {
            version: 1,
            completedModules: uniqueModules,
            lastVisited,
            lastUpdated: new Date().toISOString(),
            allCompleted: false,
          };

          // Save progress
          saveProgress(progress);

          // Restore progress
          const restored = getProgress();

          // Should be equivalent
          expect(restored.completedModules).toEqual(uniqueModules);
          expect(restored.lastVisited).toBe(lastVisited);
          expect(restored.version).toBe(1);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: marking incomplete removes module from completed list', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.integer({ min: 1, max: 20 }),
        (moduleId, totalModules) => {
          clearProgress();

          // Mark complete then incomplete
          markModuleComplete(moduleId, totalModules);
          expect(isModuleComplete(moduleId)).toBe(true);

          markModuleIncomplete(moduleId);
          expect(isModuleComplete(moduleId)).toBe(false);

          const restored = getProgress();
          expect(restored.completedModules).not.toContain(moduleId);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: validateProgressData rejects invalid data', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant('string'),
          fc.constant(123),
          fc.constant({ version: 2 }), // Wrong version
          fc.constant({ version: 1, completedModules: 'not-array' }), // Invalid completedModules
        ),
        (invalidData) => {
          const result = validateProgressData(invalidData);
          expect(result).toBeNull();
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
