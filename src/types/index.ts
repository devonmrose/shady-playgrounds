export type ShadeLevel = 'full-shade' | 'partial-shade' | 'mostly-sunny';
export type ShadeValue = ShadeLevel | 'night';

export type LocationType =
  | 'playground'
  | 'park'
  | 'splash-pad'
  | 'basketball-court'
  | 'tennis-court'
  | 'soccer-field'
  | 'skate-park'
  | 'rec-center'
  | 'multi-sport-court'
  | 'open-field'
  | 'pocket-park'
  | 'baseball-diamond';

export interface HourlyShade {
  hour: number; // 0–23
  shade: ShadeValue;
  label: string; // "6 AM", "1 PM", etc.
}

export interface SunProfile {
  hourly: HourlyShade[];
  bestPlayTime: string; // "Early Morning", "Morning & Afternoon", etc.
  bestHours: { start: number; end: number };
  note: string;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  /** Additional outdoor amenity types — used so multi-use facilities appear in multiple filters */
  secondaryTypes?: LocationType[];
  coordinates: [number, number]; // [lat, lng]
  shadeScore: ShadeLevel;
  description: string;
  tags: string[];
  sunProfile: SunProfile;
  canopyEstimate: number; // 0–100
  neighborhood: string;
  address?: string;
}

export interface CategoryInfo {
  type: LocationType | null; // null = "View All"
  label: string;
  emoji: string;
  description: string;
}
