/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        calm: {
          50: '#f6fafe',
          100: '#edf4fc',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(37, 99, 235, 0.18)',
        card: '0 2px 12px -2px rgba(30, 58, 138, 0.10)',
        lift: '0 24px 48px -16px rgba(30, 58, 138, 0.22), 0 4px 12px -4px rgba(37, 99, 235, 0.12)',
        glow: '0 0 0 4px rgba(59, 130, 246, 0.15), 0 12px 32px -8px rgba(37, 99, 235, 0.45)',
        'glow-sm': '0 0 0 3px rgba(59, 130, 246, 0.12), 0 6px 20px -6px rgba(37, 99, 235, 0.35)',
        deep: '0 32px 64px -24px rgba(23, 37, 84, 0.35)',
        insetRing: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.55)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(24px, -18px) scale(1.06)' },
          '66%': { transform: 'translate(-18px, 14px) scale(0.97)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(0.96)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        rise: 'rise 0.6s cubic-bezier(0.22,1,0.36,1) both',
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 14s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3.2s ease-in-out infinite',
        'pop-in': 'pop-in 0.45s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
};
