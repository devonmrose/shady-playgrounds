import { useEffect, useRef, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Heart, Loader2, AlertTriangle, Navigation } from 'lucide-react';
import type { Location, LocationType } from '../types';
import { TYPE_EMOJIS } from '../constants';
import { haversineDistance, formatDistance } from '../utils/distanceCalculator';
import { useUserLocation } from '../hooks/useUserLocation';
import FilterBar from './FilterBar';
import LocationDetailPanel from './LocationDetailPanel';
import ThemeToggle from './ThemeToggle';

const SHADE_HEX: Record<string, { bg: string; border: string }> = {
  'full-shade': { bg: '#10b981', border: '#059669' },
  'partial-shade': { bg: '#fbbf24', border: '#d97706' },
  'mostly-sunny': { bg: '#f97316', border: '#ea580c' },
};

function createMarkerIcon(location: Location, selected: boolean): L.DivIcon {
  const colors = SHADE_HEX[location.shadeScore] ?? { bg: '#94a3b8', border: '#64748b' };
  const emoji = TYPE_EMOJIS[location.type] ?? '📍';
  const size = selected ? 44 : 34;
  const fontSize = selected ? 18 : 14;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        background:${colors.bg};
        border:${selected ? '3px' : '2px'} solid ${selected ? 'white' : colors.border};
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:${fontSize}px;
        box-shadow:${selected ? '0 0 0 3px ' + colors.bg + '66, 0 4px 12px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.25)'};
        cursor:pointer;
        transition:all 0.2s;
        line-height:1;
      ">${emoji}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

const USER_LOCATION_ICON = L.divIcon({
  className: '',
  html: `
    <div style="
      width:18px;height:18px;
      background:#3b82f6;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Fly to a location when selected */
function MapFlyTo({ coordinates }: { coordinates: [number, number] | null }) {
  const map = useMap();
  const prevCoord = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      coordinates &&
      (prevCoord.current?.[0] !== coordinates[0] ||
        prevCoord.current?.[1] !== coordinates[1])
    ) {
      map.flyTo(coordinates, Math.max(map.getZoom(), 15), { duration: 0.8 });
      prevCoord.current = coordinates;
    }
  }, [coordinates, map]);

  return null;
}

/** Dismiss the detail panel when the user clicks empty map space */
function MapClickDismiss({ onDismiss }: { onDismiss: () => void }) {
  useMapEvents({ click: onDismiss });
  return null;
}

interface Props {
  locations: Location[];
  filteredLocations: Location[];
  activeFilter: LocationType | null;
  selectedLocation: Location | null;
  favoriteIds: string[];
  isDark: boolean;
  onBack: () => void;
  onSelectLocation: (loc: Location) => void;
  onCloseDetail: () => void;
  onFilterChange: (type: LocationType | null) => void;
  onToggleFavorite: (id: string) => void;
  onToggleTheme: () => void;
  onShowFavorites: () => void;
}

export default function MapView({
  locations,
  filteredLocations,
  activeFilter,
  selectedLocation,
  favoriteIds,
  isDark,
  onBack,
  onSelectLocation,
  onCloseDetail,
  onFilterChange,
  onToggleFavorite,
  onToggleTheme,
  onShowFavorites,
}: Props) {
  const [mapError, setMapError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { coords: userCoords, status: locationStatus, request: requestLocation } = useUserLocation();

  useEffect(() => {
    const handleResize = () => {
      const next = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== next ? next : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When Near Me is active, sort filtered locations by distance from user
  const displayedLocations = useMemo(() => {
    if (!userCoords) return filteredLocations;
    return [...filteredLocations].sort(
      (a, b) =>
        haversineDistance(userCoords, a.coordinates) -
        haversineDistance(userCoords, b.coordinates)
    );
  }, [filteredLocations, userCoords]);

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Nearest spot distance label for the legend
  const nearestLabel = useMemo(() => {
    if (!userCoords || displayedLocations.length === 0) return null;
    const d = haversineDistance(userCoords, displayedLocations[0].coordinates);
    return `Nearest: ${formatDistance(d)}`;
  }, [userCoords, displayedLocations]);

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-cloud-white dark:bg-slate-900">
      {/* Main map area */}
      <div className="flex-1 relative flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="
          relative z-30 flex items-center gap-2 px-3 py-2
          bg-cloud-white/95 dark:bg-slate-900/95 backdrop-blur-sm
          border-b-2 border-earth-brown/10 dark:border-slate-800
          shadow-warm
        ">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold font-heading text-earth-brown/70 dark:text-slate-300 hover:bg-earth-brown/10 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Logo */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span className="text-lg">🌳</span>
            <span className="font-heading font-bold text-leafy-green text-sm">
              TreePatch
            </span>
          </div>

          {/* Filter bar */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <FilterBar
              activeFilter={activeFilter}
              onFilterChange={onFilterChange}
              resultCount={filteredLocations.length}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Near Me button */}
            <button
              onClick={requestLocation}
              disabled={locationStatus === 'loading'}
              title={
                locationStatus === 'error'
                  ? 'Location unavailable'
                  : locationStatus === 'success'
                  ? 'Re-center on my location'
                  : 'Find spots near me'
              }
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                border shadow-sm hover:shadow-md transition-all duration-200
                ${locationStatus === 'success'
                  ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
                  : locationStatus === 'error'
                  ? 'bg-white/90 dark:bg-slate-700/90 border-rose-300 dark:border-rose-700 text-rose-400'
                  : 'bg-white/90 dark:bg-slate-700/90 border-slate-200 dark:border-slate-600 text-slate-400 hover:text-blue-500 hover:scale-110'
                }
                ${locationStatus === 'loading' ? 'animate-pulse' : ''}
              `}
              aria-label="Near me"
            >
              <Navigation size={15} strokeWidth={2} className={locationStatus === 'success' ? '' : ''} />
            </button>

            <button
              onClick={onShowFavorites}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cloud-white/90 dark:bg-slate-700/90 border-2 border-earth-brown/15 shadow-warm hover:shadow-warm-lg transition-all duration-200 hover:scale-110"
              aria-label="Saved spots"
            >
              <Heart size={16} className={favoriteIds.length > 0 ? 'fill-sunset-orange text-sunset-orange' : 'text-earth-brown/40'} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sunset-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </button>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {mapLoading && !mapError && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-cloud-white dark:bg-slate-900">
              <div className="flex flex-col items-center gap-3">
                <div className="text-4xl animate-tree-sway">🌳</div>
                <p className="font-body text-earth-brown/60 dark:text-slate-400 text-sm font-semibold">Loading the map…</p>
                <Loader2 size={20} className="animate-spin text-leafy-green" />
              </div>
            </div>
          )}

          {mapError ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-emerald-50 dark:bg-slate-900">
              <div className="text-center p-8 max-w-sm">
                <div className="text-6xl mb-4">🌳</div>
                <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
                  <AlertTriangle size={18} />
                  <span className="font-heading font-semibold text-lg">Oops!</span>
                </div>
                <p className="font-body text-slate-600 dark:text-slate-300">
                  The trees are being mysterious today. Map couldn't load — but here are all the spots!
                </p>
              </div>
            </div>
          ) : (
            <MapContainer
              center={[39.9928, -75.1526]}
              zoom={12}
              className="w-full h-full"
              zoomControl={false}
              whenReady={() => setMapLoading(false)}
            >
              <ZoomControl position="bottomright" />
              <TileLayer
                url={tileUrl}
                attribution={tileAttribution}
                errorTileUrl="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                eventHandlers={{
                  tileerror: () => setMapError(true),
                }}
              />

              {/* Fly to selected spot or user location */}
              <MapFlyTo
                coordinates={selectedLocation ? selectedLocation.coordinates : userCoords}
              />

              {/* Dismiss panel on empty map click */}
              {selectedLocation && (
                <MapClickDismiss onDismiss={onCloseDetail} />
              )}

              {/* User location dot */}
              {userCoords && (
                <Marker position={userCoords} icon={USER_LOCATION_ICON} zIndexOffset={2000} />
              )}

              {displayedLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={loc.coordinates}
                  icon={createMarkerIcon(loc, selectedLocation?.id === loc.id)}
                  eventHandlers={{
                    click: () => onSelectLocation(loc),
                  }}
                  zIndexOffset={selectedLocation?.id === loc.id ? 1000 : 0}
                />
              ))}
            </MapContainer>
          )}

          {/* Floating shade legend + spot count */}
          {!mapLoading && !mapError && (
            <div className="
              absolute bottom-4 left-3 z-20
              bg-cloud-white/95 dark:bg-slate-800/95 backdrop-blur-sm
              rounded-2xl shadow-warm border-2 border-earth-brown/10 dark:border-slate-700
              px-3 py-2 flex flex-col gap-2 font-body
            ">
              {/* Spot count + near me info */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-earth-brown dark:text-slate-300">
                  {filteredLocations.length} spot{filteredLocations.length !== 1 ? 's' : ''} on map
                </span>
                {activeFilter && (
                  <button
                    onClick={() => onFilterChange(null)}
                    className="text-[10px] font-bold text-leafy-green hover:underline"
                  >
                    Show all
                  </button>
                )}
              </div>
              {/* Nearest spot row */}
              {nearestLabel && (
                <div className="flex items-center gap-1.5">
                  <Navigation size={10} className="text-sky-blue shrink-0" />
                  <span className="text-[11px] text-sky-blue font-semibold">{nearestLabel}</span>
                </div>
              )}
              {/* Legend */}
              <div className="flex items-center gap-3">
                {[
                  { color: 'bg-leafy-green', label: 'Full Shade' },
                  { color: 'bg-sunshine-yellow', label: 'Partial' },
                  { color: 'bg-sunset-orange', label: 'Sunny' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-[11px] text-earth-brown/60 dark:text-slate-400 font-semibold">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Mobile detail panel */}
        {selectedLocation && isMobile && (
          <LocationDetailPanel
            location={selectedLocation}
            allLocations={locations}
            isFavorite={favoriteIds.includes(selectedLocation.id)}
            onToggleFavorite={onToggleFavorite}
            onClose={onCloseDetail}
            onSelectLocation={onSelectLocation}
            isMobile={true}
          />
        )}
      </div>

      {/* Desktop: right panel */}
      {selectedLocation && !isMobile && (
        <LocationDetailPanel
          location={selectedLocation}
          allLocations={locations}
          isFavorite={favoriteIds.includes(selectedLocation.id)}
          onToggleFavorite={onToggleFavorite}
          onClose={onCloseDetail}
          onSelectLocation={onSelectLocation}
          isMobile={false}
        />
      )}
    </div>
  );
}
