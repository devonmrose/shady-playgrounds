import { useState, useEffect, useCallback } from 'react';
import type { Location, LocationType } from './types';
import { locations, getLocationById } from './data/locations';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { useFilters } from './hooks/useFilters';
import HomeScreen from './components/HomeScreen';
import MapView from './components/MapView';
import FavoritesPanel from './components/FavoritesPanel';

type View = 'home' | 'map';

function getSharedLocationFromURL(): string | null {
  try {
    return new URLSearchParams(window.location.search).get('location');
  } catch {
    return null;
  }
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const { favorites, toggleFavorite } = useFavorites();
  const { isDark, toggleTheme } = useTheme();
  const { activeFilter, setFilter, filteredLocations } = useFilters(locations);

  // Handle shared URL on mount
  useEffect(() => {
    const sharedId = getSharedLocationFromURL();
    if (sharedId) {
      const loc = getLocationById(sharedId);
      if (loc) {
        setSelectedLocation(loc);
        setView('map');
        // Clean up URL without navigating
        const url = new URL(window.location.href);
        url.searchParams.delete('location');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

  const handleSelectCategory = useCallback((type: LocationType | null) => {
    setFilter(type);
    setView('map');
  }, [setFilter]);

  const handleSelectLocation = useCallback((loc: Location) => {
    setSelectedLocation(loc);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedLocation(null);
    setView('home');
  }, []);

  return (
    <div className={isDark ? 'dark' : ''}>
      {view === 'home' ? (
        <HomeScreen
          onSelectCategory={handleSelectCategory}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <MapView
          locations={locations}
          filteredLocations={filteredLocations}
          activeFilter={activeFilter}
          selectedLocation={selectedLocation}
          favoriteIds={favorites}
          isDark={isDark}
          onBack={handleBack}
          onSelectLocation={handleSelectLocation}
          onCloseDetail={handleCloseDetail}
          onFilterChange={setFilter}
          onToggleFavorite={toggleFavorite}
          onToggleTheme={toggleTheme}
          onShowFavorites={() => setShowFavorites(true)}
        />
      )}

      {showFavorites && (
        <FavoritesPanel
          favoriteIds={favorites}
          allLocations={locations}
          onSelectLocation={(loc) => {
            setSelectedLocation(loc);
            setView('map');
            setShowFavorites(false);
          }}
          onToggleFavorite={toggleFavorite}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </div>
  );
}
