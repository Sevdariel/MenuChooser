/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'light-orange': {
          0: '#FFF6DE',
          100: '#FFF3D2',
          200: '#FFEABB',
          300: '#FFE1A4',
          400: '#FFD88D',
          500: '#FFCF76',
          600: '#FFC65F',
          700: '#FFBD48',
          800: '#FFB431',
          900: '#FFAB19',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

