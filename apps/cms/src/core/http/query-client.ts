import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
  },
});

export const queryKeys = {
  user: ['user'] as const,
  workspace: {
    current: ['workspace', 'current'] as const,
    list: ['workspace', 'list'] as const,
  },
  product: {
    list: ['product', 'list'] as const,
    detail: (id: string) => ['product', 'detail', id] as const,
  },
  preferences: ['preferences'] as const,
  notifications: ['notifications'] as const,
};
