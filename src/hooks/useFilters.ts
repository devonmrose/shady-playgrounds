import { useState, useCallback } from 'react';
import type { LocationType, Location } from '../types';

export function useFilters(allLocations: Location[]) {
  const [activeFilter, setActiveFilter] = useState<LocationType | null>(null);

  const setFilter = useCallback((type: LocationType | null) => {
    setActiveFilter(type);
  }, []);

  const filteredLocations = activeFilter
    ? allLocations.filter((loc) => loc.type === activeFilter)
    : allLocations;

  return { activeFilter, setFilter, filteredLocations };
}
