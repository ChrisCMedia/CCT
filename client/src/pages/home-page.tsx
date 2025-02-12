import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useQuery } from "@tanstack/react-query";
import { Todo, Post } from "@shared/schema";
import { Calendar } from "@/components/ui/calendar";

export default function HomePage() {
  const { data: todos } = useQuery<Todo[]>({ queryKey: ["/api/todos"] });
  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"] });

  const pendingTodos = todos?.filter((todo) => !todo.completed) || [];
  const upcomingPosts = posts?.filter((post) => new Date(post.scheduledDate) > new Date()) || [];

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
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
              <CardTitle>Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {upcomingPosts.slice(0, 5).map((post) => (
                  <li key={post.id} className="text-sm text-gray-600">
                    {post.content.slice(0, 50)}...
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
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
