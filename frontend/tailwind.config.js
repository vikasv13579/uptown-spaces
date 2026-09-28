/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#070C18',
          900: '#0B132B',
          800: '#111C38',
          700: '#1C2B4E',
          600: '#2A3C66',
        },
        accent: {
          gold: '#D97706',
          'gold-hover': '#B45309',
          amber: '#F59E0B',
          indigo: '#4F46E5',
          'indigo-dark': '#3730A3',
        },
        surface: {
          ground: '#F8FAFC',
          card: '#FFFFFF',
          sidebar: '#0B132B',
          muted: '#F1F5F9',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      }
    },
  },
  plugins: [],
}
