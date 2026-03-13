import { useState, useMemo } from 'react';
import type { LocationType, Location } from '../types';

// 'fields' is a UI-only aggregated filter that matches both soccer-field and open-field
export type FilterType = LocationType | 'fields' | null;

const FIELD_TYPES = new Set<LocationType>(['soccer-field', 'open-field']);

export function useFilters(allLocations: Location[]) {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const filteredLocations = useMemo(() => {
    if (!activeFilter) return allLocations;
    if (activeFilter === 'fields') return allLocations.filter(
      (loc) => FIELD_TYPES.has(loc.type) || loc.secondaryTypes?.some((t) => FIELD_TYPES.has(t))
    );
    return allLocations.filter(
      (loc) => loc.type === activeFilter || loc.secondaryTypes?.includes(activeFilter)
    );
  }, [activeFilter, allLocations]);

  return { activeFilter, setFilter: setActiveFilter, filteredLocations };
}
