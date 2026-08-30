/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#081C15',
          900: '#1B4332',
          800: '#2D6A4F',
          700: '#40916C',
          600: '#52B788',
          500: '#74C69D',
          400: '#95D5B2',
          300: '#B7E4C7',
          200: '#D8F3DC',
          100: '#EAF7EE',
          50: '#F4FAF6',
        },
        solar: {
          900: '#78350F',
          800: '#92400E',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
          300: '#FCD34D',
          200: '#FDE68A',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        app: {
          bg: '#F6F9F7',
          card: '#FFFFFF',
          darkCard: '#132A20',
          border: '#E2ECE6',
          textDark: '#0D2118',
          textMuted: '#587366',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        scan: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '95%' },
        }
      }
    },
  },
  plugins: [],
}
