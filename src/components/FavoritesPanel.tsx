import { Heart, X, MapPin } from 'lucide-react';
import type { Location } from '../types';
import { TYPE_EMOJIS } from '../constants';
import { SHADE_LABELS, SHADE_COLORS } from '../utils/shadeCalculator';

interface Props {
  favoriteIds: string[];
  allLocations: Location[];
  onSelectLocation: (loc: Location) => void;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

export default function FavoritesPanel({
  favoriteIds,
  allLocations,
  onSelectLocation,
  onToggleFavorite,
  onClose,
}: Props) {
  const favoriteLocations = allLocations.filter((loc) =>
    favoriteIds.includes(loc.id)
  );

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-end md:items-center justify-center
        bg-black/40 backdrop-blur-sm
        animate-fade-in
      "
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="
          w-full md:w-[420px] max-h-[85vh] flex flex-col
          bg-white dark:bg-slate-800
          rounded-t-3xl md:rounded-3xl
          shadow-2xl
          animate-slide-up md:animate-fade-in
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center">
              <Heart size={16} className="text-rose-500 fill-rose-500" />
            </div>
            <h2 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
              Saved Spots
            </h2>
            {favoriteLocations.length > 0 && (
              <span className="text-xs font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full">
                {favoriteLocations.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-body">
          {favoriteLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="text-5xl animate-bounce-gentle">🌳</div>
              <div>
                <p className="font-semibold text-slate-600 dark:text-slate-300">No saved spots yet</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Tap the{' '}
                  <Heart size={13} className="inline text-rose-400" />{' '}
                  on any location to save it here.
                </p>
              </div>
            </div>
          ) : (
            favoriteLocations.map((loc) => {
              const shadeColors = SHADE_COLORS[loc.shadeScore];
              return (
                <div
                  key={loc.id}
                  className="
                    flex items-center gap-3 p-3 rounded-xl
                    bg-slate-50 dark:bg-slate-700/50
                    border border-slate-100 dark:border-slate-700
                  "
                >
                  <span className="text-2xl shrink-0">{TYPE_EMOJIS[loc.type] ?? '📍'}</span>
                  <button
                    className="min-w-0 flex-1 text-left"
                    onClick={() => { onSelectLocation(loc); onClose(); }}
                  >
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                      {loc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${shadeColors.bg} ${shadeColors.text}`}>
                        {SHADE_LABELS[loc.shadeScore]}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <MapPin size={10} />
                        {loc.neighborhood}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => onToggleFavorite(loc.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Heart size={16} className="text-rose-500 fill-rose-500" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
