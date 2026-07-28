import { authService } from './auth.service';
import { queryClient, queryKeys } from '@/core/http/query-client';

export const appInitializer = {
  bootstrap: async (): Promise<boolean> => {
    try {
      const token = await authService.refreshSession();
      if (!token) {
        return false;
      }

      // Prefetch authenticated user into React Query cache
      const user = await authService.getMe();
      if (user) {
        queryClient.setQueryData(queryKeys.user, user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
