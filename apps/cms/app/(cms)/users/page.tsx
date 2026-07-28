'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Mail, UserCheck, Trash2, Edit2 } from 'lucide-react';
import { userApi } from '@/core/api/user.api';
import { useAuth } from '@/providers/auth-provider';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });

  const users = usersResponse?.data?.data || [];

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      userApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (isLoading) return <div className="text-muted p-8 text-center">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted mt-1 text-xs">
            View user accounts and manage access permissions
          </p>
        </div>
        <button className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium">
          Add User
        </button>
      </div>

      <div className="border-border bg-background overflow-hidden rounded-lg border shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-border bg-surface text-muted border-b">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-surface/50">
                <td className="text-foreground px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold">
                      {(user.firstName || user.email).charAt(0).toUpperCase()}
                    </div>
                    <span>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : 'No Name'}
                    </span>
                  </div>
                </td>
                <td className="text-muted px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Mail className="text-muted h-3.5 w-3.5" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="text-muted px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Shield className="text-muted h-3.5 w-3.5" />
                    <span className="capitalize">{user.role || 'ADMIN'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'}`}
                  >
                    <UserCheck className="h-3 w-3" />
                    {user.status || 'PENDING'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        toggleStatus.mutate({
                          id: user.id,
                          status: user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE',
                        })
                      }
                      className="bg-surface border-border rounded border px-2 py-1 text-[10px]"
                    >
                      Toggle
                    </button>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => deleteUser.mutate(user.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="text-muted px-4 py-8 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
