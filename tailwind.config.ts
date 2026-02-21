import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{vue,ts}",
    "./components/**/*.{vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./composables/**/*.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#4A5445",
          dark: "#3B4337",
          light: "#5E6B58",
          50: "#F4F5F3",
          100: "#E6E9E4",
          200: "#CBD1C7",
          300: "#A3AD9D",
          400: "#7B8A73",
          500: "#5E6B58",
          600: "#4A5445",
          700: "#3B4337",
          800: "#2D332A",
          900: "#1F231D",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
