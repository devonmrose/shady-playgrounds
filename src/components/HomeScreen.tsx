import { motion, type Variants } from 'framer-motion';
import type { CategoryInfo } from '../types';
import type { FilterType } from '../hooks/useFilters';
import { TYPE_EMOJIS } from '../constants';
import CloudBackground from './CloudBackground';
import WeatherIcon from './WeatherIcon';
import ThemeToggle from './ThemeToggle';

type CategoryEntry = Omit<CategoryInfo, 'type'> & { type: FilterType; color: string; blob: number };

const CATEGORIES: CategoryEntry[] = [
  { type: 'playground',        label: 'Playgrounds',      emoji: TYPE_EMOJIS['playground'],        description: 'Swings, slides & climbing',   color: 'bg-leafy-green/20',     blob: 1 },
  { type: 'park',              label: 'Parks',             emoji: TYPE_EMOJIS['park'],              description: 'Shaded green spaces',         color: 'bg-breezy-teal/20',     blob: 2 },
  { type: 'splash-pad',        label: 'Splash Pads',       emoji: TYPE_EMOJIS['splash-pad'],        description: 'Water jets & spray grounds',  color: 'bg-sky-blue/20',        blob: 3 },
  { type: 'basketball-court',  label: 'Basketball',        emoji: TYPE_EMOJIS['basketball-court'],  description: 'Outdoor hoops',               color: 'bg-sunset-orange/20',   blob: 4 },
  { type: 'tennis-court',      label: 'Tennis',            emoji: TYPE_EMOJIS['tennis-court'],      description: 'Public courts',               color: 'bg-sunshine-yellow/30', blob: 1 },
  { type: 'fields',            label: 'Fields',            emoji: '⚽',                             description: 'Soccer & open grass spaces',  color: 'bg-leafy-green/30',     blob: 2 },
  { type: 'baseball-diamond',  label: 'Baseball',          emoji: TYPE_EMOJIS['baseball-diamond'],  description: 'Diamonds & batting cages',    color: 'bg-sunset-orange/15',   blob: 3 },
  { type: 'skate-park',        label: 'Skate Parks',       emoji: TYPE_EMOJIS['skate-park'],        description: 'Ramps & smooth surfaces',     color: 'bg-earth-brown/10',     blob: 4 },
  { type: 'rec-center',        label: 'Rec Centers',       emoji: TYPE_EMOJIS['rec-center'],        description: 'Community outdoor spaces',    color: 'bg-breezy-teal/15',     blob: 1 },
  { type: 'multi-sport-court', label: 'Multi-Sport',       emoji: TYPE_EMOJIS['multi-sport-court'], description: 'Courts for many activities',  color: 'bg-sunshine-yellow/20', blob: 2 },
  { type: 'pocket-park',       label: 'Pocket Parks',      emoji: TYPE_EMOJIS['pocket-park'],       description: 'Hidden neighborhood gems',    color: 'bg-leafy-green/15',     blob: 3 },
  { type: null,                label: 'View All',           emoji: '🗺️',                            description: 'Every shady spot in Philly',  color: 'bg-sunshine-yellow/40', blob: 4 },
];

const BLOB_CLASSES: Record<number, string> = {
  1: 'rounded-blob-1',
  2: 'rounded-blob-2',
  3: 'rounded-blob-3',
  4: 'rounded-blob-4',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 22 } },
};

interface Props {
  onSelectCategory: (type: FilterType) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function HomeScreen({ onSelectCategory, isDark, onToggleTheme }: Props) {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden flex flex-col bg-cloud-white text-earth-brown">
      <CloudBackground />

      {/* Header */}
      <header className="relative z-10 w-full px-5 py-4 flex items-center justify-between bg-cloud-white/80 backdrop-blur-sm border-b-2 border-earth-brown/10 shadow-warm">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <WeatherIcon type="tree-canopy" size="md" />
          </motion.div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-leafy-green leading-none">TreePatch</h1>
            <p className="font-body text-xs font-semibold text-earth-brown/60 leading-none mt-0.5">Philadelphia</p>
          </div>
        </motion.div>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </header>

      {/* Hero */}
      <main className="flex-1 relative z-10 flex flex-col items-center px-4 pt-8 pb-28 sm:pt-14 max-w-5xl mx-auto w-full">
        <motion.div
          className="text-center mb-10 sm:mb-14 relative"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute -top-8 -left-8 sm:-left-14 z-[-1] opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <WeatherIcon type="sun" size="xl" />
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-earth-brown leading-tight max-w-2xl mx-auto">
            Find the perfect patch of shade to play in Philly
          </h2>
          <p className="font-body text-base sm:text-lg font-semibold text-earth-brown/70 mt-4 max-w-xl mx-auto">
            Philadelphia's guide to shaded outdoor play spaces for kids.
          </p>
        </motion.div>

        {/* Category grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CATEGORIES.map((cat) => {
            const isViewAll = cat.type === null;
            return (
              <motion.button
                key={cat.label}
                variants={itemVariants}
                onClick={() => onSelectCategory(cat.type)}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`
                  flex flex-col items-center justify-center p-5 gap-2.5 w-full aspect-square
                  ${cat.color}
                  ${BLOB_CLASSES[cat.blob]}
                  shadow-warm hover:shadow-warm-lg transition-shadow
                  border-2 border-earth-brown/10
                  focus:outline-none focus:ring-4 focus:ring-leafy-green/40
                  ${isViewAll ? 'col-span-2 sm:col-span-1' : ''}
                `}
              >
                <motion.span
                  className="text-3xl leading-none"
                  whileHover={{ rotate: [-5, 5, -3, 3, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {cat.emoji}
                </motion.span>
                <div className="text-center">
                  <p className="font-heading font-bold text-sm sm:text-base text-earth-brown leading-tight">
                    {cat.label}
                  </p>
                  <p className="text-[10px] sm:text-xs font-semibold text-earth-brown/55 leading-tight mt-0.5 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <p className="text-center text-xs text-earth-brown/40 mt-8 italic font-semibold">
          Shade ratings updated daily · Philadelphia, PA
        </p>
      </main>

      {/* Bottom wave decoration */}
      <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-0 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-leafy-green/60">
          <path d="M0,120 C150,100 350,0 600,60 C850,120 1050,40 1200,80 L1200,120 L0,120 Z" />
        </svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-20 fill-leafy-green/80">
          <path d="M0,120 C200,80 400,120 600,40 C800,-40 1000,80 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </div>
  );
}
