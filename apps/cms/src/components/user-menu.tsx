'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useWorkspace } from '@/providers/workspace-provider';
import { User, LogOut, KeyRound, Settings, UserCheck } from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || 'User';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-border bg-surface hover:bg-muted/10 flex items-center gap-2 rounded-full border p-1.5 transition-colors"
      >
        <div className="bg-primary text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
          {displayName.charAt(0).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="border-border bg-background absolute right-0 z-50 mt-2 w-56 rounded-md border p-1 shadow-md">
          <div className="border-border border-b px-3 py-2">
            <p className="text-foreground truncate text-xs font-medium">{displayName}</p>
            <p className="text-muted truncate text-[11px]">{user?.email}</p>
            {currentWorkspace && (
              <span className="bg-surface text-muted mt-1 inline-block rounded px-1.5 py-0.5 font-mono text-[10px]">
                WS: {currentWorkspace.code}
              </span>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="text-foreground hover:bg-surface flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
            >
              <User className="text-muted h-3.5 w-3.5" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="text-foreground hover:bg-surface flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
            >
              <Settings className="text-muted h-3.5 w-3.5" />
              <span>Preferences</span>
            </Link>
            <Link
              href="/change-password"
              onClick={() => setIsOpen(false)}
              className="text-foreground hover:bg-surface flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
            >
              <KeyRound className="text-muted h-3.5 w-3.5" />
              <span>Change Password</span>
            </Link>
          </div>

          <div className="border-border border-t pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
