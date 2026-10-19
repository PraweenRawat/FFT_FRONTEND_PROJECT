/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F7F5F8',
          100: '#ECE8ED',
          200: '#CBD3DC',
          300: '#BDB0C2',
          400: '#8A7690',
          500: '#475C6F',
          600: '#344453', // Official Slate
          700: '#24303C',
          800: '#1A232C',
          900: '#12181E',
          DEFAULT: '#344453',
        },
        ochre: {
          50: '#FDF8ED',
          100: '#FFEBE4',
          200: '#FCEAC6',
          300: '#F7D493',
          400: '#DA9A2F', // Official Golden Ochre
          500: '#C68722',
          600: '#D96944',
          700: '#B64E2A',
          800: '#923B1D',
          900: '#752F17',
          DEFAULT: '#DA9A2F',
        },
        coolgray: {
          50: '#FBFBFA',
          100: '#F5F4EE',
          200: '#E9E6D8',
          300: '#D9D3BC',
          400: '#A3B2B1', // Official Cool Gray
          500: '#ADA47F',
          600: '#8E855F',
          700: '#706949',
          800: '#554F37',
          900: '#3D3827',
          DEFAULT: '#A3B2B1',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -1px rgba(84, 69, 90, 0.08), 0 1px 4px -1px rgba(84, 69, 90, 0.04)',
        'elevated': '0 10px 25px -3px rgba(84, 69, 90, 0.12), 0 4px 10px -2px rgba(84, 69, 90, 0.06)',
      }
    },
  },
  plugins: [],
}
