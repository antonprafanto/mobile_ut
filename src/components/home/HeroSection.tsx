'use client';

import React from 'react';
import Link from 'next/link';
import { StatsCard } from './StatsCard';

interface HeroSectionProps {
    completedCount: number;
    totalModules: number;
    progress: number;
    firstModuleSlug: string;
}

export function HeroSection({ completedCount, totalModules, progress, firstModuleSlug }: HeroSectionProps) {
    return (
        <section className="relative mb-16 pt-8 pb-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium mb-6 animate-fade-in-up">
                        <span className="animate-pulse">🎓</span>
                        <span>Universitas Terbuka</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        Pemrograman <br className="hidden lg:block" />
                        <span className="text-gradient">Piranti Bergerak</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Kuasai pengembangan aplikasi mobile modern dengan Ionic Framework.
                        Materi komprehensif dari dasar hingga deployment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <Link
                            href={`/modules/${firstModuleSlug}`}
                            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-hover hover:scale-105 transition-all shadow-lg shadow-primary/25 w-full sm:w-auto"
                        >
                            Mulai Belajar
                        </Link>
                        <a
                            href="#modules"
                            className="px-8 py-4 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-muted hover:scale-105 transition-all w-full sm:w-auto"
                        >
                            Lihat Silabus
                        </a>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-md lg:max-w-full animate-scale-in" style={{ animationDelay: '0.4s' }}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl transform rotate-6" />
                        <StatsCard
                            completedCount={completedCount}
                            totalModules={totalModules}
                            progress={progress}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
