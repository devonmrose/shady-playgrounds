import type { ShadeLevel, ShadeValue } from '../types';

/** Approximate sun intensity per hour (Philadelphia summer, EDT, solar noon ~1 PM) */
export const SUN_INTENSITY: Record<number, number> = {
  5: 0.01,
  6: 0.06,
  7: 0.18,
  8: 0.35,
  9: 0.53,
  10: 0.70,
  11: 0.84,
  12: 0.94,
  13: 1.00,
  14: 0.96,
  15: 0.83,
  16: 0.65,
  17: 0.45,
  18: 0.26,
  19: 0.12,
  20: 0.03,
  21: 0.00,
};

/**
 * Compute shade level for a given sun intensity and canopy coverage.
 * @param intensity 0–1 sun intensity
 * @param canopy 0–100 canopy/building shade percentage
 */
export function getShadeLevel(intensity: number, canopy: number): ShadeValue {
  if (intensity <= 0.01) return 'night';
  const effectiveSun = intensity * (1 - canopy / 100);
  if (effectiveSun < 0.22) return 'full-shade';
  if (effectiveSun < 0.52) return 'partial-shade';
  return 'mostly-sunny';
}

/**
 * Compute the overall shade score for a location based on its canopy,
 * averaged across core daylight hours (8 AM – 6 PM).
 */
export function computeShadeScore(canopy: number): ShadeLevel {
  const daytimeHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const avgIntensity =
    daytimeHours.reduce((sum, h) => sum + (SUN_INTENSITY[h] ?? 0), 0) /
    daytimeHours.length;
  const effectiveSun = avgIntensity * (1 - canopy / 100);
  if (effectiveSun < 0.22) return 'full-shade';
  if (effectiveSun < 0.52) return 'partial-shade';
  return 'mostly-sunny';
}

export const SHADE_LABELS: Record<ShadeLevel, string> = {
  'full-shade': 'Full Shade',
  'partial-shade': 'Partial Shade',
  'mostly-sunny': 'Mostly Sunny',
};

export const SHADE_COLORS: Record<ShadeLevel, { bg: string; text: string; dot: string }> = {
  'full-shade': {
    bg: 'bg-emerald-100 dark:bg-emerald-900/60',
    text: 'text-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  'partial-shade': {
    bg: 'bg-amber-100 dark:bg-amber-900/60',
    text: 'text-amber-800 dark:text-amber-200',
    dot: 'bg-amber-400',
  },
  'mostly-sunny': {
    bg: 'bg-orange-100 dark:bg-orange-900/60',
    text: 'text-orange-800 dark:text-orange-200',
    dot: 'bg-orange-500',
  },
};
