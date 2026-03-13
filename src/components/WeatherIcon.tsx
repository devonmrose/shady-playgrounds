export type WeatherIconType =
  | 'sun' | 'tree-canopy' | 'wind' | 'cloud' | 'leaf' | 'treehouse'
  | 'water-splash' | 'court' | 'grassy-hill' | 'skateboard'
  | 'partial-shade' | 'full-shade' | 'rain' | 'full-sun' | 'light-sun';

interface WeatherIconProps {
  type: WeatherIconType;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export default function WeatherIcon({ type, className = '', size = 'md', color }: WeatherIconProps) {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16', xl: 'w-24 h-24' };
  const baseProps = {
    viewBox: '0 0 100 100',
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `${sizeClasses[size]} ${className}`,
    xmlns: 'http://www.w3.org/2000/svg',
  };

  switch (type) {
    case 'sun':
    case 'full-sun':
      return (
        <svg {...baseProps} stroke={color || 'var(--sunshine-yellow)'} strokeWidth="6">
          <circle cx="50" cy="50" r="20" fill={color || 'var(--sunshine-yellow)'} fillOpacity="0.2" />
          <path d="M50 15 Q52 10 50 5 M50 85 Q48 90 50 95 M15 50 Q10 48 5 50 M85 50 Q90 52 95 50 M25 25 Q20 20 18 18 M75 75 Q80 80 82 82 M25 75 Q20 80 18 82 M75 25 Q80 20 82 18" />
        </svg>
      );
    case 'light-sun':
      return (
        <svg {...baseProps} stroke={color || 'var(--sunshine-yellow)'} strokeWidth="6">
          <circle cx="40" cy="40" r="15" fill={color || 'var(--sunshine-yellow)'} fillOpacity="0.2" />
          <path d="M40 15 Q42 10 40 5 M15 40 Q10 38 5 40 M20 20 Q15 15 13 13" />
          <path d="M45 60 Q55 50 70 50 Q85 50 90 65 Q95 80 80 85 Q65 90 50 85 Q40 80 45 60" stroke="var(--sky-blue)" fill="var(--cloud-white)" strokeWidth="4" />
        </svg>
      );
    case 'tree-canopy':
    case 'full-shade':
      return (
        <svg {...baseProps} stroke={color || 'var(--leafy-green)'} strokeWidth="6">
          <path d="M50 90 Q48 70 50 60" stroke="var(--earth-brown)" strokeWidth="8" />
          <path d="M50 65 Q30 65 20 50 Q10 35 25 20 Q40 5 55 15 Q70 5 85 20 Q95 35 80 50 Q70 65 50 65 Z" fill={color || 'var(--leafy-green)'} fillOpacity="0.2" />
        </svg>
      );
    case 'partial-shade':
      return (
        <svg {...baseProps} strokeWidth="6">
          <circle cx="35" cy="35" r="15" stroke="var(--sunshine-yellow)" fill="var(--sunshine-yellow)" fillOpacity="0.2" />
          <path d="M35 10 Q37 5 35 0 M10 35 Q5 33 0 35 M15 15 Q10 10 8 8" stroke="var(--sunshine-yellow)" />
          <path d="M65 90 Q63 70 65 60" stroke="var(--earth-brown)" strokeWidth="8" />
          <path d="M65 65 Q45 65 35 50 Q25 35 40 20 Q55 5 70 15 Q85 5 100 20 Q110 35 95 50 Q85 65 65 65 Z" stroke="var(--leafy-green)" fill="var(--leafy-green)" fillOpacity="0.8" />
        </svg>
      );
    case 'wind':
      return (
        <svg {...baseProps} stroke={color || 'var(--breezy-teal)'} strokeWidth="6">
          <path d="M10 40 Q30 35 60 40 Q80 45 75 60 Q70 70 60 65 Q50 60 55 50 Q60 40 75 40" />
          <path d="M20 60 Q40 65 70 60 Q90 55 85 40 Q80 30 70 35 Q60 40 65 50" />
          <path d="M5 50 Q15 52 25 50" />
        </svg>
      );
    case 'cloud':
      return (
        <svg {...baseProps} stroke={color || 'var(--sky-blue)'} strokeWidth="6">
          <path d="M25 65 Q10 65 10 50 Q10 35 25 35 Q30 20 50 20 Q70 20 75 35 Q90 35 90 50 Q90 65 75 65 Z" fill="var(--cloud-white)" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...baseProps} stroke={color || 'var(--leafy-green)'} strokeWidth="6">
          <path d="M50 90 Q45 75 50 60" strokeWidth="6" />
          <path d="M50 60 Q20 50 20 25 Q20 5 50 5 Q80 5 80 25 Q80 50 50 60 Z" fill={color || 'var(--leafy-green)'} fillOpacity="0.2" />
          <path d="M50 60 Q48 35 50 15" strokeWidth="4" />
          <path d="M50 40 Q35 30 30 25" strokeWidth="4" />
          <path d="M50 30 Q65 20 70 15" strokeWidth="4" />
        </svg>
      );
    case 'treehouse':
      return (
        <svg {...baseProps} stroke={color || 'var(--earth-brown)'} strokeWidth="6">
          <path d="M50 95 Q48 70 50 50" strokeWidth="10" />
          <path d="M50 65 Q25 65 15 45 Q5 25 25 10 Q45 -5 65 10 Q85 25 75 45 Q65 65 50 65 Z" stroke="var(--leafy-green)" fill="var(--leafy-green)" fillOpacity="0.2" />
          <path d="M35 55 L65 55 L65 35 L50 20 L35 35 Z" fill="var(--sunshine-yellow)" fillOpacity="0.8" />
          <rect x="45" y="40" width="10" height="15" fill="var(--earth-brown)" />
        </svg>
      );
    case 'water-splash':
      return (
        <svg {...baseProps} stroke={color || 'var(--sky-blue)'} strokeWidth="6">
          <path d="M50 80 Q20 80 20 60 Q20 40 50 10 Q80 40 80 60 Q80 80 50 80 Z" fill={color || 'var(--sky-blue)'} fillOpacity="0.2" />
          <path d="M25 45 Q15 35 15 25 Q15 15 25 5 Q35 15 35 25 Q35 35 25 45 Z" fill={color || 'var(--sky-blue)'} fillOpacity="0.5" />
          <path d="M75 55 Q65 45 65 35 Q65 25 75 15 Q85 25 85 35 Q85 45 75 55 Z" fill={color || 'var(--sky-blue)'} fillOpacity="0.5" />
        </svg>
      );
    case 'court':
      return (
        <svg {...baseProps} stroke={color || 'var(--sunset-orange)'} strokeWidth="6">
          <path d="M15 25 L85 15 L90 75 L10 85 Z" fill={color || 'var(--sunset-orange)'} fillOpacity="0.2" />
          <path d="M48 20 L52 80" strokeWidth="4" />
          <circle cx="50" cy="50" r="15" strokeWidth="4" />
        </svg>
      );
    case 'grassy-hill':
      return (
        <svg {...baseProps} stroke={color || 'var(--leafy-green)'} strokeWidth="6">
          <path d="M5 80 Q30 40 60 70" fill="none" />
          <path d="M30 90 Q60 50 95 80" fill="none" />
          <path d="M45 50 Q48 40 50 35 M45 50 Q42 40 40 35 M45 50 L45 35" strokeWidth="4" />
          <path d="M75 65 Q78 55 80 50 M75 65 Q72 55 70 50 M75 65 L75 50" strokeWidth="4" />
        </svg>
      );
    case 'skateboard':
      return (
        <svg {...baseProps} stroke={color || 'var(--earth-brown)'} strokeWidth="6">
          <path d="M15 45 Q5 45 5 55 Q5 65 15 65 L85 65 Q95 65 95 55 Q95 45 85 45 Z" fill={color || 'var(--earth-brown)'} fillOpacity="0.2" />
          <circle cx="30" cy="75" r="8" fill="var(--earth-brown)" />
          <circle cx="70" cy="75" r="8" fill="var(--earth-brown)" />
          <path d="M20 45 L30 65 M80 45 L70 65" strokeWidth="4" />
        </svg>
      );
    case 'rain':
      return (
        <svg {...baseProps} stroke={color || 'var(--sky-blue)'} strokeWidth="6">
          <path d="M25 45 Q10 45 10 30 Q10 15 25 15 Q30 0 50 0 Q70 0 75 15 Q90 15 90 30 Q90 45 75 45 Z" fill="var(--cloud-white)" stroke="var(--sky-blue)" />
          <path d="M30 60 L25 75 M50 65 L45 85 M70 55 L65 70" strokeLinecap="round" />
        </svg>
      );
    default:
      return <svg {...baseProps}><circle cx="50" cy="50" r="40" /></svg>;
  }
}
