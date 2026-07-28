'use client';

import React from 'react';
import { useWorkspace } from '@/providers/workspace-provider';
import { Building2, Check, ArrowRight, Trash2, Edit2, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi } from '@/core/api/workspace.api';
import { workspaceService } from '@/services/workspace.service';
import { queryKeys } from '@/core/http/query-client';

export default function WorkspacesPage() {
  const { currentWorkspace, isSwitching, switchWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const { data: filteredWorkspaces = [], isLoading } = useQuery({
    queryKey: [...queryKeys.workspace.list, statusFilter],
    queryFn: () =>
      workspaceService.getWorkspaces(statusFilter !== 'ALL' ? { status: statusFilter } : undefined),
  });

  // Form State
  const [formData, setFormData] = React.useState({ name: '' });

  const createMutation = useMutation({
    mutationFn: (data: any) => workspaceApi.createWorkspace(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => workspaceApi.deleteWorkspace(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list }),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => workspaceApi.restoreWorkspace(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list }),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name) {
      createMutation.mutate(
        { name: formData.name },
        {
          onSuccess: () => {
            setIsCreateOpen(false);
            setFormData({ name: '' });
          },
        },
      );
    }
  };

  const openCreateModal = () => {
    setFormData({ name: '' });
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-muted mt-1 text-xs">
            Manage and switch between your accessible workspace environments
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-primary-foreground flex items-center gap-2 rounded px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Workspace
        </button>
      </div>

      <div className="border-border flex items-center gap-2 border-b pb-4">
        {['ALL', 'ACTIVE', 'INACTIVE', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:text-foreground hover:bg-surface bg-transparent'
            }`}
          >
            {status === 'ALL'
              ? 'All'
              : status === 'INACTIVE'
                ? 'Suspended'
                : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkspaces.map((ws: any) => {
          const isActive = ws.id === currentWorkspace?.id;
          return (
            <div
              key={ws.id}
              className={`rounded-lg border p-4 shadow-sm transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-border bg-background hover:border-muted'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-surface border-border flex h-8 w-8 items-center justify-center rounded-md border">
                    <Building2 className="text-muted h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-foreground flex items-center gap-2 text-xs font-semibold">
                      {ws.name}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                          ws.status === 'ACTIVE'
                            ? 'bg-green-500/10 text-green-500'
                            : ws.status === 'INACTIVE'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {ws.status === 'INACTIVE' ? 'SUSPENDED' : ws.status}
                      </span>
                    </h3>
                    <p className="text-muted font-mono text-[10px]">[{ws.code}]</p>
                  </div>
                </div>
                {isActive && (
                  <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium">
                    <Check className="h-3 w-3" />
                    Active
                  </span>
                )}
              </div>

              <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                <div className="text-muted flex items-center gap-2 text-[10px]">
                  <span>Code: {ws.code}</span>
                  <Link href={`/workspaces/${ws.id}`} className="hover:text-foreground">
                    <Edit2 className="h-3 w-3" />
                  </Link>
                  {!isActive && ws.status !== 'ARCHIVED' && (
                    <button
                      onClick={() => archiveMutation.mutate(ws.id)}
                      className="hover:text-red-500"
                      title="Archive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                  {ws.status === 'ARCHIVED' && (
                    <button
                      onClick={() => restoreMutation.mutate(ws.id)}
                      className="text-foreground font-medium hover:underline"
                    >
                      Restore
                    </button>
                  )}
                </div>
                {!isActive && ws.status !== 'ARCHIVED' && (
                  <button
                    onClick={() => switchWorkspace(ws.id)}
                    disabled={isSwitching}
                    className="text-primary flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
                  >
                    <span>Switch</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Workspace Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="border-border bg-background w-full max-w-md rounded-lg border p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-foreground text-lg font-semibold">Create Workspace</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-foreground block text-xs font-medium">Workspace Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-border hover:bg-surface rounded-md border px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-xs font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
