'use client';

import React, { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/core/api/user.api';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const updateProfile = useMutation({
    mutationFn: (data: any) => userApi.updateProfile(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ firstName, lastName });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted mt-1 text-xs">Manage your personal information</p>
      </div>

      <div className="border-border bg-background rounded-lg border p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground text-xs font-medium">First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-border bg-surface w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-xs font-medium">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-border bg-surface w-full rounded-md border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-foreground text-xs font-medium">Email</label>
            <input
              value={user?.email || ''}
              disabled
              className="border-border bg-surface/50 text-muted w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {updateProfile.isSuccess && (
              <span className="ml-3 text-xs text-green-500">Profile updated successfully.</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
