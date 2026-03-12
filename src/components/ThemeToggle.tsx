import { Sun, Moon } from 'lucide-react';

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        flex items-center justify-center w-10 h-10 rounded-full
        bg-white/90 dark:bg-slate-700/90
        border border-slate-200 dark:border-slate-600
        shadow-sm hover:shadow-md
        text-amber-500 dark:text-amber-300
        transition-all duration-200 hover:scale-110
        backdrop-blur-sm
      "
    >
      {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}
