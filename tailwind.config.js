/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F3EBDD',
        paper: '#FBF6EC',
        ink: '#1E1410',
        tomato: { DEFAULT: '#A3241A', dark: '#6E140C', soft: '#E9C9BF' },
        mustard: '#F0B23A',
        tan: '#E7D9C2',
        olive: '#5E6B3A',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
