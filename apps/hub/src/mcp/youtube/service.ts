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

  async listMyVideos(limit = 10) {
    return this.fetch(`/search?part=snippet&forMine=true&type=video&maxResults=${limit}`);
  }

  async getChannelDetails(channelId: string) {
    return this.fetch(`/channels?part=snippet,statistics,contentDetails,brandingSettings&id=${channelId}`);
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

  async listPlaylistItems(playlistId: string, limit = 20) {
    return this.fetch(`/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${limit}`);
  }

  async removeFromPlaylist(playlistItemId: string) {
    return this.fetch(`/playlistItems?id=${playlistItemId}`, {
      method: "DELETE",
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

  // Video Upload
  async uploadVideo(videoUrl: string, snippet: any, status?: any) {
    // 1. Initialize resumable upload
    const initUrl = new URL("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status");
    if (this.apiKey && !this.accessToken) initUrl.searchParams.append("key", this.apiKey);

    const initHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Upload-Content-Type": "video/*",
    };
    if (this.accessToken) initHeaders["Authorization"] = `Bearer ${this.accessToken}`;

    const initResponse = await fetch(initUrl.toString(), {
      method: "POST",
      headers: initHeaders,
      body: JSON.stringify({ snippet, status }),
    });

    if (!initResponse.ok) {
      throw new Error(`Upload Initialization Failed: ${await initResponse.text()}`);
    }

    const uploadLocation = initResponse.headers.get("Location");
    if (!uploadLocation) throw new Error("No upload location received from YouTube");

    // 2. Fetch the video from the provided URL and pipe to YouTube
    const videoStream = await fetch(videoUrl);
    if (!videoStream.ok) throw new Error(`Failed to fetch video from URL: ${videoUrl}`);

    const uploadResponse = await fetch(uploadLocation, {
      method: "PUT",
      body: videoStream.body,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Video Upload Failed: ${await uploadResponse.text()}`);
    }

    return uploadResponse.json();
  }

  async setThumbnail(videoId: string, thumbnailUrl: string) {
    const thumbStream = await fetch(thumbnailUrl);
    if (!thumbStream.ok) throw new Error(`Failed to fetch thumbnail from URL: ${thumbnailUrl}`);

    const url = new URL(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`);
    if (this.apiKey && !this.accessToken) url.searchParams.append("key", this.apiKey);

    const headers: Record<string, string> = {
      "Content-Type": "image/*",
    };
    if (this.accessToken) headers["Authorization"] = `Bearer ${this.accessToken}`;

    const response = await fetch(url.toString(), {
      method: "POST",
      headers,
      body: thumbStream.body,
    });

    if (!response.ok) throw new Error(`Thumbnail Set Failed: ${await response.text()}`);
    return response.json();
  }

  // Analytics Tools
  async getReports(params: {
    ids: string;
    startDate: string;
    endDate: string;
    metrics: string;
    dimensions?: string;
    filters?: string;
    sort?: string;
    maxResults?: number;
  }) {
    const url = new URL("https://youtubeanalytics.googleapis.com/v2/reports");
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    } else if (this.apiKey) {
      url.searchParams.append("key", this.apiKey);
    }

    const response = await fetch(url.toString(), { headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`YouTube Analytics API Error: ${JSON.stringify(error)}`);
    }
    return response.json();
  }

  // Captions & Transcript
  async listCaptions(videoId: string) {
    return this.fetch(`/captions?part=snippet&videoId=${videoId}`);
  }

  async getCaption(captionId: string) {
    // Note: This returns the actual caption track file, might need special handling
    const url = new URL(`${this.baseUrl}/captions/${captionId}`);
    const headers: Record<string, string> = {};
    if (this.accessToken) headers["Authorization"] = `Bearer ${this.accessToken}`;
    
    const response = await fetch(url.toString(), { headers });
    return response.text();
  }

  // Activity Tools
  async listMyActivities(limit = 20) {
    return this.fetch(`/activities?part=snippet,contentDetails&mine=true&maxResults=${limit}`);
  }
}
