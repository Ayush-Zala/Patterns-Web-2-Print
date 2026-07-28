'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled CMS Error:', error);
  }, [error]);

  return (
    <div className="bg-surface text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40">
        <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">500 - Server Error</h1>
      <p className="text-muted mt-2 max-w-sm text-xs">
        An unexpected error occurred while rendering this page. Our team has been notified.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
