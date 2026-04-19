/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(244, 63, 94, 0.25)",
      },
    },
  },
  plugins: [],
};
