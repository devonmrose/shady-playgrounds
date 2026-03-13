import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;

// Cache photo URLs so we don't re-fetch when the panel reopens
const cache = new Map<string, string | null>();

export function usePlacePhoto(name: string, lat: number, lng: number) {
  const cacheKey = `${name}|${lat}|${lng}`;
  const [photoUrl, setPhotoUrl] = useState<string | null>(
    cache.has(cacheKey) ? cache.get(cacheKey)! : null,
  );
  const [ready, setReady] = useState(cache.has(cacheKey));

  useEffect(() => {
    if (!API_KEY || cache.has(cacheKey)) return;

    let cancelled = false;

    fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.photos',
      },
      body: JSON.stringify({
        textQuery: `${name} Philadelphia`,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 500,
          },
        },
        maxResultCount: 1,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const photo = data?.places?.[0]?.photos?.[0];
        const url = photo
          ? `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${API_KEY}`
          : null;
        cache.set(cacheKey, url);
        setPhotoUrl(url);
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        cache.set(cacheKey, null);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, name, lat, lng]);

  return { photoUrl, ready };
}
