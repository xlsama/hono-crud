import postgres from 'postgres'

// Connect to postgres default database to create our database
const sqlDefault = postgres({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
})

async function initDatabase() {
  try {
    // Create database if it doesn't exist
    await sqlDefault.unsafe(`
      SELECT 'CREATE DATABASE todos_db'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'todos_db')
      \gexec
    `).catch(() => {
      // Database might already exist, try alternative approach
      return sqlDefault`
        CREATE DATABASE todos_db
      `.catch((err) => {
        if (err.code !== '42P04') { // 42P04 = database already exists
          throw err
        }
        console.log('Database todos_db already exists')
      })
    })

    await sqlDefault.end()

    // Connect to our new database
    const sql = postgres({
      host: 'localhost',
      port: 5432,
      database: 'todos_db',
    })

    // Create todos table
    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log('✓ Database and todos table created successfully!')

    await sql.end()
    process.exit(0)
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

initDatabase()
