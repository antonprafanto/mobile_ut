// Module content structure
export interface Module {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  learningObjectives: string[];
  estimatedTime: number; // in minutes
  summary: string[];
  nextModule?: string;
  prevModule?: string;
  externalLinks?: ExternalLink[];
}

export interface ExternalLink {
  title: string;
  url: string;
  description?: string;
}

// Code example structure
export interface CodeExample {
  id: string;
  files: CodeFile[];
  description?: string;
}

export interface CodeFile {
  filename: string;
  language: 'typescript' | 'html' | 'css' | 'json' | 'bash' | 'javascript';
  code: string;
  highlightLines?: number[];
}

// Progress tracking
export interface ProgressState {
  completedModules: string[]; // Array of module IDs
  lastVisited: string; // Module ID
  lastUpdated: Date;
}

// Stored progress in localStorage
export interface StoredProgress {
  version: 1;
  completedModules: string[];
  lastVisited: string;
  lastUpdated: string; // ISO date string
  allCompleted: boolean;
  completionDate?: string; // ISO date string when all modules completed
}

// Search result
export interface SearchResult {
  moduleId: string;
  moduleTitle: string;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;
  matchedKeywords: string[];
  relevanceScore: number;
}

// Search response with suggestions for no-results case
export interface SearchResponse {
  results: SearchResult[];
  suggestions: string[]; // Alternative search terms when no results found
  popularTopics: string[]; // Popular topics to suggest
}

// Search index entry
export interface SearchIndexEntry {
  moduleId: string;
  moduleTitle: string;
  sectionId: string;
  sectionTitle: string;
  content: string; // Plain text content for searching
  keywords: string[];
}

// Theme state
export interface ThemeState {
  mode: 'light' | 'dark';
  systemPreference: boolean;
}

// Offline status
export interface OfflineState {
  isOnline: boolean;
  cachedModules: string[];
  lastSyncTime: Date;
}

// Reading progress (scroll position)
export interface ReadingProgressState {
  moduleId: string;
  scrollPercentage: number; // 0-100
  currentSection: string;
}

// Completion certificate
export interface CompletionCertificate {
  studentName?: string;
  completionDate: Date;
  totalModules: number;
  completedModules: number;
}

// Module frontmatter from MDX
export interface ModuleFrontmatter {
  id: string;
  title: string;
  order: number;
  description: string;
  learningObjectives: string[];
  estimatedTime: number;
  summary: string[];
  externalLinks?: ExternalLink[];
}

// Project tutorial structure
export interface ProjectTutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: TutorialStep[];
  finalCode: CodeExample;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  description: string;
  codeChanges: CodeExample[];
  explanation: string;
  checkpoint?: string;
}
