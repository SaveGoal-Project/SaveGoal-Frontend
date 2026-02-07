/**
 * Design Tokens extracted from Figma Design
 * SaveGoal Brand Colors, Typography, and Spacing
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: "#1a53c8",
    dark: "#2b3063",
    light: "#5761c9",
    lighter: "#8aabee",
    lightest: "#9bbcff",
  },
  // Accent Colors
  accent: {
    yellow: "#ffce31",
    yellowLight: "rgba(255, 214, 0, 0.3)",
    yellowLighter: "rgba(255, 214, 0, 0.01)",
  },
  // Neutral Colors
  neutral: {
    white: "#ffffff",
    black: "#000000",
    gray: {
      50: "#f5f5f5",
      100: "#d9d9d9",
      200: "#939393",
      300: "#5f5e5e",
      400: "#303770",
    },
  },
  // Background Colors
  background: {
    DEFAULT: "#f5f5f5",
    white: "#ffffff",
    blue: "#212d67",
    gradient: {
      primary: "linear-gradient(to right, #2b3063, #5761c9)",
      blue: "linear-gradient(to bottom, #1a53c8, #ffffff)",
      yellow: "linear-gradient(to bottom, rgba(192,219,251,0.64), rgba(255,214,0,0.01))",
    },
  },
  // Text Colors
  text: {
    primary: "#000000",
    secondary: "#1a53c8",
    muted: "rgba(26, 83, 200, 0.66)",
    light: "rgba(26, 83, 200, 0.62)",
    white: "#ffffff",
    gray: "#5e7fc1",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: ["Montserrat", "sans-serif"],
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "22px",
    "3xl": "25px",
    "4xl": "28px",
    "5xl": "30px",
    "6xl": "40px",
    "7xl": "50px",
    "8xl": "52px",
    "9xl": "58px",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    normal: "normal",
    tight: 1.2,
    relaxed: 1.5,
  },
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
  "4xl": "96px",
  "5xl": "128px",
} as const;

export const borderRadius = {
  sm: "5px",
  md: "10px",
  lg: "11px",
  xl: "20px",
  "2xl": "23px",
  "3xl": "25px",
  "4xl": "30px",
  "5xl": "35px",
  "6xl": "45px",
  "7xl": "72px",
  full: "100px",
} as const;

export const shadows = {
  sm: "0px 4px 25px 0px rgba(0, 0, 0, 0.11)",
  md: "2px 2px 10px 0px rgba(0, 0, 0, 0.25)",
  lg: "0px 4px 56.2px 0px rgba(0, 0, 0, 0.25)",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
} as const;

