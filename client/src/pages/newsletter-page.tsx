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
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function NewsletterPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
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
        title: "Newsletter erstellt",
        description: "Der Newsletter wurde erfolgreich gespeichert",
      });
    },
  });

  const updateNewsletterMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; content: string } }) => {
      const res = await apiRequest("PATCH", `/api/newsletters/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletters"] });
      setEditingNewsletter(null);
      toast({
        title: "Newsletter aktualisiert",
        description: "Der Newsletter wurde erfolgreich aktualisiert",
      });
    },
  });

  const deleteNewsletterMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/newsletters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletters"] });
      toast({
        title: "Newsletter gelöscht",
        description: "Der Newsletter wurde erfolgreich gelöscht",
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
              <CardTitle>Newsletter erstellen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Newsletter Titel</Label>
                  <Input
                    id="title"
                    placeholder="Titel eingeben..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Newsletter Inhalt</Label>
                  <Textarea
                    id="content"
                    placeholder="Inhalt eingeben..."
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
                  Newsletter speichern
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gespeicherte Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsletters?.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{newsletter.title}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingNewsletter(newsletter)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteNewsletterMutation.mutate(newsletter.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
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

      <Dialog open={!!editingNewsletter} onOpenChange={() => setEditingNewsletter(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Newsletter bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Titel</Label>
              <Input
                id="edit-title"
                value={editingNewsletter?.title || ""}
                onChange={(e) =>
                  setEditingNewsletter(
                    editingNewsletter
                      ? { ...editingNewsletter, title: e.target.value }
                      : null
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Inhalt</Label>
              <Textarea
                id="edit-content"
                value={editingNewsletter?.content || ""}
                onChange={(e) =>
                  setEditingNewsletter(
                    editingNewsletter
                      ? { ...editingNewsletter, content: e.target.value }
                      : null
                  )
                }
                rows={8}
              />
            </div>
            <Button
              onClick={() => {
                if (editingNewsletter) {
                  updateNewsletterMutation.mutate({
                    id: editingNewsletter.id,
                    data: {
                      title: editingNewsletter.title,
                      content: editingNewsletter.content,
                    },
                  });
                }
              }}
              disabled={updateNewsletterMutation.isPending}
            >
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}