'use client';

import React, { useState, useEffect } from 'react';
import { isOnline, registerOfflineListeners } from '@/lib/offline';

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const cleanup = registerOfflineListeners(
      () => {
        setOnline(true);
        setShowRestored(true);
        setTimeout(() => setShowRestored(false), 3000);
      },
      () => {
        setOnline(false);
        setShowRestored(false);
      }
    );

    return cleanup;
  }, []);

  if (online && !showRestored) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
        online
          ? 'bg-success text-white'
          : 'bg-warning text-white'
      }`}
      role="status"
      aria-live="polite"
    >
      {online ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Koneksi dipulihkan</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l6.921 6.922c.05.062.105.118.168.167l6.91 6.911a1 1 0 001.415-1.414l-.675-.675a9.001 9.001 0 00-.668-11.982A1 1 0 1014.95 5.05a7.002 7.002 0 01.657 9.143l-1.435-1.435a5.002 5.002 0 00-.636-6.294A1 1 0 0012.12 7.88a3 3 0 01.587 3.415l-1.992-1.992a.922.922 0 00-.018-.018l-6.99-6.991zM3.238 8.187a1 1 0 00-1.933-.518c-.115.43-.185.876-.185 1.331 0 1.657.675 3.157 1.764 4.243l1.414-1.414A4.002 4.002 0 013.238 8.187z" clipRule="evenodd" />
          </svg>
          <span>Mode Offline</span>
        </>
      )}
    </div>
  );
}

export default OfflineIndicator;
