'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="border-border bg-background hover:bg-surface hover:text-foreground text-muted focus-visible:ring-primary group relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none"
      aria-label="Toggle theme"
    >
      <Sun className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all duration-300 group-hover:text-amber-500 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all duration-300 group-hover:text-blue-400 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
