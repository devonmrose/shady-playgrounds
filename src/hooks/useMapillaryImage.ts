import { useState, useEffect } from 'react';

const TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;

// Module-level cache keyed by "lat,lng"
const cache = new Map<string, string | null>();

function cacheKey(lat: number, lng: number) {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * Returns the URL of the nearest Mapillary street-level photo for the
 * given coordinates, or null if none found / token not set.
 */
export function useMapillaryImage(lat: number, lng: number): string | null {
  const key = cacheKey(lat, lng);
  const [url, setUrl] = useState<string | null>(cache.has(key) ? (cache.get(key) ?? null) : null);

  useEffect(() => {
    if (!TOKEN) return;

    const key = cacheKey(lat, lng);
    if (cache.has(key)) {
      setUrl(cache.get(key) ?? null);
      return;
    }

    // Search for the closest image within 200 m, excluding panoramas
    const endpoint =
      `https://graph.mapillary.com/images` +
      `?access_token=${TOKEN}` +
      `&fields=id,thumb_1024_url` +
      `&closeto=${lng},${lat}` +
      `&radius=200` +
      `&is_pano=false` +
      `&limit=1`;

    fetch(endpoint)
      .then((r) => {
        if (!r.ok) throw new Error('mapillary fetch failed');
        return r.json();
      })
      .then((data) => {
        const imgUrl: string | null = data?.data?.[0]?.thumb_1024_url ?? null;
        cache.set(key, imgUrl);
        setUrl(imgUrl);
      })
      .catch(() => {
        cache.set(key, null);
      });
  }, [lat, lng]);

  return url;
}
