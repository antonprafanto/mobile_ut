import { Module } from '@/types';

// Sort modules by order property
export function sortModulesByOrder(modules: Module[]): Module[] {
  return [...modules].sort((a, b) => a.order - b.order);
}

// Check if modules are in correct order (progressive difficulty)
export function areModulesInOrder(modules: Module[]): boolean {
  for (let i = 1; i < modules.length; i++) {
    if (modules[i].order <= modules[i - 1].order) {
      return false;
    }
  }
  return true;
}

// Get module by ID
export function getModuleById(modules: Module[], id: string): Module | undefined {
  return modules.find(m => m.id === id);
}

// Get module by slug
export function getModuleBySlug(modules: Module[], slug: string): Module | undefined {
  return modules.find(m => m.slug === slug);
}

// Get next module
export function getNextModule(modules: Module[], currentId: string): Module | undefined {
  const sorted = sortModulesByOrder(modules);
  const currentIndex = sorted.findIndex(m => m.id === currentId);
  if (currentIndex === -1 || currentIndex === sorted.length - 1) {
    return undefined;
  }
  return sorted[currentIndex + 1];
}

// Get previous module
export function getPrevModule(modules: Module[], currentId: string): Module | undefined {
  const sorted = sortModulesByOrder(modules);
  const currentIndex = sorted.findIndex(m => m.id === currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return sorted[currentIndex - 1];
}

// Validate module has required fields
export function isValidModule(module: Partial<Module>): module is Module {
  return (
    typeof module.id === 'string' &&
    typeof module.title === 'string' &&
    typeof module.slug === 'string' &&
    typeof module.order === 'number' &&
    typeof module.description === 'string' &&
    Array.isArray(module.learningObjectives) &&
    module.learningObjectives.length > 0 &&
    typeof module.estimatedTime === 'number' &&
    Array.isArray(module.summary) &&
    module.summary.length > 0
  );
}
