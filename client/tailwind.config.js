/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary-container": "var(--primary-container)",
        "secondary": "var(--secondary)",
        "tertiary": "var(--tertiary)",
        "surface": "var(--surface)",
        "on-surface": "var(--on-surface)",
        "surface-container": "var(--surface-container)",
        "surface-container-low": "var(--surface-container-low)",
        "surface-container-high": "var(--surface-container-high)",
        "surface-container-highest": "var(--surface-container-highest)",
        "on-surface-variant": "var(--on-surface-variant)",
        "outline-variant": "var(--outline-variant)",
        "error": "#ba1a1a", // Keep error as standard or use a variable
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
