/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{html,ts}",
        // The library's templates also use Tailwind utilities (e.g. the dialog's
        // "fixed inset-0", "max-w-lg"), so scan them too or those classes are missing
        "./projects/verben-ng-ui/src/**/*.{html,ts}",
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
