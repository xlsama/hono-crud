# Hono CRUD API with PostgreSQL & Drizzle ORM

A type-safe todos CRUD API built with Hono framework, Drizzle ORM, and Bun runtime.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono v4
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL

## Setup

1. Install dependencies:
```sh
bun install
```

2. Ensure PostgreSQL is running and create database:
```sh
createdb todos_db
```

3. Run Drizzle migrations:
```sh
bun run db:migrate
```

4. Start development server:
```sh
bun run dev
```

Server runs on http://localhost:3000

## Database Commands

```sh
# Generate migration from schema changes
bun run db:generate

# Run migrations
bun run db:migrate

# Open Drizzle Studio (visual database browser)
bun run db:studio
```

## API Examples

### Create a todo
```sh
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Hono","description":"Build a CRUD API"}'
```

### Get all todos
```sh
curl http://localhost:3000/todos
```

### Get a single todo
```sh
curl http://localhost:3000/todos/1
```

### Update a todo
```sh
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Delete a todo
```sh
curl -X DELETE http://localhost:3000/todos/1
```
