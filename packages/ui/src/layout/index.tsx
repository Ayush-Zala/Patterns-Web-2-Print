import * as React from 'react';
import { cn } from '../lib/utils';

export function AppShell({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-background flex min-h-screen w-full flex-col', className)} {...props}>
      {children}
    </div>
  );
}

export function Sidebar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside
      className={cn(
        'bg-background sticky top-0 z-10 hidden h-screen w-[var(--sidebar-width)] flex-col border-r sm:flex',
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function Header({ className, children, ...props }: React.HTMLAttributes<HTMLHeadElement>) {
  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-30 flex h-[var(--header-height)] shrink-0 items-center gap-4 border-b px-4 sm:px-6',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8', className)} {...props}>
      {children}
    </div>
  );
}

export function Page({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      className={cn('flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8', className)}
      {...props}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  className,
  title,
  description,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title: string; description?: string }) {
  return (
    <div className={cn('flex items-center justify-between', className)} {...props}>
      <div>
        <h1 className="text-heading-l">{title}</h1>
        {description && <p className="text-muted text-sm">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function NavigationGroup({
  className,
  title,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title: string }) {
  return (
    <div className={cn('flex flex-col gap-2 py-2', className)} {...props}>
      <h4 className="text-muted px-4 text-xs font-semibold tracking-wider uppercase">{title}</h4>
      <nav className="grid gap-1 px-2">{children}</nav>
    </div>
  );
}
