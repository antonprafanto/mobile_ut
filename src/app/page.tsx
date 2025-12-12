'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { modules } from '@/data/modules';
import { getProgress, getCompletionPercentage } from '@/lib/progress';
import { sortModulesByOrder } from '@/lib/modules';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { HeroSection } from '@/components/home/HeroSection';
import { ModuleCard } from '@/components/home/ModuleCard';

export default function HomePage() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stored = getProgress();
    setCompletedModules(stored.completedModules);
    setProgress(getCompletionPercentage(modules.length));
  }, []);

  const sortedModules = sortModulesByOrder(modules);

  return (
    <Layout>
      <OfflineIndicator />

      <HeroSection
        completedCount={completedModules.length}
        totalModules={modules.length}
        progress={progress}
        firstModuleSlug={sortedModules[0]?.slug}
      />

      {/* Module List */}
      <section id="modules" className="scroll-mt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Daftar Modul</h2>
            <p className="text-muted-foreground">
              Ikuti materi pembelajaran secara berurutan
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModules.map((module, index) => {
            const isComplete = completedModules.includes(module.id);

            return (
              <div
                key={module.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <ModuleCard
                  module={module}
                  isComplete={isComplete}
                  index={index}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Completion CTA */}
      {completedModules.length === modules.length && (
        <section className="mt-16 text-center p-10 glass-card rounded-3xl border-success/20 bg-success/5 animate-scale-in">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Selamat! Anda Telah Menyelesaikan Semua Modul
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Anda telah menguasai dasar-dasar pemrograman mobile dengan Ionic.
            Silakan unduh sertifikat kelulusan Anda.
          </p>
          <Link
            href="/certificate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-success text-white rounded-xl font-bold hover:bg-success/90 hover:scale-105 transition-all shadow-lg shadow-success/25"
          >
            Lihat Sertifikat
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </section>
      )}
    </Layout>
  );
}
