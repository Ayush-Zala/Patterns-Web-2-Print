'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/providers/workspace-provider';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';

export function WorkspaceSwitcher() {
  const { currentWorkspace, workspaces, isSwitching, switchWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="border-border bg-surface text-foreground hover:bg-muted/10 flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
      >
        <Building2 className="text-muted h-4 w-4" />
        <span className="max-w-[120px] truncate">
          {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
        </span>
        <ChevronsUpDown className="text-muted h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="border-border bg-background absolute left-0 z-50 mt-1 w-56 rounded-md border p-1 shadow-md">
          <div className="text-muted px-2 py-1 text-[10px] font-semibold uppercase">Workspaces</div>
          <div className="max-h-48 overflow-y-auto">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={async () => {
                  setIsOpen(false);
                  if (ws.id !== currentWorkspace?.id) {
                    await switchWorkspace(ws.id);
                  }
                }}
                className="text-foreground hover:bg-surface flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-muted font-mono text-[10px]">[{ws.code}]</span>
                  <span className="truncate">{ws.name}</span>
                </div>
                {ws.id === currentWorkspace?.id && <Check className="text-primary h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
