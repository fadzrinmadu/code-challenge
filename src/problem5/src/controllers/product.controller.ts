import { NextFunction, Request, Response } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from '../db/product.repository';
import { ApiError } from '../middleware/errorHandler';
import { CreateProductInput, UpdateProductInput } from '../models/product.model';

function parseCreateInput(body: unknown): CreateProductInput {
  if (typeof body !== 'object' || body === null) {
    throw new ApiError(400, 'Request body must be a JSON object');
  }
  const { name, description, category, price, inStock } = body as Record<string, unknown>;

  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new ApiError(400, '"name" is required and must be a non-empty string');
  }
  if (typeof category !== 'string' || category.trim().length === 0) {
    throw new ApiError(400, '"category" is required and must be a non-empty string');
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    throw new ApiError(400, '"price" is required and must be a non-negative number');
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    throw new ApiError(400, '"description" must be a string');
  }
  if (inStock !== undefined && typeof inStock !== 'boolean') {
    throw new ApiError(400, '"inStock" must be a boolean');
  }

  return {
    name: name.trim(),
    description: (description as string | null | undefined) ?? null,
    category: category.trim(),
    price,
    inStock: inStock as boolean | undefined,
  };
}

function parseUpdateInput(body: unknown): UpdateProductInput {
  if (typeof body !== 'object' || body === null) {
    throw new ApiError(400, 'Request body must be a JSON object');
  }
  const { name, description, category, price, inStock } = body as Record<string, unknown>;
  const input: UpdateProductInput = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new ApiError(400, '"name" must be a non-empty string');
    }
    input.name = name.trim();
  }
  if (category !== undefined) {
    if (typeof category !== 'string' || category.trim().length === 0) {
      throw new ApiError(400, '"category" must be a non-empty string');
    }
    input.category = category.trim();
  }
  if (price !== undefined) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new ApiError(400, '"price" must be a non-negative number');
    }
    input.price = price;
  }
  if (description !== undefined) {
    if (description !== null && typeof description !== 'string') {
      throw new ApiError(400, '"description" must be a string or null');
    }
    input.description = description as string | null;
  }
  if (inStock !== undefined) {
    if (typeof inStock !== 'boolean') {
      throw new ApiError(400, '"inStock" must be a boolean');
    }
    input.inStock = inStock;
  }

  if (Object.keys(input).length === 0) {
    throw new ApiError(400, 'At least one field must be provided to update');
  }

  return input;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(400, `Invalid pagination value: ${value}`);
  }
  return parsed;
}

function parseOptionalNumber(value: unknown, field: string): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new ApiError(400, `"${field}" must be a number`);
  }
  return parsed;
}

export function create(req: Request, res: Response, next: NextFunction): void {
  try {
    const input = parseCreateInput(req.body);
    const product = createProduct(input);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export function list(req: Request, res: Response, next: NextFunction): void {
  try {
    const { category, q, minPrice, maxPrice, inStock, page, limit } = req.query;

    let inStockFilter: boolean | undefined;
    if (inStock === 'true') inStockFilter = true;
    else if (inStock === 'false') inStockFilter = false;
    else if (inStock !== undefined) {
      throw new ApiError(400, '"inStock" must be "true" or "false"');
    }

    const filters = {
      category: typeof category === 'string' ? category : undefined,
      q: typeof q === 'string' ? q : undefined,
      minPrice: parseOptionalNumber(minPrice, 'minPrice'),
      maxPrice: parseOptionalNumber(maxPrice, 'maxPrice'),
      inStock: inStockFilter,
      page: parsePositiveInt(page, 1),
      limit: Math.min(parsePositiveInt(limit, 20), 100),
    };

    const { data, total } = listProducts(filters);
    res.json({
      data,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit) || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

export function getOne(req: Request, res: Response, next: NextFunction): void {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      throw new ApiError(404, `Product ${req.params.id} not found`);
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export function update(req: Request, res: Response, next: NextFunction): void {
  try {
    const input = parseUpdateInput(req.body);
    const product = updateProduct(req.params.id, input);
    if (!product) {
      throw new ApiError(404, `Product ${req.params.id} not found`);
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export function remove(req: Request, res: Response, next: NextFunction): void {
  try {
    const deleted = deleteProduct(req.params.id);
    if (!deleted) {
      throw new ApiError(404, `Product ${req.params.id} not found`);
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
