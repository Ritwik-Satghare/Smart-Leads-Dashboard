/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ─── Light mode palette ─── */
        "sidebar":               "#1a2332",
        "sidebar-hover":         "#243044",
        "sidebar-active":        "#10b981",
        "sidebar-text":          "#94a3b8",
        "sidebar-text-active":   "#ffffff",

        "primary":               "#10b981",
        "primary-hover":         "#059669",
        "primary-light":         "#d1fae5",
        "primary-subtle":        "#ecfdf5",

        "accent":                "#3b82f6",
        "accent-light":          "#dbeafe",

        "surface":               "#f8fafc",
        "surface-card":          "#ffffff",
        "surface-elevated":      "#ffffff",

        "border":                "#e2e8f0",
        "border-light":          "#f1f5f9",

        "text-primary":          "#0f172a",
        "text-secondary":        "#475569",
        "text-muted":            "#94a3b8",

        "danger":                "#ef4444",
        "danger-light":          "#fee2e2",
        "warning":               "#f59e0b",
        "warning-light":         "#fef3c7",
        "info":                  "#3b82f6",
        "info-light":            "#dbeafe",
        "success":               "#10b981",
        "success-light":         "#d1fae5",

        /* ─── Dark mode overrides ─── */
        "dark-bg":               "#0f172a",
        "dark-card":             "#1e293b",
        "dark-elevated":         "#334155",
        "dark-border":           "#334155",
        "dark-border-light":     "#1e293b",
        "dark-text":             "#f1f5f9",
        "dark-text-secondary":   "#94a3b8",
        "dark-text-muted":       "#64748b",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg":      "0.75rem",
        "xl":      "1rem",
        "2xl":     "1.25rem",
        "full":    "9999px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display":   ["36px", { lineHeight: "44px",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading":   ["24px", { lineHeight: "32px",  letterSpacing: "-0.01em", fontWeight: "600" }],
        "subhead":   ["18px", { lineHeight: "28px",  fontWeight: "600" }],
        "body":      ["14px", { lineHeight: "22px",  fontWeight: "400" }],
        "body-lg":   ["16px", { lineHeight: "24px",  fontWeight: "400" }],
        "caption":   ["12px", { lineHeight: "16px",  fontWeight: "500" }],
        "overline":  ["11px", { lineHeight: "16px",  fontWeight: "600", letterSpacing: "0.05em" }],
      },
      boxShadow: {
        "card":      "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-lg":   "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)",
        "modal":     "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        "float":     "0 25px 50px -12px rgba(0,0,0,0.15)",
      },
      spacing: {
        "sidebar": "260px",
      },
      keyframes: {
        "slide-in-right": {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-in":        "fade-in 0.2s ease-out",
        "scale-in":       "scale-in 0.2s ease-out",
        "shimmer":        "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
}
