import { createRequire } from "node:module";
import type { Config } from "tailwindcss";

const require = createRequire(import.meta.url);

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
          elevated: "var(--surface-elevated)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        subtle: {
          foreground: "var(--subtle-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        navy: "var(--navy)",
        lost: {
          DEFAULT: "var(--lost)",
          muted: "var(--lost-muted)",
          foreground: "var(--lost-foreground)",
        },
        found: {
          DEFAULT: "var(--found)",
          muted: "var(--found-muted)",
          foreground: "var(--found-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          muted: "var(--success-muted)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          muted: "var(--warning-muted)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          muted: "var(--danger-muted)",
        },
        info: {
          DEFAULT: "var(--info)",
          muted: "var(--info-muted)",
        },
        "biu-gold": "var(--primary)",
        "biu-navy": "var(--navy)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(var(--shadow-color) / 0.06), 0 1px 2px -1px rgb(var(--shadow-color) / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(var(--shadow-color) / 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
