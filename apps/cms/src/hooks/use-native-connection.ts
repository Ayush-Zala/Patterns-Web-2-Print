import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationKeys } from './use-integrations';
import { httpClient } from '@/core/http/http-client';
import { toast } from 'sonner';

export const useConnectNative = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await httpClient.post<{
        integration: any;
        apiSecret: string;
      }>(`/integrations/${id}/connect`, undefined, {
        headers: { 'x-workspace-id': workspaceId },
      });
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.detail(id),
      });
      toast.success('Generated Native Website credentials');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate credentials');
    },
  });
};

export const useRotateNativeSecret = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await httpClient.post<{
        integration: any;
        apiSecret: string;
      }>(`/integrations/${id}/rotate-secret`, undefined, {
        headers: { 'x-workspace-id': workspaceId },
      });
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: integrationKeys.detail(id),
      });
      toast.success('Successfully rotated API secret');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to rotate secret');
    },
  });
};

export const useNativeStatus = (workspaceId: string, id: string) => {
  return useQuery({
    queryKey: [...integrationKeys.detail(id), 'native-status'],
    queryFn: async () => {
      const { data } = await httpClient.get<{
        connectionStatus: string;
        lastVerifiedAt: string | null;
        credentialsGeneratedAt: string | null;
        apiKey: string | null;
      }>(`/integrations/${id}/status`, {
        headers: { 'x-workspace-id': workspaceId },
      });
      return data;
    },
    enabled: !!id && !!workspaceId,
  });
};
