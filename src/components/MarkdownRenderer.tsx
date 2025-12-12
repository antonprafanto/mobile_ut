'use client';

import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import { ImageLightbox } from '@/components/ui/ImageLightbox';

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState({ src: '', alt: '' });

    useEffect(() => {
        if (contentRef.current && content) {
            // Configure marked with custom renderer
            const renderer = new marked.Renderer();

            // Custom Heading Renderer for marked v17+
            // @ts-ignore
            renderer.heading = ({ text, depth }) => {
                const slug = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                if (depth === 2) {
                    return `
                        <h2 id="${slug}" class="group flex items-center gap-3 text-2xl font-bold text-foreground dark:text-white mt-12 mb-6 pb-4 border-b border-border/50">
                            <span class="w-1.5 h-8 bg-primary rounded-full"></span>
                            ${text}
                            <a href="#${slug}" class="opacity-0 group-hover:opacity-100 transition-opacity text-primary ml-2">#</a>
                        </h2>
                    `;
                }

                if (depth === 3) {
                    return `
                        <h3 id="${slug}" class="text-xl font-bold text-foreground dark:text-white mt-8 mb-4 flex items-center gap-2">
                            <span class="text-primary/60">#</span>
                            ${text}
                        </h3>
                    `;
                }

                return `<h${depth} id="${slug}">${text}</h${depth}>`;
            };

            // Custom Table Renderer
            // @ts-ignore
            renderer.table = ({ header, body }) => {
                return `
                    <div class="overflow-x-auto my-8 rounded-xl border border-border/50 shadow-sm">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-muted/50 text-muted-foreground font-semibold">
                                ${header}
                            </thead>
                            <tbody class="divide-y divide-border/50 bg-card">
                                ${body}
                            </tbody>
                        </table>
                    </div>
                `;
            };

            marked.use({ renderer, gfm: true, breaks: true });

            // Render markdown
            const html = marked.parse(content);
            contentRef.current.innerHTML = html as string;

            // Post-processing
            if (contentRef.current) {
                // Highlight code blocks
                contentRef.current.querySelectorAll('pre code').forEach((block) => {
                    Prism.highlightElement(block as HTMLElement);
                });

                // Add Copy Button to Code Blocks
                contentRef.current.querySelectorAll('pre').forEach((pre) => {
                    // Create wrapper
                    const wrapper = document.createElement('div');
                    wrapper.className = 'relative group my-6 rounded-xl overflow-hidden border border-border/50 shadow-lg shadow-black/5';

                    // Create header
                    const header = document.createElement('div');
                    header.className = 'flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/10 backdrop-blur-sm absolute top-0 left-0 right-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity';

                    // Language label
                    const codeClass = pre.querySelector('code')?.className || '';
                    const lang = codeClass.match(/language-(\w+)/)?.[1] || 'text';
                    const langLabel = document.createElement('span');
                    langLabel.className = 'text-xs font-mono text-muted-foreground uppercase';
                    langLabel.textContent = lang;

                    // Copy button
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-background/50 hover:bg-background px-2 py-1 rounded-md border border-border/50';
                    copyBtn.innerHTML = `
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        Copy
                    `;

                    copyBtn.addEventListener('click', () => {
                        const code = pre.querySelector('code')?.innerText || '';
                        navigator.clipboard.writeText(code);
                        copyBtn.innerHTML = `<svg class="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Copied!`;
                        copyBtn.classList.add('text-success');
                        setTimeout(() => {
                            copyBtn.innerHTML = `
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Copy
                            `;
                            copyBtn.classList.remove('text-success');
                        }, 2000);
                    });

                    header.appendChild(langLabel);
                    header.appendChild(copyBtn);
                    wrapper.appendChild(header);

                    // Clone pre and append to wrapper
                    const preClone = pre.cloneNode(true) as HTMLElement;
                    preClone.classList.add('!my-0', '!rounded-none', '!bg-[#1e293b]'); // Override default margins and radius
                    wrapper.appendChild(preClone);

                    // Replace original pre with wrapper
                    pre.parentNode?.replaceChild(wrapper, pre);
                });

                // Enhanced Blockquotes (Callouts)
                contentRef.current.querySelectorAll('blockquote').forEach((quote) => {
                    const text = quote.textContent || '';
                    let type = 'note';
                    let icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                    let colorClass = 'border-primary bg-primary/5 text-primary-foreground';
                    let title = 'Catatan';

                    if (text.toLowerCase().includes('warning') || text.toLowerCase().includes('perhatian')) {
                        type = 'warning';
                        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
                        colorClass = 'border-warning bg-warning/10 text-warning-foreground';
                        title = 'Perhatian';
                    } else if (text.toLowerCase().includes('tip')) {
                        type = 'tip';
                        icon = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>';
                        colorClass = 'border-success bg-success/10 text-success-foreground';
                        title = 'Tips';
                    }

                    // Create new structure
                    const wrapper = document.createElement('div');
                    wrapper.className = `my-6 rounded-xl border-l-4 p-4 ${colorClass}`;

                    const header = document.createElement('div');
                    header.className = 'flex items-center gap-2 font-bold mb-2';
                    header.innerHTML = `${icon} <span>${title}</span>`;

                    const content = document.createElement('div');
                    content.className = 'text-foreground/90 text-sm leading-relaxed';
                    content.innerHTML = quote.innerHTML;

                    wrapper.appendChild(header);
                    wrapper.appendChild(content);

                    quote.parentNode?.replaceChild(wrapper, quote);
                });

                // Style Images & Add Lightbox Trigger
                contentRef.current.querySelectorAll('img').forEach((img) => {
                    img.classList.add('rounded-xl', 'shadow-lg', 'my-8', 'mx-auto', 'max-w-full', 'border', 'border-border/50', 'cursor-zoom-in', 'transition-transform', 'hover:scale-[1.02]');
                    img.addEventListener('click', () => {
                        setLightboxImage({
                            src: img.getAttribute('src') || '',
                            alt: img.getAttribute('alt') || ''
                        });
                        setLightboxOpen(true);
                    });
                });

                // Style Links
                contentRef.current.querySelectorAll('a').forEach((link) => {
                    if (!link.classList.contains('text-primary')) { // Avoid double styling
                        link.classList.add('text-primary', 'hover:underline', 'font-medium', 'decoration-primary/30', 'underline-offset-2');
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    }
                });
            }
        }
    }, [content]);

    return (
        <>
            <div
                ref={contentRef}
                className="markdown-content prose prose-lg prose-slate dark:prose-invert max-w-none"
                style={{
                    lineHeight: '1.8',
                }}
            />
            <ImageLightbox
                src={lightboxImage.src}
                alt={lightboxImage.alt}
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
            />
        </>
    );
}
