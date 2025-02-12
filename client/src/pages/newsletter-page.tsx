import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Newsletter } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function NewsletterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const { data: newsletters } = useQuery<Newsletter[]>({ 
    queryKey: ["/api/newsletters"] 
  });

  const createNewsletterMutation = useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await apiRequest("POST", "/api/newsletters", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletters"] });
      setTitle("");
      setContent("");
      toast({
        title: "Newsletter created",
        description: "Your newsletter input has been saved",
      });
    },
  });

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Newsletter Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Newsletter Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter newsletter title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Newsletter Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your newsletter content..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (title && content) {
                      createNewsletterMutation.mutate({ title, content });
                    }
                  }}
                  disabled={!title || !content || createNewsletterMutation.isPending}
                >
                  Save Newsletter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Previous Newsletter Inputs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsletters?.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <h3 className="font-medium">{newsletter.title}</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {newsletter.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
