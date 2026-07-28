import { httpClient } from '../http/http-client';

export interface Product {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export const productApi = {
  getProducts: () => httpClient.get<Product[]>('/products'),

  createProduct: (data: {
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
  }) => httpClient.post<Product>('/products', data),

  publishProduct: (id: string) => httpClient.post<Product>(`/products/${id}/publish`, {}),

  deleteProduct: (id: string) => httpClient.delete(`/products/${id}`),

  restoreProduct: (id: string) => httpClient.post<Product>(`/products/${id}/restore`, {}),

  hardDeleteProduct: (id: string) => httpClient.delete(`/products/${id}/permanent`),

  uploadProductImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return httpClient.post<{ success: boolean; data: { url: string } }>(
      '/uploads/product',
      formData,
    );
  },
};
