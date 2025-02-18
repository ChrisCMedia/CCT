import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Post, SocialAccount } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Image } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in Bytes

export default function PostPlannerPage() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: posts } = useQuery<Post[]>({ queryKey: ["/api/posts"] });
  const { data: accounts } = useQuery<SocialAccount[]>({ queryKey: ["/api/social-accounts"] });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fehler",
        description: "Die Datei ist zu groß. Maximum ist 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    // Erstelle eine URL für die Vorschau
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; scheduledDate: Date; accountIds: number[]; image?: File }) => {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("scheduledDate", data.scheduledDate.toISOString());
      data.accountIds.forEach(id => formData.append("accountIds[]", id.toString()));
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Fehler beim Erstellen des Posts");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setSelectedDate(undefined);
      setSelectedAccount(undefined);
      setSelectedImage(null);
      setPreviewUrl(null);
      toast({
        title: "Post erstellt",
        description: "Ihr Post wurde erfolgreich geplant",
      });
    },
  });

  const approvePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/posts/${id}/approve`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post genehmigt",
        description: "Der Post wurde zur Veröffentlichung freigegeben",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Neuen Post erstellen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Schreiben Sie Ihren Post-Inhalt..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                />

                <div className="space-y-2">
                  <Label>Account auswählen</Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={setSelectedAccount}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Bild hinzufügen (max. 5MB)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {previewUrl && (
                    <div className="mt-2 relative w-full aspect-video">
                      <img
                        src={previewUrl}
                        alt="Vorschau"
                        className="rounded-lg object-cover w-full h-full"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setSelectedImage(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Entfernen
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    if (content && selectedDate && selectedAccount) {
                      createPostMutation.mutate({
                        content,
                        scheduledDate: selectedDate,
                        accountIds: [parseInt(selectedAccount)],
                        image: selectedImage || undefined,
                      });
                    }
                  }}
                  disabled={!content || !selectedDate || !selectedAccount || createPostMutation.isPending}
                >
                  Post planen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geplante Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <p className="text-sm text-gray-600">{post.content}</p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post Bild"
                        className="rounded-lg mt-2 w-full object-cover aspect-video"
                      />
                    )}
                    <div className="text-xs text-gray-400">
                      Geplant für: {format(new Date(post.scheduledDate), "PPP")}
                    </div>
                    <div className="flex gap-2">
                      {!post.approved && (
                        <Button
                          size="sm"
                          onClick={() => approvePostMutation.mutate(post.id)}
                        >
                          Genehmigen
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePostMutation.mutate(post.id)}
                      >
                        Löschen
                      </Button>
                    </div>
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