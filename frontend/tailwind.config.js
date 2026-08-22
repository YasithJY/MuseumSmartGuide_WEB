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
        primary: "#2C1A14", // Luxury Dark Brown (Darker Espresso)
        gold: "#C9A227",    // Heritage Gold
        parchment: "#FFFFF0", // Tusker Ivory
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
