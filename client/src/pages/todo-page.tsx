import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Todo } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const { toast } = useToast();
  const { data: todos } = useQuery<Todo[]>({ 
    queryKey: ["/api/todos"],
    staleTime: 0,
  });

  const createTodoMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const res = await apiRequest("POST", "/api/todos", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
      setNewDescription("");
      toast({
        title: "Aufgabe erstellt",
        description: "Die neue Aufgabe wurde erfolgreich hinzugefügt",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: "Die Aufgabe konnte nicht erstellt werden: " + error.message,
        variant: "destructive",
      });
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
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: "Status konnte nicht geändert werden: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Aufgabe gelöscht",
        description: "Die Aufgabe wurde aus der Liste entfernt",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: "Die Aufgabe konnte nicht gelöscht werden: " + error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Aufgabenliste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div>
                <Input
                  placeholder="Neue Aufgabe hinzufügen..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Beschreibung der Aufgabe..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={() => 
                  newTodo.trim() && 
                  createTodoMutation.mutate({ 
                    title: newTodo.trim(), 
                    description: newDescription.trim() 
                  })
                }
                disabled={!newTodo.trim() || createTodoMutation.isPending}
              >
                Hinzufügen
              </Button>
            </div>

            <ul className="space-y-4">
              {todos?.map((todo) => (
                <li
                  key={todo.id}
                  className="flex flex-col gap-2 p-4 hover:bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
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
                        todo.completed ? "line-through text-gray-400" : "font-medium"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                    >
                      Löschen
                    </Button>
                  </div>
                  {todo.description && (
                    <p className="text-sm text-gray-600 ml-10">
                      {todo.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}