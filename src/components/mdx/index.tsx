'use client';

import React from 'react';
import type { MDXComponents } from 'mdx/types';

// Custom MDX components mapping
export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mb-6 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-bold mb-4 mt-8 text-foreground border-b border-border pb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mb-3 mt-6 text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="ml-4">{children}</li>
  ),
  a: ({ href, children }) => (
    <a 
      href={href} 
      className="text-primary hover:text-primary-hover underline transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-code-bg text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-border">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-2">{children}</td>
  ),
  hr: () => <hr className="my-8 border-border" />,
};

export default mdxComponents;
