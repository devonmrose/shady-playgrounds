import { Heart, X, MapPin, ChevronDown } from 'lucide-react';
import type { Location } from '../types';
import { TYPE_EMOJIS, TYPE_LABELS } from '../constants';
import { SHADE_LABELS, SHADE_COLORS } from '../utils/shadeCalculator';
import SunProfileTimeline from './SunProfileTimeline';
import NearbyLocations from './NearbyLocations';
import ShareButton from './ShareButton';

interface Props {
  location: Location;
  allLocations: Location[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectLocation: (loc: Location) => void;
  isMobile: boolean;
}

export default function LocationDetailPanel({
  location,
  allLocations,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectLocation,
  isMobile,
}: Props) {
  const shadeColors = SHADE_COLORS[location.shadeScore];

  const content = (
    <div className="flex flex-col h-full font-body">
      {/* Drag handle (mobile only) */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-600 rounded-full" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="text-3xl shrink-0 mt-0.5">{TYPE_EMOJIS[location.type] ?? '📍'}</span>
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100 leading-tight">
              {location.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs font-semibold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">
                {TYPE_LABELS[location.type] ?? location.type}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${shadeColors.bg} ${shadeColors.text}`}>
                {SHADE_LABELS[location.shadeScore]}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          aria-label="Close"
        >
          {isMobile ? <ChevronDown size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-5">
        {/* Neighborhood */}
        {(location.neighborhood || location.address) && (
          <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <MapPin size={13} className="shrink-0" />
            <span>{location.address ?? location.neighborhood}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {location.description}
        </p>

        {/* Tags */}
        {location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {location.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Sun Profile */}
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span>☀️</span> Sun Through the Day
          </h3>
          <SunProfileTimeline sunProfile={location.sunProfile} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleFavorite(location.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              transition-all duration-200
              ${isFavorite
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                : 'bg-slate-100 hover:bg-rose-50 text-slate-700 dark:bg-slate-700 dark:hover:bg-rose-900/30 dark:text-slate-200'
              }
            `}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={15}
              strokeWidth={2}
              className={isFavorite ? 'fill-rose-500 text-rose-500' : ''}
            />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <ShareButton location={location} />
        </div>

        {/* Nearby Spots */}
        <div>
          <h3 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span>📍</span> More Nearby Spots
          </h3>
          <NearbyLocations
            currentLocation={location}
            allLocations={allLocations}
            onSelectLocation={onSelectLocation}
          />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div
        className="
          fixed bottom-0 left-0 right-0 z-40
          bg-white dark:bg-slate-800
          rounded-t-3xl shadow-2xl
          animate-slide-up
          max-h-[72vh] flex flex-col
        "
        style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.18)' }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="
        w-[400px] shrink-0 h-full
        bg-white dark:bg-slate-800
        border-l border-slate-100 dark:border-slate-700
        flex flex-col
        animate-slide-in-right
        overflow-hidden
      "
    >
      {content}
    </div>
  );
}
