'use client';

import React from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useWorkspace } from '@/providers/workspace-provider';
import { Box, ShoppingCart, Users, Layers, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const greetingName = user?.firstName || user?.email?.split('@')[0] || 'Admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Welcome back, {greetingName}
        </h1>
        <p className="text-muted mt-1 text-xs">
          Active Workspace:{' '}
          <span className="text-foreground font-semibold">
            {currentWorkspace?.name} ({currentWorkspace?.code})
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border-border bg-background rounded-lg border p-4 opacity-60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted text-xs font-medium">Total Products</span>
            <Box className="text-muted h-4 w-4" />
          </div>
          <p className="text-muted mt-2 text-xl font-bold">Coming Soon</p>
          <span className="text-muted text-[10px]">Phase 2 Module</span>
        </div>

        <div className="border-border bg-background rounded-lg border p-4 opacity-60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted text-xs font-medium">Total Orders</span>
            <ShoppingCart className="text-muted h-4 w-4" />
          </div>
          <p className="text-muted mt-2 text-xl font-bold">Coming Soon</p>
          <span className="text-muted text-[10px]">Phase 2 Module</span>
        </div>

        <div className="border-border bg-background rounded-lg border p-4 opacity-60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted text-xs font-medium">Active Users</span>
            <Users className="text-muted h-4 w-4" />
          </div>
          <p className="text-muted mt-2 text-xl font-bold">Coming Soon</p>
          <span className="text-muted text-[10px]">Awaiting Analytics API</span>
        </div>

        <div className="border-border bg-background rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted text-xs font-medium">System Status</span>
            <Activity className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-foreground mt-2 text-2xl font-bold">Healthy</p>
          <span className="text-muted text-[10px]">API & Worker Active</span>
        </div>
      </div>

      <div className="border-border bg-background rounded-lg border p-6 shadow-sm">
        <h3 className="text-foreground text-sm font-semibold">Workspace Activity Log</h3>
        <div className="text-muted mt-4 flex flex-col items-center justify-center py-8 text-center">
          <Layers className="h-8 w-8 opacity-40" />
          <p className="mt-2 text-xs font-medium">No recent activity</p>
          <p className="text-[11px]">Your workspace events will appear here as you operate.</p>
        </div>
      </div>
    </div>
  );
}
