import { SearchIndexEntry } from '@/types';
import { modules } from '@/data/modules';

/**
 * Build search index from modules data
 */
export function buildSearchIndex(): SearchIndexEntry[] {
  const index: SearchIndexEntry[] = [];

  for (const module of modules) {
    // Add module title entry
    index.push({
      moduleId: module.id,
      moduleTitle: module.title,
      sectionId: 'title',
      sectionTitle: module.title,
      content: module.title,
      keywords: extractKeywords(module.title),
    });

    // Add description entry
    index.push({
      moduleId: module.id,
      moduleTitle: module.title,
      sectionId: 'description',
      sectionTitle: 'Deskripsi',
      content: module.description,
      keywords: extractKeywords(module.description),
    });

    // Add learning objectives
    module.learningObjectives.forEach((objective, i) => {
      index.push({
        moduleId: module.id,
        moduleTitle: module.title,
        sectionId: `objective-${i}`,
        sectionTitle: 'Tujuan Pembelajaran',
        content: objective,
        keywords: extractKeywords(objective),
      });
    });

    // Add summary items
    module.summary.forEach((item, i) => {
      index.push({
        moduleId: module.id,
        moduleTitle: module.title,
        sectionId: `summary-${i}`,
        sectionTitle: 'Ringkasan',
        content: item,
        keywords: extractKeywords(item),
      });
    });
  }

  return index;
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'dan', 'atau', 'yang', 'untuk', 'dengan', 'dari', 'ke', 'di', 'pada',
    'adalah', 'ini', 'itu', 'akan', 'dapat', 'bisa', 'dalam', 'sebagai',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, self) => self.indexOf(word) === index);
}

/**
 * Get popular topics for suggestions
 */
export function getPopularTopics(): string[] {
  return [
    'Ionic Framework',
    'Mobile Development',
    'TypeScript',
    'Angular',
    'Capacitor',
    'UI Components',
    'Navigation',
    'Forms',
    'HTTP',
    'State Management',
  ];
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(query: string): string[] {
  const suggestions = [
    'ionic',
    'mobile',
    'component',
    'navigation',
    'form',
    'http',
    'api',
    'state',
    'deploy',
    'capacitor',
    'angular',
    'typescript',
  ];

  const lowerQuery = query.toLowerCase();
  return suggestions.filter(s => s.startsWith(lowerQuery) && s !== lowerQuery);
}
