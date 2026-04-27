import { createRequire } from "node:module";
import type { Config } from "tailwindcss";

const require = createRequire(import.meta.url);

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "biu-gold": "#B8860B",
        "biu-navy": "#1a1a2e",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
