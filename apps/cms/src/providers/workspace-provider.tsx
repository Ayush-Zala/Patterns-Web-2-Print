'use client';

import React, { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { workspaceService } from '@/services/workspace.service';
import { queryKeys } from '@/core/http/query-client';
import { Workspace } from '@/types/auth.types';
import { useAuth } from './auth-provider';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  isSwitching: boolean;
  switchWorkspace: (workspaceId: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: currentWorkspace, isLoading: isLoadingCurrent } = useQuery({
    queryKey: queryKeys.workspace.current,
    queryFn: () => workspaceService.getCurrentWorkspace(),
    enabled: isAuthenticated,
  });

  const { data: workspaces, isLoading: isLoadingList } = useQuery({
    queryKey: queryKeys.workspace.list,
    queryFn: () => workspaceService.getWorkspaces(),
    enabled: isAuthenticated,
  });

  const switchWorkspace = async (workspaceId: string) => {
    setIsSwitching(true);
    try {
      await workspaceService.switchWorkspace(workspaceId);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace: currentWorkspace || null,
        workspaces: workspaces || [],
        isLoading: isLoadingCurrent || isLoadingList,
        isSwitching,
        switchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
