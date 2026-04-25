---
title: Mastodon MCP
description: Post toots, browse timelines, and interact with the federated social network via the Mastodon API.
icon: 🐘
route: /mcp-server/mastodon
---

# Mastodon MCP Server

The Mastodon MCP server allows AI agents to interact with any Mastodon instance. Because Mastodon is federated, you must specify your instance URL and access token.

## Features

- **Full Lifecycle Statuses**: Post toots, favourite (like) statuses, and bookmark content.
- **Advanced Social**: Follow/unfollow, block, and mute accounts with custom durations.
- **Moderation**: Report rule-breaking accounts directly from the agent.
- **Discovery**: Access Home, Federated, and Local timelines, plus search and conversations (DMs).
- **Personalization**: Access your notifications, bookmarks, favourites, and custom lists.

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

1. **Login**: Log in to your Mastodon instance (e.g., `mastodon.social`).
2. **Settings**: Go to **Preferences** -> **Development**.
3. **New Application**: Click **"New Application"**.
   - **Application name**: `MCPPURE`
   - **Application website**: `https://mcppure.shraj.workers.dev`
   - **Redirect URI**: `urn:ietf:wg:oauth:2.0:oob`
   - **Scopes**: Select `read` and `write` (or check all detailed scopes for maximum features).
4. **Submit**: Click **"Submit"** at the bottom.
5. **Copy Token**: Click on your newly created application and copy the **"Your access token"** string.

## Tools

### Status & Interaction
- `post_status`: Create a new post.
- `favourite_status`: Like a post.
- `bookmark_status`: Save a post to bookmarks.

### Social & Account
- `follow_account`: Follow an account.
- `mute_account`: Mute an account (with optional duration).
- `report_account`: Report an account for rules violation.

### Timelines & Discovery
- `get_home_timeline`: View your home feed.
- `get_public_timeline`: View public/federated statuses.
- `get_conversations`: Access your direct messages.
- `search`: Find accounts, hashtags, or statuses.

### Personal Data
- `get_notifications`: View recent mentions and interactions.
- `get_bookmarks`: Access saved statuses.
- `get_favourites`: Access liked statuses.
- `get_lists`: Access your custom Mastodon lists.
