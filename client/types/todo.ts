export interface Todo {
  _id: string
  title: string
  description?: string
  done: boolean
  createdAt: string
  updatedAt: string
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  page: number
  pages: number
  totalPending: number
  totalDone: number
}

export interface GetTodosParams {
  page?: number
  limit?: number
  search?: string
  done?: boolean
}

export interface CreateTodoRequest {
  title: string
  description?: string
}

export interface UpdateTodoRequest {
  title: string
  description?: string
}
