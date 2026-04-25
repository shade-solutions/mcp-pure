export interface TumblrEnv {
  TUMBLR_ACCESS_TOKEN?: string;
}

export class TumblrService {
  private accessToken: string;
  private baseUrl = "https://api.tumblr.com/v2";

  constructor(env: TumblrEnv) {
    if (!env.TUMBLR_ACCESS_TOKEN) {
      throw new Error("TUMBLR_ACCESS_TOKEN is required");
    }
    this.accessToken = env.TUMBLR_ACCESS_TOKEN;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Tumblr API Error: ${JSON.stringify(error)}`);
    }

    return response.json();
  }

  // Post Tools
  async createPost(blogIdentifier: string, content: any[], tags?: string[], state?: string) {
    return this.fetch(`/blog/${blogIdentifier}/posts`, {
      method: "POST",
      body: JSON.stringify({
        content,
        tags,
        state: state || "published",
      }),
    });
  }

  async getBlogPosts(blogIdentifier: string, limit = 20) {
    return this.fetch(`/blog/${blogIdentifier}/posts?limit=${limit}`);
  }

  // User Tools
  async getDashboard(limit = 20, type?: string) {
    let url = `/user/dashboard?limit=${limit}`;
    if (type) url += `&type=${type}`;
    return this.fetch(url);
  }

  async likePost(id: string, reblogKey: string) {
    return this.fetch("/user/like", {
      method: "POST",
      body: JSON.stringify({ id, reblog_key: reblogKey }),
    });
  }

  async followBlog(blogIdentifier: string) {
    return this.fetch("/user/follow", {
      method: "POST",
      body: JSON.stringify({ url: blogIdentifier }),
    });
  }

  // Search Tool
  async searchTagged(tag: string, limit = 20) {
    return this.fetch(`/tagged?tag=${encodeURIComponent(tag)}&limit=${limit}`);
  }
}
