import type { SunProfile, ShadeValue } from '../types';
import { Sun, TreePine, Cloud } from 'lucide-react';

function fmtHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

interface Props {
  sunProfile: SunProfile;
}

const SHADE_SEGMENT_COLORS: Record<ShadeValue, string> = {
  'full-shade': 'bg-emerald-400 dark:bg-emerald-500',
  'partial-shade': 'bg-amber-300 dark:bg-amber-400',
  'mostly-sunny': 'bg-orange-400 dark:bg-orange-500',
  night: 'bg-slate-200 dark:bg-slate-600',
};

const SHADE_SEGMENT_TITLE: Record<ShadeValue, string> = {
  'full-shade': 'Full Shade',
  'partial-shade': 'Partial Shade',
  'mostly-sunny': 'Mostly Sunny',
  night: 'Night',
};

function ShadeIcon({ shade }: { shade: ShadeValue }) {
  if (shade === 'full-shade') return <TreePine size={13} className="text-emerald-600 dark:text-emerald-400" />;
  if (shade === 'partial-shade') return <Cloud size={13} className="text-amber-500 dark:text-amber-400" />;
  return <Sun size={13} className="text-orange-500 dark:text-orange-400" />;
}

export default function SunProfileTimeline({ sunProfile }: Props) {
  const { hourly, bestPlayTime, bestHours, note } = sunProfile;

  const displayHours = hourly.filter((h) => h.hour >= 6 && h.hour <= 20);
  const nightHours = displayHours.filter((h) => h.shade === 'night');
  const hasNight = nightHours.length > 0;

  return (
    <div className="space-y-2 font-body">
      {/* Timeline bar */}
      <div className="relative">
        <div className="flex items-stretch gap-0.5 h-7 w-full rounded-lg overflow-hidden">
          {displayHours.map((h) => {
            const isBest = h.hour >= bestHours.start && h.hour <= bestHours.end;
            return (
              <div
                key={h.hour}
                title={`${h.label}: ${SHADE_SEGMENT_TITLE[h.shade]}`}
                className={`
                  flex-1 transition-all duration-300
                  ${SHADE_SEGMENT_COLORS[h.shade]}
                  ${h.shade === 'night' ? 'opacity-40' : ''}
                  ${isBest ? 'ring-2 ring-white ring-inset relative z-10' : ''}
                `}
              />
            );
          })}
        </div>
        {/* Best window highlight underline */}
        <div className="flex gap-0.5 mt-0.5 h-1">
          {displayHours.map((h) => {
            const isBest = h.hour >= bestHours.start && h.hour <= bestHours.end;
            return (
              <div
                key={h.hour}
                className={`flex-1 rounded-full ${isBest ? 'bg-emerald-500 dark:bg-emerald-400' : ''}`}
              />
            );
          })}
        </div>
      </div>

      {/* Time labels */}
      <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide px-0.5">
        <span>6 AM</span>
        <span>Morning</span>
        <span>Noon</span>
        <span>Afternoon</span>
        <span>8 PM</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-1">
        {(
          [
            ['full-shade', 'Full Shade'],
            ['partial-shade', 'Partial Shade'],
            ['mostly-sunny', 'Mostly Sunny'],
          ] as [ShadeValue, string][]
        ).map(([shade, label]) => (
          <div key={shade} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${SHADE_SEGMENT_COLORS[shade]}`} />
            <span className="text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Best play time callout */}
      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl px-3 py-2 border border-emerald-100 dark:border-emerald-800">
        <ShadeIcon shade="full-shade" />
        <div className="min-w-0">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            Best: {bestPlayTime}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5">
            ({fmtHour(bestHours.start)} – {fmtHour(bestHours.end)})
          </span>
        </div>
      </div>

      {/* Note */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic px-0.5">{note}</p>

      {/* Night warning */}
      {hasNight && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 px-0.5">
          <span>🌙</span>
          <span>Nighttime — Play may not be safe</span>
        </div>
      )}
    </div>
  );
}
