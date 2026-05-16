"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type DesignTheme = "minimal" | "bold" | "glassmorphic";
export type ColorMode = "light" | "dark";

interface ThemeContextValue {
  designTheme: DesignTheme;
  colorMode: ColorMode;
  setDesignTheme: (theme: DesignTheme) => void;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const DESIGN_THEME_KEY = "cartix-design-theme";
const COLOR_MODE_KEY = "cartix-color-mode";

function isDesignTheme(value: string | null): value is DesignTheme {
  return value === "minimal" || value === "bold" || value === "glassmorphic";
}

function isColorMode(value: string | null): value is ColorMode {
  return value === "light" || value === "dark";
}

function getInitialDesignTheme(): DesignTheme {
  if (typeof window === "undefined") return "minimal";

  const saved = localStorage.getItem(DESIGN_THEME_KEY);
  return isDesignTheme(saved) ? saved : "minimal";
}

function getInitialColorMode(): ColorMode {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem(COLOR_MODE_KEY);
  if (isColorMode(saved)) return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [designTheme, setDesignThemeState] = useState<DesignTheme>(
    getInitialDesignTheme
  );
  const [colorMode, setColorModeState] =
    useState<ColorMode>(getInitialColorMode);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-design-theme", designTheme);
    if (colorMode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [colorMode, designTheme]);

  const setDesignTheme = useCallback((theme: DesignTheme) => {
    setDesignThemeState(theme);
    localStorage.setItem(DESIGN_THEME_KEY, theme);
    document.documentElement.setAttribute("data-design-theme", theme);
  }, []);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem(COLOR_MODE_KEY, mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorMode(colorMode === "light" ? "dark" : "light");
  }, [colorMode, setColorMode]);

  return (
    <ThemeContext.Provider
      value={{ designTheme, colorMode, setDesignTheme, setColorMode, toggleColorMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
