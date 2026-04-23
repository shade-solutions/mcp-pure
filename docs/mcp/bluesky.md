---
title: Bluesky MCP
description: Full integration with the AT Protocol for social networking.
icon: 🧊
route: /mcp-server/bluesky
---

# Bluesky MCP Server

The Bluesky MCP server provides a comprehensive interface for interacting with the Bluesky social network via the AT Protocol.

## Features

- **Profile Management**: Get profiles and resolve handles.
- **Feed Interaction**: Search posts, get timelines, and fetch author feeds.
- **Social Graph**: List followers/follows, follow/unfollow users, and mute/block accounts.
- **Content Creation**: Create posts (with images), reply to posts, and quote posts.
- **Engagement**: Like/unlike posts and repost/unrepost.
- **Direct Messaging**: List conversations, create chats, and send messages.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "bluesky": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/bluesky",
      "headers": {
        "x-bluesky-identifier": "your-handle.bsky.social",
        "x-bluesky-app-password": "your-app-password"
      }
    }
  }
}
```

## Tools

### Profile
- `whoami`: Describe the active session.
- `resolve_handle`: Resolve a handle to a DID.
- `get_profile`: Fetch a profile by handle or DID.

### Feed
- `search_posts`: Search posts across Bluesky.
- `get_timeline`: Fetch home timeline.
- `get_author_feed`: Fetch a user's feed.
- `get_thread`: Fetch a post thread.

### Social
- `follow_user`, `unfollow_user`
- `mute_user`, `unmute_user`
- `block_user`, `unblock_user`

### Actions
- `create_post`, `reply_to_post`, `quote_post`, `delete_post`
- `like_post`, `unlike_post`, `repost_post`, `unrepost_post`

### Chat
- `list_conversations`, `get_conversation`, `create_conversation`, `send_message`
