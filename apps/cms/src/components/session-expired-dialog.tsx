'use client';

import React from 'react';

interface SessionExpiredDialogProps {
  open: boolean;
  onConfirm: () => void;
}

export function SessionExpiredDialog({ open, onConfirm }: SessionExpiredDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="border-border bg-background w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h3 className="text-foreground text-lg font-semibold">Session Expired</h3>
        <p className="text-muted mt-2 text-sm">
          Your authentication session has expired due to inactivity or token invalidation. Please
          sign in again to continue.
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none"
          >
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
}
