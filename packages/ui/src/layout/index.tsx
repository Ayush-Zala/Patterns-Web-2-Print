import * as React from "react"
import { cn } from "../lib/utils"

export function AppShell({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex min-h-screen w-full flex-col bg-background", className)} {...props}>
      {children}
    </div>
  )
}

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside className={cn("fixed inset-y-0 left-0 z-10 hidden w-[var(--sidebar-width)] flex-col border-r bg-background sm:flex", className)} {...props}>
      {children}
    </aside>
  )
}

export function Header({ className, children, ...props }: React.HTMLAttributes<HTMLHeadElement>) {
  return (
    <header className={cn("sticky top-0 z-30 flex h-[var(--header-height)] items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6", className)} {...props}>
      {children}
    </header>
  )
}

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8", className)} {...props}>
      {children}
    </div>
  )
}

export function Page({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main className={cn("flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8", className)} {...props}>
      {children}
    </main>
  )
}

export function PageHeader({ className, title, description, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { title: string; description?: string }) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <div>
        <h1 className="text-heading-l">{title}</h1>
        {description && <p className="text-muted text-sm">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function NavigationGroup({ className, title, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <div className={cn("flex flex-col gap-2 py-2", className)} {...props}>
      <h4 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted">{title}</h4>
      <nav className="grid gap-1 px-2">
        {children}
      </nav>
    </div>
  )
}
