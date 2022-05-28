const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "serif": ["Grenze", ...defaultTheme.fontFamily.serif],
        "sans": ["Oxygen", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        "accent": {
          100: "#d6dbe9",
          200: "#adb8d2",
          300: "#8594bc",
          400: "#5c71a5",
          500: "#334d8f",
          600: "#293e72",
          700: "#1f2e56",
          800: "#141f39",
          900: "#0a0f1d"
        },
      }
    },
  },
  plugins: [],
}
