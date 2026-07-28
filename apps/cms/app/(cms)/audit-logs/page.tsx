'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditApi } from '@/core/api/audit.api';
import { Activity } from 'lucide-react';

export default function AuditLogsPage() {
  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ['audit'],
    queryFn: () => auditApi.getLogs(),
  });

  const logs = logsResponse?.data?.data || [];

  if (isLoading) return <div className="text-muted p-8 text-center">Loading audit logs...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted mt-1 text-xs">View system activity and security events</p>
      </div>

      <div className="border-border bg-background overflow-hidden rounded-lg border shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-border bg-surface text-muted border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Resource</th>
              <th className="px-4 py-3 font-medium">User ID</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {logs.map((log: any) => (
              <tr key={log.id} className="hover:bg-surface/50">
                <td className="text-muted px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="text-foreground px-4 py-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Activity className="text-muted h-3.5 w-3.5" />
                    <span>{log.action}</span>
                  </div>
                </td>
                <td className="text-muted px-4 py-3">{log.resource}</td>
                <td className="text-muted px-4 py-3 font-mono">{log.userId || 'System'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted px-4 py-8 text-center">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
