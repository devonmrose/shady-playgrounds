import WeatherIcon from './WeatherIcon';

const CLOUDS = [
  { top: '8%',  duration: 45, delay: '0s',    opacity: 0.55, size: 'xl' as const },
  { top: '28%', duration: 35, delay: '-12s',   opacity: 0.40, size: 'lg' as const },
  { top: '58%', duration: 50, delay: '-28s',   opacity: 0.45, size: 'xl' as const },
  { top: '78%', duration: 32, delay: '-6s',    opacity: 0.30, size: 'md' as const },
  { top: '14%', duration: 40, delay: '-20s',   opacity: 0.60, size: 'lg' as const },
];

export default function CloudBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: cloud.top,
            opacity: cloud.opacity,
            animation: `float-cloud ${cloud.duration}s linear infinite`,
            animationDelay: cloud.delay,
            left: '-20vw',
          }}
        >
          <WeatherIcon type="cloud" size={cloud.size} color="var(--sky-blue)" />
        </div>
      ))}
    </div>
  );
}
