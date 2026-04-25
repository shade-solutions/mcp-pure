export interface TumblrEnv {
  TUMBLR_ACCESS_TOKEN?: string; // OAuth 2.0
  TUMBLR_CONSUMER_KEY?: string; // OAuth 1.0a
  TUMBLR_CONSUMER_SECRET?: string;
  TUMBLR_TOKEN?: string;
  TUMBLR_TOKEN_SECRET?: string;
}

export class TumblrService {
  private accessToken?: string;
  private consumerKey?: string;
  private consumerSecret?: string;
  private token?: string;
  private tokenSecret?: string;
  private baseUrl = "https://api.tumblr.com/v2";

  constructor(env: TumblrEnv) {
    this.accessToken = env.TUMBLR_ACCESS_TOKEN;
    this.consumerKey = env.TUMBLR_CONSUMER_KEY;
    this.consumerSecret = env.TUMBLR_CONSUMER_SECRET;
    this.token = env.TUMBLR_TOKEN;
    this.tokenSecret = env.TUMBLR_TOKEN_SECRET;
  }

  private async getAuthHeader(method: string, url: string, params: Record<string, string> = {}) {
    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    }

    if (this.consumerKey && this.consumerSecret && this.token && this.tokenSecret) {
      // OAuth 1.0a signing (Simplified for Cloudflare Workers)
      // Note: Full OAuth 1.0a signing is complex. We'll use a basic implementation or
      // suggest OAuth 2.0 if this becomes a bottleneck. 
      // For now, we'll implement a minimal signer.
      return this.signOAuth1(method, url, params);
    }

    throw new Error("Tumblr credentials missing. Provide TUMBRL_ACCESS_TOKEN (OAuth 2.0) or 4 OAuth 1.0a keys.");
  }

  private async signOAuth1(method: string, url: string, params: Record<string, string> = {}) {
    const nonce = Math.random().toString(36).substring(2);
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.consumerKey!,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: this.token!,
      oauth_version: "1.0",
      ...params,
    };

    const sortedKeys = Object.keys(oauthParams).sort();
    const baseString = sortedKeys
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
      .join("&");

    const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(baseString)}`;
    const signingKey = `${encodeURIComponent(this.consumerSecret!)}&${encodeURIComponent(this.tokenSecret!)}`;

    const signature = await this.hmacSha1(signingKey, signatureBase);
    oauthParams.oauth_signature = signature;

    const authHeader = "OAuth " + Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(", ");

    return authHeader;
  }

  private async hmacSha1(key: string, data: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const msgData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const cleanUrl = url.split("?")[0];
    
    // Extract query params for signing
    const queryParams: Record<string, string> = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    const authHeader = await this.getAuthHeader(options.method || "GET", cleanUrl, queryParams);

    const response = await fetch(url, {
      ...options,
      headers: {
        "Authorization": authHeader,
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

  async unlikePost(id: string, reblogKey: string) {
    return this.fetch("/user/unlike", {
      method: "POST",
      body: JSON.stringify({ id, reblog_key: reblogKey }),
    });
  }

  async reblogPost(blogIdentifier: string, id: string, reblogKey: string, comment?: string) {
    return this.fetch(`/blog/${blogIdentifier}/post/reblog`, {
      method: "POST",
      body: JSON.stringify({ id, reblog_key: reblogKey, comment }),
    });
  }

  async deletePost(blogIdentifier: string, id: string) {
    return this.fetch(`/blog/${blogIdentifier}/post/delete`, {
      method: "POST",
      body: JSON.stringify({ id }),
    });
  }

  async followBlog(blogIdentifier: string) {
    return this.fetch("/user/follow", {
      method: "POST",
      body: JSON.stringify({ url: blogIdentifier }),
    });
  }

  async getUserInfo() {
    return this.fetch("/user/info");
  }

  // Search Tool
  async searchTagged(tag: string, limit = 20) {
    return this.fetch(`/tagged?tag=${encodeURIComponent(tag)}&limit=${limit}`);
  }
}
