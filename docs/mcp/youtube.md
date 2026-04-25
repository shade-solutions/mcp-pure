---
title: YouTube MCP
description: Search videos, manage playlists, like content, and interact with the YouTube Data API v3.
icon: 🎥
route: /mcp-server/youtube
---

# YouTube MCP Server

The YouTube MCP server enables AI agents to interact with the YouTube platform for search, content management, and engagement.

## Features

- **Search**: Find videos, channels, and playlists.
- **Engagement**: Like, dislike, and rate videos.
- **Content Management**: Update video metadata or delete videos.
- **Playlists**: Create and manage playlists, and add videos to them.
- **Comments**: List video comment threads and post new comments.
- **Social**: Subscribe to channels and list your current subscriptions.
- **Identity**: Verify channel information and credentials.

## Configuration

Add the following to your MCP client configuration:

### Option 1: OAuth 2.0 (Recommended for all features)
Use a Google OAuth 2.0 Access Token to access private data and perform write actions (like, post comment, etc.).

```json
{
  "mcpServers": {
    "youtube": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/youtube",
      "headers": {
        "x-youtube-access-token": "your-access-token"
      }
    }
  }
}
```

### Option 2: API Key (Search only)
Use a standard Google Cloud API Key for public data like search and video details.

```json
{
  "mcpServers": {
    "youtube": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/youtube",
      "headers": {
        "x-youtube-api-key": "your-api-key"
      }
    }
  }
}
```

## How to get Credentials

1. **Google Cloud Console**: Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. **Project**: Create a new project or select an existing one.
3. **API Library**: Search for and enable the **YouTube Data API v3**.
4. **Credentials**:
   - **API Key**: Create an API key under "Credentials".
   - **OAuth 2.0**: Create an OAuth 2.0 Client ID and use a tool like [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) to generate a token with the `https://www.googleapis.com/auth/youtube` scope.

## Tools

### Search & Discovery
- `search_youtube`: Search for content on YouTube.
- `get_video_details`: Get metadata for a specific video.

### Engagement & Social
- `rate_video`: Like or dislike a video.
- `post_comment`: Add a comment to a video.
- `subscribe_to_channel`: Subscribe to a channel.
- `list_subscriptions`: View your subscriptions.

### Content Management
- `update_video`: Edit title, description, or privacy of your videos.
- `delete_video`: Permanently remove a video you own.

### Playlists
- `create_playlist`: Create a new playlist.
- `add_to_playlist`: Add a video to a playlist.
- `list_playlists`: View playlists for a channel or user.

### Identity
- `whoami`: Get information about your own channel.
