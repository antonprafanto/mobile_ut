'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { calculateScrollPercentage } from '@/lib/reading-progress';

interface ReadingProgressIndicatorProps {
  moduleId?: string;
}

export function ReadingProgressIndicator({ moduleId }: ReadingProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    const percentage = calculateScrollPercentage(scrollTop, scrollHeight, clientHeight);
    setProgress(percentage);

    // Show indicator after scrolling a bit
    setIsVisible(scrollTop > 100);

    // Find current section from headings
    const headings = document.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      const offset = 150;
      let current = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= offset) {
          current = heading.textContent || '';
        }
      });

      setCurrentSection(current);
    }
  }, []);

  useEffect(() => {
    // Initial calculation
    updateProgress();

    // Use passive event listener for better performance
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [updateProgress]);

  return (
    <>
      {/* Progress bar at top */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current section indicator */}
      {isVisible && currentSection && (
        <div
          className="fixed top-4 right-4 z-40 hidden md:flex items-center gap-2 
                     px-3 py-1.5 bg-card/90 backdrop-blur border border-border 
                     rounded-full shadow-sm text-xs text-muted-foreground
                     transition-opacity duration-300"
        >
          <span className="font-medium text-foreground">{progress}%</span>
          <span className="w-px h-3 bg-border" />
          <span className="max-w-[200px] truncate">{currentSection}</span>
        </div>
      )}
    </>
  );
}

export default ReadingProgressIndicator;
