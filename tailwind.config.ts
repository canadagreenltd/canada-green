import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      colors: {
        brand: {
          50: "#F0F7F2",
          300: "#74C69D",
          500: "#2D6A4F",
          700: "#1B4332",
          900: "#14321F",
          950: "#0B1F16",
          DEFAULT: "#1B4332",
        },
        ev: {
          100: "#E0F2FE",
          500: "#0EA5E9",
          700: "#0369A1",
          DEFAULT: "#0EA5E9",
        },
        agri: {
          100: "#FEF3C7",
          500: "#D97706",
          700: "#A16207",
          DEFAULT: "#D97706",
        },
        "accent-red": {
          DEFAULT: "#DC2626",
          hover: "#B91C1C",
        },
        neutral: {
          white: "#FFFFFF",
          cream: "#FAFAF8",
          200: "#E5E7EB",
          600: "#4B5563",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};

export default config;
