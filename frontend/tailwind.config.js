/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: "#131921",
          light: "#232f3e",
          background: "#EAEDED",
          yellow: "#f0c14b",
          orange: "#FF9900",
          "search-btn": "#FEBD69",
          blue: "#007185",
          price: "#B12704",
          deal: "#CC0C39",
          footer: "#232F3E",
        },
        ink: "#0F1111",
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
        },
      },
      fontFamily: {
        sans: ["'Amazon Ember'", "Inter", "Arial", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "amazon-card": "0 2px 5px 0 rgba(213,217,217,.5)",
        "buy-box": "0 2px 5px rgba(15,17,17,0.15), 0 0 0 1px rgba(15,17,17,0.09)",
      },
    },
  },
  plugins: [],
};
