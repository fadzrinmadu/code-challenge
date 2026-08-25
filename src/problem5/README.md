# Problem 5: CRUD API (ExpressJS + TypeScript)

A REST API for managing `Product` resources, built with Express and TypeScript, persisted to a local SQLite database via `better-sqlite3`.

## Stack

- Express 4 + TypeScript
- `better-sqlite3` — embedded, file-backed SQLite database (no external DB server required)
- `uuid` for resource IDs

## Resource: Product

```ts
{
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  inStock: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

## Setup

```bash
cd src/problem5
npm install
cp .env.example .env
```

`.env` variables:

| Variable  | Default          | Description                          |
|-----------|------------------|---------------------------------------|
| `PORT`    | `3000`           | HTTP port the server listens on       |
| `DB_PATH` | `./data/app.db`  | Path to the SQLite database file      |

The `data/` directory and database file are created automatically on first run if they don't exist.

## Running

```bash
npm run dev     # ts-node-dev, watches for changes
```

or build + run the compiled output:

```bash
npm run build
npm start
```

The API is served under `http://localhost:3000/api/products`. `GET /health` returns `{ "status": "ok" }`.

## Endpoints

### Create a product

`POST /api/products`

```bash
curl -X POST localhost:3000/api/products \
  -H 'Content-Type: application/json' \
  -d '{"name":"Widget","category":"tools","price":9.99,"description":"A useful widget","inStock":true}'
```

Required fields: `name` (non-empty string), `category` (non-empty string), `price` (number >= 0). Optional: `description` (string or null), `inStock` (boolean, defaults to `true`).

Returns `201` with the created product.

### List products (with filters)

`GET /api/products`

Query parameters (all optional):

| Param      | Type    | Description                                      |
|------------|---------|---------------------------------------------------|
| `category` | string  | Exact match on category                            |
| `q`        | string  | Case-insensitive substring match on name/description |
| `minPrice` | number  | Minimum price (inclusive)                          |
| `maxPrice` | number  | Maximum price (inclusive)                          |
| `inStock`  | boolean | `"true"` or `"false"`                              |
| `page`     | integer | Page number, default `1`                           |
| `limit`    | integer | Page size, default `20`, capped at `100`           |

```bash
curl "localhost:3000/api/products?category=tools&minPrice=5&maxPrice=50&page=1&limit=10"
```

Returns `{ data: Product[], pagination: { page, limit, total, totalPages } }`.

### Get a product

`GET /api/products/:id`

```bash
curl localhost:3000/api/products/<id>
```

Returns `200` with the product, or `404` if it doesn't exist.

### Update a product

`PUT /api/products/:id`

Partial update — send only the fields to change.

```bash
curl -X PUT localhost:3000/api/products/<id> \
  -H 'Content-Type: application/json' \
  -d '{"price":12.5,"inStock":false}'
```

Returns `200` with the updated product, `400` if no valid fields are provided, or `404` if the product doesn't exist.

### Delete a product

`DELETE /api/products/:id`

```bash
curl -X DELETE localhost:3000/api/products/<id>
```

Returns `204` on success, or `404` if the product doesn't exist.

## Project structure

```
src/
  app.ts                       Express app wiring (middleware, routes)
  index.ts                     Entrypoint, loads .env and starts the server
  db/
    index.ts                   SQLite connection + schema bootstrap
    product.repository.ts      Data access layer (queries)
  controllers/
    product.controller.ts      Request validation + response handling
  routes/
    product.routes.ts          Route -> controller mapping
  middleware/
    errorHandler.ts            Centralized error + 404 handling
  models/
    product.model.ts           Shared TypeScript types
```
