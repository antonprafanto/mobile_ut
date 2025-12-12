/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preference
 */
export function getAnimationDuration(defaultMs: number): number {
  if (prefersReducedMotion()) {
    return 0;
  }
  return defaultMs;
}

/**
 * Get animation class based on user preference
 */
export function getAnimationClass(animationClass: string): string {
  if (prefersReducedMotion()) {
    return '';
  }
  return animationClass;
}

/**
 * Check if animations should be enabled
 */
export function shouldAnimate(): boolean {
  return !prefersReducedMotion();
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  enabled: boolean;
  className: string;
}

/**
 * Get animation config based on user preference
 */
export function getAnimationConfig(
  defaultDuration: number,
  className: string
): AnimationConfig {
  const enabled = shouldAnimate();
  return {
    duration: enabled ? defaultDuration : 0,
    enabled,
    className: enabled ? className : '',
  };
}
