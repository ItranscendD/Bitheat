import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#10B981", // Bitheat Emerald
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#6366F1", // Bitheat Indigo
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B", // Bitheat Amber
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444", // Bitheat Red
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          dark: "#111827",
        }
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)"],
        body: ["var(--font-dm-sans)"],
        mono: ["var(--font-space-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
