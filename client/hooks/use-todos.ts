import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { todoRequests } from "@/requests/todos"
import type { UpdateTodoRequest, GetTodosParams, Todo } from "@/types/todo"

// Use a factory function for consistent query keys
const getTodosQueryKey = (params?: GetTodosParams) => ['todos', params]

// Get all todos
export function useTodos(params?: GetTodosParams) {
  return useQuery({
    queryKey: getTodosQueryKey(params),
    queryFn: () => todoRequests.getTodos(params),
  })
}

// Create todo mutation
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoRequests.createTodo,
    onSuccess: (newTodo) => {
      // Optimistically add to cache
      queryClient.setQueryData<Todo[]>(getTodosQueryKey(), (oldTodos = []) => [...oldTodos, newTodo])
      // Invalidate all variations of the query
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

// Update todo mutation
export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoRequest }) => 
      todoRequests.updateTodo(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old?.map(todo => 
          todo._id === id ? { ...todo, ...data } : todo
        ) || []
      )
      
      return { previousTodos }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}

// Toggle todo mutation
export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoRequests.toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old?.map(todo => 
          todo._id === id ? { ...todo, done: !todo.done } : todo
        ) || []
      )
      
      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}

// Delete todo mutation
export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: todoRequests.deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      queryClient.setQueryData<Todo[]>(['todos'], (old) => 
        old?.filter(todo => todo._id !== id) || []
      )
      
      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })
}