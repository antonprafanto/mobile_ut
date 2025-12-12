'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { search, initializeSearch, highlightKeywords, debounce } from '@/lib/search-engine';
import { SearchResponse } from '@/types';
import { modules } from '@/data/modules';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Initialize search on mount
  useEffect(() => {
    initializeSearch();
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((q: string) => {
      if (q.trim()) {
        const response = search(q);
        setResults(response);
        setSelectedIndex(-1);
      } else {
        setResults(null);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Keyboard shortcut (Ctrl/Cmd + K)
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      navigateToResult(results.results[selectedIndex].moduleId);
    }
  };

  const navigateToResult = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      router.push(`/modules/${module.slug}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari materi... (Ctrl+K)"
          className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg
                     text-sm text-foreground placeholder:text-muted-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults(null);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && query && results && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.results.length > 0 ? (
            <ul className="py-2">
              {results.results.map((result, index) => (
                <li key={result.moduleId}>
                  <button
                    onClick={() => navigateToResult(result.moduleId)}
                    className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors
                      ${selectedIndex === index ? 'bg-muted' : ''}`}
                  >
                    <div className="font-medium text-foreground text-sm">
                      {result.moduleTitle}
                    </div>
                    <div
                      className="text-xs text-muted-foreground mt-1 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: highlightKeywords(result.excerpt, result.matchedKeywords),
                      }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Tidak ada hasil untuk &quot;{query}&quot;
              </p>
              {results.suggestions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-foreground mb-2">Coba cari:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        className="px-2 py-1 text-xs bg-muted rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {results.popularTopics.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Topik populer:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.popularTopics.slice(0, 5).map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setQuery(topic)}
                        className="px-2 py-1 text-xs bg-muted rounded hover:bg-primary hover:text-white transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default SearchBar;
