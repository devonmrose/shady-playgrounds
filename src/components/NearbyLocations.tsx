import { useMemo } from 'react';
import type { Location, ShadeLevel } from '../types';
import { haversineDistance, formatDistance } from '../utils/distanceCalculator';
import { SHADE_LABELS, SHADE_COLORS } from '../utils/shadeCalculator';
import { TYPE_EMOJIS } from '../constants';
import { MapPin } from 'lucide-react';

interface Props {
  currentLocation: Location;
  allLocations: Location[];
  onSelectLocation: (loc: Location) => void;
}

export default function NearbyLocations({ currentLocation, allLocations, onSelectLocation }: Props) {
  const nearby = useMemo(() =>
    allLocations
      .filter((loc) => loc.id !== currentLocation.id)
      .map((loc) => ({
        loc,
        distance: haversineDistance(currentLocation.coordinates, loc.coordinates),
      }))
      .filter(({ distance }) => distance <= 1.5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10),
    [currentLocation.id, currentLocation.coordinates, allLocations]
  );

  if (nearby.length === 0) {
    return (
      <p className="text-sm text-earth-brown/50 font-body italic font-semibold">
        No other spots within 1.5 miles.
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
              w-full flex items-center gap-3 p-2.5 rounded-xl text-left
              bg-earth-brown/5 hover:bg-leafy-green/10
              dark:bg-slate-700/50 dark:hover:bg-leafy-green/10
              border-2 border-transparent hover:border-leafy-green/25
              transition-all duration-150 group
            "
          >
            <span className="text-xl shrink-0">{TYPE_EMOJIS[loc.type] ?? '📍'}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-earth-brown dark:text-slate-100 truncate group-hover:text-leafy-green transition-colors font-heading">
                {loc.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${shadeColors.bg} ${shadeColors.text}`}>
                  {SHADE_LABELS[loc.shadeScore as ShadeLevel]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-earth-brown/50 dark:text-slate-500 shrink-0 font-semibold">
              <MapPin size={11} />
              {formatDistance(distance)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
