/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Baloo 2"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        'leafy-green': 'var(--leafy-green)',
        'sky-blue': 'var(--sky-blue)',
        'sunshine-yellow': 'var(--sunshine-yellow)',
        'cloud-white': 'var(--cloud-white)',
        'breezy-teal': 'var(--breezy-teal)',
        'sunset-orange': 'var(--sunset-orange)',
        'earth-brown': 'var(--earth-brown)',
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      borderRadius: {
        'blob-1': '60% 40% 55% 45% / 50% 60% 40% 50%',
        'blob-2': '40% 60% 45% 55% / 60% 50% 55% 45%',
        'blob-3': '55% 45% 60% 40% / 45% 55% 50% 60%',
        'blob-4': '45% 55% 40% 60% / 55% 45% 60% 40%',
      },
      boxShadow: {
        warm: '0 4px 14px 0 rgba(141, 110, 99, 0.12)',
        'warm-lg': '0 10px 25px -5px rgba(141, 110, 99, 0.18)',
        'warm-inner': 'inset 0 2px 4px 0 rgba(141, 110, 99, 0.06)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'tree-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'float-cloud': {
          '0%': { transform: 'translateX(-20vw)' },
          '100%': { transform: 'translateX(120vw)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        'tree-sway': 'tree-sway 3s ease-in-out infinite',
        sway: 'sway 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float-cloud-slow': 'float-cloud 45s linear infinite',
        'float-cloud-mid': 'float-cloud 35s linear infinite',
        'float-cloud-fast': 'float-cloud 30s linear infinite',
      },
    },
  },
  plugins: [],
};
