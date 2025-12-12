import { StoredProgress, ProgressState } from '@/types';

const STORAGE_KEY = 'ionic-learning-progress';
const CURRENT_VERSION = 1;

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

// Validate stored progress data
export function validateProgressData(data: unknown): StoredProgress | null {
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;

  if (obj.version !== CURRENT_VERSION) return null;
  if (!Array.isArray(obj.completedModules)) return null;
  if (typeof obj.lastVisited !== 'string') return null;
  if (typeof obj.lastUpdated !== 'string') return null;

  // Validate all module IDs are strings
  const validCompleted = obj.completedModules.filter(
    (id): id is string => typeof id === 'string'
  );

  return {
    version: CURRENT_VERSION,
    completedModules: validCompleted,
    lastVisited: obj.lastVisited,
    lastUpdated: obj.lastUpdated,
    allCompleted: Boolean(obj.allCompleted),
    completionDate: typeof obj.completionDate === 'string' ? obj.completionDate : undefined,
  };
}

// Get progress from localStorage
export function getProgress(): StoredProgress {
  const defaultProgress: StoredProgress = {
    version: CURRENT_VERSION,
    completedModules: [],
    lastVisited: '',
    lastUpdated: new Date().toISOString(),
    allCompleted: false,
  };

  if (!isLocalStorageAvailable()) {
    return defaultProgress;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;

    const parsed = JSON.parse(stored);
    const validated = validateProgressData(parsed);
    return validated || defaultProgress;
  } catch {
    return defaultProgress;
  }
}

// Save progress to localStorage
export function saveProgress(progress: StoredProgress): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

// Mark a module as complete
export function markModuleComplete(moduleId: string, totalModules: number): StoredProgress {
  const progress = getProgress();

  if (!progress.completedModules.includes(moduleId)) {
    progress.completedModules.push(moduleId);
  }

  progress.lastUpdated = new Date().toISOString();

  // Check if all modules are completed
  if (progress.completedModules.length >= totalModules) {
    progress.allCompleted = true;
    progress.completionDate = progress.completionDate || new Date().toISOString();
  }

  saveProgress(progress);
  return progress;
}

// Mark a module as incomplete
export function markModuleIncomplete(moduleId: string): StoredProgress {
  const progress = getProgress();

  progress.completedModules = progress.completedModules.filter(id => id !== moduleId);
  progress.lastUpdated = new Date().toISOString();
  progress.allCompleted = false;

  saveProgress(progress);
  return progress;
}

// Check if a module is complete
export function isModuleComplete(moduleId: string): boolean {
  const progress = getProgress();
  return progress.completedModules.includes(moduleId);
}

// Update last visited module
export function updateLastVisited(moduleId: string): StoredProgress {
  const progress = getProgress();
  progress.lastVisited = moduleId;
  progress.lastUpdated = new Date().toISOString();
  saveProgress(progress);
  return progress;
}

// Clear all progress
export function clearProgress(): void {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Get completion percentage
export function getCompletionPercentage(totalModules: number): number {
  const progress = getProgress();
  if (totalModules === 0) return 0;
  return Math.round((progress.completedModules.length / totalModules) * 100);
}

// Convert StoredProgress to ProgressState
export function toProgressState(stored: StoredProgress): ProgressState {
  return {
    completedModules: stored.completedModules,
    lastVisited: stored.lastVisited,
    lastUpdated: new Date(stored.lastUpdated),
  };
}
