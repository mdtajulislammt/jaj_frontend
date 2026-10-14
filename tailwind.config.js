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
        mist: "var(--bg-mist, #F4F8F1)",
        "mist-deep": "var(--bg-mist-deep, #E8F2E2)",
        primary: {
          DEFAULT: "var(--primary, #64BD0B)",
          hover: "var(--primary-hover, #529E08)",
          dark: "var(--primary-dark, #3B7506)",
          light: "var(--primary-light, #84DB1B)",
          dim: "var(--primary-dim, #EBF8DC)",
          text: "var(--primary-text, #FFFFFF)",
        },
        sky: {
          DEFAULT: "var(--primary, #64BD0B)",
          hover: "var(--primary-hover, #529E08)",
          dark: "var(--primary-dark, #3B7506)",
          light: "var(--primary-light, #84DB1B)",
          dim: "var(--primary-dim, #EBF8DC)",
        },
        slate: {
          DEFAULT: "#56606E",
          light: "#8A93A3",
        },
        line: "var(--border-line, #DDE8D6)",
        good: "var(--primary, #64BD0B)",
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
        pop: "0 10px 30px -10px var(--primary-shadow, rgba(100,189,11,0.40))",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
