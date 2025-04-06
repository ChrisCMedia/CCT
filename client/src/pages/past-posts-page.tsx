import { useQuery } from "@tanstack/react-query";
import { Post, SocialAccount, User } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isBefore, formatDistance } from "date-fns";
import { de } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Linkedin } from "lucide-react";

export default function PastPostsPage() {
  const today = new Date();

  const { data: posts } = useQuery<(Post & { account: SocialAccount; lastEditedBy?: User })[]>({
    queryKey: ["/api/posts"],
  });

  // Filtere nur vergangene Posts (Datum liegt in der Vergangenheit)
  const pastPosts = posts?.filter(post => 
    isBefore(new Date(post.scheduledDate), today)
  ).sort((a, b) => 
    new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Vergangene Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {pastPosts?.length === 0 && (
              <p className="text-gray-500 text-center py-6">Keine vergangenen Posts gefunden.</p>
            )}
            
            <div className="space-y-4">
              {pastPosts?.map((post) => (
                <div key={post.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                      {post.account?.accountName || "Unbekannter Account"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {post.platformPostId && (
                        <Badge variant="secondary">
                          Veröffentlicht
                        </Badge>
                      )}
                      {post.account?.platform === "LinkedIn" && post.approved && (
                        <Badge className="bg-[#0077B5] text-white">
                          <Linkedin className="h-3 w-3 mr-1" />
                          LinkedIn
                        </Badge>
                      )}
                    </div>
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
                      Veröffentlicht am: {format(new Date(post.scheduledDate), "dd.MM.yyyy")}
                      {post.lastEditedAt && post.lastEditedBy && (
                        <>
                          <span>•</span>
                          <span>
                            Bearbeitet von{" "}
                            <span className="font-semibold text-primary">
                              {post.lastEditedBy.username}
                            </span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 