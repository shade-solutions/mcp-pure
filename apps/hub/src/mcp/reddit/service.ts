export type RedditEnv = {
  REDDIT_CLIENT_ID?: string;
  REDDIT_CLIENT_SECRET?: string;
  REDDIT_USERNAME?: string;
  REDDIT_PASSWORD?: string;
  REDDIT_USER_AGENT?: string;
};

export class RedditService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(private readonly env: RedditEnv) {}

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD } = this.env;

    if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
      throw new Error('Missing Reddit Client ID or Client Secret');
    }

    const auth = btoa(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`);
    const body = new URLSearchParams();
    
    if (REDDIT_USERNAME && REDDIT_PASSWORD) {
      body.append('grant_type', 'password');
      body.append('username', REDDIT_USERNAME);
      body.append('password', REDDIT_PASSWORD);
    } else {
      body.append('grant_type', 'client_credentials');
    }

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'User-Agent': this.env.REDDIT_USER_AGENT || 'MCP-Pure/0.1.0',
      },
      body,
    });

    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(`Failed to get Reddit access token: ${data.error_description || data.error}`);
    }

    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // 1 minute buffer
    return this.accessToken!;
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    const url = `https://oauth.reddit.com${path}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'User-Agent': this.env.REDDIT_USER_AGENT || 'MCP-Pure/0.1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Reddit API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async search(query: string, limit = 10) {
    return this.request(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getSubredditPosts(subreddit: string, type: 'hot' | 'new' | 'top' = 'hot', limit = 10) {
    return this.request(`/r/${subreddit}/${type}?limit=${limit}`);
  }

  async getPostDetails(postId: string) {
    // Reddit post IDs usually start with t3_
    const id = postId.startsWith('t3_') ? postId.slice(3) : postId;
    return this.request(`/comments/${id}`);
  }

  async submitPost(subreddit: string, title: string, text?: string, url?: string) {
    const body = new URLSearchParams({
      api_type: 'json',
      kind: url ? 'link' : 'self',
      sr: subreddit,
      title,
    });
    if (text) body.append('text', text);
    if (url) body.append('url', url);

    return this.request('/api/submit', {
      method: 'POST',
      body,
    });
  }

  async reply(parentId: string, text: string) {
    const body = new URLSearchParams({
      api_type: 'json',
      thing_id: parentId,
      text,
    });

    return this.request('/api/comment', {
      method: 'POST',
      body,
    });
  }

  async getMe() {
    return this.request('/api/v1/me');
  }
}
