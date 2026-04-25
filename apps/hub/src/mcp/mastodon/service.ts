export interface MastodonEnv {
  MASTODON_ACCESS_TOKEN?: string;
  MASTODON_INSTANCE_URL?: string;
}

export class MastodonService {
  private accessToken: string;
  private instanceUrl: string;

  constructor(env: MastodonEnv) {
    this.accessToken = env.MASTODON_ACCESS_TOKEN || "";
    this.instanceUrl = (env.MASTODON_INSTANCE_URL || "").replace(/\/$/, "");
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    if (!this.accessToken || !this.instanceUrl) {
      throw new Error("Mastodon credentials missing. Please provide x-mastodon-access-token and x-mastodon-instance-url headers.");
    }

    const response = await fetch(`${this.instanceUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Mastodon API Error: ${JSON.stringify(error)}`);
    }

    return response.status === 204 ? { success: true } : response.json();
  }

  // Status Tools
  async postStatus(data: { status: string; visibility?: string; spoiler_text?: string; sensitive?: boolean }) {
    return this.fetch("/api/v1/statuses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getStatus(id: string) {
    return this.fetch(`/api/v1/statuses/${id}`);
  }

  async favouriteStatus(id: string) {
    return this.fetch(`/api/v1/statuses/${id}/favourite`, { method: "POST" });
  }

  async unfavouriteStatus(id: string) {
    return this.fetch(`/api/v1/statuses/${id}/unfavourite`, { method: "POST" });
  }

  async bookmarkStatus(id: string) {
    return this.fetch(`/api/v1/statuses/${id}/bookmark`, { method: "POST" });
  }

  async unbookmarkStatus(id: string) {
    return this.fetch(`/api/v1/statuses/${id}/unbookmark`, { method: "POST" });
  }

  // Timeline Tools
  async getHomeTimeline(limit = 20) {
    return this.fetch(`/api/v1/timelines/home?limit=${limit}`);
  }

  async getPublicTimeline(limit = 20, local = false) {
    return this.fetch(`/api/v1/timelines/public?limit=${limit}${local ? "&local=true" : ""}`);
  }

  async getConversations(limit = 20) {
    return this.fetch(`/api/v1/conversations?limit=${limit}`);
  }

  // Search Tool
  async search(query: string, type?: "accounts" | "statuses" | "hashtags", limit = 20) {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    if (type) params.append("type", type);
    return this.fetch(`/api/v2/search?${params.toString()}`);
  }

  // Account Tools
  async followAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/follow`, { method: "POST" });
  }

  async unfollowAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/unfollow`, { method: "POST" });
  }

  async blockAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/block`, { method: "POST" });
  }

  async unblockAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/unblock`, { method: "POST" });
  }

  async muteAccount(id: string, notifications = true, duration = 0) {
    return this.fetch(`/api/v1/accounts/${id}/mute`, { 
      method: "POST",
      body: JSON.stringify({ notifications, duration })
    });
  }

  async unmuteAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/unmute`, { method: "POST" });
  }

  async getAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}`);
  }

  async reportAccount(accountId: string, category: string, comment: string, statusIds?: string[]) {
    return this.fetch("/api/v1/reports", {
      method: "POST",
      body: JSON.stringify({
        account_id: accountId,
        category,
        comment,
        status_ids: statusIds
      })
    });
  }

  // Personal Tools
  async getNotifications(limit = 20) {
    return this.fetch(`/api/v1/notifications?limit=${limit}`);
  }

  async getBookmarks(limit = 20) {
    return this.fetch(`/api/v1/bookmarks?limit=${limit}`);
  }

  async getFavourites(limit = 20) {
    return this.fetch(`/api/v1/favourites?limit=${limit}`);
  }

  // Lists & Filters
  async getLists() {
    return this.fetch("/api/v1/lists");
  }

  async getFilters() {
    return this.fetch("/api/v2/filters");
  }
}
