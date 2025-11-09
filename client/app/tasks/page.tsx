"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { TodoItem } from "@/components/todo-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTodos, useUpdateTodo, useToggleTodo, useDeleteTodo } from "@/hooks/use-todos"
import type { GetTodosParams } from "@/types/todo"

export default function TasksPage() {
  const { toast } = useToast()

  // Filter and pagination state
  const [filters, setFilters] = useState<GetTodosParams>({
    page: 1,
    limit: 15, // Show more items on dedicated tasks page
    search: "",
    done: undefined,
  })

  // Debounced search
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  const { data: todosResponse, isLoading, error } = useTodos(filters)
  const updateTodoMutation = useUpdateTodo()
  const toggleTodoMutation = useToggleTodo()
  const deleteTodoMutation = useDeleteTodo()

  const todos = todosResponse?.todos || []
  const totalPages = todosResponse?.pages || 1
  const currentPage = todosResponse?.page || 1
  const totalTodos = todosResponse?.total || 0

  const completedCount = todos.filter((todo) => todo.done).length
  const pendingCount = todos.filter((todo) => !todo.done).length

  const handleUpdateTodo = async (id: string, data: { title: string; description: string }) => {
    try {
      await updateTodoMutation.mutateAsync({ id, data })
      toast({
        title: "Success",
        description: "Todo updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      })
    }
  }

  const handleToggleTodo = async (id: string) => {
    try {
      await toggleTodoMutation.mutateAsync(id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle todo status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodoMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleStatusFilter = (value: string) => {
    const done = value === "all" ? undefined : value === "completed"
    setFilters((prev) => ({ ...prev, done, page: 1 }))
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto p-6 max-w-6xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">Failed to load todos. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <List className="h-8 w-8" />
              All Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Manage and organize all your todos in one place</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
              </CardTitle>
              <CardDescription>Find specific tasks or filter by completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search todos by title or description..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select onValueChange={handleStatusFilter} defaultValue="all">
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending Only</SelectItem>
                    <SelectItem value="completed">Completed Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Todo List */}
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading todos...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Task List</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{totalTodos} total</Badge>
                    {filters.done !== undefined && (
                      <Badge variant="outline">{filters.done ? "Completed" : "Pending"} only</Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchInput || filters.done !== undefined ? "No todos found" : "No todos yet"}
                    </h3>
                    <p className="text-gray-500">
                      {searchInput || filters.done !== undefined
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first todo."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todos.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onUpdate={handleUpdateTodo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        isUpdating={updateTodoMutation.isPending}
                        isToggling={toggleTodoMutation.isPending}
                        isDeleting={deleteTodoMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} ({totalTodos} total items)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
