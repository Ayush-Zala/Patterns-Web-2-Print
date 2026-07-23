import * as React from "react"
import { AppShell, Header, Container, Page, Button, Card, Skeleton } from "@patterns/ui"
import { ShoppingCart, Menu, User } from "lucide-react"

export default function WebsitePage() {
  return (
    <AppShell>
      <Header className="justify-between px-4 lg:px-8 border-b">
        <div className="flex items-center gap-6">
          <span className="text-heading-m font-bold">Patterns</span>
          <nav className="hidden md:flex gap-4">
            <Button variant="link" className="text-muted">Home</Button>
            <Button variant="link" className="text-muted">Products</Button>
            <Button variant="link" className="text-muted">About</Button>
            <Button variant="link" className="text-muted">Contact</Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><ShoppingCart className="h-5 w-5" /></Button>
          <Button variant="outline" className="hidden sm:inline-flex">Sign In</Button>
        </div>
      </Header>
      
      <div className="flex-1 overflow-auto">
        <Page className="p-0 sm:px-0">
          {/* Hero Section */}
          <section className="bg-surface py-20 px-4 text-center border-b border-border">
            <h1 className="text-heading-xl font-bold mb-4">Print On Demand, Perfected</h1>
            <p className="text-heading-m text-muted max-w-2xl mx-auto mb-8">Design, sell, and scale your business with enterprise-grade print automation.</p>
            <Button size="lg">Get Started</Button>
          </section>

          <Container>
            {/* Category Grid Placeholder */}
            <section className="py-12">
              <h2 className="text-heading-l font-bold mb-6">Categories</h2>
              <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md shadow-sm border border-border" />
                ))}
              </div>
            </section>

            {/* Featured Products Placeholder */}
            <section className="py-12 border-t border-border">
              <h2 className="text-heading-l font-bold mb-6">Featured Products</h2>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="flex flex-col shadow-sm border-border overflow-hidden">
                    <Skeleton className="h-48 rounded-none border-b border-border" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </Container>
        </Page>
      </div>

      <footer className="border-t border-border bg-surface py-12 text-center text-muted">
        <Container>
          <p>&copy; {new Date().getFullYear()} Patterns. All rights reserved.</p>
        </Container>
      </footer>
    </AppShell>
  )
}
