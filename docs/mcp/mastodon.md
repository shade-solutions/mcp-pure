---
title: Mastodon MCP
description: Post toots, browse timelines, and interact with the federated social network via the Mastodon API.
icon: 🐘
route: /mcp-server/mastodon
---

# Mastodon MCP Server

The Mastodon MCP server allows AI agents to interact with any Mastodon instance. Because Mastodon is federated, you must specify your instance URL and access token.

## Features

- **Status Management**: Post new statuses (toots) with visibility controls and spoiler warnings.
- **Timeline Discovery**: Access Home, Local, and Federated (Public) timelines.
- **Deep Search**: Search for users, statuses, and hashtags across the network.
- **Notifications & Bookmarks**: Stay updated with mentions and manage your saved content.
- **Account Interactions**: Follow or block accounts by their ID.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "mastodon": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/mastodon",
      "headers": {
        "x-mastodon-access-token": "your-access-token",
        "x-mastodon-instance-url": "https://mastodon.social"
      }
    }
  }
}
```

## How to get Credentials

To use the Mastodon MCP server, you need an access token from your Mastodon instance.

1. **Login**: Log in to your Mastodon instance (e.g., `mastodon.social`, `fosstodon.org`).
2. **Settings**: Go to **Preferences** -> **Development**.
3. **New Application**: Click **"New Application"**.
   - **Application name**: `MCP Pure`.
   - **Application website**: `https://mcppure.shraj.workers.dev`.
   - **Scopes**: Select `read` and `write` (or specific ones like `read:statuses`, `write:statuses`, `read:notifications`, `read:bookmarks`, `write:follows`).
4. **Submit**: Click **"Submit"** at the bottom.
5. **Copy Token**: Click on your newly created application and copy the **"Your access token"** string.

## Tools

### Status Tools
- `post_status`: Create a new post with text, visibility, and spoiler warning.
- `get_account`: Get detailed profile information about an account.

### Timeline Tools
- `get_home_timeline`: Fetch statuses from accounts you follow.
- `get_public_timeline`: View public statuses (optionally limited to the local instance).

### Search & Discovery
- `search`: Find accounts, statuses, or hashtags by query.

### Account Interactions
- `follow_account`: Follow an account by its ID.
- `block_account`: Block an account by its ID.

### Personal Tools
- `get_notifications`: View recent mentions, reblogs, and follows.
- `get_bookmarks`: Access your bookmarked statuses.
