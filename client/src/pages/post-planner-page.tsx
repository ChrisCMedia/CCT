import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Post, SocialAccount, User, PostComment } from "@shared/schema";
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
import { Image, Linkedin, Pencil, MessageCircle, Send } from "lucide-react";
import { formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [showDeletedPosts, setShowDeletedPosts] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [viewingComments, setViewingComments] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");

  const { data: posts } = useQuery<(Post & { account: SocialAccount; lastEditedBy?: User })[]>({
    queryKey: ["/api/posts"],
  });
  const { data: accounts } = useQuery<SocialAccount[]>({ queryKey: ["/api/social-accounts"] });
  const { data: deletedPosts } = useQuery<(Post & { account: SocialAccount; lastEditedBy?: User })[]>({
    queryKey: ["/api/posts/deleted"],
    enabled: showDeletedPosts,
  });
  const { data: comments, refetch: refetchComments } = useQuery<(PostComment & { user: User })[]>({
    queryKey: [`/api/posts/${viewingComments}/comments`],
    enabled: viewingComments !== null,
  });

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

    console.log(`Bild ausgewählt: ${file.name}, Größe: ${file.size} Bytes, Typ: ${file.type}`);

    if (isEditing) {
      setEditingImage(file);
      const url = URL.createObjectURL(file);
      setEditingPreviewUrl(url);
      console.log("Vorschau-URL für Bearbeitung erstellt:", url);
    } else {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      console.log("Vorschau-URL erstellt:", url);
    }
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; scheduledDate: Date; accountIds: number[]; image?: File }) => {
      console.log("Starte Post-Erstellung mit Daten:", {
        content: data.content.substring(0, 50) + (data.content.length > 50 ? "..." : ""),
        scheduledDate: data.scheduledDate,
        accountIds: data.accountIds,
        hasImage: !!data.image
      });

      const formData = new FormData();
      formData.append("content", data.content);
      formData.append("scheduledDate", data.scheduledDate.toISOString());
      
      if (data.accountIds.length > 0) {
        data.accountIds.forEach(id => {
          formData.append("accountIds[]", id.toString());
        });
        console.log("Account IDs für Request:", data.accountIds);
      }
      
      if (data.image) {
        console.log("Füge Bild zum Upload hinzu:", data.image.name, data.image.size, data.image.type);
        formData.append("image", data.image);
      } else {
        console.log("Kein Bild für Upload ausgewählt");
      }

      // Logge FormData-Einträge zur Überprüfung
      console.log("FormData-Einträge:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? 'File: ' + pair[1].name : pair[1]}`);
      }

      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Unbekannter Fehler" }));
          console.error("Post-Erstellung fehlgeschlagen:", errorData);
          throw new Error(errorData.message || "Fehler beim Erstellen des Posts");
        }

        return res.json();
      } catch (error) {
        console.error("Netzwerk- oder Serverfehler:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setContent("");
      setSelectedDate(undefined);
      setSelectedAccount(undefined);
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      toast({
        title: "Post erstellt",
        description: "Ihr Post wurde erfolgreich geplant",
      });
    },
    onError: (error: Error) => {
      console.error("Post-Erstellung fehlgeschlagen:", error);
      toast({
        title: "Fehler",
        description: `Der Post konnte nicht erstellt werden: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const formData = new FormData();
      formData.append("content", updates.content);
      formData.append("scheduledDate", updates.scheduledDate.toISOString());
      if (updates.accountId) {
        formData.append("accountId", updates.accountId.toString());
      }
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
      formData.append("scheduledInLinkedIn", updates.scheduledInLinkedIn ? 'true' : 'false');

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
      if (editingPreviewUrl) {
        URL.revokeObjectURL(editingPreviewUrl);
      }
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
      queryClient.invalidateQueries({ queryKey: ["/api/posts/deleted"] });
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

  const restorePostMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/posts/${id}/restore`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts/deleted"] });
      toast({
        title: "Post wiederhergestellt",
        description: "Der Post wurde erfolgreich wiederhergestellt",
      });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, postId }: { content: string; postId: number }) => {
      const res = await apiRequest("POST", `/api/posts/${postId}/comments`, { content });
      return res.json();
    },
    onSuccess: () => {
      setNewComment("");
      refetchComments();
      toast({
        title: "Kommentar erstellt",
        description: "Ihr Kommentar wurde erfolgreich hinzugefügt",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("DELETE", `/api/comments/${commentId}`);
    },
    onSuccess: () => {
      refetchComments();
      toast({
        title: "Kommentar gelöscht",
        description: "Der Kommentar wurde erfolgreich gelöscht",
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
                        {post.account?.accountName}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {post.scheduledInLinkedIn && (
                          <Badge variant="secondary" className="bg-green-100">
                            ✓ Geplant
                          </Badge>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => setEditingPost(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{post.content}</p>
                    {(post.imageData || post.imageUrl) && (
                      <img
                        src={post.imageData || post.imageUrl}
                        alt="Post Bild"
                        className="rounded-lg mt-2 w-full object-cover aspect-video"
                        onError={(e) => {
                          console.error("Bildfehler beim Laden von Post", post.id, ":");
                          console.error("Bild-Daten vorhanden:", !!post.imageData);
                          if (post.imageData) {
                            console.error("Base64 Länge:", post.imageData.length);
                            console.error("Base64 Vorschau:", post.imageData.substring(0, 50) + "...");
                            console.error("Base64 Format korrekt:", post.imageData.startsWith("data:"));
                          }
                          console.error("Image URL vorhanden:", !!post.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
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
                        variant="outline"
                        onClick={() => setViewingComments(post.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Kommentare
                      </Button>
                      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setPostToDelete(post)}
                        >
                          Löschen
                        </Button>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Post löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie diesen Post wirklich löschen?
                              Sie können gelöschte Posts später wiederherstellen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (postToDelete) {
                                  deletePostMutation.mutate(postToDelete.id);
                                  setPostToDelete(null);
                                }
                              }}
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && resetEditingState()}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
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
                    value={editingPost.visibility || "public"}
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
                    value={editingPost.postType || "post"}
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

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="scheduled-in-linkedin"
                    checked={editingPost.scheduledInLinkedIn || false}
                    onCheckedChange={(checked) => 
                      setEditingPost({ ...editingPost, scheduledInLinkedIn: !!checked })
                    }
                  />
                  <label
                    htmlFor="scheduled-in-linkedin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In LinkedIn geplant
                  </label>
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
                        scheduledInLinkedIn: editingPost.scheduledInLinkedIn,
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

      <Dialog open={viewingComments !== null} onOpenChange={(open) => !open && setViewingComments(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kommentare</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2">
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {comment.user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{comment.user.username}</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          className="h-7 px-2"
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(comment.createdAt), "PPp")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Noch keine Kommentare vorhanden
                </p>
              )}
            </div>
            
            <Separator />
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Schreiben Sie einen Kommentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button 
                className="self-end"
                disabled={!newComment.trim() || createCommentMutation.isPending}
                onClick={() => {
                  if (viewingComments && newComment.trim()) {
                    createCommentMutation.mutate({
                      content: newComment,
                      postId: viewingComments
                    });
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => setShowDeletedPosts(!showDeletedPosts)}
        >
          {showDeletedPosts ? "Gelöschte Posts ausblenden" : "Gelöschte Posts anzeigen"}
        </Button>

        {showDeletedPosts && deletedPosts && deletedPosts.length > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="text-lg font-semibold">Gelöschte Posts</h3>
            {deletedPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="mb-2">
                    {post.account?.accountName}
                  </Badge>
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
                  <div className="text-gray-400">
                    Geplant für: {format(new Date(post.scheduledDate), "PP")}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => restorePostMutation.mutate(post.id)}
                >
                  Wiederherstellen
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}