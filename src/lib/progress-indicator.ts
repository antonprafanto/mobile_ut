import { Module } from '@/types';
import { StoredProgress } from '@/types';

export interface ModuleProgressIndicator {
  moduleId: string;
  isComplete: boolean;
}

/**
 * Generate progress indicators for a list of modules based on stored progress
 */
export function getProgressIndicators(
  modules: Module[],
  progress: StoredProgress
): ModuleProgressIndicator[] {
  return modules.map((module) => ({
    moduleId: module.id,
    isComplete: progress.completedModules.includes(module.id),
  }));
}

/**
 * Check if progress indicators match the stored progress state
 */
export function validateProgressIndicators(
  indicators: ModuleProgressIndicator[],
  progress: StoredProgress
): boolean {
  for (const indicator of indicators) {
    const shouldBeComplete = progress.completedModules.includes(indicator.moduleId);
    if (indicator.isComplete !== shouldBeComplete) {
      return false;
    }
  }
  return true;
}

/**
 * Count completed modules from indicators
 */
export function countCompletedFromIndicators(indicators: ModuleProgressIndicator[]): number {
  return indicators.filter((i) => i.isComplete).length;
}
