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
- **Engagement**: Like/unlike posts, reblog content, and follow blogs directly.
- **Management**: Delete your own posts or reblogs.
- **Discovery**: Search for content across Tumblr using tags or fetch specific blog posts.
- **Profile Info**: Access your own profile and list of blogs.

## Configuration

### Option 1: OAuth 2.0 (Recommended)
If you have a modern Bearer token (e.g. from the [Tumblr API Console](https://api.tumblr.com/console)):

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
If you have a Consumer Key, Consumer Secret, Token, and Token Secret (standard for older `tumblr.js` scripts):

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
4. **Access Token**: You can generate a persistent token (standard or Bearer) using the [Tumblr API Console](https://api.tumblr.com/console).

## Tools

### Posting & Content
- `create_post`: Create a new post with multiple content blocks.
- `get_blog_posts`: Fetch recent posts from a specific blog.
- `delete_post`: Delete one of your own posts or reblogs.

### User Interaction
- `get_dashboard`: Fetch your authenticated home dashboard.
- `like_post`: Like a specific post.
- `unlike_post`: Remove a like from a post.
- `reblog_post`: Reblog a post to one of your blogs.
- `follow_blog`: Follow a blog.

### Discovery & Profile
- `search_tagged`: Search for posts across Tumblr by tag.
- `get_user_info`: Get your profile info and list of blogs.
