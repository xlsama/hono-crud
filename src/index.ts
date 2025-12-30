import { Hono } from 'hono'
import todos from './todos'

const app = new Hono()

app.get('/', c => {
  return c.json({ message: 'Todos API', version: '1.0.0' })
})

// Mount todos routes
app.route('/todos', todos)

export default app
