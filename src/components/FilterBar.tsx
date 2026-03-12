import type { LocationType } from '../types';

interface FilterOption {
  type: LocationType | null;
  label: string;
  emoji: string;
}

const FILTERS: FilterOption[] = [
  { type: null, label: 'All', emoji: '🗺️' },
  { type: 'playground', label: 'Playgrounds', emoji: '🛝' },
  { type: 'park', label: 'Parks', emoji: '🌳' },
  { type: 'splash-pad', label: 'Splash Pads', emoji: '💦' },
  { type: 'basketball-court', label: 'Basketball', emoji: '🏀' },
  { type: 'tennis-court', label: 'Tennis', emoji: '🎾' },
  { type: 'soccer-field', label: 'Soccer', emoji: '⚽' },
  { type: 'skate-park', label: 'Skate Parks', emoji: '🛹' },
  { type: 'rec-center', label: 'Rec Centers', emoji: '🏫' },
  { type: 'open-field', label: 'Open Fields', emoji: '🌿' },
  { type: 'multi-sport-court', label: 'Multi-Sport', emoji: '🏆' },
  { type: 'pocket-park', label: 'Pocket Parks', emoji: '🌺' },
];

interface Props {
  activeFilter: LocationType | null;
  onFilterChange: (type: LocationType | null) => void;
  resultCount?: number;
}

export default function FilterBar({ activeFilter, onFilterChange, resultCount }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
      {FILTERS.map((f) => {
        const isActive =
          f.type === activeFilter || (f.type === null && activeFilter === null);
        return (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.type)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold font-body
              whitespace-nowrap transition-all duration-200
              ${isActive
                ? 'bg-emerald-600 text-white shadow-md scale-105 dark:bg-emerald-500'
                : 'bg-white/90 dark:bg-slate-700/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-emerald-50 dark:hover:bg-slate-600'
              }
            `}
          >
            <span className="text-sm">{f.emoji}</span>
            {f.label}
            {isActive && resultCount !== undefined && (
              <span className="ml-1 bg-white/30 rounded-full px-1.5 text-[10px] font-bold">
                {resultCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { FILTERS };
