'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, Product } from '@/core/api/product.api';
import { queryKeys } from '@/core/http/query-client';
import {
  Package,
  Plus,
  X,
  Upload,
  Globe,
  Settings,
  FileText,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useWorkspace } from '@/providers/workspace-provider';

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useWorkspace();
  const currency = currentWorkspace?.settings?.theme?.currency || 'USD';
  const dateFormat = currentWorkspace?.settings?.theme?.dateFormat || 'MM/DD/YYYY';

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

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<
    'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  >('ALL');

  const { data: products = [], isLoading } = useQuery({
    queryKey: queryKeys.product.list,
    queryFn: () => productApi.getProducts().then((res) => res.data),
  });

  const filteredProducts = products.filter(
    (p: Product) => statusFilter === 'ALL' || p.status === statusFilter,
  );

  // Form State
  const [formData, setFormData] = React.useState({ title: '', description: '', price: '' });
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = React.useState(false);

  const createMutation = useMutation({
    mutationFn: (data: any) => productApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.product.list });
      setIsCreateOpen(false);
      setFormData({ title: '', description: '', price: '' });
      setFile(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => productApi.publishProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.product.list }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.product.list }),
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => productApi.restoreProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.product.list }),
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (id: string) => productApi.hardDeleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.product.list }),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    let imageUrl = undefined;
    if (file) {
      setUploadingImage(true);
      try {
        const uploadRes = await productApi.uploadProductImage(file);
        if (uploadRes && uploadRes.success === false) {
          alert('Backend Error: ' + JSON.stringify(uploadRes));
        } else {
          imageUrl = uploadRes.data?.url;
        }
      } catch (error: any) {
        alert('Image upload failed: ' + (error?.message || JSON.stringify(error)));
        console.error('Image upload failed', error);
      }
      setUploadingImage(false);
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description || undefined,
      price: parseInt(formData.price, 10),
      imageUrl,
    });
  };

  const openCreateModal = () => {
    setFormData({ title: '', description: '', price: '' });
    setFile(null);
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">Products</h1>
          <p className="text-muted mt-1 text-xs">
            Manage your product catalog and publish to your storefront
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-primary text-primary-foreground flex items-center gap-2 rounded px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Create Product
        </button>
      </div>

      <div className="border-border flex items-center gap-2 border-b pb-4">
        {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:text-foreground hover:bg-surface bg-transparent'
            }`}
          >
            {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((p: Product) => (
          <div
            key={p.id}
            className="border-border bg-background hover:border-muted flex flex-col rounded-lg border p-4 shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex w-full gap-3">
                {p.imageUrl ? (
                  <img
                    src={
                      p.imageUrl.startsWith('http')
                        ? p.imageUrl
                        : `${process.env.NEXT_PUBLIC_STORAGE_URL || 'http://localhost:9000/patterns-public'}/${p.imageUrl}`
                    }
                    alt={p.title}
                    className="bg-surface border-border h-12 w-12 rounded border object-cover"
                  />
                ) : (
                  <div className="bg-surface border-border flex h-12 w-12 shrink-0 items-center justify-center rounded border">
                    <Package className="text-muted h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0 flex-1 overflow-hidden">
                  <h3 className="text-foreground truncate text-sm font-semibold">{p.title}</h3>
                  <p className="text-muted mt-0.5 text-xs font-medium">{formatPrice(p.price)}</p>
                </div>
              </div>
              <span
                className={`ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase ${
                  p.status === 'PUBLISHED'
                    ? 'bg-green-500/10 text-green-500'
                    : p.status === 'DRAFT'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-red-500/10 text-red-500'
                }`}
              >
                {p.status}
              </span>
            </div>

            {p.description && (
              <p className="text-muted mt-3 line-clamp-2 text-[11px]">{p.description}</p>
            )}

            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="text-muted text-[10px]">{formatDate(p.createdAt)}</div>

              <div className="flex items-center gap-4">
                {p.status === 'DRAFT' && (
                  <button
                    onClick={() => publishMutation.mutate(p.id)}
                    disabled={publishMutation.isPending}
                    className="text-primary flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
                  >
                    <Globe className="h-3 w-3" />
                    Publish
                  </button>
                )}

                {p.status === 'ARCHIVED' ? (
                  <>
                    <button
                      onClick={() => restoreMutation.mutate(p.id)}
                      disabled={restoreMutation.isPending}
                      className="text-primary flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Restore
                    </button>
                    <button
                      onClick={() => hardDeleteMutation.mutate(p.id)}
                      disabled={hardDeleteMutation.isPending}
                      className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Permanently Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => deleteMutation.mutate(p.id)}
                    disabled={deleteMutation.isPending}
                    className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-muted border-border bg-surface/50 col-span-full rounded-lg border border-dashed py-12 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 opacity-20" />
            <p className="text-sm">No products found.</p>
          </div>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="border-border bg-background flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-lg border p-6 shadow-lg">
            <div className="mb-4 flex shrink-0 items-center justify-between">
              <h3 className="text-foreground text-lg font-semibold">Create Product</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="scrollbar-thin space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="text-foreground block text-xs font-medium">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Premium T-Shirt"
                  className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-foreground block text-xs font-medium">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comfortable cotton..."
                  rows={3}
                  className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full resize-none rounded-md border px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-foreground block text-xs font-medium">
                  Price (in cents)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 2999 for $29.99"
                  className="border-border bg-background text-foreground placeholder:text-muted focus:border-primary mt-1 w-full rounded-md border px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-foreground mb-1 block text-xs font-medium">
                  Product Image (Optional)
                </label>
                <div className="flex w-full items-center justify-center">
                  <label className="border-border bg-surface hover:bg-surface/80 flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="flex flex-col items-center justify-center pt-3 pb-4">
                      <Upload className="text-muted mb-2 h-5 w-5" />
                      <p className="text-muted text-[10px]">
                        <span className="text-foreground font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                {file && (
                  <p className="text-primary mt-2 truncate text-[10px]">Selected: {file.name}</p>
                )}
              </div>
              <div className="flex shrink-0 justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-border hover:bg-surface text-foreground rounded-md border px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || uploadingImage}
                  className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-xs font-medium hover:opacity-90 disabled:opacity-50"
                >
                  {uploadingImage
                    ? 'Uploading...'
                    : createMutation.isPending
                      ? 'Creating...'
                      : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
