import { Heart, X, MapPin, ChevronDown } from 'lucide-react';
import type { Location } from '../types';
import { TYPE_LABELS, TYPE_EMOJIS } from '../constants';
import { SHADE_LABELS } from '../utils/shadeCalculator';
import SunProfileTimeline from './SunProfileTimeline';
import NearbyLocations from './NearbyLocations';
import ShareButton from './ShareButton';
import { useWeather } from '../hooks/useWeather';
import { usePlacePhoto } from '../hooks/usePlacePhoto';

interface Props {
  location: Location;
  allLocations: Location[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectLocation: (loc: Location) => void;
  isMobile: boolean;
}

/** OpenStreetMap embed URL showing the exact location with a pin */
function osmEmbedUrl(lat: number, lng: number) {
  const delta = 0.004;
  const bbox = `${lng - delta},${lat - delta * 0.6},${lng + delta},${lat + delta * 0.6}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

function LocationHero({ location }: { location: Location }) {
  const emoji = TYPE_EMOJIS[location.type] ?? '📍';
  const [lat, lng] = location.coordinates;
  const { photoUrl, ready } = usePlacePhoto(location.name, lat, lng);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '180px' }}>
      {/* Show Google user photo once ready; fall back to OSM map embed */}
      {ready && photoUrl ? (
        <img
          src={photoUrl}
          alt={location.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <iframe
          key={location.id}
          src={osmEmbedUrl(lat, lng)}
          title={`Map of ${location.name}`}
          style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
          loading="lazy"
          scrolling="no"
        />
      )}
      {/* Gradient fade at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #FAFAF8, transparent)' }} />
      {/* Type badge */}
      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 border border-white/30 shadow"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)' }}>
        <span className="text-sm">{emoji}</span>
        <span className="text-xs font-bold font-heading" style={{ color: '#8D6E63' }}>
          {TYPE_LABELS[location.type] ?? location.type}
        </span>
      </div>
    </div>
  );
}

function WeatherStrip({ lat, lng }: { lat: number; lng: number }) {
  const { weather, status } = useWeather(lat, lng);

  if (status === 'loading') {
    return (
      <div className="bg-sky-blue/10 border border-sky-blue/20 rounded-2xl px-4 py-3 animate-pulse">
        <div className="h-4 bg-sky-blue/20 rounded w-1/2 mb-2" />
        <div className="h-3 bg-sky-blue/10 rounded w-3/4" />
      </div>
    );
  }

  if (!weather || status === 'error') return null;

  return (
    <div className="bg-sky-blue/10 border-2 border-sky-blue/20 rounded-2xl px-4 py-3.5">
      <h3 className="font-heading font-bold text-sm text-earth-brown dark:text-slate-200 mb-2.5 flex items-center gap-1.5">
        <span>🌤️</span> Today's Weather
      </h3>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl leading-none">{weather.emoji}</span>
          <div>
            <p className="font-heading font-bold text-earth-brown dark:text-slate-100 leading-tight">
              {weather.label}
            </p>
            <p className="text-xs font-semibold text-earth-brown/60 dark:text-slate-400 mt-0.5">
              {weather.tempHighF}° / {weather.tempLowF}° &middot; {weather.precipChance}% rain
            </p>
          </div>
        </div>
        {weather.isGoodForPlay ? (
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-leafy-green/20 text-leafy-green">
            ✓ Great day to play!
          </span>
        ) : (
          <a
            href="https://www.accuweather.com/en/us/philadelphia/19103/weather-forecast/350540"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-3 py-1.5 rounded-full bg-sunset-orange/20 text-sunset-orange hover:bg-sunset-orange/30 transition-colors"
          >
            Check conditions ↗
          </a>
        )}
      </div>
    </div>
  );
}

function shadeChipColors(score: string) {
  switch (score) {
    case 'full-shade':    return 'bg-leafy-green/20 text-leafy-green border-leafy-green/30';
    case 'partial-shade': return 'bg-sunshine-yellow/25 text-earth-brown border-sunshine-yellow/40';
    case 'mostly-sunny':  return 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
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
  const content = (
    <div className="flex flex-col h-full font-body overflow-hidden">
      {/* Drag handle (mobile only) */}
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-earth-brown/20 rounded-full" />
        </div>
      )}

      {/* Hero header */}
      <div className="shrink-0 relative">
        <LocationHero location={location} />
        {/* Close button overlaid top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-cloud-white dark:bg-slate-700 text-earth-brown dark:text-slate-200 shadow-warm-lg border-2 border-earth-brown/20 dark:border-slate-600 hover:bg-earth-brown/10 dark:hover:bg-slate-600 transition-colors"
          aria-label="Close"
        >
          {isMobile ? <ChevronDown size={18} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Name + shade chip */}
      <div className="px-5 pt-1 pb-3 shrink-0">
        <h2 className="font-heading font-bold text-xl text-earth-brown dark:text-slate-100 leading-tight">
          {location.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${shadeChipColors(location.shadeScore)}`}>
            {SHADE_LABELS[location.shadeScore]}
          </span>
          {location.neighborhood && (
            <span className="flex items-center gap-1 text-xs text-earth-brown/50 font-semibold">
              <MapPin size={11} />
              {location.address ?? location.neighborhood}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable content — iOS needs -webkit-overflow-scrolling */}
      <div
        className="flex-1 overflow-y-auto px-5 space-y-4"
        style={{
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 16px))',
        }}
      >
        {/* Description */}
        <p className="text-sm text-earth-brown/80 dark:text-slate-300 leading-relaxed font-medium">
          {location.description}
        </p>

        {/* Tags */}
        {location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {location.tags.map((tag) => (
              <span key={tag} className="text-[11px] font-bold bg-leafy-green/10 text-leafy-green px-2 py-0.5 rounded-full border border-leafy-green/20">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Weather */}
        <WeatherStrip lat={location.coordinates[0]} lng={location.coordinates[1]} />

        {/* Sun Profile */}
        <div>
          <h3 className="font-heading font-bold text-sm text-earth-brown dark:text-slate-200 mb-3 flex items-center gap-2">
            <span>☀️</span> Sun Through the Day
          </h3>
          <SunProfileTimeline sunProfile={location.sunProfile} />
        </div>

        {/* Actions — Save + Share */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleFavorite(location.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold font-heading
              transition-all duration-200
              ${isFavorite
                ? 'bg-sunset-orange/20 text-sunset-orange border-2 border-sunset-orange/30'
                : 'bg-earth-brown/10 hover:bg-sunset-orange/10 text-earth-brown/70 border-2 border-transparent hover:border-sunset-orange/20'
              }
            `}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={15} strokeWidth={2} className={isFavorite ? 'fill-sunset-orange text-sunset-orange' : ''} />
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <ShareButton location={location} />
        </div>

        {/* Nearby Spots */}
        <div>
          <h3 className="font-heading font-bold text-sm text-earth-brown dark:text-slate-200 mb-3 flex items-center gap-2">
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
          fixed bottom-0 left-0 right-0
          bg-cloud-white dark:bg-slate-800
          rounded-t-3xl
          animate-slide-up
          flex flex-col
          overflow-hidden
        "
        style={{
          zIndex: 9999,
          boxShadow: '0 -4px 32px rgba(141,110,99,0.22)',
          maxHeight: '82svh',
          // Force GPU compositing so iOS Safari respects overflow:hidden + border-radius on iframes
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="
        w-[400px] shrink-0 h-full
        bg-cloud-white dark:bg-slate-800
        border-l-2 border-earth-brown/10 dark:border-slate-700
        flex flex-col
        animate-slide-in-right
        overflow-hidden
        shadow-warm-lg
      "
    >
      {content}
    </div>
  );
}
