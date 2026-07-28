'use client';

import React from 'react';
import { useUI } from '@/providers/ui-provider';
import { Moon, Sun, Monitor } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { preferencesApi } from '@/core/api/preferences.api';

export default function SettingsPage() {
  const { theme, setTheme } = useUI();
  const queryClient = useQueryClient();

  const { data: prefsResponse, isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: () => preferencesApi.getPreferences(),
  });

  const prefs = prefsResponse?.data;

  const updatePrefs = useMutation({
    mutationFn: (data: any) => preferencesApi.updatePreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updatePrefs.mutate({ theme: newTheme });
  };

  if (isLoading) return <div className="text-muted p-8 text-center">Loading preferences...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">Preferences</h1>
        <p className="text-muted mt-1 text-xs">Customize your user experience and theme options</p>
      </div>

      <div className="border-border bg-background rounded-lg border p-6 shadow-sm">
        <h3 className="text-foreground text-sm font-semibold">Appearance</h3>
        <p className="text-muted mt-1 text-xs">Choose your preferred application theme</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors ${
              theme === 'light'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <Sun className="text-foreground h-6 w-6" />
            <span className="text-foreground mt-2 text-xs font-medium">Light Theme</span>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors ${
              theme === 'dark'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <Moon className="text-foreground h-6 w-6" />
            <span className="text-foreground mt-2 text-xs font-medium">Dark Theme</span>
          </button>

          <button
            onClick={() => handleThemeChange('system')}
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-colors ${
              theme === 'system'
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <Monitor className="text-foreground h-6 w-6" />
            <span className="text-foreground mt-2 text-xs font-medium">System Default</span>
          </button>
        </div>
      </div>
      <div className="border-border bg-background rounded-lg border p-6 shadow-sm">
        <h3 className="text-foreground text-sm font-semibold">Language & Region</h3>
        <p className="text-muted mt-1 text-xs">Set your language and timezone preferences</p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-foreground text-xs font-medium">Language</label>
            <select
              value={prefs?.language || 'en-US'}
              onChange={(e) => updatePrefs.mutate({ language: e.target.value })}
              className="border-border bg-surface w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-foreground text-xs font-medium">Timezone</label>
            <select
              value={prefs?.timezone || 'UTC'}
              onChange={(e) => updatePrefs.mutate({ timezone: e.target.value })}
              className="border-border bg-surface w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (US)</option>
              <option value="America/Los_Angeles">Pacific Time (US)</option>
              <option value="Europe/London">London (UK)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
