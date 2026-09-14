export const colors = {
  light: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    primary: "#2563EB",
    primaryText: "#FFFFFF",
    border: "#E2E8F0",
    danger: "#DC2626",
    success: "#16A34A",
    warning: "#D97706",
  },
  dark: {
    background: "#0B1220",
    surface: "#111A2E",
    text: "#F1F5F9",
    textMuted: "#94A3B8",
    primary: "#3B82F6",
    primaryText: "#0B1220",
    border: "#1E293B",
    danger: "#F87171",
    success: "#4ADE80",
    warning: "#FBBF24",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

// Palette "futuriste" pour les écrans premium (héros, badges lumineux) -
// distincte du thème clair/sombre standard, utilisée volontairement en dur.
export const futuristic = {
  gradientStart: "#0B1224",
  gradientMid: "#12224B",
  gradientEnd: "#1E3A8A",
  gold: "#F5B93F",
  goldSoft: "#FCE3A6",
  glass: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.16)",
  textOnDark: "#F8FAFC",
  textOnDarkMuted: "rgba(248,250,252,0.7)",
  badgeColors: [
    ["#38BDF8", "#2563EB"],
    ["#FBBF24", "#F59E0B"],
    ["#34D399", "#059669"],
    ["#F472B6", "#DB2777"],
    ["#A78BFA", "#7C3AED"],
    ["#FB923C", "#EA580C"],
    ["#5EEAD4", "#0D9488"],
    ["#F87171", "#DC2626"],
    ["#93C5FD", "#3B82F6"],
  ] as [string, string][],
};
