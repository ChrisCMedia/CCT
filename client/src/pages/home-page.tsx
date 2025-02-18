import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useQuery } from "@tanstack/react-query";
import { Todo, Post, SocialAccount } from "@shared/schema";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function HomePage() {
  const { data: todos } = useQuery<Todo[]>({ queryKey: ["/api/todos"] });
  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"] });
  const { data: accounts } = useQuery<SocialAccount[]>({ queryKey: ["/api/social-accounts"] });

  const pendingTodos = todos?.filter((todo) => !todo.completed) || [];
  const upcomingPosts = posts?.filter((post) => new Date(post.scheduledDate) > new Date()) || [];

  // Hilfsfunktion um den Account-Namen für einen Post zu finden
  const getAccountName = (accountId: number) => {
    const account = accounts?.find(acc => acc.id === accountId);
    return account ? account.accountName : 'Unbekannter Account';
  };

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Offene Aufgaben</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {pendingTodos.slice(0, 5).map((todo) => (
                  <li key={todo.id} className="text-sm text-gray-600">
                    {todo.title}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geplante Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcomingPosts.slice(0, 5).map((post) => (
                  <li key={post.id} className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {post.content.slice(0, 50)}...
                    </p>
                    <div className="flex gap-2 text-xs text-gray-400">
                      <span>
                        {format(new Date(post.scheduledDate), "dd.MM.yyyy")}
                      </span>
                      <span>•</span>
                      <span>
                        {getAccountName(post.accountId)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kalender</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}