'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ReadingProgressIndicator } from '@/components/ui/ReadingProgressIndicator';
import { modules, getModuleBySlug } from '@/data/modules';
import { markModuleComplete, isModuleComplete, updateLastVisited } from '@/lib/progress';
import { Module } from '@/types';
import Link from 'next/link';
import { contentService } from '@/lib/content.service';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { TableOfContents } from '@/components/ui/TableOfContents';
import { ScrollProgress } from '@/components/ui/ScrollProgress';

interface ModulePageClientProps {
  slug: string;
}

export default function ModulePageClient({ slug }: ModulePageClientProps) {
  const [module, setModule] = useState<Module | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moduleContent, setModuleContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const mod = getModuleBySlug(slug);
    if (mod) {
      setModule(mod);
      setIsComplete(isModuleComplete(mod.id));
      updateLastVisited(mod.id);

      // Load module content
      loadContent(mod.slug);
    }
  }, [slug]);

  async function loadContent(moduleSlug: string) {
    setLoadingContent(true);
    try {
      const content = await contentService.loadModuleContent(moduleSlug);
      setModuleContent(content);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoadingContent(false);
    }
  }

  const handleMarkComplete = () => {
    if (module) {
      markModuleComplete(module.id, modules.length);
      setIsComplete(true);
    }
  };

  if (!module) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Modul tidak ditemukan</h1>
          <Link href="/" className="text-primary hover:underline">
            Kembali ke beranda
          </Link>
        </div>
      </Layout>
    );
  }

  const prevModule = modules.find(m => m.order === module.order - 1);
  const nextModule = modules.find(m => m.order === module.order + 1);

  return (
    <Layout>
      <ScrollProgress />
      <ReadingProgressIndicator moduleId={module.id} />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Module Header */}
        <header className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-accent/5 to-background border border-primary/10 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Modules</Link>
              <svg className="w-4 h-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">Modul {module.order}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              {module.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
              {module.description}
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-background/50 backdrop-blur px-4 py-2 rounded-xl border border-border/50">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {module.estimatedTime} menit estimasi
              </div>

              {isComplete && (
                <div className="flex items-center gap-2 text-sm font-bold text-success bg-success/10 backdrop-blur px-4 py-2 rounded-xl border border-success/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Selesai
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Learning Objectives */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                Tujuan Pembelajaran
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {module.learningObjectives.map((objective, i) => (
                  <div key={i} className="p-5 bg-card border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-foreground/90 leading-relaxed font-medium">{objective}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Module Content */}
            <section className="mb-12">
              {moduleContent ? (
                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                  <MarkdownRenderer content={moduleContent} />
                </div>
              ) : loadingContent ? (
                <div className="p-12 border-2 border-dashed border-border rounded-2xl text-center bg-muted/30">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground font-medium">Sedang memuat materi...</p>
                </div>
              ) : (
                <div className="p-12 border-2 border-dashed border-border rounded-2xl text-center bg-muted/30">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground font-medium">Konten modul belum tersedia.</p>
                </div>
              )}
            </section>

            {/* Summary Card */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 relative z-10">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Ringkasan Materi
                </h2>

                <ul className="space-y-4 relative z-10">
                  {module.summary.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/90">
                      <svg className="w-5 h-5 text-success mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Mark Complete Button */}
            {!isComplete && (
              <div className="mb-16 text-center">
                <button
                  onClick={handleMarkComplete}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-hover transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="relative">Tandai Selesai & Lanjut</span>
                </button>
              </div>
            )}

            {/* Navigation */}
            <nav className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-border/50">
              {prevModule ? (
                <Link
                  href={`/modules/${prevModule.slug}`}
                  className="group flex flex-col p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-muted-foreground mb-2 group-hover:text-primary transition-colors">
                    ← Modul Sebelumnya
                  </span>
                  <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {prevModule.title}
                  </span>
                </Link>
              ) : <div />}

              {nextModule ? (
                <Link
                  href={`/modules/${nextModule.slug}`}
                  className="group flex flex-col items-end text-right p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-muted-foreground mb-2 group-hover:text-primary transition-colors">
                    Modul Selanjutnya →
                  </span>
                  <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {nextModule.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/certificate"
                  className="group flex flex-col items-end text-right p-6 bg-gradient-to-br from-success/10 to-emerald-500/10 border border-success/20 rounded-2xl hover:border-success/40 hover:shadow-lg hover:shadow-success/10 transition-all duration-300"
                >
                  <span className="text-xs font-semibold text-success mb-2">
                    Selesai Semua Modul 🎉
                  </span>
                  <span className="text-lg font-bold text-foreground group-hover:text-success transition-colors">
                    Ambil Sertifikat
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* Sidebar Column (TOC) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <TableOfContents content={moduleContent} />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}
