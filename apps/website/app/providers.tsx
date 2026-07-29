'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* ToastProvider Placeholder */}
      {/* QueryProvider Placeholder */}
      {/* WorkspaceProvider Placeholder */}
      {/* ConfigProvider Placeholder */}
      {/* AuthProvider Placeholder */}
      {/* NotificationProvider Placeholder */}
      {children}
    </NextThemesProvider>
  );
}
