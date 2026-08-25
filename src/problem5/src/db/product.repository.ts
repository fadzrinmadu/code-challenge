import { v4 as uuidv4 } from 'uuid';
import { db } from './index';
import {
  CreateProductInput,
  Product,
  ProductFilters,
  UpdateProductInput,
} from '../models/product.model';

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  inStock: number;
  createdAt: string;
  updatedAt: string;
}

function toProduct(row: ProductRow): Product {
  return { ...row, inStock: Boolean(row.inStock) };
}

export function createProduct(input: CreateProductInput): Product {
  const now = new Date().toISOString();
  const row: ProductRow = {
    id: uuidv4(),
    name: input.name,
    description: input.description ?? null,
    category: input.category,
    price: input.price,
    inStock: input.inStock === false ? 0 : 1,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO products (id, name, description, category, price, inStock, createdAt, updatedAt)
     VALUES (@id, @name, @description, @category, @price, @inStock, @createdAt, @updatedAt)`
  ).run(row);

  return toProduct(row);
}

export function listProducts(filters: ProductFilters): { data: Product[]; total: number } {
  const conditions: string[] = [];
  const params: Record<string, unknown> = {};

  if (filters.category) {
    conditions.push('category = @category');
    params.category = filters.category;
  }
  if (filters.q) {
    conditions.push('(name LIKE @q OR description LIKE @q)');
    params.q = `%${filters.q}%`;
  }
  if (filters.minPrice !== undefined) {
    conditions.push('price >= @minPrice');
    params.minPrice = filters.minPrice;
  }
  if (filters.maxPrice !== undefined) {
    conditions.push('price <= @maxPrice');
    params.maxPrice = filters.maxPrice;
  }
  if (filters.inStock !== undefined) {
    conditions.push('inStock = @inStock');
    params.inStock = filters.inStock ? 1 : 0;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const total = (
    db.prepare(`SELECT COUNT(*) as count FROM products ${whereClause}`).get(params) as {
      count: number;
    }
  ).count;

  const offset = (filters.page - 1) * filters.limit;
  const rows = db
    .prepare(
      `SELECT * FROM products ${whereClause} ORDER BY createdAt DESC LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: filters.limit, offset }) as ProductRow[];

  return { data: rows.map(toProduct), total };
}

export function getProductById(id: string): Product | undefined {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as
    | ProductRow
    | undefined;
  return row ? toProduct(row) : undefined;
}

export function updateProduct(id: string, input: UpdateProductInput): Product | undefined {
  const existing = getProductById(id);
  if (!existing) return undefined;

  const updated: ProductRow = {
    id: existing.id,
    name: input.name ?? existing.name,
    description: input.description !== undefined ? input.description : existing.description,
    category: input.category ?? existing.category,
    price: input.price ?? existing.price,
    inStock: (input.inStock ?? existing.inStock) ? 1 : 0,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  db.prepare(
    `UPDATE products
     SET name = @name, description = @description, category = @category,
         price = @price, inStock = @inStock, updatedAt = @updatedAt
     WHERE id = @id`
  ).run(updated);

  return toProduct(updated);
}

export function deleteProduct(id: string): boolean {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}
