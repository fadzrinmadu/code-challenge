export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  category: string;
  price: number;
  inStock?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  description?: string | null;
  category?: string;
  price?: number;
  inStock?: boolean;
}

export interface ProductFilters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page: number;
  limit: number;
}
