import type { Location, ShadeLevel } from '../types';
import { haversineDistance, formatDistance } from '../utils/distanceCalculator';
import { SHADE_LABELS, SHADE_COLORS } from '../utils/shadeCalculator';
import { MapPin } from 'lucide-react';

const TYPE_EMOJIS: Record<string, string> = {
  playground: '🛝',
  park: '🌳',
  'splash-pad': '💦',
  'basketball-court': '🏀',
  'tennis-court': '🎾',
  'soccer-field': '⚽',
  'skate-park': '🛹',
  'rec-center': '🏫',
  'multi-sport-court': '🏆',
  'open-field': '🌿',
  'pocket-park': '🌺',
};

interface Props {
  currentLocation: Location;
  allLocations: Location[];
  onSelectLocation: (loc: Location) => void;
}

export default function NearbyLocations({ currentLocation, allLocations, onSelectLocation }: Props) {
  const nearby = allLocations
    .filter((loc) => loc.id !== currentLocation.id)
    .map((loc) => ({
      loc,
      distance: haversineDistance(currentLocation.coordinates, loc.coordinates),
    }))
    .filter(({ distance }) => distance <= 1.2)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  if (nearby.length === 0) {
    return (
      <p className="text-sm text-slate-400 dark:text-slate-500 font-body italic">
        No other spots within 1 mile.
      </p>
    );
  }

  return (
    <div className="space-y-2 font-body">
      {nearby.map(({ loc, distance }) => {
        const shadeColors = SHADE_COLORS[loc.shadeScore as ShadeLevel];
        return (
          <button
            key={loc.id}
            onClick={() => onSelectLocation(loc)}
            className="
              w-full flex items-center gap-3 p-3 rounded-xl text-left
              bg-slate-50 hover:bg-emerald-50
              dark:bg-slate-700/50 dark:hover:bg-emerald-900/30
              border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800
              transition-all duration-150 group
            "
          >
            <span className="text-xl shrink-0">{TYPE_EMOJIS[loc.type] ?? '📍'}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {loc.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${shadeColors.bg} ${shadeColors.text}`}>
                  {SHADE_LABELS[loc.shadeScore as ShadeLevel]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 shrink-0">
              <MapPin size={11} />
              {formatDistance(distance)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
