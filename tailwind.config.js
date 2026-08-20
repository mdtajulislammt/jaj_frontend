/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0E16",
        "ink-soft": "#141B26",
        paper: "#FFFFFF",
        mist: "#EEF5FC",
        "mist-deep": "#DEEAF7",
        sky: {
          DEFAULT: "#2F6FE4",
          light: "#8FC3FF",
          dim: "#E4EFFC",
        },
        slate: {
          DEFAULT: "#56606E",
          light: "#8A93A3",
        },
        line: "#DCE6F0",
        good: "#1E9E6B",
        warn: "#D9A419",
        bad: "#E0483F",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "barcode": "repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 3px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,14,22,0.04), 0 8px 24px -12px rgba(10,14,22,0.10)",
        pop: "0 10px 30px -10px rgba(47,111,228,0.35)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
