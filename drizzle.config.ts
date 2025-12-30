import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    database: 'todos_db',
  },
} satisfies Config
