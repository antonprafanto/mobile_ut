'use client';

import React, { useState, useEffect } from 'react';
import { CodeFile } from '@/types';
import { highlightCode, addLineNumbers, getLanguageDisplayName, SupportedLanguage } from '@/lib/syntax-highlighter';

interface CodePlaygroundProps {
  files: CodeFile[];
  description?: string;
}

export function CodePlayground({ files, description }: CodePlaygroundProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeFile = files[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const { lines, lineCount } = addLineNumbers(activeFile.code);

  // Get highlighted HTML
  const highlightedCode = mounted
    ? highlightCode(activeFile.code, activeFile.language as SupportedLanguage)
    : activeFile.code;

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border bg-code-bg">
      {/* Description */}
      {description && (
        <div className="px-4 py-2 bg-muted border-b border-border text-sm text-muted-foreground">
          {description}
        </div>
      )}

      {/* File tabs */}
      {files.length > 1 && (
        <div className="flex border-b border-border bg-muted/50">
          {files.map((file, index) => (
            <button
              key={file.filename}
              onClick={() => setActiveTab(index)}
              className={`
                px-4 py-2 text-sm font-mono transition-colors
                ${activeTab === index
                  ? 'bg-code-bg text-white border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              aria-label={`View ${file.filename}`}
            >
              {file.filename}
            </button>
          ))}
        </div>
      )}

      {/* Single file header */}
      {files.length === 1 && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-sm font-mono text-muted-foreground">
            {activeFile.filename}
          </span>
          <span className="text-xs text-muted-foreground">
            {getLanguageDisplayName(activeFile.language as SupportedLanguage)}
          </span>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 px-3 py-1 text-xs rounded bg-muted/80 
                     text-muted-foreground hover:text-foreground hover:bg-muted
                     transition-colors z-10"
          aria-label="Copy code"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-success">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </span>
          )}
        </button>

        {/* Code with line numbers */}
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className="flex">
              {/* Line numbers */}
              <span className="select-none pr-4 text-right text-muted-foreground border-r border-border/50 mr-4">
                {lines.map((_, i) => (
                  <span key={i} className="block" aria-hidden="true">
                    {i + 1}
                  </span>
                ))}
              </span>
              {/* Code content */}
              <span
                className="flex-1 text-gray-100"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </code>
          </pre>
        </div>
      </div>

      {/* Toast notification for copy */}
      {copied && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-success text-white rounded-lg shadow-lg z-50 animate-fade-in">
          Code copied to clipboard!
        </div>
      )}
    </div>
  );
}

export default CodePlayground;
