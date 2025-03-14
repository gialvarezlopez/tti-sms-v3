import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          700: "#FF512D",
          900: "#C72200",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        neutral: {
          100: "#F8F9FC",
          300: "#DADEE6",
          700: "#3F444D",
          800: "#23272F",
        },
        customRed: {
          v1: "#DC2F2F",
          v2: "#B51E1E",
          v3: "#E02D3C",
          v4: "#FEF1F2",
        },
        success: {
          v1: "#EDFDF8",
          v2: "#16A374",
        },
        customBlack: {
          v1: "#1D2433",
        },

        customPink: {
          v1: "#FFF2F2",
        },
        customGray: {
          v1: "#E1E1E1",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        custom: "0px 4px 12px 0px rgba(0, 0, 0, 0.16)",
      },
      animation: {
        pulse: "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { backgroundColor: "#f3f4f6" }, // Very light grey
          "50%": { backgroundColor: "#9ca3af" }, // Dark grey
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["checked", "focus"],
      borderColor: ["checked", "focus"],
      ringColor: ["focus", "checked"],
    },
  },
  //plugins: [require("tailwindcss-animate")],
};
export default config;
