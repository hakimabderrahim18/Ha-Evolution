/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD54A", // gold yellow
        secondary: "#FFFFFF",
        background: "#0B1220",
        accent: "#7C4DFF",
        success: "#22C55E",
        darkCard: "rgba(18, 26, 44, 0.65)",
        darkBorder: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 77, 255, 0.25)",
        goldGlow: "0 0 20px rgba(255, 213, 74, 0.25)",
        successGlow: "0 0 20px rgba(34, 197, 94, 0.25)",
      },
    },
  },
  plugins: [],
}
