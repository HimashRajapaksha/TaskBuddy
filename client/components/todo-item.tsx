"use client"

import { useState } from "react"
import { Edit3, Trash2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import type { Todo } from "@/types/todo"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, data: { title: string; description: string }) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  isUpdating: boolean
  isToggling: boolean
  isDeleting: boolean
}

export function TodoItem({ todo, onUpdate, onToggle, onDelete, isUpdating, isToggling, isDeleting }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || "",
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm({
      title: todo.title,
      description: todo.description || "",
    })
  }

  const handleSave = () => {
    if (!editForm.title.trim()) return
    onUpdate(todo._id, editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      title: todo.title,
      description: todo.description || "",
    })
  }

  const handleDelete = () => {
    onDelete(todo._id)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div
        className={cn(
          "p-4 border rounded-lg transition-all duration-200",
          todo.done ? "bg-green-50 border-green-200" : "bg-white border-gray-200",
          "hover:shadow-md",
        )}
      >
        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Todo title"
            />
            <Textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              placeholder="Todo description"
              className="min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isUpdating || !editForm.title.trim()}>
                <Save className="h-4 w-4 mr-1" />
                {isUpdating ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Checkbox
              checked={todo.done}
              onCheckedChange={() => onToggle(todo._id)}
              disabled={isToggling}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={cn("font-medium text-gray-900", todo.done && "line-through text-gray-500")}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={cn("text-sm text-gray-600 mt-1", todo.done && "line-through text-gray-400")}>
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Created: {new Date(todo.createdAt).toLocaleDateString()}</span>
                {todo.updatedAt !== todo.createdAt && (
                  <span>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleEdit} disabled={isUpdating}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        todoTitle={todo.title}
        isDeleting={isDeleting}
      />
    </>
  )
}
