import Fuse from 'fuse.js';
import { SearchIndexEntry, SearchResult, SearchResponse } from '@/types';
import { buildSearchIndex, getPopularTopics, getSearchSuggestions } from './search-index';

let fuseInstance: Fuse<SearchIndexEntry> | null = null;
let searchIndex: SearchIndexEntry[] = [];

/**
 * Initialize the search engine
 */
export function initializeSearch(): void {
  searchIndex = buildSearchIndex();
  
  fuseInstance = new Fuse(searchIndex, {
    keys: [
      { name: 'content', weight: 0.5 },
      { name: 'moduleTitle', weight: 0.3 },
      { name: 'sectionTitle', weight: 0.2 },
      { name: 'keywords', weight: 0.4 },
    ],
    threshold: 0.4,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
  });
}

/**
 * Perform search and return results
 */
export function search(query: string): SearchResponse {
  if (!fuseInstance) {
    initializeSearch();
  }

  if (!query.trim()) {
    return {
      results: [],
      suggestions: [],
      popularTopics: getPopularTopics(),
    };
  }

  const fuseResults = fuseInstance!.search(query, { limit: 20 });

  // Group results by module to avoid duplicates
  const moduleResults = new Map<string, SearchResult>();

  for (const result of fuseResults) {
    const item = result.item;
    const score = 1 - (result.score || 0); // Convert to relevance (higher is better)

    if (!moduleResults.has(item.moduleId) || moduleResults.get(item.moduleId)!.relevanceScore < score) {
      moduleResults.set(item.moduleId, {
        moduleId: item.moduleId,
        moduleTitle: item.moduleTitle,
        sectionId: item.sectionId,
        sectionTitle: item.sectionTitle,
        excerpt: createExcerpt(item.content, query),
        matchedKeywords: extractMatchedKeywords(query, item.content),
        relevanceScore: score,
      });
    }
  }

  const results = Array.from(moduleResults.values())
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10);

  // If no results, provide suggestions
  if (results.length === 0) {
    return {
      results: [],
      suggestions: getSearchSuggestions(query),
      popularTopics: getPopularTopics(),
    };
  }

  return {
    results,
    suggestions: [],
    popularTopics: [],
  };
}

/**
 * Create excerpt with highlighted keywords
 */
export function createExcerpt(content: string, query: string): string {
  const maxLength = 150;
  const words = query.toLowerCase().split(/\s+/);
  
  let excerpt = content;
  if (content.length > maxLength) {
    // Try to find a relevant portion
    const lowerContent = content.toLowerCase();
    let startIndex = 0;
    
    for (const word of words) {
      const index = lowerContent.indexOf(word);
      if (index !== -1) {
        startIndex = Math.max(0, index - 30);
        break;
      }
    }
    
    excerpt = (startIndex > 0 ? '...' : '') + 
              content.slice(startIndex, startIndex + maxLength) + 
              (startIndex + maxLength < content.length ? '...' : '');
  }
  
  return excerpt;
}

/**
 * Extract matched keywords from content
 */
export function extractMatchedKeywords(query: string, content: string): string[] {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const contentLower = content.toLowerCase();
  
  return queryWords.filter(word => contentLower.includes(word));
}

/**
 * Highlight keywords in text
 */
export function highlightKeywords(text: string, keywords: string[]): string {
  if (keywords.length === 0) return text;
  
  let result = text;
  for (const keyword of keywords) {
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    result = result.replace(regex, '<mark class="bg-warning/30 px-0.5 rounded">$1</mark>');
  }
  
  return result;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
