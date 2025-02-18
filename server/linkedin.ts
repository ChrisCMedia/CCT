import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import passport from "passport";
import type { Express } from "express";
import { storage } from "./storage";

// LinkedIn API Helper für direkte API-Aufrufe
class LinkedInAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.linkedin.com/v2/${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async sharePost(params: {
    content: string;
    articleUrl?: string | undefined;
    imageUrl?: string | undefined;
    visibility?: string | undefined;
    userId: string;
  }) {
    const payload = {
      author: `urn:li:person:${params.userId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: params.content
          },
          shareMediaCategory: "NONE",
          media: params.imageUrl ? [{
            status: "READY",
            originalUrl: params.imageUrl,
          }] : undefined,
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": params.visibility?.toUpperCase() || "PUBLIC"
      }
    };

    return this.makeRequest('ugcPosts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getPostStatistics(postId: string) {
    const result = await this.makeRequest(`socialActions/${postId}`);

    // Transform the raw data into our analytics format
    return {
      impressionCount: result.totalShares || 0,
      clickCount: result.uniqueImpressionsCount || 0,
      likeCount: result.likesSummary?.totalLikes || 0,
      shareCount: result.sharesSummary?.totalShares || 0,
      commentCount: result.commentsSummary?.totalComments || 0,
      demographicData: result.demographicsSummary || {},
    };
  }
}

export function setupLinkedInAuth(app: Express) {
  if (!process.env.LINKEDIN_CLIENT_ID || !process.env.LINKEDIN_CLIENT_SECRET) {
    console.error("LinkedIn OAuth credentials missing");
    return;
  }

  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/auth/linkedin/callback",
        scope: ["r_liteprofile", "r_emailaddress", "w_member_social"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Suche nach existierendem Social Account
          const existingAccount = await storage.getSocialAccountByPlatformId(
            profile.id,
            "LinkedIn"
          );

          if (existingAccount) {
            // Update tokens
            await storage.updateSocialAccount(existingAccount.id, {
              accessToken,
              refreshToken,
              tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 Stunde
            });
            return done(null, existingAccount);
          }

          // Erstelle neuen Social Account
          const account = await storage.createSocialAccount({
            platform: "LinkedIn",
            accountName: profile.displayName,
            userId: profile._json.id, // Use the numeric ID from profile
            accessToken,
            refreshToken,
            tokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
            platformUserId: profile.id,
          });

          return done(null, account);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // LinkedIn Auth Routes
  app.get("/auth/linkedin", passport.authenticate("linkedin"));

  app.get(
    "/auth/linkedin/callback",
    passport.authenticate("linkedin", {
      failureRedirect: "/auth",
    }),
    async (req, res) => {
      // Nach erfolgreicher Authentifizierung zur Dashboard-Seite
      res.redirect("/");
    }
  );

  // API-Routen für LinkedIn-Integration
  app.post("/api/linkedin/share", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { postId } = req.body;
      const post = await storage.getPost(postId);
      if (!post) return res.status(404).json({ message: "Post nicht gefunden" });

      const account = await storage.getSocialAccount(post.accountId);
      if (!account) {
        return res.status(404).json({ message: "LinkedIn Account nicht gefunden" });
      }

      // LinkedIn API Client mit Account Token initialisieren
      const linkedIn = new LinkedInAPI(account.accessToken!);

      // Post auf LinkedIn veröffentlichen
      const response = await linkedIn.sharePost({
        content: post.content,
        articleUrl: post.articleUrl || undefined,
        imageUrl: post.imageUrl || undefined,
        visibility: post.visibility || undefined,
        userId: account.platformUserId!,
      });

      // Update Post mit LinkedIn Post ID
      await storage.updatePost(postId, {
        content: post.content,
        userId: post.userId,
        platformPostId: response.id,
        publishStatus: "published",
      });

      res.json({ success: true, linkedInPostId: response.id });
    } catch (error) {
      console.error("LinkedIn API Error:", error);
      res.status(500).json({ 
        message: "Fehler beim Teilen auf LinkedIn",
        error: (error as Error).message 
      });
    }
  });

  // Analytics abrufen
  app.get("/api/linkedin/analytics/:postId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const post = await storage.getPost(Number(req.params.postId));
      if (!post) return res.status(404).json({ message: "Post nicht gefunden" });

      const account = await storage.getSocialAccount(post.accountId);
      if (!account) {
        return res.status(404).json({ message: "LinkedIn Account nicht gefunden" });
      }

      const linkedIn = new LinkedInAPI(account.accessToken!);

      // Analytics von LinkedIn abrufen
      const analytics = await linkedIn.getPostStatistics(post.platformPostId!);

      // Analytics in der Datenbank speichern
      await storage.updatePostAnalytics(post.id, {
        impressions: analytics.impressionCount,
        clicks: analytics.clickCount,
        likes: analytics.likeCount,
        shares: analytics.shareCount,
        comments: analytics.commentCount,
        engagementRate: Math.round(
          ((analytics.likeCount + analytics.commentCount + analytics.shareCount) /
            analytics.impressionCount) *
            100
        ),
        demographicData: analytics.demographicData,
        updatedAt: new Date(),
      });

      res.json(analytics);
    } catch (error) {
      console.error("LinkedIn Analytics Error:", error);
      res.status(500).json({ 
        message: "Fehler beim Abrufen der Analytics",
        error: (error as Error).message 
      });
    }
  });
}