'use client';

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { workspaceApi } from '@/core/api/workspace.api';
import { queryKeys } from '@/core/http/query-client';
import {
  Settings,
  Image as ImageIcon,
  ShieldAlert,
  FileText,
  ArrowLeft,
  Loader2,
  Save,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useWorkspace } from '@/providers/workspace-provider';
import { toast } from 'sonner';
import { IntegrationsTab } from './components/IntegrationsTab';
import { WebhooksTab } from './components/WebhooksTab';

export default function WorkspaceDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<
    'general' | 'branding' | 'settings' | 'integrations' | 'webhooks' | 'danger'
  >('general');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceApi.getWorkspace(id).then((res) => res.data),
  });

  const workspace = data;

  // Form states
  const [generalData, setGeneralData] = useState({ name: '', description: '' });
  const [brandingData, setBrandingData] = useState({ primaryColor: '', secondaryColor: '' });
  const [settingsData, setSettingsData] = useState({
    timezone: '',
    currency: '',
    language: '',
    dateFormat: '',
    timeFormat: '',
  });
  const [isConfirmingArchive, setIsConfirmingArchive] = useState(false);
  const [isConfirmingStatus, setIsConfirmingStatus] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('');

  // Update states when data loads
  useEffect(() => {
    if (workspace) {
      setGeneralData({ name: workspace.name || '', description: workspace.description || '' });
      setBrandingData({
        primaryColor: workspace.settings?.branding?.primaryColor || '',
        secondaryColor: workspace.settings?.branding?.secondaryColor || '',
      });
      setSettingsData({
        timezone: workspace.settings?.theme?.timezone || '',
        currency: workspace.settings?.theme?.currency || '',
        language: workspace.settings?.theme?.language || '',
        dateFormat: workspace.settings?.theme?.dateFormat || '',
        timeFormat: workspace.settings?.theme?.timeFormat || '',
      });
    }
  }, [workspace]);

  const updateMutation = useMutation({
    mutationFn: (updateData: any) => workspaceApi.updateWorkspace(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list });
      if (id === currentWorkspace?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.workspace.current });
      }
      toast.success('Workspace updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to update workspace');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => workspaceApi.updateWorkspaceStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list });
      if (id === currentWorkspace?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.workspace.current });
      }
      setIsConfirmingStatus(false);
      toast.success('Workspace status updated');
    },
    onError: (error: any) => {
      setIsConfirmingStatus(false);
      toast.error(error?.response?.data?.message || error.message || 'Failed to update status');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: () => workspaceApi.deleteWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list });
      toast.success('Workspace archived');
      router.push('/workspaces');
    },
    onError: (error: any) => {
      setIsConfirmingArchive(false);
      toast.error(error?.response?.data?.message || error.message || 'Failed to archive workspace');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: () => workspaceApi.restoreWorkspace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', id] });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspace.list });
      toast.success('Workspace restored');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to restore workspace');
    },
  });

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted h-6 w-6 animate-spin" />
      </div>
    );
  if (isError || !workspace)
    return <div className="p-6 text-red-500">Failed to load workspace</div>;

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ name: generalData.name, description: generalData.description });
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      ...(workspace.settings || {}),
      branding: {
        ...(workspace.settings?.branding || {}),
        primaryColor: brandingData.primaryColor,
        secondaryColor: brandingData.secondaryColor,
      },
    };
    updateMutation.mutate({ settings });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      ...(workspace.settings || {}),
      theme: {
        ...(workspace.settings?.theme || {}),
        ...settingsData,
      },
    };
    updateMutation.mutate({ settings });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FileText className="h-4 w-4" /> },
    { id: 'branding', label: 'Branding', icon: <ImageIcon className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <LinkIcon className="h-4 w-4" /> },
    { id: 'webhooks', label: 'Webhooks', icon: <FileText className="h-4 w-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <ShieldAlert className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/workspaces"
          className="hover:bg-surface text-muted rounded-full p-2 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-foreground flex items-center gap-3 text-xl font-bold tracking-tight">
            {workspace.name}
            <span
              className={`mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                workspace.status === 'ACTIVE'
                  ? 'bg-green-500/10 text-green-500'
                  : workspace.status === 'INACTIVE'
                    ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'
              }`}
            >
              {workspace.status === 'INACTIVE' ? 'SUSPENDED' : workspace.status}
            </span>
          </h1>
          <p className="text-muted mt-1 text-xs">Manage workspace details and configurations</p>
        </div>
      </div>

      <div className="border-border flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'text-muted hover:text-foreground hover:border-border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="max-w-xl space-y-4">
            <div>
              <label className="text-foreground mb-1 block text-xs font-medium">
                Workspace Name
              </label>
              <input
                type="text"
                required
                value={generalData.name}
                onChange={(e) => setGeneralData({ ...generalData, name: e.target.value })}
                className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-foreground mb-1 block text-xs font-medium">Description</label>
              <textarea
                value={generalData.description}
                onChange={(e) => setGeneralData({ ...generalData, description: e.target.value })}
                className="border-border bg-background focus:border-primary min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </form>
        )}

        {activeTab === 'branding' && (
          <form onSubmit={handleSaveBranding} className="max-w-xl space-y-6">
            <div className="space-y-4">
              <h3 className="text-foreground border-border border-b pb-2 text-sm font-medium">
                Colors
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-foreground mb-1 block text-xs font-medium">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={brandingData.primaryColor || '#000000'}
                    onChange={(e) =>
                      setBrandingData({ ...brandingData, primaryColor: e.target.value })
                    }
                    className="border-border bg-background h-10 w-full cursor-pointer rounded-md border p-1"
                  />
                </div>
                <div>
                  <label className="text-foreground mb-1 block text-xs font-medium">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={brandingData.secondaryColor || '#ffffff'}
                    onChange={(e) =>
                      setBrandingData({ ...brandingData, secondaryColor: e.target.value })
                    }
                    className="border-border bg-background h-10 w-full cursor-pointer rounded-md border p-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-foreground border-border border-b pb-2 text-sm font-medium">
                Assets
              </h3>
              <div className="border-border bg-surface rounded-lg border p-6 text-center">
                <ImageIcon className="text-muted mx-auto mb-2 h-8 w-8" />
                <p className="text-foreground text-sm font-medium">Logo & Favicon Upload</p>
                <p className="text-muted mt-1 text-xs">
                  Asset uploading will be available in Phase 2.
                </p>
                <button
                  type="button"
                  disabled
                  className="bg-muted text-muted-foreground mt-4 cursor-not-allowed rounded px-4 py-2 text-xs font-medium opacity-50"
                >
                  Upload Disabled
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Branding
            </button>
          </form>
        )}

        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="max-w-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-foreground mb-1 block text-xs font-medium">Timezone</label>
                <select
                  value={settingsData.timezone}
                  onChange={(e) => setSettingsData({ ...settingsData, timezone: e.target.value })}
                  className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST/EDT)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-medium">Currency</label>
                <select
                  value={settingsData.currency}
                  onChange={(e) => setSettingsData({ ...settingsData, currency: e.target.value })}
                  className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select currency</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-medium">Language</label>
                <select
                  value={settingsData.language}
                  onChange={(e) => setSettingsData({ ...settingsData, language: e.target.value })}
                  className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select language</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-medium">
                  Date Format
                </label>
                <select
                  value={settingsData.dateFormat}
                  onChange={(e) => setSettingsData({ ...settingsData, dateFormat: e.target.value })}
                  className="border-border bg-background focus:border-primary w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="">Select format</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-24)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (07/24/2026)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (24/07/2026)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground mt-4 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </button>
          </form>
        )}

        {activeTab === 'integrations' && <IntegrationsTab />}

        {activeTab === 'webhooks' && <WebhooksTab />}

        {activeTab === 'danger' && (
          <div className="max-w-xl space-y-6">
            <div className="border-border rounded-lg border p-4">
              <h3 className="text-foreground text-sm font-medium">Workspace Status</h3>
              <p className="text-muted mt-1 mb-4 text-xs">
                Current status:{' '}
                <span className="font-bold">
                  {workspace.status === 'INACTIVE' ? 'SUSPENDED' : workspace.status}
                </span>
              </p>

              <div className="flex gap-2">
                {workspace.status !== 'ACTIVE' && (
                  <button
                    onClick={() => {
                      setPendingStatus('ACTIVE');
                      setIsConfirmingStatus(true);
                    }}
                    className="rounded bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-500 transition-colors hover:bg-green-500/20"
                  >
                    Activate Workspace
                  </button>
                )}
                {workspace.status !== 'INACTIVE' && workspace.status !== 'ARCHIVED' && (
                  <button
                    onClick={() => {
                      setPendingStatus('INACTIVE');
                      setIsConfirmingStatus(true);
                    }}
                    className="rounded bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500 transition-colors hover:bg-yellow-500/20"
                  >
                    Suspend Workspace
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-red-500/30 p-4">
              <h3 className="text-sm font-medium text-red-500">Danger Zone</h3>
              <p className="text-muted mt-1 mb-4 text-xs">
                Archiving a workspace will restrict access and hide it from regular views.
              </p>

              {workspace.status === 'ARCHIVED' ? (
                <button
                  onClick={() => restoreMutation.mutate()}
                  disabled={restoreMutation.isPending}
                  className="bg-foreground text-background rounded px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {restoreMutation.isPending ? 'Restoring...' : 'Restore Workspace'}
                </button>
              ) : (
                <button
                  onClick={() => setIsConfirmingArchive(true)}
                  className="rounded bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
                >
                  Archive Workspace
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      {isConfirmingArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="border-border bg-background w-full max-w-sm rounded-lg border p-6 shadow-lg">
            <h3 className="text-foreground text-lg font-semibold">Archive Workspace</h3>
            <p className="text-muted mt-2 text-sm">
              Are you sure you want to archive {workspace.name}? You can restore it later.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmingArchive(false)}
                className="border-border hover:bg-surface rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => archiveMutation.mutate()}
                disabled={archiveMutation.isPending}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {archiveMutation.isPending ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="border-border bg-background w-full max-w-sm rounded-lg border p-6 shadow-lg">
            <h3 className="text-foreground text-lg font-semibold">Change Status</h3>
            <p className="text-muted mt-2 text-sm">Change workspace status to {pendingStatus}?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmingStatus(false)}
                className="border-border hover:bg-surface rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => statusMutation.mutate(pendingStatus)}
                disabled={statusMutation.isPending}
                className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {statusMutation.isPending ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
