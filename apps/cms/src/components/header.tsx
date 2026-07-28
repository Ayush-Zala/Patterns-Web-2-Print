'use client';

import React from 'react';
import { WorkspaceSwitcher } from './workspace-switcher';
import { UserMenu } from './user-menu';
import { Bell, Layers } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@patterns/ui';

export function Header() {
  return (
    <header className="border-border bg-background/95 sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b px-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-foreground flex items-center gap-2 font-bold">
          <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-md shadow-sm">
            <Layers className="h-4 w-4" />
          </div>
          <span className="text-sm tracking-tight">Patterns</span>
        </Link>
        <span className="text-muted/40">/</span>
        <WorkspaceSwitcher />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          className="text-muted hover:bg-surface hover:text-foreground focus-visible:ring-primary relative flex h-9 w-9 items-center justify-center rounded-md border border-transparent transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
