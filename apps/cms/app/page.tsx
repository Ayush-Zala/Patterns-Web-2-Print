import * as React from "react"
import { AppShell, Sidebar, Header, Container, Page, PageHeader, NavigationGroup, Button, Card, Skeleton, EmptyState } from "@patterns/ui"
import { LayoutDashboard, Package, Palette, Image as ImageIcon, ShoppingCart, Users, Settings, Search, Bell, Menu } from "lucide-react"

export default function CMSPage() {
  return (
    <AppShell className="flex-row">
      <Sidebar className="w-[var(--sidebar-width)] flex-shrink-0">
        <div className="flex h-[var(--header-height)] items-center border-b px-4 lg:px-6">
          <span className="text-heading-m font-bold">Patterns</span>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <NavigationGroup title="Workspace">
            <Button variant="ghost" className="justify-start gap-2 px-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</Button>
            <Button variant="ghost" className="justify-start gap-2 px-2"><Package className="h-4 w-4" /> Products</Button>
            <Button variant="ghost" className="justify-start gap-2 px-2"><Palette className="h-4 w-4" /> Templates</Button>
            <Button variant="ghost" className="justify-start gap-2 px-2"><ImageIcon className="h-4 w-4" /> Assets</Button>
          </NavigationGroup>
          <NavigationGroup title="Commerce">
            <Button variant="ghost" className="justify-start gap-2 px-2"><ShoppingCart className="h-4 w-4" /> Orders</Button>
            <Button variant="ghost" className="justify-start gap-2 px-2"><Users className="h-4 w-4" /> Customers</Button>
          </NavigationGroup>
          <NavigationGroup title="Administration">
            <Button variant="ghost" className="justify-start gap-2 px-2"><Settings className="h-4 w-4" /> Settings</Button>
          </NavigationGroup>
        </div>
      </Sidebar>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header className="justify-between px-4 lg:px-6 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden"><Menu className="h-5 w-5" /></Button>
            <span className="text-muted text-sm hidden sm:inline-block">Workspace / Development</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Search className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
            {/* Theme Toggle Placeholder */}
            {/* User Avatar Placeholder */}
            <Skeleton className="h-8 w-8 rounded-full ml-2" />
          </div>
        </Header>
        
        <div className="flex-1 overflow-auto">
          <Page>
            <PageHeader title="Dashboard" description="Overview of your workspace." />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-4 shadow-sm border-border">
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-1/3" />
                </Card>
              ))}
            </div>
            
            <EmptyState 
              icon={Package}
              title="No recent activity"
              description="Your workspace activity will appear here once you start processing orders."
            />
          </Page>
        </div>
      </div>
    </AppShell>
  )
}
