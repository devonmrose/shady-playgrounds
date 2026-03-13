import { X, MapPin } from 'lucide-react';
import type { Location } from '../types';
import { TYPE_EMOJIS } from '../constants';
import { SHADE_LABELS } from '../utils/shadeCalculator';

interface Props {
  favoriteIds: string[];
  allLocations: Location[];
  onSelectLocation: (loc: Location) => void;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}

function shadeChipColors(score: string) {
  switch (score) {
    case 'full-shade':    return 'bg-leafy-green/20 text-leafy-green';
    case 'partial-shade': return 'bg-sunshine-yellow/30 text-earth-brown';
    case 'mostly-sunny':  return 'bg-sunset-orange/20 text-sunset-orange';
    default: return 'bg-earth-brown/10 text-earth-brown/60';
  }
}

export default function FavoritesPanel({
  favoriteIds,
  allLocations,
  onSelectLocation,
  onToggleFavorite,
  onClose,
}: Props) {
  const favoriteLocations = allLocations.filter((loc) => favoriteIds.includes(loc.id));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-end bg-earth-brown/30 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="
          w-full md:w-[380px] max-h-[88vh] flex flex-col
          bg-cloud-white dark:bg-slate-800
          rounded-t-3xl md:rounded-3xl
          shadow-warm-lg
          border-t-2 border-earth-brown/10 md:border-2
          animate-slide-up md:animate-fade-in
          overflow-hidden
          md:mr-4 md:mb-4
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b-2 border-earth-brown/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sunset-orange/15 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="var(--sunset-orange)" stroke="var(--sunset-orange)" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2 className="font-heading font-bold text-lg text-earth-brown dark:text-slate-100">
              Saved Spots
            </h2>
            {favoriteLocations.length > 0 && (
              <span className="text-xs font-bold bg-sunset-orange/15 text-sunset-orange px-2 py-0.5 rounded-full">
                {favoriteLocations.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-earth-brown/10 text-earth-brown/50 hover:bg-earth-brown/20 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-body">
          {favoriteLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="text-5xl animate-bounce-gentle opacity-40">🌳</div>
              <div>
                <p className="font-heading font-bold text-earth-brown/50">No saved spots yet</p>
                <p className="text-sm text-earth-brown/40 mt-1 font-semibold">
                  Tap the ♡ on any location to save it here.
                </p>
              </div>
            </div>
          ) : (
            favoriteLocations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-earth-brown/5 border-2 border-earth-brown/10 hover:border-leafy-green/30 transition-colors"
              >
                <span className="text-2xl shrink-0">{TYPE_EMOJIS[loc.type] ?? '📍'}</span>
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => { onSelectLocation(loc); onClose(); }}
                >
                  <p className="text-sm font-bold text-earth-brown dark:text-slate-100 truncate font-heading hover:text-leafy-green transition-colors">
                    {loc.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${shadeChipColors(loc.shadeScore)}`}>
                      {SHADE_LABELS[loc.shadeScore]}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-earth-brown/50 font-semibold">
                      <MapPin size={10} />
                      {loc.neighborhood}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => onToggleFavorite(loc.id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-sunset-orange/10 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="var(--sunset-orange)" stroke="var(--sunset-orange)" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
