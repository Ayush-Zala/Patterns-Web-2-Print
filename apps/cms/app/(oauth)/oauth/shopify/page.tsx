'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspace } from '@/providers/workspace-provider';
import { integrationApi } from '@/core/api/integration.api';
import { Loader2, Link as LinkIcon, Store } from 'lucide-react';

function ShopifyOAuthContent() {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const redirectUri = searchParams.get('redirect_uri');

  const { workspaces, isLoading } = useWorkspace();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!shop || !redirectUri) {
    return (
      <div className="text-center">
        <h1 className="mb-2 text-xl font-semibold text-red-500">Invalid Request</h1>
        <p className="text-muted text-xs">Missing shop or redirect_uri parameters.</p>
      </div>
    );
  }

  const handleConnect = async () => {
    if (!selectedWorkspaceId) {
      setError('Please select a workspace');
      return;
    }

    setIsConnecting(true);
    setError(null);
    try {
      const response = await integrationApi.connectShopify(selectedWorkspaceId, {
        shop,
        redirectUri,
      });

      // Redirect to the URL provided by the backend (which includes the JWT token)
      window.location.href = response.data.redirectUrl;
    } catch (err: any) {
      setError(err?.message || 'Failed to connect Shopify. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-4">
          <div className="bg-primary/10 rounded-full p-3">
            <Store className="text-primary h-6 w-6" />
          </div>
          <LinkIcon className="text-muted h-4 w-4" />
          <div className="bg-primary rounded-full p-3">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          Connect Shopify to Patterns
        </h1>
        <p className="text-muted mt-2 text-xs">
          You are linking the Shopify store <strong className="text-foreground">{shop}</strong> to
          your Patterns account.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-foreground block text-xs font-medium">
          Select Workspace to Connect
        </label>

        {isLoading ? (
          <div className="bg-surface text-muted flex items-center justify-center rounded-md border p-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-xs">Loading workspaces...</span>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="rounded-md border bg-yellow-50 p-3 text-center text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            You don't have any workspaces yet.
          </div>
        ) : (
          <select
            className="bg-background focus:border-primary w-full rounded-md border p-2.5 text-xs focus:outline-none"
            value={selectedWorkspaceId}
            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
          >
            <option value="" disabled>
              -- Select a Workspace --
            </option>
            {workspaces.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.code})
              </option>
            ))}
          </select>
        )}
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting || !selectedWorkspaceId || workspaces.length === 0}
        className="bg-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : (
          <span>Approve Connection</span>
        )}
      </button>
    </div>
  );
}

export default function ShopifyOAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-8">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
        </div>
      }
    >
      <ShopifyOAuthContent />
    </Suspense>
  );
}
