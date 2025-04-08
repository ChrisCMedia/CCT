import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Todo, User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function TodoPage() {
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const { data: todos } = useQuery<Todo[]>({ 
    queryKey: ["/api/todos"],
    staleTime: 0,
  });

  const { data: users } = useQuery<Omit<User, "password">[]>({
    queryKey: ["/api/users"],
    staleTime: 0,
  });

  const createTodoMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; deadline?: Date; assignedToUserId?: number }) => {
      try {
        const res = await apiRequest("POST", "/api/todos", data);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Fehler beim Erstellen der Aufgabe");
        }
        return await res.json();
      } catch (error) {
        console.error("Fehler beim Erstellen der Aufgabe:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      setNewTodo("");
      setNewDescription("");
      setDeadline(undefined);
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

  const assignTodoMutation = useMutation({
    mutationFn: async ({ id, assignedToUserId }: { id: number; assignedToUserId?: number }) => {
      const res = await apiRequest("PATCH", `/api/todos/${id}`, { assignedToUserId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
      toast({
        title: "Aufgabe zugewiesen",
        description: "Die Aufgabe wurde erfolgreich zugewiesen",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: "Die Aufgabe konnte nicht zugewiesen werden: " + error.message,
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
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP", { locale: de }) : "Deadline wählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                onClick={() => 
                  newTodo.trim() && 
                  createTodoMutation.mutate({ 
                    title: newTodo.trim(), 
                    description: newDescription.trim(),
                    deadline: deadline,
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
                    <Select
                      value={todo.assignedToUserId?.toString()}
                      onValueChange={(value) =>
                        assignTodoMutation.mutate({
                          id: todo.id,
                          assignedToUserId: value ? Number(value) : undefined,
                        })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Benutzer zuweisen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Nicht zugewiesen</SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  {todo.deadline && (
                    <p className="text-sm text-blue-600 ml-10">
                      Deadline: {format(new Date(todo.deadline), "PPP", { locale: de })}
                    </p>
                  )}
                  {todo.assignedTo && (
                    <p className="text-sm text-blue-600 ml-10">
                      Zugewiesen an: {todo.assignedTo.username}
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