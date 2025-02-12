import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Todo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();
  const { data: todos } = useQuery<Todo[]>({ queryKey: ["/api/todos"] });

  const createTodoMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/todos", { title });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Todo deleted",
        description: "The todo has been removed from your list",
      });
    },
  });

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Todo List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Add new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newTodo) {
                    createTodoMutation.mutate(newTodo);
                  }
                }}
              />
              <Button
                onClick={() => newTodo && createTodoMutation.mutate(newTodo)}
                disabled={createTodoMutation.isPending}
              >
                Add
              </Button>
            </div>

            <ul className="space-y-4">
              {todos?.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg"
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) =>
                      toggleTodoMutation.mutate({
                        id: todo.id,
                        completed: checked as boolean,
                      })
                    }
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteTodoMutation.mutate(todo.id)}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
