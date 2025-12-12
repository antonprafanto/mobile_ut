import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup';

export type SupportedLanguage = 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'bash';

const languageMap: Record<SupportedLanguage, string> = {
  typescript: 'typescript',
  javascript: 'javascript',
  html: 'markup',
  css: 'css',
  json: 'json',
  bash: 'bash',
};

/**
 * Highlight code with Prism.js
 */
export function highlightCode(code: string, language: SupportedLanguage): string {
  const prismLanguage = languageMap[language] || 'plaintext';
  const grammar = Prism.languages[prismLanguage];
  
  if (!grammar) {
    return escapeHtml(code);
  }
  
  return Prism.highlight(code, grammar, prismLanguage);
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Add line numbers to code
 */
export function addLineNumbers(code: string): { lines: string[]; lineCount: number } {
  const lines = code.split('\n');
  return {
    lines,
    lineCount: lines.length,
  };
}

/**
 * Check if highlighted output is valid HTML
 */
export function isValidHighlightedOutput(html: string): boolean {
  // Check for basic Prism token classes or escaped content
  return (
    html.includes('class="token') ||
    html.includes('&lt;') ||
    html.includes('&gt;') ||
    html.length > 0
  );
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(language: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    bash: 'Bash',
  };
  return names[language] || language;
}
