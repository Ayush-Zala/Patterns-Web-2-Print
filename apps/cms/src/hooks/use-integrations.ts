import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWorkspace } from '@/providers/workspace-provider';
import {
  integrationApi,
  CreateIntegrationPayload,
  UpdateIntegrationPayload,
  IntegrationQueryParams,
} from '@/core/api/integration.api';

export const integrationKeys = {
  all: ['integration'] as const,
  lists: () => [...integrationKeys.all, 'list'] as const,
  list: (filters: IntegrationQueryParams) => [...integrationKeys.lists(), filters] as const,
  details: () => [...integrationKeys.all, 'detail'] as const,
  detail: (id: string) => [...integrationKeys.details(), id] as const,
};

export function useIntegrations(params?: IntegrationQueryParams) {
  const { currentWorkspace } = useWorkspace();
  const enabled = !!currentWorkspace?.id;

  return useQuery({
    queryKey: integrationKeys.list(params || {}),
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error('No active workspace');
      const res = await integrationApi.findMany(currentWorkspace.id, params);
      return res.data;
    },
    enabled,
  });
}

export function useIntegration(id: string) {
  const { currentWorkspace } = useWorkspace();
  const enabled = !!currentWorkspace?.id && !!id;

  return useQuery({
    queryKey: integrationKeys.detail(id),
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error('No active workspace');
      const res = await integrationApi.findOne(currentWorkspace.id, id);
      return res.data;
    },
    enabled,
  });
}

export function useCreateIntegration() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();

  return useMutation({
    mutationFn: async (data: CreateIntegrationPayload) => {
      if (!currentWorkspace?.id) throw new Error('No active workspace');
      const res = await integrationApi.create(currentWorkspace.id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
    },
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateIntegrationPayload }) => {
      if (!currentWorkspace?.id) throw new Error('No active workspace');
      const res = await integrationApi.update(currentWorkspace.id, id, data);
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: integrationKeys.detail(variables.id) });
    },
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!currentWorkspace?.id) throw new Error('No active workspace');
      await integrationApi.remove(currentWorkspace.id, id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.lists() });
      queryClient.removeQueries({ queryKey: integrationKeys.detail(id) });
    },
  });
}
