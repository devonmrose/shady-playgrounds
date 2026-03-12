import type { SunProfile, HourlyShade, LocationType } from '../types';
import { SUN_INTENSITY, getShadeLevel } from './shadeCalculator';

const DISPLAY_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const HOUR_LABELS: Record<number, string> = {
  6: '6 AM', 7: '7 AM', 8: '8 AM', 9: '9 AM', 10: '10 AM',
  11: '11 AM', 12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM',
  16: '4 PM', 17: '5 PM', 18: '6 PM', 19: '7 PM', 20: '8 PM',
};

/** Extra building shade bonus for dense urban locations */
function buildingBonus(type: LocationType): number {
  if (type === 'pocket-park') return 12;
  if (type === 'rec-center') return 8;
  if (type === 'basketball-court' || type === 'multi-sport-court') return 5;
  return 0;
}

function getBestPlayTimeLabel(start: number): string {
  if (start <= 8) return 'Early Morning';
  if (start <= 10) return 'Morning';
  if (start <= 12) return 'Late Morning';
  if (start <= 14) return 'Early Afternoon';
  if (start <= 16) return 'Afternoon';
  return 'Evening';
}

export function generateSunProfile(canopy: number, type: LocationType): SunProfile {
  const bonus = buildingBonus(type);
  const effectiveCanopy = Math.min(100, canopy + bonus);

  const hourly: HourlyShade[] = DISPLAY_HOURS.map((hour) => ({
    hour,
    shade: getShadeLevel(SUN_INTENSITY[hour] ?? 0, effectiveCanopy),
    label: HOUR_LABELS[hour],
  }));

  // Find best consecutive shade window in daytime hours (7 AM–8 PM)
  const playHours = hourly.filter((h) => h.hour >= 7 && h.hour <= 19);

  let bestStart = playHours[0]?.hour ?? 7;
  let bestEnd = bestStart + 1;
  let bestScore = 0;

  for (let i = 0; i < playHours.length; i++) {
    for (let j = i + 1; j < playHours.length; j++) {
      const window = playHours.slice(i, j + 1);
      const score = window.reduce((s, h) => {
        if (h.shade === 'full-shade') return s + 3;
        if (h.shade === 'partial-shade') return s + 1;
        return s;
      }, 0);
      // Prefer morning windows (family-friendly bias)
      const morningBias = playHours[i].hour <= 10 ? 2 : 0;
      if (score + morningBias > bestScore) {
        bestScore = score + morningBias;
        bestStart = playHours[i].hour;
        bestEnd = playHours[j].hour;
      }
    }
  }

  // Clamp window width to 3 hours max for display
  if (bestEnd - bestStart > 3) bestEnd = bestStart + 3;

  let note: string;
  if (effectiveCanopy >= 75) {
    note = 'Great canopy coverage all day';
  } else if (effectiveCanopy >= 55) {
    note = 'Best in morning and late afternoon';
  } else if (effectiveCanopy >= 35) {
    note = 'Most comfortable before 10 AM or after 4 PM';
  } else {
    note = 'Limited shade — bring sunscreen!';
  }

  return {
    hourly,
    bestPlayTime: getBestPlayTimeLabel(bestStart),
    bestHours: { start: bestStart, end: bestEnd },
    note,
  };
}
