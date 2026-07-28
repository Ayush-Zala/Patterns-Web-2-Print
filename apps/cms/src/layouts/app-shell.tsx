'use client';

import React from 'react';
import { Header } from '@/components/header';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Box,
  Image as ImageIcon,
  FileCode2,
  ShoppingCart,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Workspaces', href: '/workspaces', icon: Building2 },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Products', href: '/products', icon: Box },
  { label: 'Assets', href: '/assets', icon: ImageIcon },
  { label: 'Templates', href: '/templates', icon: FileCode2 },
  { label: 'Orders', href: '/orders', icon: ShoppingCart },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Audit Logs', href: '/audit-logs', icon: Activity },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <div className="flex">
        <aside className="border-border bg-surface hidden min-h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r p-3 md:block">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted hover:bg-foreground/5 hover:text-foreground hover:translate-x-1'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
