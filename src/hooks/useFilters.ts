import { useState, useMemo } from 'react';
import type { LocationType, Location } from '../types';

export function useFilters(allLocations: Location[]) {
  const [activeFilter, setActiveFilter] = useState<LocationType | null>(null);

  const filteredLocations = useMemo(
    () => activeFilter ? allLocations.filter((loc) => loc.type === activeFilter) : allLocations,
    [activeFilter, allLocations]
  );

  return { activeFilter, setFilter: setActiveFilter, filteredLocations };
}
