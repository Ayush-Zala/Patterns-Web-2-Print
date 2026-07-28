'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="bg-surface text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
        <ShieldAlert className="h-7 w-7 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">403 - Forbidden</h1>
      <p className="text-muted mt-2 max-w-sm text-xs">
        You do not have permission to access this resource. Please contact your administrator if you
        believe this is an error.
      </p>
      <div className="mt-6">
        <Link
          href="/dashboard"
          className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
