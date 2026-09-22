import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        studio: {
          bg: "#09090B",
          surface: "#151518",
          card: "#18181B",
          elevated: "#202023",
          border: "#27272A",
          borderHover: "#3F3F46",
          primary: "#F4F4F5",
          secondary: "#A1A1AA",
          muted: "#71717A",
          accent: "#C4B5FD",
          accentHover: "#DDD6FE",
          accentMuted: "rgba(196, 181, 253, 0.15)",
          success: "#6EE7B7",
          warning: "#FCD34D",
          error: "#FDA4AF",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
