import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Loader2, Plus, Trash2, Key, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { httpClient } from '@/core/http/http-client';

export const WebhooksTab = () => {
  const { id: workspaceId } = useParams() as { id: string };
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: 'product.created, product.updated',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['webhooks', workspaceId],
    queryFn: () => httpClient.get(`/webhooks`).then((res: any) => res.data.data),
  });

  const webhooks = data || [];

  const createMutation = useMutation({
    mutationFn: (data: any) => httpClient.post(`/webhooks`, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', workspaceId] });
      setIsCreating(false);
      setNewWebhook({ url: '', events: 'product.created, product.updated' });
      toast.success('Webhook created successfully!');
      if (res.data.data.secret) {
        // In a real app we'd show this in a modal
        alert(
          `IMPORTANT: Save this secret now! It will not be shown again.\n\nSecret: ${res.data.data.secret}`,
        );
      }
    },
    onError: () => toast.error('Failed to create webhook'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => httpClient.delete(`/webhooks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', workspaceId] });
      toast.success('Webhook deleted');
    },
  });

  const rotateMutation = useMutation({
    mutationFn: (id: string) => httpClient.post(`/webhooks/${id}/rotate-secret`),
    onSuccess: (res: any) => {
      toast.success('Secret rotated successfully');
      alert(
        `IMPORTANT: Save this new secret now! It will not be shown again.\n\nSecret: ${res.data.data.secret}`,
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="text-muted h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-foreground text-sm font-medium">Webhooks</h3>
          <p className="text-muted mt-1 text-xs">
            Receive real-time HTTP requests to external services when events occur.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Webhook
        </button>
      </div>

      {isCreating && (
        <div className="border-border bg-surface space-y-4 rounded-lg border p-4">
          <h4 className="text-foreground text-sm font-medium">Create New Webhook</h4>
          <div>
            <label className="text-foreground mb-1 block text-xs font-medium">Payload URL</label>
            <input
              type="url"
              placeholder="https://example.com/webhook"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
              className="bg-background border-border focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-xs font-medium">
              Events (comma separated)
            </label>
            <input
              type="text"
              value={newWebhook.events}
              onChange={(e) => setNewWebhook({ ...newWebhook, events: e.target.value })}
              className="bg-background border-border focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="border-border hover:bg-background rounded-md border px-3 py-1.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                createMutation.mutate({
                  url: newWebhook.url,
                  events: newWebhook.events
                    .split(',')
                    .map((e) => e.trim())
                    .filter(Boolean),
                  isActive: true,
                })
              }
              disabled={!newWebhook.url || createMutation.isPending}
              className="bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Saving...' : 'Save Webhook'}
            </button>
          </div>
        </div>
      )}

      {webhooks.length === 0 ? (
        <div className="border-border bg-surface/50 rounded-lg border border-dashed p-8 text-center">
          <Activity className="text-muted mx-auto mb-2 h-8 w-8" />
          <p className="text-foreground text-sm font-medium">No webhooks configured</p>
          <p className="text-muted mt-1 text-xs">
            Add a webhook to start receiving event notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {webhooks.map((webhook: any) => (
            <div
              key={webhook.id}
              className="border-border bg-surface flex items-start justify-between rounded-lg border p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${webhook.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <h4 className="text-foreground font-mono text-sm font-medium">{webhook.url}</h4>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {webhook.events.map((evt: string) => (
                    <span
                      key={evt}
                      className="bg-background border-border text-muted-foreground rounded border px-2 py-0.5 text-xs"
                    >
                      {evt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure you want to rotate the secret? The old secret will stop working immediately.',
                      )
                    ) {
                      rotateMutation.mutate(webhook.id);
                    }
                  }}
                  className="text-muted hover:text-foreground bg-background border-border rounded-md border p-1.5 transition-colors"
                  title="Rotate Secret"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this webhook?')) {
                      deleteMutation.mutate(webhook.id);
                    }
                  }}
                  className="rounded-md bg-red-500/10 p-1.5 text-red-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
