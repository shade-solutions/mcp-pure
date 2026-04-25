export interface MastodonEnv {
  MASTODON_ACCESS_TOKEN?: string;
  MASTODON_INSTANCE_URL?: string;
}

export class MastodonService {
  private accessToken: string;
  private instanceUrl: string;

  constructor(env: MastodonEnv) {
    if (!env.MASTODON_ACCESS_TOKEN) {
      throw new Error("MASTODON_ACCESS_TOKEN is required");
    }
    if (!env.MASTODON_INSTANCE_URL) {
      throw new Error("MASTODON_INSTANCE_URL is required (e.g., https://mastodon.social)");
    }
    this.accessToken = env.MASTODON_ACCESS_TOKEN;
    this.instanceUrl = env.MASTODON_INSTANCE_URL.replace(/\/$/, "");
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
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

  // Timeline Tools
  async getHomeTimeline(limit = 20) {
    return this.fetch(`/api/v1/timelines/home?limit=${limit}`);
  }

  async getPublicTimeline(limit = 20, local = false) {
    return this.fetch(`/api/v1/timelines/public?limit=${limit}${local ? "&local=true" : ""}`);
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

  async blockAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}/block`, { method: "POST" });
  }

  async getAccount(id: string) {
    return this.fetch(`/api/v1/accounts/${id}`);
  }

  // Notifications & Bookmarks
  async getNotifications(limit = 20) {
    return this.fetch(`/api/v1/notifications?limit=${limit}`);
  }

  async getBookmarks(limit = 20) {
    return this.fetch(`/api/v1/bookmarks?limit=${limit}`);
  }
}
