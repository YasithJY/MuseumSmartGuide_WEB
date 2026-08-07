/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#4E342E", // Luxury Dark Brown
        gold: "#C9A227",    // Heritage Gold
        parchment: "#F7F2E9", // Ancient Paper Background
        accent: "#8D6E63",  // Muted Terracotta/Warm Brown
        dark: "#2D2D2D",    // Charcoal
      },
      fontFamily: {
        heading: ["Cinzel", "serif"],
        body: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
      }
    },
  },
  plugins: [],
}
