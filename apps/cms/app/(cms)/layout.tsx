'use client';

import React, { useEffect } from 'react';
import { AuthGuard } from '@/guards/auth-guard';
import { WorkspaceGuard } from '@/guards/workspace-guard';
import { AppShell } from '@/layouts/app-shell';
import { initializeNavigation } from '@/core/registries/init';

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeNavigation();
  }, []);

  return (
    <AuthGuard>
      <WorkspaceGuard>
        <AppShell>{children}</AppShell>
      </WorkspaceGuard>
    </AuthGuard>
  );
}
