'use client';

import React from 'react';
import Link from 'next/link';

interface ModuleCardProps {
    module: {
        id: string;
        slug: string;
        title: string;
        description: string;
        estimatedTime: number;
        order: number;
    };
    isComplete: boolean;
    index: number;
}

export function ModuleCard({ module, isComplete, index }: ModuleCardProps) {
    return (
        <Link
            href={`/modules/${module.slug}`}
            className="group block relative h-full"
        >
            <div
                className={`
          relative h-full p-6 rounded-2xl transition-all duration-500
          bg-card/50 backdrop-blur-sm border border-border/50
          hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10
          flex flex-col overflow-hidden
          ${isComplete ? 'border-success/30 bg-success/5' : 'hover:border-primary/30'}
        `}
            >
                {/* Gradient Blob Background Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500" />

                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div
                        className={`
              w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm
              transition-all duration-500
              ${isComplete
                                ? 'bg-gradient-to-br from-success to-emerald-600 text-white shadow-success/25'
                                : 'bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary group-hover:to-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25'
                            }
            `}
                    >
                        {isComplete ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span>{module.order}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-md">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {module.estimatedTime} min
                    </div>
                </div>

                <h3 className="relative z-10 text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {module.title}
                </h3>

                <p className="relative z-10 text-sm text-muted-foreground mb-8 line-clamp-3 flex-1 leading-relaxed">
                    {module.description}
                </p>

                <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md ${isComplete ? 'bg-success/10 text-success' : 'bg-primary/5 text-primary'}`}>
                        {isComplete ? 'Selesai' : 'Belum Selesai'}
                    </span>

                    <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                        {isComplete ? 'Review Materi' : 'Mulai Belajar'}
                        <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
