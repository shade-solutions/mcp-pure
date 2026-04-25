---
title: Slack MCP
description: Post messages, list channels, and manage workspace interactions via the Slack Web API.
icon: 💬
route: /mcp-server/slack
---

# Slack MCP Server

The Slack MCP server enables AI agents to interact with Slack workspaces using a Bot User OAuth Token.

## Features

- **Messaging**: Post messages to public/private channels or DMs.
- **Organization**: List channels and users in the workspace.
- **Context**: Fetch conversation history and user profiles.
- **Identity**: Verify authentication and bot details.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "slack": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/slack",
      "headers": {
        "x-slack-bot-token": "xoxb-your-bot-token"
      }
    }
  }
}
```

## How to get Credentials

1. **Slack Apps**: Go to the [Slack API Dashboard](https://api.slack.com/apps).
2. **Create App**: Create a new app "From scratch".
3. **Permissions**: Under **OAuth & Permissions**, add `chat:write`, `channels:read`, `users:read`, `groups:read`, `im:read`, and `mpim:read` scopes.
4. **Install**: Install the app to your workspace.
5. **Bot Token**: Copy the **Bot User OAuth Token** (starts with `xoxb-`).

## Tools

### Messaging
- `post_message`: Send a message or structured blocks to a channel.
- `get_channel_history`: Fetch recent messages from a conversation.

### Workspace Discovery
- `list_channels`: List all available channels in the team.
- `list_users`: List all members of the Slack team.
- `get_user_info`: Get profile details for a specific user.

### Identity
- `whoami`: Verify authentication and get bot user details.
