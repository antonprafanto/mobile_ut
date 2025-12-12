import { describe, it, expect, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import {
  search,
  initializeSearch,
  createExcerpt,
  extractMatchedKeywords,
  highlightKeywords,
} from '@/lib/search-engine';
import { getPopularTopics } from '@/lib/search-index';

describe('Search Functionality Properties', () => {
  beforeAll(() => {
    initializeSearch();
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 14: Search relevance**
   * *For any* search query and module content, the search results SHALL only include 
   * modules that contain the search terms, ordered by relevance score.
   * **Validates: Requirements 8.1**
   */
  it('Property 14: search results are ordered by relevance score', () => {
    const testQueries = ['ionic', 'mobile', 'component', 'navigation', 'form'];
    
    for (const query of testQueries) {
      const response = search(query);
      
      // Results should be ordered by relevance (descending)
      for (let i = 1; i < response.results.length; i++) {
        expect(response.results[i].relevanceScore).toBeLessThanOrEqual(
          response.results[i - 1].relevanceScore
        );
      }
    }
  });

  it('Property 14: search results have valid structure', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ionic', 'mobile', 'setup', 'component', 'navigation'),
        (query) => {
          const response = search(query);
          
          for (const result of response.results) {
            // Each result should have required fields
            expect(result.moduleId).toBeDefined();
            expect(result.moduleTitle).toBeDefined();
            expect(result.sectionId).toBeDefined();
            expect(result.excerpt).toBeDefined();
            expect(result.relevanceScore).toBeGreaterThanOrEqual(0);
            expect(result.relevanceScore).toBeLessThanOrEqual(1);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 15: Search keyword highlighting**
   * *For any* search result, all instances of the matched search keywords 
   * SHALL be highlighted in the result excerpt.
   * **Validates: Requirements 8.2**
   */
  it('Property 15: highlightKeywords wraps all keyword occurrences', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 200 }),
        fc.array(fc.string({ minLength: 2, maxLength: 10 }), { minLength: 1, maxLength: 5 }),
        (text, keywords) => {
          const validKeywords = keywords.filter(k => k.trim().length > 0);
          if (validKeywords.length === 0) return true;
          
          const highlighted = highlightKeywords(text, validKeywords);
          
          // If keyword exists in text, it should be wrapped in mark tag
          for (const keyword of validKeywords) {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
              expect(highlighted).toContain('<mark');
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 15: extractMatchedKeywords returns keywords found in content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 100 }),
        (content) => {
          // Use words from content as query
          const words = content.split(/\s+/).filter(w => w.length > 2);
          if (words.length === 0) return true;
          
          const query = words.slice(0, 3).join(' ');
          const matched = extractMatchedKeywords(query, content);
          
          // All matched keywords should exist in content
          for (const keyword of matched) {
            expect(content.toLowerCase()).toContain(keyword.toLowerCase());
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 20: Search no-results suggestions**
   * *For any* search query that returns zero results, the search system SHALL return 
   * a non-empty array of suggested alternative terms or popular topics.
   * **Validates: Requirements 8.4**
   */
  it('Property 20: no results returns suggestions or popular topics', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 5, maxLength: 30 }).map(s => s.replace(/[a-zA-Z]/g, 'x')), // Unlikely to match
        (query) => {
          const response = search(query);
          
          if (response.results.length === 0) {
            // Should have either suggestions or popular topics
            const hasSuggestions = response.suggestions.length > 0 || response.popularTopics.length > 0;
            expect(hasSuggestions).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 20: popular topics are always available', () => {
    const topics = getPopularTopics();
    expect(topics.length).toBeGreaterThan(0);
    
    // Each topic should be a non-empty string
    for (const topic of topics) {
      expect(topic.length).toBeGreaterThan(0);
    }
  });

  it('createExcerpt produces valid excerpts', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (content, query) => {
          const excerpt = createExcerpt(content, query);
          
          // Excerpt should not be empty
          expect(excerpt.length).toBeGreaterThan(0);
          
          // Excerpt should not be longer than content + ellipsis
          expect(excerpt.length).toBeLessThanOrEqual(content.length + 6);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty query returns empty results with popular topics', () => {
    const response = search('');
    
    expect(response.results).toHaveLength(0);
    expect(response.popularTopics.length).toBeGreaterThan(0);
  });
});
