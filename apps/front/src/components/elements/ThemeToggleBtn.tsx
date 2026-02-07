"use client";

import { useMounted } from "@/hooks/useMounted";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@ui/button";

export const ThemeToggleBtn = () => {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted)
    return (
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full"
        aria-label="Toggle theme"
        onClick={(e) => e.preventDefault()}
      >
        <span className="h-4.5 w-4.5" />
      </Button>
    );

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      size="icon"
      variant="ghost"
      className="rounded-full"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </Button>
  );
};
