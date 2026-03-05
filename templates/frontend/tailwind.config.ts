import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "{{primary50}}",
          100: "{{primary100}}",
          200: "{{primary200}}",
          300: "{{primary300}}",
          400: "{{primary400}}",
          500: "{{primary500}}",
          600: "{{primary600}}",
          700: "{{primary700}}",
          800: "{{primary800}}",
          900: "{{primary900}}",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        surface: "#F9FAFB",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "sans-serif"],
      },
    },
  },
} satisfies Config;
