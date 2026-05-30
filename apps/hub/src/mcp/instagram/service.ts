export interface InstagramEnv {
  INSTAGRAM_ACCESS_TOKEN?: string;
  INSTAGRAM_USER_ID?: string;
}

interface RequestOptions {
  method?: "GET" | "POST" | "DELETE";
  params?: Record<string, string | number | boolean | undefined>;
  body?: any;
}

/**
 * Instagram MCP backed by the Instagram Graph API (Business/Creator accounts).
 * Auth: a long-lived access token plus the IG Business Account ID.
 */
export class InstagramService {
  private accessToken: string;
  private userId: string;
  private baseUrl = "https://graph.facebook.com/v21.0";

  constructor(env: InstagramEnv) {
    this.accessToken = env.INSTAGRAM_ACCESS_TOKEN || "";
    this.userId = env.INSTAGRAM_USER_ID || "";
  }

  private requireUserId() {
    if (!this.userId) {
      throw new Error(
        "Instagram User ID missing. Provide the x-instagram-user-id header (your IG Business Account ID)."
      );
    }
    return this.userId;
  }

  private async fetch(path: string, opts: RequestOptions = {}) {
    if (!this.accessToken) {
      throw new Error(
        "Instagram Access Token missing. Provide the x-instagram-access-token header."
      );
    }

    const { method = "GET", params = {}, body } = opts;
    const url = new URL(`${this.baseUrl}/${path.replace(/^\//, "")}`);
    url.searchParams.set("access_token", this.accessToken);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }

    const init: RequestInit = { method };
    if (body !== undefined) {
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url.toString(), init);
    const data: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Instagram API Error: ${JSON.stringify(data.error || data)}`);
    }
    return data;
  }

  // ----- Identity & Account -----
  async whoami() {
    const id = this.requireUserId();
    return this.fetch(id, {
      params: {
        fields:
          "id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url",
      },
    });
  }

  async getAccountInsights(metrics: string, period = "day") {
    const id = this.requireUserId();
    return this.fetch(`${id}/insights`, {
      params: { metric: metrics, period },
    });
  }

  // ----- Media (read) -----
  async listMyMedia(limit = 25) {
    const id = this.requireUserId();
    return this.fetch(`${id}/media`, {
      params: {
        fields:
          "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count",
        limit,
      },
    });
  }

  async getMediaDetails(mediaId: string) {
    return this.fetch(mediaId, {
      params: {
        fields:
          "id,caption,media_type,media_product_type,media_url,permalink,thumbnail_url,timestamp,username,like_count,comments_count,owner",
      },
    });
  }

  async getMediaInsights(mediaId: string, metrics = "reach,likes,comments,saved,shares") {
    return this.fetch(`${mediaId}/insights`, { params: { metric: metrics } });
  }

  // ----- Publishing (two-step: container -> publish) -----
  private async createContainer(params: Record<string, string | number | boolean | undefined>) {
    const id = this.requireUserId();
    return this.fetch(`${id}/media`, { method: "POST", params });
  }

  private async publishContainer(creationId: string) {
    const id = this.requireUserId();
    return this.fetch(`${id}/media_publish`, {
      method: "POST",
      params: { creation_id: creationId },
    });
  }

  async publishPhoto(imageUrl: string, caption?: string) {
    const container = await this.createContainer({ image_url: imageUrl, caption });
    return this.publishContainer(container.id);
  }

  async publishReel(videoUrl: string, caption?: string, coverUrl?: string) {
    const container = await this.createContainer({
      media_type: "REELS",
      video_url: videoUrl,
      caption,
      cover_url: coverUrl,
    });
    return this.publishContainer(container.id);
  }

  async publishStory(mediaUrl: string, isVideo = false) {
    const container = await this.createContainer(
      isVideo
        ? { media_type: "STORIES", video_url: mediaUrl }
        : { media_type: "STORIES", image_url: mediaUrl }
    );
    return this.publishContainer(container.id);
  }

  async getPublishingLimit() {
    const id = this.requireUserId();
    return this.fetch(`${id}/content_publishing_limit`, {
      params: { fields: "config,quota_usage" },
    });
  }

  // ----- Comments & Replies -----
  async listMediaComments(mediaId: string, limit = 25) {
    return this.fetch(`${mediaId}/comments`, {
      params: {
        fields: "id,text,username,timestamp,like_count,replies{id,text,username,timestamp}",
        limit,
      },
    });
  }

  async getCommentReplies(commentId: string, limit = 25) {
    return this.fetch(`${commentId}/replies`, {
      params: { fields: "id,text,username,timestamp,like_count", limit },
    });
  }

  async createComment(mediaId: string, message: string) {
    return this.fetch(`${mediaId}/comments`, {
      method: "POST",
      params: { message },
    });
  }

  async replyToComment(commentId: string, message: string) {
    return this.fetch(`${commentId}/replies`, {
      method: "POST",
      params: { message },
    });
  }

  async hideComment(commentId: string, hide = true) {
    return this.fetch(commentId, { method: "POST", params: { hide } });
  }

  async deleteComment(commentId: string) {
    return this.fetch(commentId, { method: "DELETE" });
  }

  async getMentionedMedia(limit = 25) {
    const id = this.requireUserId();
    return this.fetch(`${id}/tags`, {
      params: {
        fields:
          "id,caption,media_type,media_url,permalink,timestamp,username,like_count,comments_count",
        limit,
      },
    });
  }

  // ----- Direct Messages (Instagram Messaging API) -----
  async listConversations(limit = 25) {
    const id = this.requireUserId();
    return this.fetch(`${id}/conversations`, {
      params: {
        platform: "instagram",
        fields: "id,updated_time,participants",
        limit,
      },
    });
  }

  async getConversationMessages(conversationId: string, limit = 25) {
    return this.fetch(conversationId, {
      params: {
        fields: "messages{id,created_time,from,to,message}",
        limit,
      },
    });
  }

  async sendDirectMessage(recipientId: string, text: string) {
    const id = this.requireUserId();
    return this.fetch(`${id}/messages`, {
      method: "POST",
      body: {
        recipient: { id: recipientId },
        message: { text },
      },
    });
  }

  async sendDirectImage(recipientId: string, imageUrl: string) {
    const id = this.requireUserId();
    return this.fetch(`${id}/messages`, {
      method: "POST",
      body: {
        recipient: { id: recipientId },
        message: {
          attachment: { type: "image", payload: { url: imageUrl } },
        },
      },
    });
  }

  async reactToMessage(recipientId: string, messageId: string, reaction = "love") {
    const id = this.requireUserId();
    return this.fetch(`${id}/messages`, {
      method: "POST",
      body: {
        recipient: { id: recipientId },
        sender_action: "react",
        payload: { message_id: messageId, reaction },
      },
    });
  }

  // ----- Search (Hashtags) -----
  async searchHashtag(query: string) {
    const id = this.requireUserId();
    return this.fetch("ig_hashtag_search", { params: { user_id: id, q: query } });
  }

  async getHashtagRecentMedia(hashtagId: string, limit = 25) {
    const id = this.requireUserId();
    return this.fetch(`${hashtagId}/recent_media`, {
      params: {
        user_id: id,
        fields: "id,caption,media_type,permalink,like_count,comments_count,timestamp",
        limit,
      },
    });
  }

  async getHashtagTopMedia(hashtagId: string, limit = 25) {
    const id = this.requireUserId();
    return this.fetch(`${hashtagId}/top_media`, {
      params: {
        user_id: id,
        fields: "id,caption,media_type,permalink,like_count,comments_count,timestamp",
        limit,
      },
    });
  }

  // ----- Lead Generation -----
  /**
   * Pull a public Business/Creator profile by username via business_discovery.
   * Returns bio, follower counts, and recent media engagement.
   */
  async discoverBusinessProfile(username: string, mediaLimit = 10) {
    const id = this.requireUserId();
    const fields = `business_discovery.username(${username}){id,username,name,biography,website,followers_count,follows_count,media_count,profile_picture_url,media.limit(${mediaLimit}){id,caption,media_type,permalink,like_count,comments_count,timestamp}}`;
    return this.fetch(id, { params: { fields } });
  }

  /**
   * Lead finder: search a hashtag, pull top/recent posts, and surface the
   * authoring usernames plus engagement so prospects can be ranked.
   */
  async findLeadsByHashtag(query: string, opts: { strategy?: "top" | "recent"; limit?: number } = {}) {
    const { strategy = "top", limit = 25 } = opts;
    const search = await this.searchHashtag(query);
    const hashtagId = search?.data?.[0]?.id;
    if (!hashtagId) {
      return { query, hashtag_id: null, leads: [], note: "No hashtag matched the query." };
    }

    const media =
      strategy === "recent"
        ? await this.getHashtagRecentMedia(hashtagId, limit)
        : await this.getHashtagTopMedia(hashtagId, limit);

    const leads = (media?.data || []).map((post: any) => ({
      media_id: post.id,
      permalink: post.permalink,
      caption: post.caption,
      media_type: post.media_type,
      like_count: post.like_count ?? 0,
      comments_count: post.comments_count ?? 0,
      engagement: (post.like_count ?? 0) + (post.comments_count ?? 0),
      timestamp: post.timestamp,
    }));

    leads.sort((a: any, b: any) => b.engagement - a.engagement);
    return { query, hashtag_id: hashtagId, strategy, lead_count: leads.length, leads };
  }

  /**
   * Lead finder: extract the unique commenters on a high-traffic post.
   * These are engaged users worth reaching out to.
   */
  async findLeadsFromCommenters(mediaId: string, limit = 50) {
    const result = await this.listMediaComments(mediaId, limit);
    const seen = new Map<string, any>();
    for (const comment of result?.data || []) {
      if (!comment.username) continue;
      const existing = seen.get(comment.username);
      if (existing) {
        existing.comment_count += 1;
      } else {
        seen.set(comment.username, {
          username: comment.username,
          last_comment: comment.text,
          comment_count: 1,
        });
      }
    }
    const leads = Array.from(seen.values()).sort((a, b) => b.comment_count - a.comment_count);
    return { media_id: mediaId, lead_count: leads.length, leads };
  }
}
