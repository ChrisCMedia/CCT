import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Post, SocialAccount, User } from "@shared/schema";
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
import { Image, Linkedin, Pencil } from "lucide-react";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in Bytes

const POST_TYPES = [
  { value: "post", label: "Standard Post" },
  { value: "article", label: "Artikel" },
  { value: "poll", label: "Umfrage" },
];

const VISIBILITIES = [
  { value: "public", label: "Öffentlich" },
  { value: "connections", label: "Nur Verbindungen" },
  { value: "private", label: "Privat" },
];

export default function PostPlannerPage() {
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingDate, setEditingDate] = useState<Date>();
  const [editingAccount, setEditingAccount] = useState<string>();
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editingPreviewUrl, setEditingPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: posts } = useQuery<(Post & { account: SocialAccount; lastEditedBy?: User })[]>({
    queryKey: ["/api/posts"],
  });
  const { data: accounts } = useQuery<SocialAccount[]>({ queryKey: ["/api/social-accounts"] });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
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

    if (isEditing) {
      setEditingImage(file);
      const url = URL.createObjectURL(file);
      setEditingPreviewUrl(url);
    } else {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; scheduledDate: Date; accountIds: number[]; image?: File }) => {
      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("scheduledDate", data.scheduledDate.toISOString());
      data.accountIds.forEach((id) => formData.append("accountIds[]", id.toString()));
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

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const formData = new FormData();

      // Ensure content is always sent
      formData.append("content", updates.content);

      // Convert and append scheduledDate if it exists
      if (updates.scheduledDate) {
        formData.append("scheduledDate", updates.scheduledDate.toISOString());
      }

      // Convert and append accountId if it exists
      if (updates.accountId) {
        formData.append("accountId", updates.accountId.toString());
      }

      // Append other fields if they exist
      if (updates.image) {
        formData.append("image", updates.image);
      }

      if (updates.visibility) {
        formData.append("visibility", updates.visibility);
      }

      if (updates.postType) {
        formData.append("postType", updates.postType);
      }

      if (updates.articleUrl) {
        formData.append("articleUrl", updates.articleUrl);
      }

      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Fehler beim Aktualisieren des Posts");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      resetEditingState();
      toast({
        title: "Post aktualisiert",
        description: "Der Post wurde erfolgreich aktualisiert",
      });
    },
  });

  const resetEditingState = () => {
    setEditingPost(null);
    setEditingDate(undefined);
    setEditingAccount(undefined);
    setEditingImage(null);
    setEditingPreviewUrl(null);
  };

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

  const unapprovePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/posts/${id}/unapprove`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Genehmigung zurückgezogen",
        description: "Die Genehmigung des Posts wurde zurückgezogen",
      });
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
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
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
                  <div key={post.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="mb-2">
                        {post.account?.platform}
                      </Badge>
                      <Button size="icon" variant="ghost" onClick={() => setEditingPost(post)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{post.content}</p>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post Bild"
                        className="rounded-lg mt-2 w-full object-cover aspect-video"
                      />
                    )}
                    <div className="text-xs space-y-1">
                      <div className="text-gray-400 flex items-center gap-2">
                        Geplant für: {format(new Date(post.scheduledDate), "PP")}
                        {post.lastEditedAt && post.lastEditedBy && (
                          <>
                            <span>•</span>
                            <span>
                              Bearbeitet von{" "}
                              <span className="font-semibold text-primary">
                                {post.lastEditedBy.username}
                              </span>{" "}
                              {formatDistance(new Date(post.lastEditedAt), new Date(), {
                                locale: de,
                                addSuffix: true,
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {post.approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unapprovePostMutation.mutate(post.id)}
                        >
                          Genehmigung zurückziehen
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => approvePostMutation.mutate(post.id)}>
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

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && resetEditingState()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post bearbeiten</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editingPost?.content || ""}
              onChange={(e) =>
                setEditingPost(editingPost ? { ...editingPost, content: e.target.value } : null)
              }
              rows={8}
            />

            <div className="space-y-2">
              <Label>Account</Label>
              <Select
                value={editingAccount || editingPost?.accountId?.toString()}
                onValueChange={setEditingAccount}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Account auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      <div className="flex items-center gap-2">
                        {account.platform === "LinkedIn" && <Linkedin className="h-4 w-4" />}
                        {account.accountName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Veröffentlichungsdatum</Label>
              <Calendar
                mode="single"
                selected={editingDate || (editingPost ? new Date(editingPost.scheduledDate) : undefined)}
                onSelect={setEditingDate}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <Label>Bild</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, true)}
                className="cursor-pointer"
              />
              {(editingPreviewUrl || editingPost?.imageUrl) && (
                <div className="mt-2 relative w-full aspect-video">
                  <img
                    src={editingPreviewUrl || editingPost?.imageUrl}
                    alt="Vorschau"
                    className="rounded-lg object-cover w-full h-full"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setEditingImage(null);
                      setEditingPreviewUrl(null);
                      if (editingPost) {
                        setEditingPost({ ...editingPost, imageUrl: null });
                      }
                    }}
                  >
                    Entfernen
                  </Button>
                </div>
              )}
            </div>

            {/* LinkedIn spezifische Optionen */}
            {editingPost?.account?.platform === "LinkedIn" && (
              <>
                <div className="space-y-2">
                  <Label>Sichtbarkeit</Label>
                  <Select
                    value={editingPost.visibility}
                    onValueChange={(value) =>
                      setEditingPost(editingPost ? { ...editingPost, visibility: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sichtbarkeit wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {VISIBILITIES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Post-Typ</Label>
                  <Select
                    value={editingPost.postType}
                    onValueChange={(value) =>
                      setEditingPost(editingPost ? { ...editingPost, postType: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Post-Typ wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_TYPES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {editingPost.postType === "article" && (
                  <div className="space-y-2">
                    <Label>Artikel-URL</Label>
                    <Input
                      type="url"
                      value={editingPost.articleUrl || ""}
                      onChange={(e) =>
                        setEditingPost({ ...editingPost, articleUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetEditingState}>
                Abbrechen
              </Button>
              <Button
                onClick={() => {
                  if (editingPost) {
                    updatePostMutation.mutate({
                      id: editingPost.id,
                      updates: {
                        content: editingPost.content,
                        scheduledDate: editingDate || new Date(editingPost.scheduledDate),
                        accountId: editingAccount ? Number(editingAccount) : editingPost.accountId,
                        image: editingImage,
                        visibility: editingPost.visibility,
                        postType: editingPost.postType,
                        articleUrl: editingPost.articleUrl,
                      },
                    });
                  }
                }}
                disabled={updatePostMutation.isPending}
              >
                Speichern
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}