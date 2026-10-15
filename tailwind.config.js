/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        "ink-soft": "#1E293B",
        paper: "rgba(255, 255, 255, 0.82)",
        mist: "var(--bg-mist, #F7FAF4)",
        "mist-deep": "var(--bg-mist-deep, #EAF4E3)",
        primary: {
          DEFAULT: "var(--primary, #64BD0B)",
          hover: "var(--primary-hover, #529E08)",
          dark: "var(--primary-dark, #3B7506)",
          light: "var(--primary-light, #84DB1B)",
          dim: "var(--primary-dim, rgba(100, 189, 11, 0.12))",
          text: "var(--primary-text, #FFFFFF)",
        },
        sky: {
          DEFAULT: "var(--primary, #64BD0B)",
          hover: "var(--primary-hover, #529E08)",
          dark: "var(--primary-dark, #3B7506)",
          light: "var(--primary-light, #84DB1B)",
          dim: "var(--primary-dim, rgba(100, 189, 11, 0.12))",
        },
        slate: {
          DEFAULT: "#475569",
          light: "#94A3B8",
        },
        line: "var(--border-line, rgba(100, 189, 11, 0.15))",
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
        card: "0 8px 30px -4px rgba(100,189,11,0.06), 0 2px 6px rgba(0,0,0,0.02)",
        pop: "0 10px 25px -5px var(--primary-shadow, rgba(100,189,11,0.40))",
        glass: "0 10px 32px 0 rgba(100,189,11,0.08), 0 1px 3px 0 rgba(0,0,0,0.03)",
        "glass-lg": "0 16px 40px -8px rgba(100,189,11,0.16), 0 2px 6px 0 rgba(0,0,0,0.02)",
      },
      borderRadius: {
        xl2: "1.1rem",
      },
    },
  },
  plugins: [],
};
