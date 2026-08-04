'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { AuthGuard } from '@/guards/auth-guard';

export default function OAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="bg-surface text-foreground flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-6 flex items-center gap-2">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Patterns</span>
        </div>

        <div className="border-border bg-background w-full max-w-md rounded-xl border p-6 shadow-sm sm:p-8">
          {children}
        </div>

        <div className="text-muted mt-8 text-center text-xs">
          <p>
            © {new Date().getFullYear()} Patterns Enterprise SaaS Platform. All rights reserved.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
