/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0A0C18",
          800: "#12142A",
          700: "#181B38",
          600: "#212446",
          500: "#2C2F58",
        },
        mist: {
          100: "#F6F5F3",
          200: "#E7E5F0",
          400: "#9C9BC0",
        },
        signal: {
          violet: "#8C6BFF",
          violetDim: "#6B51CC",
        },
        status: {
          mint: "#34D399",
          amber: "#F5B84E",
          sky: "#5AA9FF",
          coral: "#FF6859",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(140,107,255,0.4), 0 0 24px -4px rgba(140,107,255,0.5)",
      },
      keyframes: {
        pulseTravel: {
          "0%": { transform: "translateX(0%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseTravel: "pulseTravel 2.6s ease-in-out infinite",
        riseIn: "riseIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
