'use client';

import React, { useEffect, useState } from 'react';

interface TableOfContentsProps {
    content: string;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Parse headings from markdown content
        const lines = content.split('\n');
        const extractedHeadings: TocItem[] = [];

        // Simple regex to match markdown headings
        const headingRegex = /^(#{2,3})\s+(.+)$/;

        // We need to generate IDs that match what marked/slugify produces
        // This is a simplified version, might need adjustment to match marked exactly
        const slugify = (text: string) => {
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
        };

        lines.forEach((line) => {
            const match = line.match(headingRegex);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = slugify(text);
                extractedHeadings.push({ id, text, level });
            }
        });

        setHeadings(extractedHeadings);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hidden lg:block">
            <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Daftar Isi
            </h3>
            <ul className="space-y-1">
                {headings.map((heading) => (
                    <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}>
                        <a
                            href={`#${heading.id}`}
                            className={`
                block py-1.5 text-sm transition-colors border-l-2 pl-3
                ${activeId === heading.id
                                    ? 'border-primary text-primary font-medium bg-primary/5 rounded-r-md'
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
              `}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                                setActiveId(heading.id);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
