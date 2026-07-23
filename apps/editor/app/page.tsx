import * as React from "react"
import { AppShell, Button, Skeleton } from "@patterns/ui"
import { Undo, Redo, ZoomIn, ZoomOut, Save, Download, Settings, MousePointer2, Type, Square, Image as ImageIcon, Layers } from "lucide-react"

export default function EditorPage() {
  return (
    <AppShell className="h-screen overflow-hidden">
      {/* Top Toolbar */}
      <header className="flex h-14 items-center justify-between border-b bg-background px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon"><Menu className="h-4 w-4" /></Button>
          <span className="font-semibold text-sm">Untitled Design</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon"><Undo className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon"><Redo className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-3 w-3" /> Export</Button>
          <Button size="sm" className="gap-2"><Save className="h-3 w-3" /> Save</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Tool Dock */}
        <aside className="w-16 border-r bg-background flex flex-col items-center py-4 gap-4 z-10 flex-shrink-0">
          <Button variant="ghost" size="icon" className="bg-surface"><MousePointer2 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Type className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Square className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5" /></Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon"><Settings className="h-5 w-5" /></Button>
        </aside>

        {/* Canvas Area Placeholder */}
        <main className="flex-1 bg-surface relative overflow-hidden flex items-center justify-center">
          {/* Floating History / Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background border border-border shadow-sm rounded-md p-1 z-20">
            <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomOut className="h-4 w-4" /></Button>
            <span className="text-xs font-mono w-12 text-center">100%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8"><ZoomIn className="h-4 w-4" /></Button>
          </div>
          
          <div className="absolute top-4 right-4 bg-background border border-border shadow-sm rounded-md p-2 z-20">
            <Button variant="ghost" size="sm" className="gap-2 text-xs"><Layers className="h-3 w-3" /> Layers</Button>
          </div>

          <div className="w-[800px] h-[600px] bg-white border border-border shadow-md flex items-center justify-center text-muted">
            <p>Canvas Area</p>
          </div>
        </main>

        {/* Right Property Inspector */}
        <aside className="w-64 border-l bg-background flex flex-col z-10 flex-shrink-0 hidden md:flex">
          <div className="border-b p-3">
            <span className="text-sm font-semibold">Properties</span>
          </div>
          <div className="p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </aside>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-8 border-t bg-background flex items-center justify-between px-4 text-xs text-muted flex-shrink-0 z-20">
        <span>Ready</span>
        <span>800 x 600 px</span>
      </footer>
    </AppShell>
  )
}

function Menu(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
}
