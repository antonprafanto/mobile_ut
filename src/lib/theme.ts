import { ThemeState } from '@/types';

const STORAGE_KEY = 'ionic-learning-theme';

export type ThemeMode = 'light' | 'dark';

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Get system color scheme preference
export function getSystemPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Get stored theme preference
export function getStoredTheme(): ThemeMode | null {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return null;
  } catch {
    return null;
  }
}

// Save theme preference
export function saveTheme(mode: ThemeMode): boolean {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    return true;
  } catch {
    return false;
  }
}

// Clear theme preference (use system default)
export function clearTheme(): void {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Get current theme (stored or system preference)
export function getCurrentTheme(): ThemeMode {
  const stored = getStoredTheme();
  if (stored) return stored;
  return getSystemPreference();
}

// Get full theme state
export function getThemeState(): ThemeState {
  const stored = getStoredTheme();
  return {
    mode: stored || getSystemPreference(),
    systemPreference: stored === null,
  };
}

// Toggle theme
export function toggleTheme(): ThemeMode {
  const current = getCurrentTheme();
  const newMode: ThemeMode = current === 'light' ? 'dark' : 'light';
  saveTheme(newMode);
  return newMode;
}

// Apply theme to document
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initialize theme on page load
export function initializeTheme(): ThemeMode {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
}

// Listen for system preference changes
export function onSystemPreferenceChange(callback: (mode: ThemeMode) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    // Only apply if user hasn't set a preference
    if (getStoredTheme() === null) {
      const newMode: ThemeMode = e.matches ? 'dark' : 'light';
      applyTheme(newMode);
      callback(newMode);
    }
  };
  
  mediaQuery.addEventListener('change', handler);
  
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
