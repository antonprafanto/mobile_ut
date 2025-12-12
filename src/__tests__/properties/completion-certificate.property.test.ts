import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { modules } from '@/data/modules';
import {
  getProgress,
  markModuleComplete,
  clearProgress,
} from '@/lib/progress';

describe('Completion Certificate Properties', () => {
  beforeEach(() => {
    clearProgress();
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 17: Completion certificate trigger**
   * *For any* progress state where all module IDs are marked as completed, 
   * the system SHALL display a completion certificate or congratulation message.
   * **Validates: Requirements 4.4**
   */
  it('Property 17: allCompleted flag is set when all modules are completed', () => {
    const totalModules = modules.length;
    
    // Complete all modules
    for (const module of modules) {
      markModuleComplete(module.id, totalModules);
    }
    
    const progress = getProgress();
    
    expect(progress.allCompleted).toBe(true);
    expect(progress.completedModules.length).toBe(totalModules);
    expect(progress.completionDate).toBeDefined();
  });

  it('Property 17: allCompleted is false when not all modules are completed', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: modules.length - 1 }),
        (completedCount) => {
          clearProgress();
          
          const totalModules = modules.length;
          const modulesToComplete = modules.slice(0, completedCount);
          
          for (const module of modulesToComplete) {
            markModuleComplete(module.id, totalModules);
          }
          
          const progress = getProgress();
          
          if (completedCount < totalModules) {
            expect(progress.allCompleted).toBe(false);
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Property 17: completion date is set only when all modules are completed', () => {
    const totalModules = modules.length;
    
    // Complete all but one
    for (let i = 0; i < modules.length - 1; i++) {
      markModuleComplete(modules[i].id, totalModules);
    }
    
    let progress = getProgress();
    expect(progress.completionDate).toBeUndefined();
    
    // Complete the last one
    markModuleComplete(modules[modules.length - 1].id, totalModules);
    
    progress = getProgress();
    expect(progress.completionDate).toBeDefined();
  });

  it('Property 17: completed modules count matches actual completions', () => {
    fc.assert(
      fc.property(
        fc.shuffledSubarray(modules.map(m => m.id)),
        (moduleIds) => {
          clearProgress();
          
          const totalModules = modules.length;
          
          for (const id of moduleIds) {
            markModuleComplete(id, totalModules);
          }
          
          const progress = getProgress();
          
          // Completed count should match unique module IDs
          const uniqueIds = new Set(moduleIds);
          expect(progress.completedModules.length).toBe(uniqueIds.size);
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
