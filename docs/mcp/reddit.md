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

## How to get Credentials

To use the Reddit MCP server, you need to create a Reddit application to get your API credentials.

1. **Visit Reddit App Preferences**: Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps).
2. **Create a New App**: Scroll to the bottom and click **"are you a developer? create an app..."** or **"create another app..."**.
### 3. Fill the Form:
   - **name**: Give it a unique name. **IMPORTANT**: Do not include the word "reddit" in the name (e.g., use `mcp-pure-hub` instead of `reddit-mcp`).
   - **App type**: You **MUST** select **script**.
   - **description**: Optional.
   - **about url**: Optional.
   - **redirect uri**: Enter `http://localhost:8080` or `https://example.com`. Even though it's not used for scripts, Reddit requires a valid URL here.
4. **Click "create app"**: Once saved, your app details will appear.
5. **Copy Credentials**:
   - **Client ID**: The string of characters directly under "personal use script".
   - **Client Secret**: Labeled as **secret**.
6. **Account Details**: Use your standard Reddit **Username** and **Password** in the headers.

> [!IMPORTANT]
> Ensure your app type is set to **script**, otherwise authentication will fail.

## Tools

- `search_reddit`: Search for posts or subreddits.
- `get_subreddit_posts`: List posts in a specific subreddit (hot, new, top).
- `get_post_details`: Get comments and full content of a specific post.
- `create_post`: Submit a new post (text or link).
- `reply_to_comment`: Reply to a specific comment or post.
