import React, { useState } from 'react';
import {
  useConnectIntegration,
  useRotateIntegrationSecret,
  useDisconnectIntegration,
  useIntegrationStatus,
} from '@/hooks/use-integration-connection';
import { Loader2, Key, RefreshCw, Copy, PlugZap } from 'lucide-react';
import { toast } from 'sonner';

export function IntegrationSettings({
  workspaceId,
  integrationId,
}: {
  workspaceId: string;
  integrationId: string;
}) {
  const { data: statusData, isLoading } = useIntegrationStatus(workspaceId, integrationId);
  const connectMutation = useConnectIntegration(workspaceId);
  const rotateMutation = useRotateIntegrationSecret(workspaceId);
  const disconnectMutation = useDisconnectIntegration(workspaceId);

  const [exposedSecret, setExposedSecret] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const result = await connectMutation.mutateAsync(integrationId);
      setExposedSecret(result.apiSecret);
    } catch (e) {
      // toast already handled in hook
    }
  };

  const handleRotate = async () => {
    if (confirm('Are you sure? This will invalidate the existing secret immediately.')) {
      try {
        const result = await rotateMutation.mutateAsync(integrationId);
        setExposedSecret(result.apiSecret);
      } catch (e) {
        // toast already handled
      }
    }
  };

  const handleDisconnect = async () => {
    if (
      confirm(
        'Are you sure you want to disconnect? External applications using these credentials will stop working.',
      )
    ) {
      try {
        await disconnectMutation.mutateAsync(integrationId);
        setExposedSecret(null);
      } catch (e) {
        // toast already handled
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center">
        <Loader2 className="text-muted mx-auto h-5 w-5 animate-spin" />
      </div>
    );
  }

  const { connectionStatus, apiKey, lastVerifiedAt, credentialsGeneratedAt } = statusData || {};

  return (
    <div className="border-border bg-muted/20 mt-4 space-y-4 rounded border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-foreground flex items-center gap-2 text-xs font-medium">
          <Key className="h-4 w-4" /> Connection Settings
        </h5>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            connectionStatus === 'CONNECTED'
              ? 'bg-green-500/10 text-green-500'
              : connectionStatus === 'PENDING'
                ? 'bg-blue-500/10 text-blue-500'
                : 'bg-gray-500/10 text-gray-500'
          }`}
        >
          {connectionStatus || 'DISCONNECTED'}
        </span>
      </div>

      {connectionStatus === 'DISCONNECTED' && (
        <div className="py-4 text-center">
          <p className="text-muted mb-4 text-sm">
            Generate API credentials to connect your integration.
          </p>
          <button
            type="button"
            onClick={handleConnect}
            disabled={connectMutation.isPending}
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {connectMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate Credentials
          </button>
        </div>
      )}

      {(connectionStatus === 'PENDING' || connectionStatus === 'CONNECTED') && (
        <div className="space-y-4">
          <div>
            <label className="text-muted mb-1 block text-xs font-medium">API Key</label>
            <div className="flex items-center gap-2">
              <code className="bg-background border-border flex-1 rounded border px-3 py-2 text-xs">
                {apiKey}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(apiKey || '')}
                className="bg-background border-border hover:bg-muted text-muted rounded border p-2"
                title="Copy API Key"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {exposedSecret && (
            <div className="rounded border border-yellow-500/30 bg-yellow-500/10 p-3">
              <label className="mb-1 block flex items-center justify-between text-xs font-medium text-yellow-600">
                <span>API Secret (Store this securely!)</span>
                <span className="text-[10px]">Visible only once</span>
              </label>
              <div className="mt-2 flex items-center gap-2">
                <code className="bg-background text-foreground flex-1 rounded border border-yellow-500/30 px-3 py-2 font-mono text-xs">
                  {exposedSecret}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(exposedSecret)}
                  className="bg-background rounded border border-yellow-500/30 p-2 text-yellow-600 hover:bg-yellow-500/20"
                  title="Copy API Secret"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="border-border mt-4 flex items-center justify-between border-t pt-2">
            <div className="text-muted text-xs">
              {credentialsGeneratedAt && (
                <div>Generated: {new Date(credentialsGeneratedAt).toLocaleString()}</div>
              )}
              {lastVerifiedAt && (
                <div>Last Verified: {new Date(lastVerifiedAt).toLocaleString()}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                disabled={rotateMutation.isPending}
                className="border-border bg-background text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
              >
                {rotateMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Rotate Secret
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnectMutation.isPending}
                className="border-border bg-background inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                {disconnectMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <PlugZap className="h-3 w-3" />
                )}
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
