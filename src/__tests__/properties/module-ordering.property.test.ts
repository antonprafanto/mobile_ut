import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { Module } from '@/types';
import { sortModulesByOrder, areModulesInOrder } from '@/lib/modules';

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

// Generator for array of modules with unique orders
const uniqueOrderModulesArbitrary = fc
  .array(moduleArbitrary, { minLength: 1, maxLength: 20 })
  .map(modules => {
    // Ensure unique orders by reassigning
    return modules.map((m, i) => ({ ...m, order: i + 1 }));
  });

describe('Module Ordering Properties', () => {
  /**
   * **Feature: mobile-programming-learning-website, Property 1: Module ordering consistency**
   * *For any* collection of modules, when sorted by their order property, 
   * the resulting sequence SHALL present content in progressive difficulty 
   * from basic (lower order) to advanced (higher order) topics.
   * **Validates: Requirements 2.2**
   */
  it('Property 1: sorted modules are always in ascending order', () => {
    fc.assert(
      fc.property(uniqueOrderModulesArbitrary, (modules) => {
        const sorted = sortModulesByOrder(modules);
        
        // Verify sorted modules are in ascending order
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i].order).toBeGreaterThan(sorted[i - 1].order);
        }
        
        return areModulesInOrder(sorted);
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: sorting is idempotent - sorting twice gives same result', () => {
    fc.assert(
      fc.property(uniqueOrderModulesArbitrary, (modules) => {
        const sortedOnce = sortModulesByOrder(modules);
        const sortedTwice = sortModulesByOrder(sortedOnce);
        
        expect(sortedOnce).toEqual(sortedTwice);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 1: sorting preserves all modules', () => {
    fc.assert(
      fc.property(uniqueOrderModulesArbitrary, (modules) => {
        const sorted = sortModulesByOrder(modules);
        
        // Same length
        expect(sorted.length).toBe(modules.length);
        
        // All original modules are present
        const originalIds = new Set(modules.map(m => m.id));
        const sortedIds = new Set(sorted.map(m => m.id));
        expect(sortedIds).toEqual(originalIds);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
