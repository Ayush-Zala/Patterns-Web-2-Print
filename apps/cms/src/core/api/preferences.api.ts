import { httpClient } from '../http/http-client';
import { UserPreference } from '@/types/auth.types';

export const preferencesApi = {
  getPreferences: () => httpClient.get<UserPreference>('/preferences'),

  updatePreferences: (data: Partial<UserPreference>) =>
    httpClient.patch<UserPreference>('/preferences', data),
};
