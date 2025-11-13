# Fullstock API - Onboarding Guide

## Table of Contents

1. **Project Overview**
   - Purpose and Domain
   - Tech Stack Summary
   - Key Features

2. **Getting Started**
   - Prerequisites
   - Environment Setup
   - Database Setup
   - Running the Application

3. **Architecture Overview**
   - Project Structure
   - Layered Architecture Pattern
   - Request Flow Diagram

4. **Database Layer**
   - Schema Design
   - Migration Strategy (dbmate)
   - Connection Pool Management
   - Query Utilities & Snake-to-Camel Case Conversion

5. **Application Layers**
   - **Models**: Data Structures & DTOs
   - **Repositories**: Data Access Layer
   - **Services**: Business Logic Layer
   - **Schemas**: Define schema validation for requests/responses using [Zod](https://zod.dev/basics)
   - **Controllers**: Request/Response Handlers
   - **Routes**: API Endpoint Definitions

6. **Cross-Cutting Concerns**
   - Error Handling Strategy
   - Custom Error Types
   - Session Management
   - Password Hashing
   - Middleware Architecture

7. **Type Safety & Developer Experience**
   - TypeScript Configuration
   - Strict Type Checking
   - Path Aliases (`@/*`)
   - Session Type Extensions

8. **Code Quality & Standards**
   - ESLint Configuration
   - Prettier Setup
   - Naming Conventions
   - File Organization Patterns

---

## 1. Project Overview

### Purpose and Domain

**Fullstock API** is a backend RESTful API designed for an e-commerce platform. It provides the server-side functionality for managing an online store's core operations, including:

- **Product Catalog Management**: Browse, search, and organize products by categories
- **User Authentication**: Secure registration and login with session-based authentication

This API serves as the foundation for a full-stack e-commerce application, handling all data persistence, business logic, and authentication concerns.

### Tech Stack Summary

The project is built with a modern, type-safe Node.js stack:

| Layer          | Technology                          | Purpose                                         |
| -------------- | ----------------------------------- | ----------------------------------------------- |
| **Runtime**    | Node.js                             | JavaScript runtime environment                  |
| **Language**   | TypeScript                          | Type-safe JavaScript with compile-time checking |
| **Framework**  | Express.js 5                        | Fast, minimalist web framework                  |
| **Database**   | PostgreSQL                          | Robust relational database                      |
| **ORM/Query**  | node-pg                             | Native PostgreSQL client (raw SQL)              |
| **Migrations** | dbmate                              | Simple database migration tool                  |
| **Sessions**   | express-session + connect-pg-simple | Server-side session storage in PostgreSQL       |
| **Security**   | bcryptjs                            | Password hashing                                |
| **Dev Tools**  | tsx, ESLint, Prettier               | Hot reloading, linting, formatting              |

### Key Features

#### Authentication System

- Session-based authentication (no JWT complexity)
- Secure password hashing with bcrypt
- Protected routes with session middleware
- Register, login, and logout endpoints

#### Architecture Highlights

- **Layered architecture**: Clear separation of concerns (Routes → Controllers → Services → Repositories)
- **Type safety**: Full TypeScript coverage with strict mode
- **Error handling**: Centralized error handling with custom error types
- **Database migrations**: Version-controlled schema changes with dbmate
- **Developer experience**: Hot reloading, path aliases, consistent code formatting

#### Developer-Friendly Features

- **Path aliases**: Use `@/` instead of relative imports (`../../`)
- **Hot reloading**: Instant feedback with `tsx --watch`
- **REST client**: Test endpoints directly in VS Code with `api.rest`
- **Snake-to-camel conversion**: Database snake_case → JavaScript camelCase automatically
- **Seeding**: Quick database population for development/testing

---

## 2. Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v22.x or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js) or your preferred package manager

### Environment Setup

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create your environment file**

   Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   Open `.env` and update the following variables:

   ```bash
   # Database connection string
   DATABASE_URL="postgresql://user:password@localhost:5432/fullstock_dev?sslmode=disable"

   # Session configuration
   SESSION_SECRET="your-super-secret-session-key-min-32-chars"
   SESSION_NAME="sessionId"
   SESSION_MAX_AGE_HOURS=24

   # Server configuration (optional)
   PORT=3000
   ```

   **Important notes:**
   - Replace `user` and `password` with your PostgreSQL credentials
   - Generate a strong `SESSION_SECRET` (at least 32 characters). You can use:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - The database name (`fullstock_dev`) will be created in the next step

### Database Setup

The project uses **dbmate** for managing database migrations and schema changes.

1. **Create the database**

   ```bash
   npm run migrate
   ```

   This command:
   - Creates the database if it doesn't exist
   - Runs all migrations in `db/migrations/` folder
   - Sets up the `schema_migrations` tracking table

2. **Verify the database structure**

   Check migration status:

   ```bash
   npm run migrate:status
   ```

   You should see all migrations applied successfully.

3. **Seed the database with sample data**

   ```bash
   npm run db:seed
   ```

   This populates your database with:
   - 3 product categories (Polos, Tazas, Stickers)
   - 20+ sample products with realistic data
   - Images, prices, descriptions, and features

4. **Reset the database (when needed)**

   If you need to start fresh:

   ```bash
   npm run db:reset
   ```

   ⚠️ **Warning**: This drops all data and recreates everything from scratch!

### Running the Application

#### Development Mode (with hot reloading)

Start the development server:

```bash
npm run dev
```

The server will:

- Start on `http://localhost:3000` (or your configured PORT)
- Test the database connection on startup
- Auto-reload when you save changes to any `.ts` file
- Display request logs (thanks to Morgan middleware)

You should see:

```
Server running on http://localhost:3000
```

#### Production Mode

Build and run the production version:

```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

The `build` command:

1. Removes the old `dist/` folder
2. Compiles TypeScript to JavaScript
3. Resolves path aliases (`@/*` → actual paths)

#### Testing the API

Once the server is running, you can test the endpoints:

1. **Using the REST Client** (VS Code extension)

   Open `api.rest` and click "Send Request" above any endpoint:

   ```http
   ### Example: List all categories
   GET http://localhost:3000/api/categories
   ```

2. **Using curl**

   ```bash
   curl http://localhost:3000/api/categories
   ```

3. **Using your browser**

   Navigate to `http://localhost:3000/api/categories`

#### Troubleshooting

**Database connection fails:**

- Verify PostgreSQL is running: `psql --version`
- Check your `DATABASE_URL` in `.env`
- Ensure the database exists: `psql -l` (list databases)

**Port already in use:**

- Change the `PORT` in your `.env` file
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

**TypeScript errors:**

- Reinstall dependencies: `rm -rf node_modules && npm install`
- Restart TypeScript server in your IDE
- Restart ESLint server in your IDE

**Migration errors:**

- Check migration status: `npm run migrate:status`
- Reset database: `npm run db:reset`

---

## 3. Architecture Overview

### Project Structure

The project follows a clean, modular structure that separates concerns and promotes maintainability:

```
fullstock-api-pro-1025/
├── db/                          # Database-related files
│   ├── schema.sql              # Generated schema from migrations
│   ├── seed.sql                # Sample data for development
│   └── migrations/             # Database migrations (dbmate)
│
├── src/                         # Application source code
│   ├── server.ts               # Entry point - starts the server
│   ├── app.ts                  # Express app configuration
│   ├── routes.ts               # Main router - aggregates all routes
│   ├── env.ts                  # Environment variable validation
│   │
│   ├── routes/                 # Route definitions by feature
│   │   ├── auth.routes.ts
│   │   ├── categories.routes.ts
│   │   └── products.routes.ts
│   │
│   ├── controllers/            # Request/response handlers
│   │   ├── auth.controller.ts
│   │   ├── categories.controller.ts
│   │   └── products.controller.ts
│   │
│   ├── services/               # Business logic layer
│   │   ├── categories.service.ts
│   │   ├── products.service.ts
│   │   └── users.service.ts
│   │
│   ├── repositories/           # Data access layer
│   │   ├── categories.repository.ts
│   │   ├── products.repository.ts
│   │   └── users.repository.ts
│   │
│   ├── models/                 # TypeScript interfaces/types
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   └── user.model.ts
│   │
│   ├── middlewares/            # Express middleware
│   │   ├── error.middleware.ts
│   │   └── session.middleware.ts
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── errors.ts           # Custom error classes
│   │   ├── hash.ts             # Password hashing utilities
│   │   └── session.ts          # Session helpers
│   │
│   ├── db/                     # Database connection
│   │   └── index.ts            # Connection pool & query utilities
│   │
│   └── types/                  # TypeScript type definitions
│       └── auth.types.ts       # Session type extensions
│
├── api.rest                     # REST Client test file
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint configuration
├── prettier.config.js          # Prettier configuration
└── .env                        # Environment variables (not in git)
```

### Layered Architecture Pattern

The application follows a **strict layered architecture** with clear separation of concerns. Each layer has a specific responsibility and can only communicate with adjacent layers:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│                    (HTTP Requests)                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE LAYER                         │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐     │
│  │   Morgan     │  │   Session      │  │    Error     │     │
│  │  (Logging)   │  │(Authentication)│  │  Handlers    │     │
│  └──────────────┘  └────────────────┘  └──────────────┘     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      ROUTES LAYER                           │
│            URL → Controller mapping                         │
│  /api/categories → categoriesController                     │
│  /api/products → productsController                         │
│  /api/register → authController                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   CONTROLLERS LAYER                         │
│  • Parse and validate request data                          │
│  • Call appropriate service methods                         │
│  • Format and send HTTP responses                           │
│  • Handle errors via next(error)                            │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES LAYER                           │
│  • Business logic and validation                            │
│  • Coordinate multiple repositories                         │
│  • Transform data between layers                            │
│  • Throw domain-specific errors                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 REPOSITORIES LAYER                          │
│  • Database queries (SQL)                                   │
│  • CRUD operations                                          │
│  • Return typed model objects                               │
│  • No business logic                                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                               │
│                     PostgreSQL                              │
└─────────────────────────────────────────────────────────────┘
```

**Key Principles:**

1. **Unidirectional flow**: Data flows downward, responses flow upward
2. **Single responsibility**: Each layer has one clear purpose
3. **Dependency direction**: Upper layers depend on lower layers, never the reverse
4. **No layer skipping**: Controllers can't directly access repositories

### Request Flow Diagram

Let's trace a real request through the system:

**Example: GET /api/categories**

```
1. CLIENT REQUEST
   │
   │  GET /api/categories
   │  Accept: application/json
   │
   ▼

2. EXPRESS MIDDLEWARE PIPELINE (app.ts)
   │
   ├─▶ morgan("dev")              → Log request
   ├─▶ express.json()             → Parse JSON body
   ├─▶ sessionMiddleware          → Load session
   │
   ▼

3. ROUTER (routes.ts)
   │
   │  Match: /api/categories → categoriesRoutes
   │
   ▼

4. ROUTE HANDLER (categories.routes.ts)
   │
   │  GET / → categoriesController.getCategories
   │
   ▼

5. CONTROLLER (categories.controller.ts)
   │
   │  async getCategories(req, res, next) {
   │    try {
   │      // Delegate to service
   │      const categories = await categoriesService.listCategories();
   │
   │      // Format response
   │      return res.json({ data: categories });
   │    } catch (error) {
   │      return next(error);  → Error Middleware
   │    }
   │  }
   │
   ▼

6. SERVICE (categories.service.ts)
   │
   │  async listCategories() {
   │    // Business logic (if any)
   │    // Delegate to repository
   │    return await categoriesRepository.findAll();
   │  }
   │
   ▼

7. REPOSITORY (categories.repository.ts)
   │
   │  async findAll(): Promise<Category[]> {
   │    const result = await query<Category>(
   │      "SELECT * FROM categories"
   │    );
   │    return result.rows;  → snake_case to camelCase
   │  }
   │
   ▼

8. DATABASE (PostgreSQL)
   │
   │  Execute: SELECT * FROM categories
   │  Return: [{ id: 1, title: 'Polos', ... }, ...]
   │
   ▼

9. RESPONSE (back up the chain)
   │
   │  Repository → Service → Controller
   │
   │  HTTP 200 OK
   │  Content-Type: application/json
   │  {
   │    "data": [
   │      {
   │        "id": 1,
   │        "title": "Polos",
   │        "slug": "polos",
   │        "imgSrc": "/images/polos.jpg",
   │        "alt": "Hombre luciendo polo azul",
   │        "description": "Polos exclusivos...",
   │        "createdAt": "2025-10-13T...",
   │        "updatedAt": "2025-10-13T..."
   │      },
   │      ...
   │    ]
   │  }
   │
   └─▶ CLIENT
```

**Error Flow Example:**

If something goes wrong at any layer:

```
SERVICE throws ValidationError("Invalid data")
   │
   ▼
CONTROLLER catches error
   │
   ▼ next(error)
   │
   ▼
ERROR MIDDLEWARE (error.middleware.ts)
   │
   ├─ Identify error type (ValidationError)
   ├─ Map to HTTP status (422)
   └─ Format error response
   │
   ▼
CLIENT receives:
   HTTP 422 Unprocessable Entity
   { "error": "Invalid data", "errors": [...] }
```

### Why This Architecture?

**Benefits:**

- **Testability**: Each layer can be tested in isolation
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features following the pattern
- **Clarity**: Clear responsibilities reduce cognitive load
- **Type Safety**: TypeScript interfaces at each boundary
- **Reusability**: Services and repositories can be reused

**Trade-offs:**

- More files and boilerplate for simple operations
- Steeper learning curve for beginners
- Overkill for very small projects

However, for a production e-commerce API that will grow over time, these trade-offs are worth it.

---

## 5. Database Layer

### Schema Design

The database consists of four main tables that support the e-commerce functionality:

#### Tables Overview

```
┌─────────────┐
│ categories  │──┐
└─────────────┘  │
                 │ 1:N
                 │
┌─────────────┐  │
│  products   │◄─┘
└─────────────┘

┌─────────────┐
│    users    │
└─────────────┘

┌─────────────┐
│  sessions   │
└─────────────┘
```

#### 1. Categories Table

Stores product categories with SEO-friendly slugs and rich media.

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,           -- SEO-friendly URL (e.g., 'polos')
    img_src TEXT NOT NULL,               -- Category image path
    alt TEXT NOT NULL,                   -- Image alt text for accessibility
    description TEXT NOT NULL,           -- Category description
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Key Design Decisions:**

- `slug` is UNIQUE for SEO-friendly URLs (`/categories/polos`)
- `TIMESTAMPTZ` stores timestamps with timezone information
- `TEXT` instead of `VARCHAR` (PostgreSQL best practice - no performance difference)

**Sample Data:**

```json
{
  "id": 1,
  "title": "Polos",
  "slug": "polos",
  "imgSrc": "/images/polos.jpg",
  "alt": "Hombre luciendo polo azul",
  "description": "Polos exclusivos con diseños que todo desarrollador querrá lucir.",
  "createdAt": "2025-10-13T10:30:00Z",
  "updatedAt": "2025-10-13T10:30:00Z"
}
```

#### 2. Products Table

Stores individual products with dynamic features stored as JSON.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    img_src TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),  -- Price in cents
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    features JSONB,                             -- Flexible JSON storage
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Key Design Decisions:**

- **Price in cents**: Stored as INTEGER to avoid floating-point precision issues
  - $20.00 → stored as 2000 cents
  - Makes calculations exact and prevents rounding errors
- **CHECK constraint**: Ensures price cannot be negative
- **JSONB for features**: Flexible schema for product-specific attributes
  - Allows different products to have different features
  - Supports indexing and querying (unlike JSON)
- **Foreign Key with RESTRICT**: Cannot delete category if products exist

**Sample Data:**

```json
{
  "id": 1,
  "title": "Polo React",
  "imgSrc": "/images/polos/polo-react.png",
  "price": 2000,
  "description": "Viste tu pasión por React con estilo...",
  "categoryId": 1,
  "features": [
    "Estampado resistente que mantiene sus colores vibrantes",
    "Hecho de algodón suave que asegura comodidad",
    "Costuras reforzadas para una mayor durabilidad"
  ],
  "createdAt": "2025-10-13T10:30:00Z",
  "updatedAt": "2025-10-13T10:30:00Z"
}
```

#### 3. Users Table

Stores user authentication credentials.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,          -- Email as username
    password TEXT NOT NULL,              -- Bcrypt hashed password
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Key Design Decisions:**

- **Email is UNIQUE**: One account per email address
- **Password is hashed**: Never stores plain text (uses bcryptjs)
- **No personal info yet**: Minimal viable authentication (can extend later)

#### 4. Sessions Table

Stores server-side session data for authentication.

```sql
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,                  -- Session ID
  sess JSONB NOT NULL,                   -- Session data
  expire TIMESTAMPTZ(6) NOT NULL         -- Expiration timestamp
);

CREATE INDEX idx_session_expire ON sessions (expire);
```

**Key Design Decisions:**

- **Server-side sessions**: More secure than client-side JWT
- **JSONB for session data**: Flexible storage for user info
- **Index on expire**: Efficient cleanup of expired sessions
- **Used by express-session**: Automatically managed by middleware

### Migration Strategy (dbmate)

The project uses **dbmate** for database migrations - a simple, language-agnostic migration tool.

#### Why dbmate?

- **Simple**: No complex ORM, just SQL files
- **Reversible**: Every migration has `up` and `down`
- **Language-agnostic**: Works with any language/framework
- **Version control**: Migration files are tracked in git
- **Rollback support**: Can undo migrations safely

#### Migration File Structure

Each migration file follows this pattern:

```
db/migrations/YYYYMMDDHHMMSS_description.sql
```

Example: `20250918010015_create_table_categories.sql`

```sql
-- migrate:up
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    img_src TEXT NOT NULL,
    alt TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE categories;
```

**Key Points:**

- `-- migrate:up`: Code to apply the migration
- `-- migrate:down`: Code to rollback the migration
- Timestamp prefix ensures correct order
- Each migration is atomic (all or nothing)

#### Migration Workflow

**Creating a new migration:**

```bash
npm run migrate:new create_orders_table
# Creates: db/migrations/20251013120000_create_orders_table.sql
```

**Applying migrations:**

```bash
npm run migrate
# Runs all pending migrations in order
```

**Checking status:**

```bash
npm run migrate:status
# Shows which migrations are applied
```

**Rolling back:**

```bash
npm run migrate:down
# Rolls back the last migration
```

**Full reset:**

```bash
npm run db:reset
# Drops database, recreates, runs all migrations, and seeds data
```

#### Migration History Tracking

dbmate maintains a `schema_migrations` table:

```sql
CREATE TABLE schema_migrations (
    version VARCHAR PRIMARY KEY
);

-- Example data:
INSERT INTO schema_migrations (version) VALUES
    ('20250918010015'),  -- create_table_categories
    ('20250918012624'),  -- create_products_table
    ('20250930011032'),  -- create_users_table
    ('20251001221842');  -- create_sessions_table
```

This tracks which migrations have been applied, preventing duplicates.

### Connection Pool Management

The application uses **node-pg** with connection pooling for efficient database access.

#### Pool Configuration (`src/db/index.ts`)

```typescript
import { Pool } from "pg";
import env from "@/env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
```

**Why Connection Pooling?**

Without pooling, every query would:

1. Open a new TCP connection
2. Authenticate
3. Execute query
4. Close connection

With pooling:

1. Connections are reused
2. Much faster (no connection overhead)
3. Limits concurrent connections to PostgreSQL
4. Automatic connection management

**Default Pool Settings:**

- **Max connections**: 10 (can be configured)
- **Idle timeout**: 30 seconds
- **Connection timeout**: 0 (no timeout)

#### Query Utility Function

The project provides a custom `query()` function with logging and automatic camelCase conversion:

```typescript
export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  console.log("executed query", {
    text,
    duration: `${duration}ms`,
    rows: res.rowCount,
  });

  return { ...res, rows: camelcaseKeys(res.rows) as T[] };
}
```

**Features:**

- **Query logging**: See every query and its duration
- **Automatic camelCase**: Converts snake_case → camelCase
- **Type safety**: Generic type parameter for results
- **Performance monitoring**: Tracks query execution time

#### Lifecycle Management

The application properly manages the connection pool lifecycle:

**On Startup:**

```typescript
async function start() {
  try {
    await testConnection(); // Verify DB connection
  } catch {
    console.error("Could not connect to database");
    process.exit(1);
  }
  // Start server...
}
```

**On Shutdown:**

```typescript
process.on("SIGTERM", async () => {
  await closePool(); // Gracefully close all connections
  process.exit(0);
});
```

### Query Utilities & Snake-to-Camel Case Conversion

One of the most important utilities in the project handles the impedance mismatch between PostgreSQL and JavaScript naming conventions.

#### The Problem

PostgreSQL uses **snake_case**:

```sql
SELECT img_src, created_at, category_id FROM products;
```

JavaScript/TypeScript uses **camelCase**:

```typescript
interface Product {
  imgSrc: string;
  createdAt: string;
  categoryId: number;
}
```

Writing `product.img_src` in TypeScript feels wrong and breaks conventions.

#### The Solution: Automatic Conversion

The `query()` function uses the `camelcase-keys` library:

```typescript
import camelcaseKeys from "camelcase-keys";

export async function query<T extends QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  const res = await pool.query<T>(text, params);

  // Automatic snake_case → camelCase conversion
  return { ...res, rows: camelcaseKeys(res.rows) as T[] };
}
```

#### Before and After

**Database returns:**

```javascript
{
  img_src: "/images/polo.png",
  created_at: "2025-10-13T10:30:00Z",
  category_id: 1
}
```

**Your code receives:**

```javascript
{
  imgSrc: "/images/polo.png",
  createdAt: "2025-10-13T10:30:00Z",
  categoryId: 1
}
```

**This means your models can be pure camelCase:**

```typescript
// src/models/product.model.ts
export interface Product {
  id: number;
  title: string;
  imgSrc: string; // ✅ camelCase
  price: number;
  description: string;
  categoryId: number; // ✅ camelCase
  features: string[];
  createdAt: string; // ✅ camelCase
  updatedAt: string; // ✅ camelCase
}
```

#### Repository Layer Benefits

Repositories can use standard SQL without worrying about conversion:

```typescript
// src/repositories/products.repository.ts
export const productsRepository = {
  async findAll(): Promise<Product[]> {
    // Write normal SQL with snake_case
    const result = await query<Product>("SELECT * FROM products");

    // Receive camelCase objects automatically
    return result.rows; // Product[] with camelCase properties
  },

  async findById(id: number): Promise<Product | null> {
    const result = await query<Product>(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    return result.rows[0] || null; // Already camelCase!
  },
};
```

#### Performance Considerations

- **Conversion happens once**: At the database boundary
- **Minimal overhead**: camelcase-keys is very fast
- **No manual mapping**: Eliminates error-prone manual conversion
- **Type-safe**: TypeScript ensures correct property names

This approach keeps your SQL clean and your TypeScript idiomatic, with zero mental overhead.

---

## 5. Application Layers

This section dives deep into each layer of the application architecture, explaining their responsibilities, patterns, and how they work together.

### Models: Data Structures & DTOs

Models define the **shape of data** throughout the application. They are TypeScript interfaces that represent domain entities.

#### Purpose

- Define data structures with strong typing
- Document the shape of database records
- Provide type safety across all layers
- Serve as contracts between layers

#### Location

```
src/models/
├── category.model.ts
├── product.model.ts
└── user.model.ts
```

#### Example: Category Model

```typescript
// src/models/category.model.ts
export interface Category {
  id: number;
  title: string;
  slug: string;
  imgSrc: string;
  alt: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

**Key Points:**

- Uses **camelCase** (not snake_case) - matches JavaScript conventions
- All properties correspond to database columns (after camelCase conversion)
- Uses `string` for dates (ISO 8601 format from PostgreSQL)
- No methods - pure data structures (not classes)

#### Example: Product Model

```typescript
// src/models/product.model.ts
export interface Product {
  id: number;
  title: string;
  imgSrc: string;
  price: number; // In cents
  description: string;
  categoryId: number;
  features: Record<string, unknown> | null; // JSONB field
  createdAt: string;
  updatedAt: string;
}
```

**Key Points:**

- `price` is a number (cents) matching the database INTEGER
- `features` typed as `Record<string, unknown> | null` for JSONB flexibility
- `categoryId` uses camelCase (database has `category_id`)

#### Example: User Model with DTO

```typescript
// src/models/user.model.ts
export interface User {
  id: number;
  email: string;
  password: string; // ⚠️ Hashed password
  createdAt: string;
  updatedAt: string;
}

// DTO: Data Transfer Object (without password)
export type UserDto = Omit<User, "password">;

// Utility function to convert User to UserDto
export function toUserDto(user: User): UserDto {
  const { password: _, ...userDto } = user;
  return userDto;
}
```

**Key Points:**

- **DTO Pattern**: Never send password to client
- `UserDto` removes sensitive data
- `toUserDto()` utility function for safe conversion
- Used in controllers before sending response

#### When to Use DTOs

✅ **Use DTOs when:**

- Excluding sensitive data (passwords, tokens)
- Transforming data for API responses
- Combining data from multiple sources
- Different representations for different endpoints

❌ **Don't need DTOs when:**

- Data can be sent as-is (like Category, Product)
- No sensitive fields exist
- No transformation needed

### Repositories: Data Access Layer

Repositories are responsible for **all database interactions**. They provide a clean interface for data access.

#### Purpose

- Encapsulate SQL queries
- Provide CRUD operations
- Return typed model objects
- **NO business logic** (that's for services)

#### Location

```
src/repositories/
├── categories.repository.ts
├── products.repository.ts
└── users.repository.ts
```

#### Pattern Structure

Repositories are exported as objects with async methods:

```typescript
export const someRepository = {
  async methodName(params): Promise<ReturnType> {
    // SQL query here
  },
};
```

#### Example: Categories Repository

```typescript
// src/repositories/categories.repository.ts
import { query } from "@/db/index.js";
import type { Category } from "@/models/category.model.js";

export const categoriesRepository = {
  async findAll(): Promise<Category[]> {
    const result = await query<Category>("SELECT * FROM categories");
    return result.rows;
  },

  async findById(id: number): Promise<Category | null> {
    const result = await query<Category>(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },
};
```

**Key Points:**

- Uses `query<T>()` generic for type safety
- Returns `null` for not found (not throwing errors)
- Parameterized queries (`$1`, `$2`) prevent SQL injection
- No business logic - just data access

#### Example: Products Repository

```typescript
// src/repositories/products.repository.ts
export const productsRepository = {
  async findById(id: number): Promise<Product | null> {
    const result = await query<Product>(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const result = await query<Product>(
      "SELECT * FROM products WHERE category_id = $1",
      [categoryId]
    );
    return result.rows;
  },
};
```

**Key Points:**

- SQL uses `category_id` (database convention)
- Returns camelCase objects automatically (thanks to query utility)
- Multiple find methods for different query patterns

#### Example: Users Repository

```typescript
// src/repositories/users.repository.ts
export const usersRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query<User>("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  },

  async create(user: { email: string; password: string }): Promise<User> {
    const result = await query<User>(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [user.email, user.password]
    );

    // If insert fails, pg throws error before this line
    return result.rows[0]!; // Non-null assertion is safe here
  },

  async findById(id: number): Promise<User | null> {
    const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  },
};
```

**Key Points:**

- `create()` uses `RETURNING *` to get the inserted row
- Non-null assertion (`!`) is safe because INSERT success guarantees a row

#### Repository Best Practices

✅ **Do:**

- Keep methods focused and single-purpose
- Use parameterized queries ($1, $2, etc.)
- Return `null` for not found (let services decide what to do)
- Use descriptive method names (`findByEmail`, not `getUser`)

❌ **Don't:**

- Add business logic
- Throw domain errors (NotFoundError, etc.)
- Validate business rules
- Call other repositories

### Services: Business Logic Layer

Services contain **all business logic** and orchestrate operations across multiple repositories.

#### Purpose

- Implement business rules and validation
- Coordinate multiple repositories
- Transform and combine data
- Throw domain-specific errors
- Enforce business constraints

#### Location

```
src/services/
├── categories.service.ts
├── products.service.ts
└── users.service.ts
```

#### Example: Products Service

```typescript
// src/services/products.service.ts
import { categoriesRepository } from "@/repositories/categories.repository.js";
import { productsRepository } from "@/repositories/products.repository.js";
import { NotFoundError } from "@/shared/errors.js";

export const productsService = {
  async getProductById(id: number) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto no encontrado");
    }

    return product;
  },

  async listProductsByCategoryId(categoryId: number) {
    // Business logic: Verify category exists first
    const category = await categoriesRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    // Then get products
    const products = await productsRepository.findByCategoryId(categoryId);
    return products;
  },
};
```

**Key Points:**

- **Coordinates multiple repositories** (categories + products)
- **Throws domain errors** (`NotFoundError`) with meaningful messages
- **Business rule**: Category must exist before listing its products
- Transforms repository `null` into proper error

#### Example: Users Service

```typescript
// src/services/users.service.ts
import { usersRepository } from "@/repositories/users.repository.js";
import { ConflictError } from "@/shared/errors.js";
import { hashPassword } from "@/shared/hash.js";

export const usersService = {
  async getUserByEmail(email: string) {
    const user = await usersRepository.findByEmail(email);
    return user;
  },

  async createUser(email: string, password: string) {
    // Business logic: Check if user exists
    const existingUser = await usersService.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictError("Correo electrónico ya registrado");
    }

    // Business logic: Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with hashed password
    const user = await usersRepository.create({
      email,
      password: hashedPassword,
    });

    return user;
  },

  async getUserById(id: number) {
    const user = await usersRepository.findById(id);
    return user;
  },
};
```

**Key Points:**

- **Business validation**: Email must be unique
- **Data transformation**: Hashing password before storage
- **Throws ConflictError** for business rule violation
- Repository doesn't know about hashing - service handles it

#### Example: Categories Service

```typescript
// src/services/categories.service.ts
import { categoriesRepository } from "@/repositories/categories.repository.js";

export const categoriesService = {
  async listCategories() {
    const categories = await categoriesRepository.findAll();
    return categories;
  },
};
```

**Key Points:**

- Sometimes services are thin (simple pass-through)
- Still provides a place to add logic later
- Keeps architecture consistent

#### Service Best Practices

✅ **Do:**

- Implement all business logic here
- Coordinate multiple repositories
- Throw domain-specific errors
- Validate business rules
- Transform data between layers

❌ **Don't:**

- Write SQL queries
- Access the database directly
- Handle HTTP concerns (req, res)
- Parse request bodies

### Schemas: Define schema validation for requests/responses using Zod

Validation and transformation layer for inputs, outputs, and data transfer objects using schema definitions.

Input validation is performed with Zod. Schemas live in `src/schemas/` and describe the expected shapes for request bodies, params and queries. Using Zod ensures clear error messages and TypeScript-inferred types.

- Library: zod
- Location: `src/schemas/*.ts` (e.g. `src/schemas/auth.schemas.ts`)
- Purpose: validate and sanitize data before it reaches services.

If you have troubles and need to install Zod again please type this commands on terminal:

```ts
npm install
npm add zod
npm add -D eslint-plugin-zod
```

```ts
// src/schemas/products.schemas.ts
import { z } from "zod";

export const productIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a numeric string")
    .transform(Number),
});

export const categoryIdSchema = z.object({
  categoryId: z
    .string()
    .regex(/^\d+$/, "Category ID must be a numeric string")
    .transform(Number),
});

export type ProductIdParams = z.infer<typeof productIdSchema>;
export type CategoryIdParams = z.infer<typeof categoryIdSchema>;
```

Example (summary of `src/schemas/auth.schemas.ts`):

```ts
// src/schemas/auth.schemas.ts
import * as z from "zod";

export const registerSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Formato de correo inválido" })
      .trim()
      .toLowerCase(),
    password: z
      .string({ error: "El campo contraseña es obligatorio" })
      .min(6, { error: "La contraseña debe tener al menos 6 caracteres" })
      .regex(/[A-Z]/, { error: "Debe tener al menos una mayúscula" })
      .regex(/[a-z]/, { error: "Debe tener al menos una minúscula" })
      .regex(/[0-9]/, { error: "Debe tener al menos un número" })
      .regex(/[^A-Za-z0-9]/, {
        error: "Debe tener al menos un carácter especial",
      }),
    confirmPassword: z.string({
      error: "El campo confirmar contraseña es obligatorio",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = registerSchema.pick({ email: true, password: true });
```

### Controllers: Request/Response Handlers

Controllers are the **HTTP layer** - they handle Express requests and responses.

#### Purpose

- Parse and validate HTTP requests
- Call appropriate service methods
- Format HTTP responses
- Handle errors via `next(error)`
- **NO business logic** (delegate to services)

#### Location

```
src/controllers/
├── auth.controller.ts
├── categories.controller.ts
└── products.controller.ts
```

#### Example: Products Controller

```typescript
// src/controllers/products.controller.ts
import type { NextFunction, Request, Response } from "express";
import { productsService } from "@/services/products.service.js";
import { ValidationError } from "@/shared/errors.js";

export const productsController = {
  async getProductsByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // 1. Extract and validate request parameters
      const categoryId = req.params["categoryId"]?.trim();

      if (!categoryId || isNaN(Number(categoryId))) {
        throw new ValidationError("Error de validación", {
          categoryId: ["El ID de categoría debe ser un número"],
        });
      }

      // 2. Call service
      const products = await productsService.listProductsByCategoryId(
        Number(categoryId)
      );

      // 3. Format response
      return res.json({ data: products });
    } catch (error) {
      // 4. Pass errors to error middleware
      return next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"]?.trim();

      if (!id || isNaN(Number(id))) {
        throw new ValidationError("Error de validación", {
          id: ["El ID de producto debe ser un número"],
        });
      }

      const product = await productsService.getProductById(Number(id));

      return res.json({ data: product });
    } catch (error) {
      return next(error);
    }
  },
};
```

**Key Points:**

- **4-step pattern**: Extract → Validate → Call Service → Respond
- Input validation happens here (not in services)
- Consistent response format: `{ data: ... }`
- Error handling via `next(error)` (caught by error middleware)

#### Example: Auth Controller

```typescript
// src/controllers/auth.controller.ts
export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Parse and validate request body
      const body = req.body as Partial<RegisterRequest>;
      const email = body.email?.trim() ?? "";
      const password = body.password ?? "";
      const confirmPassword = body.confirmPassword ?? "";

      const errors: Record<string, string[]> = {};

      if (!email) {
        errors["email"] = ["El campo email es obligatorio"];
      } else if (!email.includes("@")) {
        errors["email"] = ["Formato de correo inválido"];
      }

      if (!password) {
        errors["password"] = ["El campo contraseña es obligatorio"];
      } else if (password.length < 6) {
        errors["password"] = ["La contraseña debe tener al menos 6 caracteres"];
      }

      if (!confirmPassword) {
        errors["confirmPassword"] = [
          "El campo confirmar contraseña es obligatorio",
        ];
      } else if (password && password !== confirmPassword) {
        errors["confirmPassword"] = ["Las contraseñas no coinciden"];
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Error de validación", errors);
      }

      // 2. Call service
      const user = await usersService.createUser(email, password);

      // 3. Manage session
      await commitSession(req, { userId: user.id });

      // 4. Format response (using DTO!)
      return res.status(201).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Partial<LoginRequest>;
      const email = body.email?.trim() ?? "";
      const password = body.password ?? "";

      const user = await usersService.getUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError(
          "Correo electrónico o contraseña inválidos"
        );
      }

      const isValidPassword = await verifyPassword(password, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedError(
          "Correo electrónico o contraseña inválidos"
        );
      }

      await commitSession(req, { userId: user.id });

      return res.status(200).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.session.userId;
      if (!userId) {
        throw new UnauthorizedError("Usuario no autenticado");
      }

      const user = await usersService.getUserById(userId);
      if (!user) {
        throw new UnauthorizedError("Usuario no encontrado");
      }

      return res.status(200).json({ data: toUserDto(user) });
    } catch (error) {
      return next(error);
    }
  },
};
```

**Key Points:**

- **Detailed validation**: Field-by-field validation with specific error messages
- **Security**: Password verification happens here (with service help)
- **Session management**: Controller handles session operations
- **DTO usage**: Uses `toUserDto()` to exclude password from response
- **Consistent error messages**: All in Spanish for this project

#### Controller Best Practices

✅ **Do:**

- Validate request input
- Parse request parameters and body
- Format responses consistently
- Use appropriate HTTP status codes
- Use DTOs for sensitive data
- Always use try-catch and next(error)

❌ **Don't:**

- Implement business logic
- Call repositories directly
- Write SQL queries
- Hash passwords or do complex operations

### Routes: API Endpoint Definitions

Routes define the **HTTP API surface** - they map URLs to controller methods.

#### Purpose

- Map HTTP methods and paths to controllers
- Apply middleware to specific routes
- Group related endpoints
- Define the public API

#### Location

```
src/routes/
├── auth.routes.ts
├── categories.routes.ts
└── products.routes.ts
```

#### Example: Products Routes

```typescript
// src/routes/products.routes.ts
import { Router } from "express";
import { productsController } from "@/controllers/products.controller.js";

const router = Router();

router.get("/:id", productsController.getProductById);

export default router;
```

**Key Points:**

- Each route file exports a Router instance
- Maps HTTP method + path → controller method
- Uses Express route parameters (`:id`)

#### Example: Categories Routes

```typescript
// src/routes/categories.routes.ts
import { Router } from "express";
import { categoriesController } from "@/controllers/categories.controller.js";
import { productsController } from "@/controllers/products.controller.js";

const router = Router();

router.get("/", categoriesController.getCategories);
router.get("/:categoryId/products", productsController.getProductsByCategoryId);

export default router;
```

**Key Points:**

- Multiple routes in one file
- Nested resource pattern: `/categories/:id/products`
- Can use controllers from different domains

#### Example: Auth Routes

```typescript
// src/routes/auth.routes.ts
import { authController } from "@/controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

export default router;
```

**Key Points:**

- RESTful conventions: POST for mutations, GET for queries
- Clear, descriptive paths
- Logout as POST (not GET) - proper HTTP semantics

#### Main Router

All route modules are aggregated in `src/routes.ts`:

```typescript
// src/routes.ts
import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "@/routes/categories.routes.js";
import productsRoutes from "@/routes/products.routes.js";

const router = Router();

router.use("/api/", authRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/products", productsRoutes);

export default router;
```

**This creates the final API structure:**

```
POST   /api/register
POST   /api/login
GET    /api/me
POST   /api/logout
GET    /api/categories
GET    /api/categories/:categoryId/products
GET    /api/products/:id
```

#### Route Best Practices

✅ **Do:**

- Use RESTful conventions
- Group related routes together
- Use descriptive paths
- Apply route-specific middleware when needed
- Use HTTP methods correctly (GET for reads, POST for writes)

❌ **Don't:**

- Put business logic in routes
- Duplicate controller code
- Use GET for mutations

### Layer Communication Summary

Understanding how layers communicate is crucial:

```
Routes
  ↓ (receives req, res, next)
Controllers
  ↓ (calls methods with plain arguments)
Services
  ↓ (calls methods with plain arguments)
Repositories
  ↓ (executes SQL queries)
Database
```

**Data flows up:**

```
Database
  ↓ (returns rows as objects)
Repositories
  ↓ (returns typed models)
Services
  ↓ (returns processed data or throws errors)
Controllers
  ↓ (formats HTTP response)
Routes
  ↓ (sends response to client)
```

**Key Principles:**

1. **Lower layers don't know about upper layers**
   - Repositories don't know about Services
   - Services don't know about Controllers
   - Controllers don't know about Routes

2. **Each layer has a single, clear responsibility**
   - Mixing concerns makes code harder to test and maintain

3. **Errors flow upward**
   - Services throw domain errors
   - Controllers catch and pass to error middleware
   - Error middleware formats HTTP error response

4. **Type safety at boundaries**
   - Models define contracts between layers
   - TypeScript enforces correct data flow

---

## 7. Cross-Cutting Concerns

Cross-cutting concerns are aspects of the application that span multiple layers and affect the entire system. This section covers error handling, session management, password security, and middleware architecture.

### Error Handling Strategy

The application uses a **centralized error handling** approach with custom error classes and a global error middleware.

#### Philosophy

Instead of handling errors inconsistently throughout the application, all errors flow to a single point where they're properly formatted and logged.

**Benefits:**

- Consistent error responses across all endpoints
- Single place to modify error handling logic
- Proper HTTP status codes automatically applied
- Centralized logging for debugging

#### Error Flow

```
1. Service Layer
   ↓ throw new NotFoundError("Product not found")

2. Controller Layer
   ↓ catch (error) { next(error) }

3. Error Middleware
   ↓ Maps error type → HTTP status
   ↓ Formats error response

4. Client receives
   { error: "Product not found" }
   HTTP 404
```

### Custom Error Types

Located in `src/shared/errors.ts`, the application defines domain-specific error classes.

#### Available Error Types

```typescript
// src/shared/errors.ts

// 404 - Resource not found
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// 422 - Validation failed
export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// 401 - Authentication failed
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// 400 - Bad request
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

// 409 - Conflict (duplicate resource)
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}
```

#### Error Type Mapping

| Error Class         | HTTP Status | Use Case                          |
| ------------------- | ----------- | --------------------------------- |
| `NotFoundError`     | 404         | Resource doesn't exist            |
| `ValidationError`   | 422         | Input validation failed           |
| `UnauthorizedError` | 401         | Authentication required/failed    |
| `BadRequestError`   | 400         | Malformed request                 |
| `ConflictError`     | 409         | Duplicate resource (email exists) |
| `ZodError`          | 422         | Zod Error Validation              |
| Any other Error     | 500         | Unexpected server error           |

#### Usage Examples

**NotFoundError - Service Layer:**

```typescript
// src/services/products.service.ts
async getProductById(id: number) {
  const product = await productsRepository.findById(id);

  if (!product) {
    throw new NotFoundError("Producto no encontrado");
  }

  return product;
}
```

**ValidationError - Controller Layer:**

```typescript
// src/controllers/products.controller.ts
const id = req.params["id"]?.trim();

if (!id || isNaN(Number(id))) {
  throw new ValidationError("Error de validación", {
    id: ["El ID de producto debe ser un número"],
  });
}
```

#### ZodError Example

When Zod schema validation fails:
Request:

```http
POST /api/auth/register
Content-Type: application/json
{
  "email": "invalid-email",
  "password": "123"
}
```

Response (422):

```json
{
  "error": "Error de validación",
  "issues": {
    "formErrors": [],
    "fieldErrors": {
      "email": ["Formato de correo inválido"],
      "password": ["La contraseña debe tener al menos 6 caracteres"]
    }
  }
}
```

**ConflictError - Service Layer:**

```typescript
// src/services/users.service.ts
async createUser(email: string, password: string) {
  const existingUser = await usersRepository.findByEmail(email);

  if (existingUser) {
    throw new ConflictError("Correo electrónico ya registrado");
  }

  // ... create user
}
```

**UnauthorizedError - Controller Layer:**

```typescript
// src/controllers/auth.controller.ts
const user = await usersService.getUserByEmail(email);

if (!user) {
  throw new UnauthorizedError("Correo electrónico o contraseña inválidos");
}
```

#### ValidationError Special Case

`ValidationError` is unique because it carries **field-specific errors**:

```typescript
throw new ValidationError("Error de validación", {
  email: ["El campo email es obligatorio"],
  password: ["La contraseña debe tener al menos 6 caracteres"],
  confirmPassword: ["Las contraseñas no coinciden"],
});
```

**Client receives:**

```json
{
  "error": "Error de validación",
  "errors": {
    "email": ["El campo email es obligatorio"],
    "password": ["La contraseña debe tener al menos 6 caracteres"],
    "confirmPassword": ["Las contraseñas no coinciden"]
  }
}
```

This format is perfect for displaying field-specific error messages in forms.

### Error Middleware

The error middleware (`src/middlewares/error.middleware.ts`) is the final stop for all errors.

#### Implementation

```typescript
// src/middlewares/error.middleware.ts
import type { Request, Response, NextFunction } from "express";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ConflictError,
} from "@/shared/errors.js";

// Catches 404s (route not found)
export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new NotFoundError("Resource not found"));
}

// Global error handler
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error for debugging
  console.error(err);

  // Map error types to HTTP status codes
  if (err instanceof BadRequestError) {
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ValidationError) {
    return res.status(422).json({
      error: err.message,
      errors: err.errors,
    });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }

  // Default to 500 for unexpected errors
  res.status(500).json({ error: "Error interno del servidor" });
  return;
}
```

#### Middleware Order in app.ts

The order of middleware is **critical**:

```typescript
// src/app.ts
import express from "express";
import {
  errorHandler,
  notFoundHandler,
} from "@/middlewares/error.middleware.js";
import routes from "@/routes.js";

const app = express();

// 1. Request processing middleware
app.use(express.json());
app.use(sessionMiddleware);

// 2. Application routes
app.use(routes);

// 3. 404 handler (no route matched)
app.use(notFoundHandler);

// 4. Error handler (catches all errors)
app.use(errorHandler);

export default app;
```

**Why this order?**

1. Request processing happens first (parse JSON, load session)
2. Routes try to handle the request
3. If no route matches → `notFoundHandler` creates a 404 error
4. All errors (from routes or notFoundHandler) → `errorHandler`

#### Error Handling Best Practices

✅ **Do:**

- Throw domain-specific errors in services
- Use `next(error)` in controllers to pass errors to middleware
- Always wrap controller code in try-catch
- Provide meaningful error messages
- Log errors for debugging

❌ **Don't:**

- Return error responses directly from services
- Swallow errors silently
- Mix error handling approaches
- Expose internal error details to clients in production

### Session Management

The application uses **server-side sessions** stored in PostgreSQL for authentication state.

#### Why Server-Side Sessions?

**Advantages over JWT:**

- Can revoke sessions immediately (logout works instantly)
- Smaller cookie size (just session ID)
- Server controls session lifetime
- No token signature verification overhead
- Session data stored securely server-side

**Trade-offs:**

- Requires database query to validate session
- Harder to scale horizontally (needs shared session store)

For this application, server-side sessions are perfect because:

- PostgreSQL is already the database
- Immediate logout is important
- Horizontal scaling isn't an immediate concern

#### Session Middleware Configuration

```typescript
// src/middlewares/session.middleware.ts
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import env from "@/env.js";
import { pool } from "@/db/index.js";

const PgSession = connectPgSimple(session);

const isProduction = process.env["NODE_ENV"] === "production";

const sessionMiddleware = session({
  // Store sessions in PostgreSQL
  store: new PgSession({
    pool, // Reuse existing connection pool
    tableName: "sessions", // Use our sessions table
    createTableIfMissing: false, // We manage schema via migrations
    pruneSessionInterval: 60 * 60, // Cleanup expired sessions every hour
  }),

  // Session configuration
  name: env.SESSION_NAME, // Cookie name (default: "sessionId")
  secret: env.SESSION_SECRET, // Used to sign session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until data stored
  rolling: true, // Reset expiration on every request

  // Cookie security settings
  cookie: {
    httpOnly: true, // Prevent JavaScript access (XSS protection)
    sameSite: "strict", // CSRF protection
    secure: isProduction, // HTTPS only in production
    maxAge: env.SESSION_MAX_AGE_HOURS * 60 * 60 * 1000, // Default: 24 hours
  },
});

export default sessionMiddleware;
```

#### Session Configuration Explained

**Store Configuration:**

- `pool`: Reuses the existing PostgreSQL connection pool
- `tableName: "sessions"`: Uses the table created by migration
- `createTableIfMissing: false`: We control schema via dbmate
- `pruneSessionInterval`: Auto-cleanup expired sessions every hour

**Session Behavior:**

- `resave: false`: Only save if session data changed (performance)
- `saveUninitialized: false`: Don't create session for anonymous users
- `rolling: true`: Extends session on each request (sliding window)

**Cookie Security:**

- `httpOnly: true`: Cookie can't be read by JavaScript (prevents XSS attacks)
- `sameSite: "strict"`: Cookie only sent to same site (prevents CSRF)
- `secure: true` (production): Cookie only sent over HTTPS
- `maxAge`: Session expires after 24 hours of inactivity

#### Session Type Extensions

TypeScript needs to know about custom session properties:

```typescript
// src/types/auth.types.ts
import type { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // Add userId to session type
  }
}
```

This enables type-safe access:

```typescript
const userId = req.session.userId; // TypeScript knows this exists!
```

#### Session Helpers

Two utility functions handle session operations safely:

```typescript
// src/shared/session.ts

// Regenerate session ID and save data (used on login/register)
export function commitSession(
  req: Request,
  data: Partial<SessionData>
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Regenerate session ID (prevents session fixation attacks)
    req.session.regenerate((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      // Store session data
      Object.assign<SessionData, Partial<SessionData>>(req.session, data);

      // Persist to database
      req.session.save((saveErr) => {
        if (saveErr) {
          reject(
            saveErr instanceof Error ? saveErr : new Error(String(saveErr))
          );
          return;
        }

        resolve();
      });
    });
  });
}

// Destroy session (used on logout)
export function destroySession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
        return;
      }

      resolve();
    });
  });
}
```

**Why these helpers?**

1. **Promisified**: Converts callbacks to async/await
2. **Session Regeneration**: `commitSession` regenerates session ID on login (security)
3. **Error Handling**: Properly typed error handling
4. **Type Safety**: Works with TypeScript's strict mode

#### Usage Examples

**Login (creating a session):**

```typescript
// src/controllers/auth.controller.ts
async login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getUserByEmail(email);
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // Store userId in session
    await commitSession(req, { userId: user.id });

    return res.json({ data: toUserDto(user) });
  } catch (error) {
    return next(error);
  }
}
```

**Accessing session data:**

```typescript
// src/controllers/auth.controller.ts
async me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.session.userId;  // Type-safe access

    if (!userId) {
      throw new UnauthorizedError("Not authenticated");
    }

    const user = await usersService.getUserById(userId);
    return res.json({ data: toUserDto(user) });
  } catch (error) {
    return next(error);
  }
}
```

**Logout (destroying session):**

```typescript
// src/controllers/auth.controller.ts
async logout(req: Request, res: Response, next: NextFunction) {
  try {
    await destroySession(req);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
```

#### Session Storage in Database

Sessions are stored in the `sessions` table:

```sql
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,           -- Session ID (from cookie)
  sess JSONB NOT NULL,            -- Session data (userId, etc.)
  expire TIMESTAMPTZ(6) NOT NULL  -- Expiration timestamp
);

CREATE INDEX idx_session_expire ON sessions (expire);
```

**Example session record:**

```json
{
  "sid": "abc123def456...",
  "sess": {
    "cookie": {
      "httpOnly": true,
      "sameSite": "strict",
      "secure": false,
      "maxAge": 86400000
    },
    "userId": 42
  },
  "expire": "2025-10-14T10:30:00Z"
}
```

The `pruneSessionInterval` setting automatically deletes expired sessions every hour.

### Password Hashing

Password security is handled by **bcryptjs**, a battle-tested hashing library.

#### Why bcrypt?

- **Slow by design**: Makes brute-force attacks impractical
- **Salted**: Each password has unique salt (no rainbow tables)
- **Adaptive**: Can increase rounds as hardware improves
- **Industry standard**: Well-vetted and trusted

#### Implementation

```typescript
// src/shared/hash.ts
import bcrypt from "bcryptjs";

// Hash a plain-text password
export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // 2^10 iterations (good balance)
  return bcrypt.hash(password, saltRounds);
}

// Verify password against hash
export function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**Salt Rounds:**

- `10` = 1,024 iterations (good for most applications)
- Higher = more secure but slower
- Can be increased as hardware improves

#### Usage in User Service

```typescript
// src/services/users.service.ts
async createUser(email: string, password: string) {
  // Check if user exists
  const existingUser = await usersRepository.findByEmail(email);
  if (existingUser) {
    throw new ConflictError("Email already registered");
  }

  // Hash password before storing
  const hashedPassword = await hashPassword(password);

  const user = await usersRepository.create({
    email,
    password: hashedPassword,  // Never store plain text!
  });

  return user;
}
```

#### Usage in Login

```typescript
// src/controllers/auth.controller.ts
async login(req: Request, res: Response, next: NextFunction) {
  const user = await usersService.getUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Verify password against stored hash
  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  // Login successful
  await commitSession(req, { userId: user.id });
  return res.json({ data: toUserDto(user) });
}
```

#### Password Security Best Practices

✅ **Do:**

- Always hash passwords before storing
- Use bcrypt (or argon2, scrypt)
- Never log passwords
- Use same error message for "user not found" and "wrong password"

❌ **Don't:**

- Store plain-text passwords
- Use weak hashing (MD5, SHA1)
- Use the same salt for all passwords (bcrypt handles this)
- Expose whether email exists vs password is wrong

### Middleware Architecture

Middleware are functions that run during the request/response cycle. The application uses middleware for logging, parsing, sessions, and error handling.

#### Middleware Pipeline

```typescript
// src/app.ts
import express from "express";
import morgan from "morgan";
import {
  errorHandler,
  notFoundHandler,
} from "@/middlewares/error.middleware.js";
import sessionMiddleware from "@/middlewares/session.middleware.js";
import routes from "@/routes.js";

const app = express();

// 1. Request logging
app.use(morgan("dev"));

// 2. Body parsing
app.use(express.json());

// 3. Session management
app.use(sessionMiddleware);

// 4. Application routes
app.use(routes);

// 5. 404 handler (no route matched)
app.use(notFoundHandler);

// 6. Global error handler
app.use(errorHandler);

export default app;
```

#### Middleware Flow

```
Incoming Request
   │
   ▼
1. morgan("dev")              → Log: GET /api/products 200 15ms
   │
   ▼
2. express.json()             → Parse JSON body
   │
   ▼
3. sessionMiddleware          → Load session from database
   │
   ▼
4. routes                     → Try to match a route
   │
   ├─▶ Route matches          → Execute controller
   │   └─▶ Success            → Send response
   │   └─▶ Error              → next(error) → Error Handler
   │
   └─▶ No route matches       → Continue to 404 handler
   │
   ▼
5. notFoundHandler            → Create NotFoundError
   │
   ▼
6. errorHandler               → Format error response
   │
   ▼
Response sent to client
```

#### Built-in Middleware

**morgan**: HTTP request logger

```typescript
app.use(morgan("dev"));
```

Output: `GET /api/products 200 15.234 ms - 1234`

**express.json()**: Parse JSON request bodies

```typescript
app.use(express.json());
```

Makes `req.body` available with parsed JSON data.

#### Custom Middleware

**Session Middleware:**

- Loads session from database
- Attaches to `req.session`
- Automatically saves changes
- Configured in `src/middlewares/session.middleware.ts`

**Error Middlewares:**

- `notFoundHandler`: Catches unmatched routes
- `errorHandler`: Global error handler
- Both in `src/middlewares/error.middleware.ts`

#### Middleware Best Practices

✅ **Do:**

- Order middleware correctly (parsing before routes)
- Use built-in middleware when available
- Handle errors in middleware
- Keep middleware focused and single-purpose

❌ **Don't:**

- Skip error handling middleware
- Put business logic in middleware
- Block the event loop with synchronous operations

#### Future Middleware Considerations

Potential middleware to add as the application grows:

- **Rate limiting**: Prevent abuse (express-rate-limit)
- **CORS**: If adding a frontend on different domain
- **Compression**: Gzip response bodies
- **Helmet**: Security headers
- **Request validation**: Input sanitization
- **Authentication guards**: Protect routes requiring login

---

## 8. Type Safety & Developer Experience

TypeScript is at the heart of this project's developer experience. This section covers the TypeScript configuration, strict type checking, path aliases, and type extensions that make development safer and more productive.

### TypeScript Configuration

The `tsconfig.json` file is carefully configured to maximize type safety while maintaining developer productivity.

#### Complete Configuration

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // File Layout
    "rootDir": "./src", // Source files location
    "outDir": "./dist", // Compiled output location

    // Path Aliases
    "paths": {
      "@/*": ["src/*"], // @/ maps to src/
    },
    "baseUrl": ".", // Base for path resolution

    // Environment Settings
    "module": "nodenext", // ESM + CommonJS interop
    "target": "esnext", // Modern JavaScript features
    "lib": ["esnext"], // Standard library
    "types": ["node"], // Node.js type definitions

    // Other Outputs
    "sourceMap": true, // Generate .map files for debugging
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Generate .d.ts.map files

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true, // Array/object access returns T | undefined
    "exactOptionalPropertyTypes": true, // Distinguish undefined vs missing

    // Style Options
    "noImplicitReturns": true, // Every code path must return
    "noImplicitOverride": true, // Explicit override keyword
    "noUnusedLocals": true, // Error on unused variables
    "noUnusedParameters": true, // Error on unused parameters
    "noFallthroughCasesInSwitch": true, // Error on switch fallthrough
    "noPropertyAccessFromIndexSignature": true, // Use bracket notation for index access

    // Recommended Options
    "strict": true, // Enable all strict checks
    "verbatimModuleSyntax": true, // Explicit import/export syntax
    "isolatedModules": true, // Each file must be self-contained
    "noUncheckedSideEffectImports": true, // Side effects must be explicit
    "moduleDetection": "force", // Treat all files as modules
    "skipLibCheck": true, // Skip type checking of .d.ts files
  },
}
```

#### Key Configuration Groups

**1. File Layout**

```jsonc
"rootDir": "./src",
"outDir": "./dist"
```

- Source code lives in `src/`
- Compiled JavaScript goes to `dist/`

**2. Module System**

```jsonc
"module": "nodenext",
"target": "esnext",
"type": "module"  // in package.json
```

- Uses **ESM** (ECMAScript Modules): `import/export` not `require()`
- All imports must have `.js` extension (even for `.ts` files!)
- Modern JavaScript features available
- Example: `import { query } from "@/db/index.js"`

**3. Path Aliases**

```jsonc
"paths": {
  "@/*": ["src/*"]
},
"baseUrl": "."
```

- `@/` is an alias for `src/`
- Enables clean imports: `import { User } from "@/models/user.model.js"`
- Requires `tsc-alias` to resolve in compiled code

**4. Strict Type Checking**

```jsonc
"strict": true
```

This enables **all** strict type checking options:

- `strictNullChecks`: `null` and `undefined` are distinct types
- `strictFunctionTypes`: Function types are checked more carefully
- `strictBindCallApply`: `bind`, `call`, `apply` are type-safe
- `strictPropertyInitialization`: Class properties must be initialized
- `noImplicitAny`: Can't use `any` without explicit annotation
- `noImplicitThis`: `this` must have explicit type
- `alwaysStrict`: Emit `"use strict"` in output

### Strict Type Checking

The project uses TypeScript's strict mode plus additional strictness flags. This catches errors at compile time instead of runtime.

#### Core Strict Checks

**1. strictNullChecks**

Without this, TypeScript allows `null`/`undefined` anywhere:

```typescript
// Without strictNullChecks
const user = await usersRepository.findById(id);
const email = user.email; // No error, but user might be null!
```

With strict null checks:

```typescript
// With strictNullChecks
const user = await usersRepository.findById(id);
const email = user.email; // ❌ Error: Object is possibly 'null'

// Must check first:
if (user) {
  const email = user.email; // ✅ OK
}
```

**Real example from the project:**

```typescript
// src/repositories/users.repository.ts
async findById(id: number): Promise<User | null> {
  const result = await query<User>("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;  // Explicitly returns null
}

// src/services/users.service.ts
async getUserById(id: number) {
  const user = await usersRepository.findById(id);
  // Must handle null case - TypeScript enforces this
  return user;  // Might be null, caller must check
}
```

**2. noImplicitAny**

Forces explicit type annotations when TypeScript can't infer:

```typescript
// ❌ Error: Parameter 'req' implicitly has an 'any' type
function handler(req, res) {
  // ...
}

// ✅ Must provide types
function handler(req: Request, res: Response) {
  // ...
}
```

**3. strictFunctionTypes**

Ensures function parameter types are checked correctly:

```typescript
type Handler = (user: User | null) => void;

// ❌ Error: Can't assign stricter function to less strict type
const myHandler: Handler = (user: User) => {
  console.log(user.email); // Would crash if user is null!
};
```

#### Additional Strict Checks

**1. noUncheckedIndexedAccess**

Array and object access returns `T | undefined`:

```typescript
const result = await query<Product>("SELECT * FROM products");

// Without noUncheckedIndexedAccess
const product = result.rows[0]; // Type: Product (might not exist!)

// With noUncheckedIndexedAccess
const product = result.rows[0]; // Type: Product | undefined ✅

// Must handle undefined:
const product = result.rows[0] || null;
if (!product) {
  throw new NotFoundError("Product not found");
}
```

**2. exactOptionalPropertyTypes**

Distinguishes between `undefined` and missing property:

```typescript
interface User {
  email: string;
  phone?: string; // Can be undefined or missing
}

// Without exactOptionalPropertyTypes
const user: User = { email: "test@example.com", phone: undefined }; // OK

// With exactOptionalPropertyTypes
const user: User = { email: "test@example.com", phone: undefined }; // ❌ Error
const user: User = { email: "test@example.com" }; // ✅ OK
```

**3. noUnusedLocals & noUnusedParameters**

Prevents unused variables:

```typescript
// ❌ Error: 'category' is declared but never used
async getProductById(id: number) {
  const category = await categoriesRepository.findById(1);
  const product = await productsRepository.findById(id);
  return product;
}

// ✅ Remove or use the variable
async getProductById(id: number) {
  const product = await productsRepository.findById(id);
  return product;
}

// ✅ Or prefix with _ to indicate intentionally unused
async errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
```

**4. noImplicitReturns**

Every code path must return a value:

```typescript
// ❌ Error: Not all code paths return a value
function getStatus(code: number): string {
  if (code === 200) {
    return "OK";
  }
  // Missing return for other cases
}

// ✅ All paths return
function getStatus(code: number): string {
  if (code === 200) {
    return "OK";
  }
  return "Error";
}
```

#### Benefits of Strict Mode

- **Catches bugs at compile time**: Many runtime errors become compile errors
- **Better IDE support**: More accurate autocomplete and error detection
- **Self-documenting code**: Types serve as inline documentation
- **Refactoring confidence**: TypeScript catches breaking changes
- **Prevents common mistakes**: Null checks, missing returns, unused vars

#### Trade-offs

- **More verbose**: Need explicit type annotations in some cases
- **Steeper learning curve**: Must understand TypeScript's type system
- **Initial friction**: Existing JavaScript code needs type fixes

However, these trade-offs are worth it for a production application that will be maintained long-term.

### Path Aliases (`@/*`)

Path aliases eliminate the need for messy relative imports.

#### The Problem

Without path aliases, imports get ugly fast:

```typescript
// Deep nesting = import hell
import { query } from "../../../db/index.js";
import { User } from "../../../models/user.model.js";
import { NotFoundError } from "../../../shared/errors.js";
import { hashPassword } from "../../../shared/hash.js";
```

Problems:

- Hard to read
- Breaks when moving files
- Difficult to maintain
- Counts `../` to understand depth

#### The Solution

With `@/` alias pointing to `src/`:

```typescript
// Clean, absolute-style imports
import { query } from "@/db/index.js";
import { User } from "@/models/user.model.js";
import { NotFoundError } from "@/shared/errors.js";
import { hashPassword } from "@/shared/hash.js";
```

Benefits:

- Always relative to `src/`
- Move files without updating imports
- Immediately clear where code comes from
- Consistent across entire codebase

#### Configuration

**1. TypeScript Configuration**

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
    },
  },
}
```

This tells TypeScript to resolve `@/` as `src/` for type checking.

**2. Runtime Resolution**

TypeScript compiles `@/` imports as-is, so we need `tsc-alias` to resolve them:

```json
// package.json
{
  "scripts": {
    "build": "rm -rf dist && tsc && tsc-alias"
  },
  "devDependencies": {
    "tsc-alias": "^1.8.16"
  }
}
```

**Build process:**

1. `tsc` compiles TypeScript → JavaScript (keeps `@/` as-is)
2. `tsc-alias` replaces `@/` with relative paths in output

**3. Development (tsx)**

The `tsx` development server understands `paths` from `tsconfig.json`, so path aliases work in development without extra configuration.

```bash
npm run dev  # tsx --watch src/server.ts
```

#### Usage Examples

**Controllers:**

```typescript
// src/controllers/products.controller.ts
import type { NextFunction, Request, Response } from "express";
import { productsService } from "@/services/products.service.js";
import { ValidationError } from "@/shared/errors.js";
```

**Services:**

```typescript
// src/services/products.service.ts
import { categoriesRepository } from "@/repositories/categories.repository.js";
import { productsRepository } from "@/repositories/products.repository.js";
import { NotFoundError } from "@/shared/errors.js";
```

**Repositories:**

```typescript
// src/repositories/products.repository.ts
import { query } from "@/db/index.js";
import type { Product } from "@/models/product.model.js";
```

#### Best Practices

✅ **Do:**

- Use `@/` for all imports from `src/`
- Keep `.js` extension (ESM requirement)
- Use for consistency across the project

❌ **Don't:**

- Mix `@/` and relative imports
- Forget the `.js` extension
- Use for external packages (those use regular imports)

#### Comparing Import Styles

**External packages (no alias):**

```typescript
import express from "express";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
```

**Project files (with alias):**

```typescript
import { query } from "@/db/index.js";
import { User } from "@/models/user.model.js";
import { hashPassword } from "@/shared/hash.js";
```

This creates a clear visual distinction between external dependencies and internal code.

### Session Type Extensions

TypeScript needs to know about custom properties added to sessions. This is done via **declaration merging**.

#### The Problem

By default, `express-session` doesn't know about custom session properties:

```typescript
import type { Request } from "express";

function handler(req: Request) {
  const userId = req.session.userId; // ❌ Error: Property 'userId' does not exist
}
```

#### The Solution: Declaration Merging

```typescript
// src/types/auth.types.ts
import type { SessionData } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number; // Add custom property
  }
}
```

This **extends** the existing `SessionData` interface from `express-session`.

#### How Declaration Merging Works

TypeScript allows you to extend interfaces defined in other modules:

```typescript
// Original interface (from express-session package)
interface SessionData {
  cookie: Cookie;
}

// Your extension (in your code)
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// Result: TypeScript merges them
interface SessionData {
  cookie: Cookie; // Original
  userId?: number; // Your addition
}
```

#### Benefits

Now TypeScript knows about `userId`:

```typescript
// src/controllers/auth.controller.ts
async me(req: Request, res: Response, next: NextFunction) {
  const userId = req.session.userId;  // ✅ Type: number | undefined

  if (!userId) {  // TypeScript enforces null check
    throw new UnauthorizedError("Not authenticated");
  }

  // userId is number here (TypeScript narrows the type)
  const user = await usersService.getUserById(userId);
}
```

**Autocomplete works:**

```typescript
req.session.  // TypeScript suggests: userId, cookie, regenerate, destroy, etc.
```

**Type errors catch mistakes:**

```typescript
req.session.userId = "123"; // ❌ Error: Type 'string' is not assignable to type 'number'
req.session.userId = 123; // ✅ OK
```

#### Adding More Session Properties

To add more properties, just extend the interface:

```typescript
// src/types/auth.types.ts
declare module "express-session" {
  interface SessionData {
    userId?: number;
    role?: "admin" | "user";
    lastLogin?: string;
    cartId?: string;
  }
}
```

#### Where to Put Type Extensions

**Option 1: Dedicated types file** (current approach)

```
src/types/auth.types.ts
```

Benefits:

- Centralized type extensions
- Easy to find
- Can include related types

**Option 2: Next to where it's used**

```
src/middlewares/session.middleware.ts
```

Benefits:

- Collocated with implementation
- Less jumping between files

This project uses **Option 1** because:

- Multiple files use `req.session.userId`
- Keeps type definitions centralized
- Follows the pattern of grouping types

#### Other Type Extensions Example

You can extend other types too:

```typescript
// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User; // Attach user after authentication
    }
  }
}

// Now this works:
function handler(req: Request) {
  if (req.user) {
    console.log(req.user.email); // ✅ TypeScript knows about 'user'
  }
}
```

### Developer Experience Benefits

The TypeScript configuration and tooling choices create an excellent developer experience:

#### 1. Hot Reloading with tsx

```bash
npm run dev  # tsx --watch src/server.ts
```

- Instant feedback on code changes - no manual restarts
- TypeScript compiled on-the-fly
- Automatic server restart on save

#### 2. Compile-Time Error Detection

TypeScript catches errors before runtime:

```typescript
// ❌ Error caught at compile time
const user = await usersRepository.findById(id);
console.log(user.email); // Error: Object is possibly 'null'

// ✅ Must handle null case
if (!user) throw new NotFoundError("User not found");
```

#### 3. Rich IDE Features

- **Autocomplete:** `usersRepository.` → suggests `findById`, `findByEmail`, `create`
- **Go to definition:** Click any function/type to jump to source
- **Type-safe refactoring:** Rename symbol updates all usages
- **Inline documentation:** Hover to see type signatures

#### 4. Type-Safe Database Queries

```typescript
const result = await query<Product>("SELECT * FROM products");
result.rows.forEach((product) => {
  console.log(product.title); // ✅ Autocomplete works
  console.log(product.invalid); // ❌ Error: Property doesn't exist
});
```

### Type Safety Best Practices

✅ **Do:**

- Enable strict mode
- Use explicit types for function parameters
- Handle null/undefined cases
- Use type guards and narrowing
- Leverage generics for reusable code
- Extend types via declaration merging when needed
- Use path aliases consistently

❌ **Don't:**

- Use `any` (defeats the purpose of TypeScript)
- Use `as` casts unless absolutely necessary
- Ignore TypeScript errors (fix them!)
- Mix CommonJS and ESM
- Forget `.js` extensions in imports
- Use non-null assertions (`!`) without good reason

---

## 9. Code Quality & Standards

This project follows strict code quality standards enforced by ESLint and Prettier. These tools ensure consistent code style, catch potential bugs, and improve maintainability.

### ESLint Configuration

ESLint catches potential bugs, enforces best practices, and maintains code quality standards.

#### Configuration (`eslint.config.js`)

```javascript
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/unbound-method": "off",
    },
  },
  {
    ignores: ["dist/**"],
  },
]);
```

#### Key ESLint Features

**1. TypeScript Type-Checked Rules**

```typescript
tseslint.configs.recommendedTypeChecked;
```

Enables rules that require type information:

- Catches type mismatches before runtime
- Enforces proper Promise handling
- Detects unsafe member access
- Validates type assertions

**2. Unused Variables Rule**

```javascript
"@typescript-eslint/no-unused-vars": [
  "error",
  { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
]
```

**Behavior:**

- ❌ Error on unused variables and parameters
- ✅ Allow variables prefixed with `_` (intentionally unused)

**Examples:**

```typescript
// ❌ ESLint error: 'data' is declared but never used
async function fetchUser(id: number) {
  const data = await usersRepository.findById(id);
  return null;
}

// ✅ OK: Using the variable
async function fetchUser(id: number) {
  const user = await usersRepository.findById(id);
  return user;
}

// ✅ OK: Prefixed with underscore
function errorHandler(
  err: Error,
  _req: Request, // Intentionally unused
  res: Response,
  _next: NextFunction // Intentionally unused
) {
  console.error(err);
  res.status(500).json({ error: "Server error" });
}
```

**3. Ignored Paths**

```javascript
ignores: ["dist/**"];
```

- Skips linting compiled JavaScript in `dist/` folder
- Focuses on source code quality

#### Running ESLint

**Lint all files:**

```bash
npm run lint
```

**Auto-fix issues:**

```bash
npm run lint:fix
```

**IDE Integration:**

- VS Code shows ESLint errors inline
- Auto-fix on save (if configured)
- Red squiggly lines under problematic code

### Prettier Setup

Prettier enforces consistent code formatting across the entire codebase.

#### Configuration (`prettier.config.js`)

```javascript
const config = {
  printWidth: 80, // Line length before wrapping
  trailingComma: "es5", // Trailing commas where valid in ES5
  tabWidth: 2, // 2 spaces per indentation level
  semi: true, // Add semicolons at end of statements
  singleQuote: false, // Use double quotes for strings
};

export default config;
```

#### Configuration Explained

**1. printWidth: 80**

- Maximum line length before Prettier wraps code
- Improves readability on smaller screens
- Standard for most projects

**2. trailingComma: "es5"**

- Adds trailing commas in objects, arrays, function params (ES5-compatible)
- Cleaner git diffs (adding items doesn't change previous lines)

**Example:**

```typescript
// With trailingComma: "es5"
const user = {
  email: "test@example.com",
  password: "hashed", // ✅ Trailing comma
};

// Adding a property only changes one line in git diff
const user = {
  email: "test@example.com",
  password: "hashed",
  name: "John", // Only this line is new
};
```

**3. tabWidth: 2**

- Indentation uses 2 spaces
- More compact than 4 spaces
- Standard for JavaScript/TypeScript projects

**4. semi: true**

- Always add semicolons
- Prevents automatic semicolon insertion (ASI) issues
- Explicit and predictable

**5. singleQuote: false**

- Use double quotes for strings: `"hello"`
- Consistent with JSON format
- Avoids escaping in most cases

#### Running Prettier

**Format all files:**

```bash
npm run format
```

**Check formatting without changes:**

```bash
npm run format:check
```

**IDE Integration:**

- VS Code formats on save (if configured)
- Instant feedback on formatting issues
- No manual formatting needed

### Naming Conventions

The project follows consistent naming patterns across all layers.

#### Files and Folders

**Pattern: kebab-case**

```
✅ Good:
src/controllers/auth.controller.ts
src/services/products.service.ts
src/shared/errors.ts

❌ Bad:
src/controllers/AuthController.ts
src/services/ProductsService.ts
src/shared/Errors.ts
```

**Suffixes indicate purpose:**

- `*.model.ts` - Data models
- `*.controller.ts` - HTTP handlers
- `*.service.ts` - Business logic
- `*.repository.ts` - Data access
- `*.routes.ts` - Route definitions
- `*.middleware.ts` - Express middleware

#### Variables and Functions

**Pattern: camelCase**

```typescript
✅ Good:
const userName = "John";
const productsRepository = {...};
async function getUserById(id: number) {...}

❌ Bad:
const UserName = "John";
const ProductsRepository = {...};
async function GetUserById(id: number) {...}
```

#### Interfaces and Types

**Pattern: PascalCase**

```typescript
✅ Good:
interface User {...}
interface Product {...}
type UserDto = Omit<User, "password">;

❌ Bad:
interface user {...}
interface product {...}
type userDto = Omit<User, "password">;
```

#### Constants

**Pattern: UPPER_SNAKE_CASE for true constants**

```typescript
✅ Good:
const SESSION_MAX_AGE = 24 * 60 * 60 * 1000;
const DEFAULT_PORT = 3000;

✅ Also acceptable (configuration objects):
const config = {
  maxAge: 24 * 60 * 60 * 1000,
  port: 3000,
};
```

#### Database Naming

**Tables and columns: snake_case**

```sql
✅ Good:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ
);

❌ Bad:
CREATE TABLE Users (
  Id SERIAL PRIMARY KEY,
  Email TEXT NOT NULL,
  CreatedAt TIMESTAMPTZ
);
```

**Note:** Database snake_case is automatically converted to JavaScript camelCase via the query utility.

### File Organization Patterns

The project follows a layered architecture with strict folder organization.

#### Layer-Based Organization

```
src/
├── routes/          # API endpoint definitions
├── controllers/     # Request/response handlers
├── services/        # Business logic
├── repositories/    # Data access
├── models/          # Type definitions
├── middlewares/     # Express middleware
├── shared/          # Utilities and helpers
├── db/             # Database connection
└── types/          # TypeScript type extensions
```

**Rules:**

- Files grouped by **layer** (not by feature)
- Clear separation of concerns
- Easy to locate files by responsibility

#### Feature-Based Grouping Within Layers

Within each layer, files are grouped by domain:

```
src/controllers/
├── auth.controller.ts       # Authentication endpoints
├── categories.controller.ts # Category management
└── products.controller.ts   # Product management
```

**Benefits:**

- Related code stays together
- Easy to find feature-specific logic
- Scales well as features grow

#### Import Organization

**Order of imports:**

```typescript
// 1. External packages
import express from "express";
import { Pool } from "pg";

// 2. Type-only imports from external packages
import type { Request, Response } from "express";

// 3. Internal imports (with @/ alias)
import { usersService } from "@/services/users.service.js";
import { ValidationError } from "@/shared/errors.js";
import type { User } from "@/models/user.model.js";
```

**Prettier automatically groups imports, but follow this mental model:**

1. External dependencies first
2. Type-only imports separated (when useful)
3. Internal code last

### Code Quality Best Practices

#### Consistent Patterns

**1. Repository Pattern**

```typescript
export const someRepository = {
  async findAll(): Promise<Model[]> {
    // Implementation
  },
  async findById(id: number): Promise<Model | null> {
    // Implementation
  },
};
```

**2. Service Pattern**

```typescript
export const someService = {
  async getSomethingById(id: number) {
    const result = await someRepository.findById(id);
    if (!result) {
      throw new NotFoundError("Not found");
    }
    return result;
  },
};
```

**3. Controller Pattern**

```typescript
export const someController = {
  async handleRequest(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Extract parameters
      // 2. Validate input
      // 3. Call service
      // 4. Format response
    } catch (error) {
      return next(error);
    }
  },
};
```

#### Error Handling

```typescript
✅ Good:
async function getUser(id: number) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

❌ Bad:
async function getUser(id: number) {
  try {
    const user = await usersRepository.findById(id);
    return user || null;  // Swallowing the missing user
  } catch (err) {
    console.log(err);  // Silent failure
    return null;
  }
}
```

#### Type Safety

```typescript
✅ Good:
const id = Number(req.params["id"]);
if (isNaN(id)) {
  throw new ValidationError("Invalid ID");
}

❌ Bad:
const id = req.params["id"] as unknown as number;  // Unsafe cast
```

#### Comments

**Use comments sparingly - code should be self-documenting:**

```typescript
✅ Good (clear without comments):
async function getUserById(id: number) {
  const user = await usersRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

⚠️ Acceptable (when explaining "why"):
// Regenerate session ID to prevent session fixation attacks
req.session.regenerate((err) => {
  // ...
});

❌ Bad (explaining obvious "what"):
// Get user by id
async function getUserById(id: number) {
  // Find the user
  const user = await usersRepository.findById(id);
  // Return the user
  return user;
}
```

### Development Workflow

**Before committing:**

1. **Lint your code:**

   ```bash
   npm run lint
   ```

2. **Format your code:**

   ```bash
   npm run format
   ```

3. **Fix TypeScript errors:**
   ```bash
   npm run build
   ```

**IDE Setup (VS Code):**

Install recommended extensions:

- ESLint
- Prettier
- TypeScript

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  }
}
```

This ensures:

- Code formats automatically on save
- ESLint fixes applied on save
- Consistent formatting across team

### Summary

The project maintains high code quality through:

- **ESLint**: Catches bugs, enforces best practices
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and compile-time checks
- **Naming conventions**: Predictable, consistent names
- **File organization**: Clear layer separation
- **Code patterns**: Consistent implementation across layers

These standards ensure:

- Code is easy to read and maintain
- Bugs are caught early
- Team members can work efficiently
- Onboarding new developers is faster
