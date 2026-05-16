"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { FloatingThemeSwitcher } from "@/components/theme/theme-switcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <FloatingThemeSwitcher />
    </ThemeProvider>
  );
}
