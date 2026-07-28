'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-surface text-foreground flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="bg-muted/20 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <FileQuestion className="text-muted h-7 w-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">404 - Page Not Found</h1>
      <p className="text-muted mt-2 max-w-sm text-xs">
        The page you are looking for does not exist or has been moved.
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
