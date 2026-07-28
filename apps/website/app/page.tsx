import * as React from 'react';
import { AppShell, Header, Container, Page, Button, Card, Skeleton } from '@patterns/ui';
import { ShoppingCart, Menu, User } from 'lucide-react';

export default async function WebsitePage() {
  let pingResult = null;
  let products = [];
  try {
    const headers = {
      'x-api-key': process.env.PATTERNS_API_KEY || '',
      'x-api-secret': process.env.PATTERNS_API_SECRET || '',
    };

    const [pingRes, productsRes] = await Promise.all([
      fetch(`${process.env.PATTERNS_API_URL}/storefront/ping`, { cache: 'no-store', headers }),
      fetch(`${process.env.PATTERNS_API_URL}/storefront/products`, { cache: 'no-store', headers }),
    ]);

    pingResult = await pingRes.json();
    const productsData = await productsRes.json();
    if (productsData.success) {
      products = productsData.data;
    }
  } catch (e) {
    console.error('Storefront fetch failed', e);
  }

  const currency = pingResult?.data?.currency || 'USD';
  const dateFormat = pingResult?.data?.dateFormat || 'MM/DD/YYYY';

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(priceInCents / 100);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (dateFormat === 'YYYY-MM-DD')
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (dateFormat === 'DD/MM/YYYY')
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <AppShell>
      <Header className="border-border justify-between border-b px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <span className="text-heading-m text-foreground font-bold">Patterns</span>
          <nav className="hidden gap-4 md:flex">
            <Button variant="link" className="text-muted hover:text-foreground">
              Home
            </Button>
            <Button variant="link" className="text-muted hover:text-foreground">
              Products
            </Button>
            <Button variant="link" className="text-muted hover:text-foreground">
              About
            </Button>
            <Button variant="link" className="text-muted hover:text-foreground">
              Contact
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-surface hidden sm:inline-flex"
          >
            Sign In
          </Button>
        </div>
      </Header>

      <div className="bg-background flex-1 overflow-auto">
        <Page className="bg-background text-foreground p-0 sm:px-0">
          {/* Hero Section */}
          <section className="bg-surface/30 border-border border-b px-4 py-20 text-center">
            <h1 className="text-heading-xl text-foreground mb-4 font-bold">
              Print On Demand, Perfected
            </h1>
            <p className="text-heading-m text-muted mx-auto mb-8 max-w-2xl">
              Design, sell, and scale your business with enterprise-grade print automation.
            </p>
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
              Get Started
            </Button>
          </section>

          <Container>
            {/* Category Grid Placeholder */}
            <section className="border-border/50 border-b py-12">
              <h2 className="text-heading-l text-foreground mb-6 font-bold">Categories</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {['T-Shirts', 'Hoodies', 'Mugs', 'Posters'].map((cat, i) => (
                  <div
                    key={i}
                    className="border-border bg-surface/50 hover:border-foreground/50 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border shadow-sm transition-colors"
                  >
                    <span className="text-foreground/80 font-semibold">{cat}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="py-12">
              <h2 className="text-heading-l text-foreground mb-6 font-bold">Featured Products</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product: any) => (
                    <Card
                      key={product.id}
                      className="border-border bg-background hover:border-muted group flex flex-col overflow-hidden border shadow-sm transition-colors"
                    >
                      <div className="bg-surface border-border relative aspect-[4/3] overflow-hidden border-b">
                        {product.imageUrl ? (
                          <img
                            src={
                              product.imageUrl.startsWith('http')
                                ? product.imageUrl
                                : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000/patterns-public'}/${product.imageUrl}`
                            }
                            alt={product.title}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-muted absolute inset-0 flex items-center justify-center">
                            <span className="text-sm">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <h3 className="text-foreground line-clamp-1 text-lg font-semibold">
                            {product.title}
                          </h3>
                          <span className="text-foreground font-bold">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-muted mb-4 line-clamp-2 text-sm">
                            {product.description}
                          </p>
                        )}
                        <div className="mt-auto flex flex-col gap-3 pt-4">
                          {product.createdAt && (
                            <span className="text-muted block text-[10px]">
                              Added {formatDate(product.createdAt)}
                            </span>
                          )}
                          <Button className="bg-foreground text-background hover:bg-foreground/90 w-full">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-muted border-border bg-surface/30 rounded-lg border border-dashed py-20 text-center">
                  <p>No published products found in this workspace.</p>
                </div>
              )}
            </section>
          </Container>
        </Page>
      </div>

      <footer className="border-border bg-surface text-muted border-t py-12 text-center">
        <Container>
          <p>&copy; {new Date().getFullYear()} Patterns. All rights reserved.</p>
        </Container>
      </footer>
    </AppShell>
  );
}
