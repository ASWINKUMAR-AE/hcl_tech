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
          50: '#f4f3ff',
          100: '#ebe9fe',
          200: '#d9d6fe',
          300: '#bdb4fe',
          400: '#9b8afb',
          500: '#7c5cf7',
          600: '#6836ee',
          700: '#5825d7',
          800: '#491eb6',
          900: '#3d1b95',
          950: '#0f0728',
        },
        dark: {
          bg: '#090a0f',
          card: '#12141d',
          cardHover: '#1a1d2b',
          border: '#232738',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
