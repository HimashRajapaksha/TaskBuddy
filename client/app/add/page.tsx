"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateTodo } from "@/hooks/use-todos";
import Link from "next/link";

export default function AddTodoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const createTodoMutation = useCreateTodo();

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTodoMutation.mutateAsync(newTodo);
      setNewTodo({ title: "", description: "" });
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
      // Optionally redirect to dashboard
      // router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setNewTodo({ title: "", description: "" });
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Add New Todo
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create a new task to add to your list
              </p>
            </div>
          </div>

          {/* Create Todo Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                New Task Details
              </CardTitle>
              <CardDescription>
                Fill in the details for your new todo item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTodo} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter todo title..."
                    value={newTodo.title}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, title: e.target.value })
                    }
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter description (optional)..."
                    value={newTodo.description}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, description: e.target.value })
                    }
                    className="w-full min-h-[120px]"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Provide additional details about your task
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createTodoMutation.isPending}
                  >
                    {createTodoMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Todo
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={createTodoMutation.isPending}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                💡 Tips for effective todos:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep titles clear and actionable</li>
                <li>• Use descriptions for additional context or steps</li>
                <li>• Break down large tasks into smaller ones</li>
                <li>• Set realistic and achievable goals</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
