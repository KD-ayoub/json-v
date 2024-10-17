import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    darkMode: 'class', 
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#FABC3F',
        'hover-primary': '#EBA832',
        'light-bg': '#FFFFFF',
        'light-text': '#333333',
        'light-secondary-text': '#666666',
        'light-border': '#DDDDDD',
        'light-card': '#F8F8F8',
        'dark-bg': '#1A1A1A',
        'dark-text': '#FFFFFF',
        'dark-secondary-text': '#CCCCCC',
        'dark-border': '#333333',
        'dark-card': '#2A2A2A',
      }
    },
  },
  plugins: [],
};
export default config;
