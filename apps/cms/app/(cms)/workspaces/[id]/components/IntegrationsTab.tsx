import React, { useState } from 'react';
import {
  useIntegrations,
  useCreateIntegration,
  useUpdateIntegration,
  useDeleteIntegration,
} from '@/hooks/use-integrations';
import { Plus, Settings2, Trash2, Edit2, Link as LinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { IntegrationSettings } from './IntegrationSettings';

type IntegrationType = 'NATIVE_WEBSITE' | 'WORDPRESS' | 'SHOPIFY';
type IntegrationStatus = 'ACTIVE' | 'SUSPENDED' | 'DISCONNECTED';

export function IntegrationsTab() {
  const { data, isLoading } = useIntegrations();
  const createMutation = useCreateIntegration();
  const updateMutation = useUpdateIntegration();
  const deleteMutation = useDeleteIntegration();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [type, setType] = useState<IntegrationType>('NATIVE_WEBSITE');
  const [displayName, setDisplayName] = useState('');
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<IntegrationStatus>('ACTIVE');

  const integrations: any[] = data?.data || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ type, displayName });
      toast.success('Integration created successfully');
      setIsCreating(false);
      setDisplayName('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create integration');
    }
  };

  const handleUpdate = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        id,
        data: { displayName: editName, status: editStatus },
      });
      toast.success('Integration updated successfully');
      setEditingId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update integration');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this integration?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Integration removed');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to remove integration');
      }
    }
  };

  if (isLoading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="text-muted mx-auto h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-foreground text-lg font-medium">Connected Integrations</h3>
          <p className="text-muted text-sm">Manage your external platforms and websites</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Integration
          </button>
        )}
      </div>

      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="border-border bg-surface space-y-4 rounded-lg border p-6"
        >
          <h4 className="text-foreground font-medium">New Integration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-medium">
                Platform Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IntegrationType)}
                className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
              >
                <option value="NATIVE_WEBSITE">Native Website</option>
                <option value="WORDPRESS">WordPress</option>
                <option value="SHOPIFY">Shopify</option>
              </select>
            </div>
            <div>
              <label className="text-foreground mb-1 block text-xs font-medium">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Main Storefront"
                className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Connect
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-muted hover:text-foreground hover:bg-muted/10 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {integrations.length === 0 && !isCreating ? (
        <div className="border-border rounded-lg border border-dashed p-12 text-center">
          <LinkIcon className="text-muted mx-auto mb-3 h-8 w-8" />
          <h3 className="text-foreground text-sm font-medium">No integrations yet</h3>
          <p className="text-muted mt-1 text-sm">
            Connect your first platform to start syncing data.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {integrations.map((integration: any) => (
            <div key={integration.id} className="border-border bg-surface rounded-lg border p-5">
              {editingId === integration.id ? (
                <form onSubmit={(e) => handleUpdate(e, integration.id)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-foreground mb-1 block text-xs font-medium">
                        Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-foreground mb-1 block text-xs font-medium">
                        Status
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as IntegrationStatus)}
                        className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="DISCONNECTED">Disconnected</option>
                      </select>
                    </div>
                  </div>

                  {integration.type === 'NATIVE_WEBSITE' || integration.type === 'WORDPRESS' ? (
                    <IntegrationSettings
                      workspaceId={integration.workspaceId}
                      integrationId={integration.id}
                    />
                  ) : (
                    <div className="border-border bg-muted/20 mt-4 rounded border p-4">
                      <h5 className="text-foreground mb-2 flex items-center gap-2 text-xs font-medium">
                        <Settings2 className="h-3 w-3" /> Configuration
                      </h5>
                      <p className="text-muted text-xs italic">
                        No configuration available. Configuration will become available after
                        connecting this integration.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="text-muted hover:text-foreground rounded-md px-4 py-2 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground flex items-center gap-2 font-medium">
                        {integration.displayName}
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            integration.status === 'ACTIVE'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-yellow-500/10 text-yellow-500'
                          }`}
                        >
                          {integration.status}
                        </span>
                      </h4>
                      <p className="text-muted mt-1 text-xs">{integration.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(integration.id);
                        setEditName(integration.displayName);
                        setEditStatus(integration.status);
                      }}
                      className="text-muted hover:bg-muted/10 hover:text-foreground rounded-md p-2 transition-colors"
                      title="Edit Integration"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="text-muted rounded-md p-2 transition-colors hover:bg-red-500/10 hover:text-red-500"
                      title="Remove Integration"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
