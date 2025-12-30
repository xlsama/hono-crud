# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hono web framework project using Bun as the runtime. Hono is a lightweight, ultrafast web framework designed for edge computing platforms.

## Essential Commands

```bash
# Install dependencies
bun install

# Generate Drizzle migrations from schema changes
bun run db:generate

# Run migrations to update database
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio

# Start development server with hot reload
bun run dev

# Run the application directly
bun run src/index.ts
```

The development server runs on http://localhost:3000 by default.

## Architecture

**Runtime**: Bun (not Node.js)
- Use Bun-specific APIs when available
- The project uses `export default app` pattern which works with Bun's built-in server

**Framework**: Hono v4
- Minimal web framework with routing, middleware, and context handling
- Entry point: `src/index.ts` - creates the Hono app instance and exports it
- Routes are defined using `app.get()`, `app.post()`, etc.
- Handlers receive a context object `c` with methods like `c.json()`, `c.text()`, `c.html()`
- Routes are mounted using `app.route(path, handler)` pattern

**Database**: PostgreSQL with Drizzle ORM
- ORM: Drizzle ORM - TypeScript-first ORM with type-safe queries
- Database client: postgres.js (used by Drizzle)
- Connection: `src/db.ts` - exports Drizzle db instance
- Schema: `src/schema.ts` - defines database tables using Drizzle schema builder
- Migrations: Located in `drizzle/` directory, managed by drizzle-kit
- Configuration: `drizzle.config.ts` - Drizzle Kit configuration
- Connection configured for localhost without credentials (assumes local dev environment)

**TypeScript Configuration**:
- Strict mode enabled
- JSX support configured with `react-jsx` transform
- JSX imports from `hono/jsx` (not React)

## Project Structure

```
src/
  index.ts          # Main application entry point, Hono app definition, route mounting
  db.ts            # Drizzle ORM database instance configuration
  schema.ts        # Drizzle schema definitions (tables, types)
  migrate.ts       # Migration runner script
  todos.ts         # Todos CRUD route handlers using Drizzle queries
drizzle/           # Generated migration files
drizzle.config.ts  # Drizzle Kit configuration
```

## Drizzle ORM Usage Patterns

**Query API** (Relational queries - recommended):
```typescript
import { db } from './db'
import { todos } from './schema'
import { eq } from 'drizzle-orm'

// Find many with ordering
await db.query.todos.findMany({
  orderBy: (todos, { desc }) => [desc(todos.createdAt)]
})

// Find first with filter
await db.query.todos.findFirst({
  where: eq(todos.id, 1)
})
```

**Core API** (SQL-like queries):
```typescript
// Insert
await db.insert(todos).values({ title: 'Task' }).returning()

// Update
await db.update(todos).set({ completed: true }).where(eq(todos.id, 1)).returning()

// Delete
await db.delete(todos).where(eq(todos.id, 1)).returning()
```

**Schema changes workflow**:
1. Modify `src/schema.ts`
2. Run `bun run db:generate` to create migration
3. Run `bun run db:migrate` to apply migration

## API Endpoints

**Todos API** (`/todos`)
- `GET /todos` - List all todos
- `GET /todos/:id` - Get a single todo
- `POST /todos` - Create a new todo (requires `title`, optional `description`)
- `PUT /todos/:id` - Update a todo (partial updates supported)
- `DELETE /todos/:id` - Delete a todo

## Database Schema

**todos table**:
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(255) NOT NULL)
- `description` (TEXT)
- `completed` (BOOLEAN DEFAULT FALSE)
- `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
