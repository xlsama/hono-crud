import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

// Database connection configuration
const client = postgres({
  host: 'localhost',
  port: 5432,
  database: 'todos_db',
})

export const db = drizzle(client, { schema })
export default db
