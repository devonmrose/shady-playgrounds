import { useState, useEffect } from 'react';

export interface WeatherDay {
  tempHighF: number;
  tempLowF: number;
  code: number;
  emoji: string;
  label: string;
  precipChance: number;
  isGoodForPlay: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

// Module-level cache so we don't refetch for nearby coords
const cache = new Map<string, WeatherDay>();

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code === 95 || code === 96 || code === 99) return '⛈️';
  return '🌤️';
}

function getWeatherLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mostly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return 'Partly cloudy';
}

export function useWeather(lat: number, lng: number): { weather: WeatherDay | null; status: Status } {
  const key = cacheKey(lat, lng);
  const [weather, setWeather] = useState<WeatherDay | null>(cache.get(key) ?? null);
  const [status, setStatus] = useState<Status>(cache.has(key) ? 'success' : 'idle');

  useEffect(() => {
    const key = cacheKey(lat, lng);
    if (cache.has(key)) {
      setWeather(cache.get(key)!);
      setStatus('success');
      return;
    }

    setStatus('loading');

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat.toFixed(3)}&longitude=${lng.toFixed(3)}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((data) => {
        const code = data.daily.weathercode[0] as number;
        const tempHighF = Math.round(data.daily.temperature_2m_max[0] as number);
        const tempLowF = Math.round(data.daily.temperature_2m_min[0] as number);
        const precipChance = (data.daily.precipitation_probability_max[0] as number) ?? 0;

        const day: WeatherDay = {
          tempHighF,
          tempLowF,
          code,
          emoji: getWeatherEmoji(code),
          label: getWeatherLabel(code),
          precipChance,
          isGoodForPlay: code < 50 && precipChance < 40,
        };

        cache.set(key, day);
        setWeather(day);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [lat, lng]);

  return { weather, status };
}
