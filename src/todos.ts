import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { todos as todosTable } from './schema'
import type { NewTodo } from './schema'

const todos = new Hono()

// Get all todos
todos.get('/', async c => {
  try {
    const allTodos = await db.query.todos.findMany({
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    })
    return c.json(allTodos)
  } catch (error) {
    return c.json({ error: 'Failed to fetch todos' }, 500)
  }
})

// Get a single todo by ID
todos.get('/:id', async c => {
  try {
    const id = parseInt(c.req.param('id'))
    const todo = await db.query.todos.findFirst({
      where: eq(todosTable.id, id),
    })

    if (!todo) {
      return c.json({ error: 'Todo not found' }, 404)
    }

    return c.json(todo)
  } catch (error) {
    return c.json({ error: 'Failed to fetch todo' }, 500)
  }
})

// Create a new todo
todos.post('/', async c => {
  try {
    const body = await c.req.json()
    const { title, description } = body

    if (!title) {
      return c.json({ error: 'Title is required' }, 400)
    }

    const newTodo: NewTodo = {
      title,
      description: description || null,
    }

    const [created] = await db.insert(todosTable).values(newTodo).returning()

    return c.json(created, 201)
  } catch (error) {
    return c.json({ error: 'Failed to create todo' }, 500)
  }
})

// Update a todo
todos.put('/:id', async c => {
  try {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const { title, description, completed } = body

    // Check if todo exists
    const existingTodo = await db.query.todos.findFirst({
      where: eq(todosTable.id, id),
    })

    if (!existingTodo) {
      return c.json({ error: 'Todo not found' }, 404)
    }

    const updateData: Partial<NewTodo> & { updatedAt?: Date } = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (completed !== undefined) updateData.completed = completed
    updateData.updatedAt = new Date()

    const [updated] = await db
      .update(todosTable)
      .set(updateData)
      .where(eq(todosTable.id, id))
      .returning()

    return c.json(updated)
  } catch (error) {
    return c.json({ error: 'Failed to update todo' }, 500)
  }
})

// Delete a todo
todos.delete('/:id', async c => {
  try {
    const id = parseInt(c.req.param('id'))

    const [deleted] = await db.delete(todosTable).where(eq(todosTable.id, id)).returning()

    if (!deleted) {
      return c.json({ error: 'Todo not found' }, 404)
    }

    return c.json({ message: 'Todo deleted successfully', todo: deleted })
  } catch (error) {
    return c.json({ error: 'Failed to delete todo' }, 500)
  }
})

export default todos
