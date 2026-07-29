import * as React from 'react';
import { AppShell, Button, Skeleton } from '@patterns/ui';
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Save,
  Download,
  Settings,
  MousePointer2,
  Type,
  Square,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';

export default function EditorPage() {
  return (
    <AppShell className="h-screen overflow-hidden">
      {/* Top Toolbar */}
      <header className="bg-background z-20 flex h-14 flex-shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">Untitled Design</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3 w-3" /> Export
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="h-3 w-3" /> Save
          </Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Tool Dock */}
        <aside className="bg-background z-10 flex w-16 flex-shrink-0 flex-col items-center gap-4 border-r py-4">
          <Button variant="ghost" size="icon" className="bg-surface">
            <MousePointer2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Type className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Square className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </aside>

        {/* Canvas Area Placeholder */}
        <main className="bg-surface relative flex flex-1 items-center justify-center overflow-hidden">
          {/* Floating History / Zoom Controls */}
          <div className="bg-background border-border absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-md border p-1 shadow-sm">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-mono text-xs">100%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="bg-background border-border absolute top-4 right-4 z-20 rounded-md border p-2 shadow-sm">
            <Button variant="ghost" size="sm" className="gap-2 text-xs">
              <Layers className="h-3 w-3" /> Layers
            </Button>
          </div>

          <div className="border-border text-muted flex h-[600px] w-[800px] items-center justify-center border bg-white shadow-md">
            <p>Canvas Area</p>
          </div>
        </main>

        {/* Right Property Inspector */}
        <aside className="bg-background z-10 flex hidden w-64 flex-shrink-0 flex-col border-l md:flex">
          <div className="border-b p-3">
            <span className="text-sm font-semibold">Properties</span>
          </div>
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="bg-background text-muted z-20 flex h-8 flex-shrink-0 items-center justify-between border-t px-4 text-xs">
        <span>Ready</span>
        <span>800 x 600 px</span>
      </footer>
    </AppShell>
  );
}

function Menu(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
