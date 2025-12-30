import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

async function main() {
  const client = postgres({
    host: 'localhost',
    port: 5432,
    database: 'todos_db',
  })

  const db = drizzle(client)

  console.log('Running migrations...')

  await migrate(db, { migrationsFolder: './drizzle' })

  console.log('✓ Migrations completed successfully!')

  await client.end()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
