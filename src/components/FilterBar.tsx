import type { FilterType } from '../hooks/useFilters';
import { TYPE_EMOJIS } from '../constants';

interface FilterOption {
  type: FilterType;
  label: string;
  emoji: string;
}

const FILTERS: FilterOption[] = [
  { type: null,                label: 'All',          emoji: '🗺️' },
  { type: 'playground',        label: 'Playgrounds',  emoji: TYPE_EMOJIS['playground'] },
  { type: 'park',              label: 'Parks',        emoji: TYPE_EMOJIS['park'] },
  { type: 'splash-pad',        label: 'Splash Pads',  emoji: TYPE_EMOJIS['splash-pad'] },
  { type: 'basketball-court',  label: 'Basketball',   emoji: TYPE_EMOJIS['basketball-court'] },
  { type: 'tennis-court',      label: 'Tennis',       emoji: TYPE_EMOJIS['tennis-court'] },
  { type: 'fields',            label: 'Fields',       emoji: '⚽' },
  { type: 'baseball-diamond',  label: 'Baseball',     emoji: TYPE_EMOJIS['baseball-diamond'] },
  { type: 'skate-park',        label: 'Skate Parks',  emoji: TYPE_EMOJIS['skate-park'] },
  { type: 'rec-center',        label: 'Rec Centers',  emoji: TYPE_EMOJIS['rec-center'] },
  { type: 'multi-sport-court', label: 'Multi-Sport',  emoji: TYPE_EMOJIS['multi-sport-court'] },
  { type: 'pocket-park',       label: 'Pocket Parks', emoji: TYPE_EMOJIS['pocket-park'] },
];

interface Props {
  activeFilter: FilterType;
  onFilterChange: (type: FilterType) => void;
  resultCount?: number;
}

export default function FilterBar({ activeFilter, onFilterChange, resultCount }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
      {FILTERS.map((f) => {
        const isActive = f.type === activeFilter || (f.type === null && activeFilter === null);
        return (
          <button
            key={f.label}
            onClick={() => onFilterChange(f.type)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-heading
              whitespace-nowrap transition-all duration-200
              ${isActive
                ? 'bg-leafy-green text-white shadow-warm scale-105'
                : 'bg-cloud-white/90 dark:bg-slate-700/90 text-earth-brown dark:text-slate-200 border-2 border-earth-brown/15 hover:border-leafy-green/40 hover:bg-leafy-green/10'
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
