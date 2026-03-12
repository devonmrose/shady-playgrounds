import type { LocationType, CategoryInfo } from '../types';
import ThemeToggle from './ThemeToggle';

const CATEGORIES: CategoryInfo[] = [
  { type: 'playground', label: 'Playgrounds', emoji: '🛝', description: 'Swings, slides & climbing structures' },
  { type: 'park', label: 'Parks', emoji: '🌳', description: 'Green spaces with shade trees' },
  { type: 'splash-pad', label: 'Splash Pads', emoji: '💦', description: 'Water jets & spray grounds' },
  { type: 'basketball-court', label: 'Basketball', emoji: '🏀', description: 'Outdoor hoops & pickup games' },
  { type: 'tennis-court', label: 'Tennis', emoji: '🎾', description: 'Public courts in the city' },
  { type: 'soccer-field', label: 'Soccer Fields', emoji: '⚽', description: 'Open grass fields for kicking around' },
  { type: 'skate-park', label: 'Skate Parks', emoji: '🛹', description: 'Ramps & smooth surfaces' },
  { type: 'rec-center', label: 'Rec Centers', emoji: '🏫', description: 'Community centers with outdoor play' },
  { type: 'open-field', label: 'Open Fields', emoji: '🌿', description: 'Wide open grassy spaces' },
  { type: 'multi-sport-court', label: 'Multi-Sport', emoji: '🏆', description: 'Courts for multiple activities' },
  { type: 'pocket-park', label: 'Pocket Parks', emoji: '🌺', description: 'Small hidden neighborhood gems' },
  { type: null, label: 'View All', emoji: '🗺️', description: 'Explore every spot in Philly' },
];

interface Props {
  onSelectCategory: (type: LocationType | null) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function HomeScreen({ onSelectCategory, isDark, onToggleTheme }: Props) {
  return (
    <div className="
      min-h-screen w-full
      bg-gradient-to-b from-sky-100 via-emerald-50 to-lime-100
      dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950
      relative overflow-x-hidden
      font-body
    ">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>

      {/* Decorative clouds */}
      <div className="absolute top-6 left-8 text-4xl opacity-60 dark:opacity-20 pointer-events-none select-none animate-bounce-gentle" style={{ animationDelay: '0s' }}>
        ☁️
      </div>
      <div className="absolute top-10 left-1/3 text-2xl opacity-40 dark:opacity-10 pointer-events-none select-none animate-bounce-gentle" style={{ animationDelay: '0.8s' }}>
        ☁️
      </div>
      <div className="absolute top-4 right-20 text-3xl opacity-50 dark:opacity-15 pointer-events-none select-none animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>
        ☁️
      </div>

      {/* Hero section */}
      <div className="flex flex-col items-center pt-16 pb-8 px-4 text-center animate-fade-in">
        {/* Tree illustration */}
        <div className="relative mb-4">
          <div className="text-7xl md:text-8xl animate-tree-sway drop-shadow-lg">🌳</div>
          <div className="absolute -bottom-1 -right-4 text-4xl opacity-70 animate-tree-sway" style={{ animationDelay: '1s' }}>🌲</div>
          <div className="absolute -bottom-1 -left-4 text-3xl opacity-60 animate-tree-sway" style={{ animationDelay: '0.5s' }}>🌿</div>
        </div>

        {/* Brand */}
        <h1 className="font-heading font-bold text-5xl md:text-6xl text-emerald-800 dark:text-emerald-300 mb-2 tracking-tight leading-none drop-shadow-sm">
          TreePatch
        </h1>
        <p className="text-lg md:text-xl text-emerald-700 dark:text-emerald-400 font-semibold mb-1 max-w-sm">
          Find shady spots for outdoor play
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          Philadelphia's guide to cool, shaded places where kids can roam free ☀️
        </p>

        {/* Quick stats */}
        <div className="flex items-center gap-4 mt-5 text-sm font-semibold">
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-900">
            <span>🌳</span>
            <span className="text-emerald-700 dark:text-emerald-300">40+ Spots</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/70 dark:bg-slate-800/70 px-3 py-1.5 rounded-full shadow-sm border border-emerald-100 dark:border-emerald-900">
            <span>🏙️</span>
            <span className="text-emerald-700 dark:text-emerald-300">10 Neighborhoods</span>
          </div>
        </div>
      </div>

      {/* Category section */}
      <div className="max-w-2xl mx-auto px-4 pb-20 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <h2 className="font-heading font-semibold text-center text-base text-slate-600 dark:text-slate-400 mb-5 tracking-wide uppercase text-xs">
          What are you looking for?
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat, i) => {
            const isViewAll = cat.type === null;
            return (
              <button
                key={cat.label}
                onClick={() => onSelectCategory(cat.type)}
                className={`
                  group relative flex flex-col items-center gap-2 p-4 rounded-2xl text-center
                  transition-all duration-200
                  hover:scale-105 hover:-translate-y-1 active:scale-95
                  animate-fade-in
                  ${isViewAll
                    ? 'bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-200 dark:hover:shadow-emerald-900 col-span-2 sm:col-span-1 flex-row gap-3 justify-center'
                    : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg border border-emerald-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-700'
                  }
                `}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <span className={`transition-transform duration-200 group-hover:scale-110 ${isViewAll ? 'text-3xl' : 'text-3xl'}`}>
                  {cat.emoji}
                </span>
                <div className={isViewAll ? 'text-left' : ''}>
                  <p className={`font-semibold leading-tight ${isViewAll ? 'text-base' : 'text-sm'}`}>
                    {cat.label}
                  </p>
                  <p className={`text-[11px] leading-tight mt-0.5 ${isViewAll ? 'text-emerald-100 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    {cat.description}
                  </p>
                </div>
                {/* Hover glow for non-view-all */}
                {!isViewAll && (
                  <div className="absolute inset-0 rounded-2xl bg-emerald-400/0 group-hover:bg-emerald-400/5 dark:group-hover:bg-emerald-400/10 transition-colors duration-200" />
                )}
              </button>
            );
          })}
        </div>

        {/* Subtext */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6 italic">
          Shade ratings updated daily · Philadelphia, PA
        </p>
      </div>

      {/* Bottom tree silhouette */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ height: '70px', zIndex: 0 }}
      >
        <div className="flex justify-around items-end h-full px-2 opacity-20 dark:opacity-10">
          {['🌲', '🌳', '🌿', '🌲', '🌳', '🌿', '🌲', '🌳'].map((t, i) => (
            <span
              key={i}
              className="text-3xl md:text-4xl animate-tree-sway"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${3 + i * 0.4}s` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
