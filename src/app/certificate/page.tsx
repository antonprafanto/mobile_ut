'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { getProgress } from '@/lib/progress';
import { modules } from '@/data/modules';
import Link from 'next/link';

export default function CertificatePage() {
  const [studentName, setStudentName] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [completionDate, setCompletionDate] = useState<string | null>(null);
  const [isAllComplete, setIsAllComplete] = useState(false);

  useEffect(() => {
    const progress = getProgress();
    setCompletedCount(progress.completedModules.length);
    setIsAllComplete(progress.allCompleted);
    if (progress.completionDate) {
      setCompletionDate(new Date(progress.completionDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!isAllComplete) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Sertifikat Belum Tersedia
          </h1>
          <p className="text-muted-foreground mb-6">
            Selesaikan semua {modules.length} modul untuk mendapatkan sertifikat.
          </p>
          <div className="mb-6">
            <div className="text-sm text-muted-foreground mb-2">
              Progress: {completedCount} / {modules.length} modul
            </div>
            <div className="w-64 mx-auto bg-muted rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / modules.length) * 100}%` }}
              />
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Lanjutkan Belajar
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-card border-4 border-primary rounded-lg p-8 md:p-12 text-center print:border-2 print:shadow-none">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Selamat! 🎉
            </h1>
            <p className="text-muted-foreground">
              Anda telah menyelesaikan seluruh materi pembelajaran
            </p>
          </div>

          {/* Certificate Content */}
          <div className="border-t border-b border-border py-8 mb-8">
            <p className="text-sm text-muted-foreground mb-2">Sertifikat ini diberikan kepada</p>
            
            {/* Name Input */}
            <div className="mb-6">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="text-2xl font-bold text-center text-foreground bg-transparent border-b-2 border-dashed border-primary focus:outline-none focus:border-solid w-full max-w-md mx-auto print:border-solid"
              />
            </div>

            <p className="text-muted-foreground mb-4">
              atas keberhasilannya menyelesaikan mata kuliah
            </p>
            
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Pemrograman Piranti Bergerak
            </h2>
            
            <p className="text-sm text-muted-foreground">
              dengan menyelesaikan {modules.length} modul pembelajaran
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{modules.length}</div>
              <div className="text-sm text-muted-foreground">Modul Selesai</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {modules.reduce((acc, m) => acc + m.estimatedTime, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Menit Belajar</div>
            </div>
          </div>

          {/* Date */}
          {completionDate && (
            <p className="text-sm text-muted-foreground mb-6">
              Diselesaikan pada {completionDate}
            </p>
          )}

          {/* Footer */}
          <div className="text-sm text-muted-foreground">
            <p>Universitas Terbuka</p>
            <p>Program Studi Sistem Informasi</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-8 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Sertifikat
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </Layout>
  );
}
