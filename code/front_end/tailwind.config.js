/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"], // ou "./**/*.html" si tu as plusieurs dossiers
  theme: {
    extend: {
      fontFamily: {
        calligraphy: ["'Pinyon Script'", "cursive"],
        header: ["'Cinzel'", "serif"],
        body: ["'Crimson Text'", "serif"],
      },
    },
  },
  plugins: [],
};
