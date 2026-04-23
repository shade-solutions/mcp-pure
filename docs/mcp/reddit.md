---
title: Reddit MCP
description: Browse subreddits, search posts, and interact with the front page of the internet.
icon: 🔥
route: /mcp/reddit
---

# Reddit MCP Server

The Reddit MCP server allows AI agents to interact with Reddit content, including searching, browsing subreddits, and managing comments.

## Features

- **Search**: Find posts and subreddits across the platform.
- **Subreddit Management**: Fetch hot, new, or top posts from specific communities.
- **Detailed View**: Access full post content and comment trees.
- **Interactions**: Submit new posts and reply to existing comments.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "reddit": {
      "url": "https://mcppure.shraj.workers.dev/mcp/reddit",
      "headers": {
        "x-reddit-client-id": "your-client-id",
        "x-reddit-client-secret": "your-client-secret",
        "x-reddit-username": "your-username",
        "x-reddit-password": "your-password"
      }
    }
  }
}
```

## Tools

- `search_reddit`: Search for posts or subreddits.
- `get_subreddit_posts`: List posts in a specific subreddit (hot, new, top).
- `get_post_details`: Get comments and full content of a specific post.
- `create_post`: Submit a new post (text or link).
- `reply_to_comment`: Reply to a specific comment or post.
