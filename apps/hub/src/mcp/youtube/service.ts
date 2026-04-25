export interface YouTubeEnv {
  YOUTUBE_ACCESS_TOKEN?: string;
  YOUTUBE_API_KEY?: string;
}

export class YouTubeService {
  private accessToken?: string;
  private apiKey?: string;
  private baseUrl = "https://www.googleapis.com/youtube/v3";

  constructor(env: YouTubeEnv) {
    this.accessToken = env.YOUTUBE_ACCESS_TOKEN;
    this.apiKey = env.YOUTUBE_API_KEY;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add API key to params if available and no access token
    if (this.apiKey && !this.accessToken) {
      url.searchParams.append("key", this.apiKey);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as any) || {}),
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`YouTube API Error: ${JSON.stringify(error)}`);
    }

    return response.status === 204 ? { success: true } : response.json();
  }

  // Identity & My Channel
  async whoami() {
    return this.fetch("/channels?part=snippet,statistics,contentDetails&mine=true");
  }

  // Search Tools
  async search(query: string, type = "video", limit = 10) {
    return this.fetch(`/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${limit}`);
  }

  // Video Tools
  async getVideoDetails(id: string) {
    return this.fetch(`/videos?part=snippet,contentDetails,statistics,status&id=${id}`);
  }

  async rateVideo(videoId: string, rating: "like" | "dislike" | "none") {
    return this.fetch(`/videos/rate?id=${videoId}&rating=${rating}`, {
      method: "POST",
    });
  }

  async deleteVideo(videoId: string) {
    return this.fetch(`/videos?id=${videoId}`, {
      method: "DELETE",
    });
  }

  async updateVideo(videoId: string, snippet: any, status?: any) {
    return this.fetch("/videos?part=snippet,status", {
      method: "PUT",
      body: JSON.stringify({
        id: videoId,
        snippet,
        status,
      }),
    });
  }

  // Playlist Tools
  async listPlaylists(channelId?: string, limit = 10) {
    const target = channelId ? `channelId=${channelId}` : "mine=true";
    return this.fetch(`/playlists?part=snippet,contentDetails&${target}&maxResults=${limit}`);
  }

  async createPlaylist(title: string, description?: string, privacyStatus = "public") {
    return this.fetch("/playlists?part=snippet,status", {
      method: "POST",
      body: JSON.stringify({
        snippet: { title, description },
        status: { privacyStatus },
      }),
    });
  }

  async addVideoToPlaylist(playlistId: string, videoId: string) {
    return this.fetch("/playlistItems?part=snippet", {
      method: "POST",
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: {
            kind: "youtube#video",
            videoId,
          },
        },
      }),
    });
  }

  // Comment Tools
  async listComments(videoId: string, limit = 20) {
    return this.fetch(`/commentThreads?part=snippet&videoId=${videoId}&maxResults=${limit}`);
  }

  async postComment(videoId: string, text: string) {
    return this.fetch("/commentThreads?part=snippet", {
      method: "POST",
      body: JSON.stringify({
        snippet: {
          videoId,
          topLevelComment: {
            snippet: { textOriginal: text },
          },
        },
      }),
    });
  }

  // Subscription Tools
  async listSubscriptions(limit = 20) {
    return this.fetch(`/subscriptions?part=snippet,contentDetails&mine=true&maxResults=${limit}`);
  }

  async subscribe(channelId: string) {
    return this.fetch("/subscriptions?part=snippet", {
      method: "POST",
      body: JSON.stringify({
        snippet: {
          resourceId: {
            kind: "youtube#channel",
            channelId,
          },
        },
      }),
    });
  }
}
