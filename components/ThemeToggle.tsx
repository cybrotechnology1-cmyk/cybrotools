"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by only rendering once mounted
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 shrink-0" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#eef0f6] hover:bg-[#e2e5ee] dark:bg-[#121124] dark:hover:bg-[#1b1937] border border-gray-200 dark:border-[#1f1d3c] text-gray-600 dark:text-[#8e8ca3] hover:text-purple-500 dark:hover:text-purple-400 transition-all hover:scale-105 active:scale-95 shrink-0"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon className="h-4.5 w-4.5 animate-in fade-in zoom-in duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
