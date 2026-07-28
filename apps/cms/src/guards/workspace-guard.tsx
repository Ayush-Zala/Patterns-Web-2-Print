'use client';

import React from 'react';
import { useWorkspace } from '@/providers/workspace-provider';

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { currentWorkspace, isLoading } = useWorkspace();

  if (isLoading && !currentWorkspace) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted text-xs">Loading workspace context...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
