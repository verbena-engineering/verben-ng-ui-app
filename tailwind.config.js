/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{html,ts}",
  ],
  theme: {
    colors:{
      controlBorder:'rgba(0, 0, 0, 0.2)',
      muted:'rgba(0, 0, 0, 0.6)',
      secondary:{
        DEFAULT:'#E8EAF1',
        100:'#F5F6F9',
        200:'rgba(215, 219, 230, 1)'
      },
      primary:{
        DEFAULT:'#D4A007',
      }
    },
    extend: {},
  },
  plugins: [],
}
