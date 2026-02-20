import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0f5233",
        "accent-gold": "#C6A75E",
        "background-light": "#f6f8f7",
        "background-dark": "#12201a",
        "emerald-dark": "#0B3D26",
      },
      fontFamily: {
        "display": ["var(--font-inter)", "sans-serif"],
        "arabic": ["var(--font-amiri)", "serif"]
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
