---
title: Instagram MCP
description: Publish posts, manage comments and replies, send DMs, search hashtags, and find leads via the Instagram Graph API.
icon: 📸
route: /mcp-server/instagram
---

# Instagram MCP Server

The Instagram MCP server lets AI agents manage an Instagram **Business or Creator** account through the official Instagram Graph API: publishing content, engaging in comments and DMs, searching hashtags, and prospecting for leads.

## Features

- **Account**: Profile details and analytics insights.
- **Publishing**: Photos, Reels, and Stories from public media URLs.
- **Comments & Replies**: List, create, reply, hide, and delete comments; read mentions.
- **Direct Messages**: List conversations, read threads, send text/image DMs, and react.
- **Search**: Resolve hashtags and pull top/recent media.
- **Lead Generation**: Discover business profiles, rank hashtag posts by engagement, and mine commenters.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "instagram": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/instagram",
      "headers": {
        "x-instagram-access-token": "your-long-lived-access-token",
        "x-instagram-user-id": "your-ig-business-account-id"
      }
    }
  }
}
```

## How to get Credentials

The Instagram Graph API requires a **Business or Creator** account connected to a Facebook Page.

1. **Meta App**: Create an app at [developers.facebook.com](https://developers.facebook.com) and add the *Instagram* and *Facebook Login* products.
2. **Permissions**: Request `instagram_basic`, `instagram_content_publish`, `instagram_manage_comments`, `instagram_manage_messages`, and `pages_show_list`.
3. **Access Token**: Generate a User token via the Graph API Explorer, then exchange it for a **long-lived token** (60 days).
4. **IG User ID**: Call `GET /me/accounts` then `GET /{page-id}?fields=instagram_business_account` to find your `instagram_business_account.id`.

> Note: DMs use the Instagram Messaging API and follow Instagram's 24-hour messaging window and policy. Publishing is rate-limited to 25 posts per rolling 24 hours.

## Tools

### Account
- `whoami` / `fetch_my_account_details`: Get the authenticated account profile.
- `get_account_insights`: Reach, impressions, profile views, and other metrics.

### Media
- `list_my_media`: List recent posts/reels.
- `get_media_details`: Full details for one media object.
- `get_media_insights`: Engagement metrics for one media object.

### Publishing
- `publish_photo`: Publish a feed photo from a URL.
- `publish_reel`: Publish a Reel from a video URL.
- `publish_story`: Publish a photo or video Story.
- `get_publishing_limit`: Check the remaining 24-hour publishing quota.

### Comments & Replies
- `list_media_comments`: List comments and nested replies.
- `get_comment_replies`: List replies to a comment.
- `create_comment`: Post a top-level comment.
- `reply_to_comment`: Reply to a comment.
- `hide_comment`: Hide or unhide a comment.
- `delete_comment`: Delete a comment.
- `get_mentioned_media`: Media where you were tagged.

### Direct Messages
- `list_conversations`: List DM threads.
- `get_conversation_messages`: Read a thread.
- `send_direct_message`: Send a text DM.
- `send_direct_image`: Send an image DM.
- `react_to_message`: React to a message.

### Search
- `search_hashtag`: Resolve a hashtag name to its ID.
- `get_hashtag_recent_media`: Recent media for a hashtag.
- `get_hashtag_top_media`: Top media for a hashtag.

### Lead Generation
- `discover_business_profile`: Inspect any public business/creator profile by username.
- `find_leads_by_hashtag`: Rank hashtag posts by engagement to surface prospects.
- `find_leads_from_commenters`: Extract and rank engaged commenters on a post.
