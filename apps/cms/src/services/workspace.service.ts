import { workspaceApi } from '@/core/api/workspace.api';
import { handleApiError } from '@/core/http/error-handler';
import { queryClient, queryKeys } from '@/core/http/query-client';

export const workspaceService = {
  getCurrentWorkspace: async () => {
    try {
      const response = await workspaceApi.getCurrentWorkspace();
      // The API returns the RequestContext, which contains the workspace property
      return (response.data as any).workspace || null;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getWorkspaces: async (params?: { status?: string }) => {
    try {
      const response = await workspaceApi.getWorkspaces(params);
      // The API returns a paginated structure: { data: Workspace[], meta: ... }
      return (response.data as any).data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  switchWorkspace: async (workspaceId: string) => {
    try {
      const response = await workspaceApi.switchWorkspace(workspaceId);
      // Invalidate workspace dependent query cache
      await queryClient.invalidateQueries({ queryKey: queryKeys.workspace.current });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Workspace Switch Failed');
    }
  },
};
