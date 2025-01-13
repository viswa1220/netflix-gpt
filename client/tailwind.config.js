/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto Slab', 'sans-serif'],
      },
      colors: {
        primaryYellow: "#FFD65A",
        primaryBlack:"#252F3B"
      },
    },
  },
  plugins: [],
};
