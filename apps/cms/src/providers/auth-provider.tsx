'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { appInitializer } from '@/services/app-initializer';
import { httpClient } from '@/core/http/http-client';
import { queryClient, queryKeys } from '@/core/http/query-client';
import { User } from '@/types/auth.types';
import { SessionExpiredDialog } from '@/components/session-expired-dialog';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, rememberMe?: boolean) => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
  refresh: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // React Query owns user state
  const { data: user } = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Register callback for when automatic refresh fails during active session
    httpClient.setOnSessionExpired(() => {
      if (isAuthenticated) {
        setShowSessionExpired(true);
      }
    });

    // Run app initializer boot sequence
    appInitializer.bootstrap().then((success) => {
      setIsAuthenticated(success);
      setIsInitializing(false);
    });
  }, []);

  const login = async (email: string, password?: string, rememberMe: boolean = false) => {
    await authService.login(email, password, rememberMe);
    const userData = await authService.getMe();
    queryClient.setQueryData(queryKeys.user, userData);
    setIsAuthenticated(true);
  };

  const logout = async (allDevices: boolean = false) => {
    await authService.logout(allDevices);
    queryClient.clear();
    setIsAuthenticated(false);
  };

  const refresh = async () => {
    const token = await authService.refreshSession();
    if (token) {
      setIsAuthenticated(true);
      return true;
    }
    setIsAuthenticated(false);
    return false;
  };

  if (isInitializing) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted text-sm font-medium">Initializing Patterns CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated,
        isLoading: isInitializing,
        login,
        logout,
        refresh,
      }}
    >
      {children}
      <SessionExpiredDialog
        open={showSessionExpired}
        onConfirm={() => {
          setShowSessionExpired(false);
          logout();
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
