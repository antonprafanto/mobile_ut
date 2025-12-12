import { ReadingProgressState } from '@/types';

/**
 * Calculate scroll percentage based on scroll position and document height
 */
export function calculateScrollPercentage(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  if (scrollHeight <= clientHeight) {
    return 100; // Content fits in viewport, consider it 100% read
  }
  
  const maxScroll = scrollHeight - clientHeight;
  const percentage = (scrollTop / maxScroll) * 100;
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

/**
 * Get current section based on visible headings
 */
export function getCurrentSection(headings: HTMLHeadingElement[]): string {
  if (headings.length === 0) return '';
  
  const scrollTop = window.scrollY;
  const offset = 100; // Offset for header
  
  // Find the last heading that's above the current scroll position
  let currentHeading = headings[0];
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    const absoluteTop = rect.top + scrollTop;
    
    if (absoluteTop <= scrollTop + offset) {
      currentHeading = heading;
    } else {
      break;
    }
  }
  
  return currentHeading.textContent || '';
}

/**
 * Create reading progress state
 */
export function createReadingProgressState(
  moduleId: string,
  scrollPercentage: number,
  currentSection: string
): ReadingProgressState {
  return {
    moduleId,
    scrollPercentage: Math.max(0, Math.min(100, scrollPercentage)),
    currentSection,
  };
}

/**
 * Validate reading progress percentage is within bounds
 */
export function isValidPercentage(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}
