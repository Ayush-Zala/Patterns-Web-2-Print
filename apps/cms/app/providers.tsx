'use client';

import React from 'react';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { WorkspaceProvider } from '@/providers/workspace-provider';
import { UIProvider } from '@/providers/ui-provider';

import { ThemeProvider } from '@patterns/ui';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <UIProvider>{children}</UIProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
