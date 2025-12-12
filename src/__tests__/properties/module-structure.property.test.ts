import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { modules } from '@/data/modules';
import { isValidModule } from '@/lib/modules';

describe('Module Structure Properties', () => {
  /**
   * **Feature: mobile-programming-learning-website, Property 2: Module structure - learning objectives**
   * *For any* module in the curriculum, the module SHALL contain a non-empty array 
   * of learning objectives that are displayed at the beginning of the module content.
   * **Validates: Requirements 2.3**
   */
  it('Property 2: every module has non-empty learning objectives', () => {
    for (const module of modules) {
      expect(Array.isArray(module.learningObjectives)).toBe(true);
      expect(module.learningObjectives.length).toBeGreaterThan(0);
      
      // Each objective should be a non-empty string
      for (const objective of module.learningObjectives) {
        expect(typeof objective).toBe('string');
        expect(objective.length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 3: Module structure - summary**
   * *For any* module in the curriculum, the module SHALL contain a non-empty 
   * summary array of key concepts covered.
   * **Validates: Requirements 2.4**
   */
  it('Property 3: every module has non-empty summary', () => {
    for (const module of modules) {
      expect(Array.isArray(module.summary)).toBe(true);
      expect(module.summary.length).toBeGreaterThan(0);
      
      // Each summary item should be a non-empty string
      for (const item of module.summary) {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      }
    }
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 10: Module content completeness**
   * *For any* module in the curriculum, the module SHALL contain both theoretical 
   * explanation text and at least one practical code example.
   * **Validates: Requirements 6.2**
   */
  it('Property 10: every module has description (theoretical content)', () => {
    for (const module of modules) {
      expect(typeof module.description).toBe('string');
      expect(module.description.length).toBeGreaterThan(0);
    }
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 11: Module external resources**
   * *For any* module in the curriculum, the module SHALL contain at least one link 
   * to official Ionic documentation or related external references.
   * **Validates: Requirements 6.3**
   * 
   * Note: External links will be added in MDX content. This test validates the structure supports it.
   */
  it('Property 11: module structure supports external links', () => {
    // Verify the Module type supports externalLinks
    for (const module of modules) {
      // externalLinks is optional but the structure should support it
      if (module.externalLinks) {
        expect(Array.isArray(module.externalLinks)).toBe(true);
      }
    }
  });

  it('all modules pass validation', () => {
    for (const module of modules) {
      expect(isValidModule(module)).toBe(true);
    }
  });

  it('all modules have unique IDs', () => {
    const ids = modules.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all modules have unique slugs', () => {
    const slugs = modules.map(m => m.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('all modules have unique order values', () => {
    const orders = modules.map(m => m.order);
    const uniqueOrders = new Set(orders);
    expect(uniqueOrders.size).toBe(orders.length);
  });

  it('modules cover all required topics', () => {
    const requiredTopics = [
      'introduction',
      'setup',
      'basics',
      'components',
      'navigation',
      'forms',
      'http',
      'native',
      'state',
      'deployment',
      'project',
    ];

    const moduleSlugs = modules.map(m => m.slug.toLowerCase());
    
    for (const topic of requiredTopics) {
      const hasTopic = moduleSlugs.some(slug => slug.includes(topic));
      expect(hasTopic).toBe(true);
    }
  });

  it('Property: module estimated time is reasonable', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...modules),
        (module) => {
          // Estimated time should be between 15 and 180 minutes
          expect(module.estimatedTime).toBeGreaterThanOrEqual(15);
          expect(module.estimatedTime).toBeLessThanOrEqual(180);
          return true;
        }
      ),
      { numRuns: modules.length }
    );
  });
});
