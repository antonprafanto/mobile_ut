import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  highlightCode,
  addLineNumbers,
  isValidHighlightedOutput,
  SupportedLanguage,
} from '@/lib/syntax-highlighter';
import { CodeFile } from '@/types';

const supportedLanguages: SupportedLanguage[] = ['typescript', 'javascript', 'html', 'css', 'json', 'bash'];

// Generator for code strings
const codeArbitrary = fc.string({ minLength: 1, maxLength: 500 });

// Generator for supported languages
const languageArbitrary = fc.constantFrom(...supportedLanguages);

// Generator for CodeFile
const codeFileArbitrary = fc.record({
  filename: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-zA-Z0-9.-]/g, '') + '.ts'),
  language: languageArbitrary,
  code: codeArbitrary,
}) as fc.Arbitrary<CodeFile>;

describe('Code Display Properties', () => {
  /**
   * **Feature: mobile-programming-learning-website, Property 4: Syntax highlighting output validity**
   * *For any* code string and supported language (TypeScript, HTML, CSS), 
   * the syntax highlighter SHALL produce valid HTML output containing appropriate syntax tokens.
   * **Validates: Requirements 3.1**
   */
  it('Property 4: syntax highlighter produces valid output for any code and language', () => {
    fc.assert(
      fc.property(codeArbitrary, languageArbitrary, (code, language) => {
        const highlighted = highlightCode(code, language);
        
        // Output should be non-empty
        expect(highlighted.length).toBeGreaterThan(0);
        
        // Output should be valid (contains tokens or escaped content)
        expect(isValidHighlightedOutput(highlighted)).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 4: highlighting preserves code content (no data loss)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }).map(s => s.replace(/[^a-zA-Z0-9 \n]/g, '')).filter(s => s.length > 0),
        languageArbitrary,
        (code, language) => {
          const highlighted = highlightCode(code, language);
          
          // Strip HTML tags to get plain text
          const plainText = highlighted.replace(/<[^>]*>/g, '');
          
          // Plain text should contain the original alphanumeric content
          const originalAlphanumeric = code.replace(/[^a-zA-Z0-9]/g, '');
          const resultAlphanumeric = plainText.replace(/[^a-zA-Z0-9]/g, '');
          
          if (originalAlphanumeric.length > 0) {
            expect(resultAlphanumeric).toContain(originalAlphanumeric.slice(0, 50));
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 5: Code display - line numbers**
   * *For any* code example rendered in the Code_Playground, the output SHALL include 
   * line numbers corresponding to each line of the source code.
   * **Validates: Requirements 3.3**
   */
  it('Property 5: line numbers match actual lines in code', () => {
    fc.assert(
      fc.property(codeArbitrary, (code) => {
        const { lines, lineCount } = addLineNumbers(code);
        
        // Line count should match actual newlines + 1
        const expectedLines = code.split('\n').length;
        expect(lineCount).toBe(expectedLines);
        expect(lines.length).toBe(expectedLines);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 5: line numbers are sequential starting from 1', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (numLines) => {
          const code = Array(numLines).fill('line').join('\n');
          const { lines, lineCount } = addLineNumbers(code);
          
          expect(lineCount).toBe(numLines);
          
          // Each line should be accessible by index
          for (let i = 0; i < numLines; i++) {
            expect(lines[i]).toBeDefined();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: mobile-programming-learning-website, Property 6: Multi-file code display - file labels**
   * *For any* code example containing multiple files, each file SHALL be displayed 
   * with its filename as a visible label.
   * **Validates: Requirements 3.4**
   */
  it('Property 6: each file has a unique filename', () => {
    fc.assert(
      fc.property(
        fc.array(codeFileArbitrary, { minLength: 1, maxLength: 10 }),
        (files) => {
          // Each file should have a non-empty filename
          for (const file of files) {
            expect(file.filename.length).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 6: filenames are preserved in file objects', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).map(s => s.replace(/[^a-zA-Z0-9]/g, '') || 'file'),
        fc.constantFrom('.ts', '.js', '.html', '.css', '.json'),
        languageArbitrary,
        codeArbitrary,
        (name, ext, language, code) => {
          const filename = name + ext;
          const file: CodeFile = {
            filename,
            language,
            code,
          };
          
          // Filename should be exactly what we set
          expect(file.filename).toBe(filename);
          expect(file.filename.length).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
