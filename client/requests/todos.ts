import { api } from "@/lib/api"
import type { Todo, CreateTodoRequest, UpdateTodoRequest, GetTodosParams, TodosResponse } from "@/types/todo"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export const todoRequests = {
  // Get all todos
  getTodos: async (params?: GetTodosParams): Promise<TodosResponse> => {
    const response = await api.get(`${BASE_URL}/api/todos`, { params })
    return response.data
  },

  // Create a new todo
  createTodo: async (data: CreateTodoRequest): Promise<Todo> => {
    const response = await api.post(`${BASE_URL}/api/todos`, data)
    return response.data
  },

  // Update a todo
  updateTodo: async (id: string, data: UpdateTodoRequest): Promise<Todo> => {
    const response = await api.put(`${BASE_URL}/api/todos/${id}`, data)
    return response.data
  },

  // Toggle todo done status
  toggleTodo: async (id: string): Promise<Todo> => {
    const response = await api.patch(`${BASE_URL}/api/todos/${id}/done`)
    return response.data
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/api/todos/${id}`)
  },
}
