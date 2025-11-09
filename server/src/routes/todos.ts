import { Router } from 'express';
import Todo from '../models/Todo';
import logger from '../utils/logger';

const router = Router();

// Helper function to handle errors
function getErrorInfo(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { 
      message: error.message, 
      stack: error.stack 
    };
  }
  return { 
    message: String(error) 
  };
}

// GET all todos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', done } = req.query;
    
    logger.info('Fetching todos', { 
      queryParams: req.query,
      ip: req.ip,
      method: req.method
    });

    const query: any = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } }
      ];
    }
    
    if (done !== undefined) {
      query.done = done === 'true';
    }
    
    const todos = await Todo.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Todo.countDocuments(query);
    const totalPending = await Todo.countDocuments({ done: false });
    const totalDone = await Todo.countDocuments({ done: true });
    
    logger.debug('Todos fetched successfully', {
      count: todos.length,
      page,
      totalPages: Math.ceil(total / Number(limit))
    });

    res.json({
      todos,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      totalPending,
      totalDone
    });
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    logger.error('Failed to fetch todos', {
      error: errorInfo.message,
      stack: errorInfo.stack
    });
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// POST new todo
router.post('/', async (req, res) => {
  const { title, description } = req.body;

  logger.info('Creating new todo', {
    requestBody: req.body,
    ip: req.ip
  });

  if (!title) {
    logger.warn('Title validation failed - title is required');
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTodo = new Todo({ title, description });
    const savedTodo = await newTodo.save();
    
    logger.info('Todo created successfully', {
      todoId: savedTodo._id,
      title: savedTodo.title
    });
    
    res.status(201).json(savedTodo);
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    logger.error('Failed to create todo', {
      error: errorInfo.message,
      stack: errorInfo.stack,
      requestBody: req.body
    });
    res.status(400).json({ message: 'Failed to create todo' });
  }
});

// PUT update todo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  logger.info('Updating todo', {
    todoId: id,
    updateData: req.body
  });

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    
    if (!updatedTodo) {
      logger.warn('Todo not found for update', { todoId: id });
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    logger.info('Todo updated successfully', {
      todoId: updatedTodo._id,
      newTitle: updatedTodo.title
    });
    
    res.json(updatedTodo);
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    logger.error('Failed to update todo', {
      error: errorInfo.message,
      stack: errorInfo.stack,
      todoId: id
    });
    res.status(400).json({ message: 'Failed to update todo' });
  }
});

// PATCH done status
router.patch('/:id/done', async (req, res) => {
  const { id } = req.params;
  
  logger.info('Toggling done status', { todoId: id });

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      logger.warn('Todo not found for status toggle', { todoId: id });
      return res.status(404).json({ message: 'Todo not found' });
    }

    const oldStatus = todo.done;
    todo.done = !todo.done;
    const updatedTodo = await todo.save();
    
    logger.info('Todo status toggled successfully', {
      todoId: updatedTodo._id,
      oldStatus,
      newStatus: updatedTodo.done
    });
    
    res.json(updatedTodo);
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    logger.error('Failed to toggle status', {
      error: errorInfo.message,
      stack: errorInfo.stack,
      todoId: id
    });
    res.status(400).json({ message: 'Failed to toggle status' });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  logger.info('Deleting todo', { todoId: id });

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      logger.warn('Todo not found for deletion', { todoId: id });
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    logger.info('Todo deleted successfully', {
      todoId: deletedTodo._id,
      title: deletedTodo.title
    });
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    const errorInfo = getErrorInfo(error);
    logger.error('Failed to delete todo', {
      error: errorInfo.message,
      stack: errorInfo.stack,
      todoId: id
    });
    res.status(400).json({ message: 'Failed to delete todo' });
  }
});

export default router;