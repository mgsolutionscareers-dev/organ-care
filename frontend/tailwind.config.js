/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6', // Primary Teal
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        navy: {
          50: '#F4F7F8',
          100: '#E1E9EC',
          200: '#C2D3D8',
          300: '#94B4BC',
          400: '#67909C',
          500: '#47727E',
          600: '#385C66',
          700: '#2A464E',
          800: '#1C3137',
          900: '#123E48', // Deep Navy from prompt
          950: '#0A2228', // Dark hero background
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 62, 72, 0.08)',
        'glow': '0 0 25px -5px rgba(20, 184, 166, 0.35)',
        'card': '0 10px 30px -5px rgba(18, 62, 72, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
