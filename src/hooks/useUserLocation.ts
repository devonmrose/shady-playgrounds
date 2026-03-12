import { useState, useCallback } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface UseUserLocation {
  coords: [number, number] | null;
  status: Status;
  request: () => void;
}

export function useUserLocation(): UseUserLocation {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setStatus('success');
      },
      () => {
        setStatus('error');
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  }, []);

  return { coords, status, request };
}
