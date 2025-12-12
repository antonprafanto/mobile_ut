'use client';

import React from 'react';

interface StatsCardProps {
    completedCount: number;
    totalModules: number;
    progress: number;
}

export function StatsCard({ completedCount, totalModules, progress }: StatsCardProps) {
    return (
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -ml-16 -mb-16 transition-all group-hover:bg-accent/10" />

            <h3 className="text-lg font-semibold text-muted-foreground mb-6">Progress Belajar Anda</h3>

            <div className="flex items-end justify-between mb-4">
                <div>
                    <span className="text-5xl font-bold text-foreground">{progress}%</span>
                    <span className="text-sm text-muted-foreground ml-2">Selesai</span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{completedCount}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Modul</div>
                </div>
            </div>

            <div className="w-full bg-muted rounded-full h-3 mb-6 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Total Modul</div>
                    <div className="font-semibold text-foreground">{totalModules} Materi</div>
                </div>
                <div>
                    <div className="text-xs text-muted-foreground mb-1">Estimasi Waktu</div>
                    <div className="font-semibold text-foreground">~12 Jam</div>
                </div>
            </div>
        </div>
    );
}
