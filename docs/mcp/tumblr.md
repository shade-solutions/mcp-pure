---
title: Tumblr MCP
description: Create NPF posts, browse your dashboard, and engage with the Tumblr community via the Tumblr API.
icon: 📄
route: /mcp-server/tumblr
---

# Tumblr MCP Server

The Tumblr MCP server allows AI agents to interact with the Tumblr blogging platform. It supports the New Post Format (NPF) and both OAuth 2.0 and OAuth 1.0a authentication.

## Features

- **Advanced Posting**: Create posts with multiple content blocks (text, image, link, video, audio).
- **Dashboard Access**: Fetch the user's dashboard to stay updated.
- **Engagement**: Like posts and follow blogs directly.
- **Tag Search**: Search for content across Tumblr using tags.

## Configuration

### Option 1: OAuth 2.0 (Recommended)
If you have a modern Bearer token:

```json
{
  "mcpServers": {
    "tumblr": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/tumblr",
      "headers": {
        "x-tumblr-access-token": "your-access-token"
      }
    }
  }
}
```

### Option 2: OAuth 1.0a (Legacy)
If you have a Consumer Key, Consumer Secret, Token, and Token Secret (e.g. from `tumblr.js` setup):

```json
{
  "mcpServers": {
    "tumblr": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/tumblr",
      "headers": {
        "x-tumblr-consumer-key": "your-consumer-key",
        "x-tumblr-consumer-secret": "your-consumer-secret",
        "x-tumblr-token": "your-token",
        "x-tumblr-token-secret": "your-token-secret"
      }
    }
  }
}
```

## How to get Credentials

1. **Tumblr Apps**: Go to the [Tumblr Applications](https://www.tumblr.com/settings/apps) page.
2. **Register Application**: Click **"Register application"**.
   - **Application Name**: `MCPPURE`
   - **Application Website**: `https://mcppure.shraj.workers.dev`
   - **Default Callback URL**: `https://mcppure.shraj.workers.dev/callback`
3. **API Keys**: Once registered, you will get a **Consumer Key** and **Consumer Secret**.
4. **Access Token**: You can generate a persistent token using the [Tumblr API Console](https://api.tumblr.com/console).

## Tools

- `create_post`: Create a new post with multiple content blocks.
- `get_blog_posts`: Fetch recent posts from a specific blog.
- `get_dashboard`: Fetch the authenticated user's dashboard.
- `like_post`: Like a specific post.
- `follow_blog`: Follow a blog.
- `search_tagged`: Search for posts by tag.
