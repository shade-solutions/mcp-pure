---
title: Tumblr MCP
description: Create NPF posts, browse your dashboard, and engage with the Tumblr community via the Tumblr API.
icon: 📄
route: /mcp-server/tumblr
---

# Tumblr MCP Server

The Tumblr MCP server allows AI agents to interact with the Tumblr blogging platform. It supports the New Post Format (NPF) for high-fidelity content creation.

## Features

- **Advanced Posting**: Create posts with multiple content blocks (text, image, link, video, audio) using the New Post Format.
- **Dashboard Access**: Fetch the user's dashboard to stay updated with followed blogs.
- **Blog Management**: Get posts from any specific blog and follow new blogs.
- **Engagement**: Like posts directly from the MCP client.
- **Tag Search**: Search for content across Tumblr using tags.

## Configuration

Add the following to your MCP client configuration:

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

## How to get Credentials

To use the Tumblr MCP server, you need an OAuth 2.0 access token.

1. **Tumblr Apps**: Go to the [Tumblr Applications](https://www.tumblr.com/settings/apps) page.
2. **Register Application**: Click **"Register application"**.
   - **Application Name**: `MCP Pure`.
   - **Application Website**: `https://mcppure.shraj.workers.dev`.
   - **Default Callback URL**: `https://mcppure.shraj.workers.dev/callback`.
3. **API Keys**: Once registered, you will get a **Consumer Key** and **Consumer Secret**.
4. **Access Token**: Since Tumblr uses OAuth 2.0, you will need to perform the OAuth flow or use a tool like the [Tumblr API Console](https://api.tumblr.com/console) to generate a temporary token for testing. For a production-ready token, follow the [OAuth 2.0 Authorization Flow](https://www.tumblr.com/docs/en/api/v2#oauth2-authorization).

## Tools

### Posting Tools
- `create_post`: Create a new post with multiple content blocks and tags.
- `get_blog_posts`: Fetch recent posts from a specific blog identifier.

### User Tools
- `get_dashboard`: Fetch the authenticated user's dashboard.
- `like_post`: Like a specific post using its ID and reblog key.
- `follow_blog`: Follow a blog by its identifier.

### Discovery Tools
- `search_tagged`: Search for posts across Tumblr that have a specific tag.
