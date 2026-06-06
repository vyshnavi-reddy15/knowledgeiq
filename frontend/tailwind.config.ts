import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        slate: "#5b6474",
        mist: "#e5ebf4",
        cloud: "#f6f8fc",
        signal: "#0f766e",
        steel: "#d5dde8"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        panel: "24px"
      }
    }
  },
  plugins: []
};

export default config;
