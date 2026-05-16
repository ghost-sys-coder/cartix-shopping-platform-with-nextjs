"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Sun, Moon, Palette, Check } from "lucide-react";
import { useTheme, DesignTheme } from "./theme-provider";

const DESIGN_THEMES: {
  id: DesignTheme;
  label: string;
  description: string;
  swatch: string[];
}[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean & refined",
    swatch: ["#346482", "#535b93", "#f8f9fa"],
  },
  {
    id: "bold",
    label: "Bold",
    description: "Kinetic precision",
    swatch: ["#ab2d00", "#4f5d6e", "#f5f6f7"],
  },
  {
    id: "glassmorphic",
    label: "Glassmorphic",
    description: "Frosted glass",
    swatch: ["#003ec7", "#4459a8", "#f8f9fa"],
  },
];

export function FloatingThemeSwitcher() {
  const { designTheme, colorMode, setDesignTheme, toggleColorMode } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="glass-panel rounded-2xl shadow-2xl p-4 w-64 border border-border"
          >
            {/* Color mode toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground">
                Appearance
              </span>
              <button
                onClick={toggleColorMode}
                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                {colorMode === "light" ? (
                  <>
                    <Sun size={12} />
                    Light
                  </>
                ) : (
                  <>
                    <Moon size={12} />
                    Dark
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-border mb-4" />

            {/* Design themes */}
            <div className="mb-1">
              <span className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground">
                Design Theme
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              {DESIGN_THEMES.map((t) => {
                const active = designTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDesignTheme(t.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                      active
                        ? "bg-primary/10 ring-1 ring-primary"
                        : "hover:bg-muted"
                    }`}
                  >
                    {/* Swatches */}
                    <div className="flex gap-1 shrink-0">
                      {t.swatch.map((c, i) => (
                        <span
                          key={i}
                          className="w-3 h-3 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-tight font-label">
                        {t.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {t.description}
                      </div>
                    </div>
                    {active && (
                      <Check size={14} className="text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        className="w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white transition-colors"
        style={{ background: "var(--brand-primary)" }}
        aria-label="Theme settings"
      >
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <Palette size={20} /> : <Settings size={20} />}
        </motion.div>
      </motion.button>
    </div>
  );
}
