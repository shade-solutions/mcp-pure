---
title: Telegram MCP
description: Send messages, media, and automate bot interactions via the Telegram Bot API.
icon: ✈️
route: /mcp-server/telegram
---

# Telegram MCP Server

The Telegram MCP server allows AI agents to interact with the Telegram messaging platform using a Bot Token.

## Features

- **Messaging**: Send text messages with MarkdownV2 or HTML support.
- **Media**: Send photos via URL or File ID.
- **Bot Identity**: Verify bot credentials and chat information.
- **Automation**: Poll for updates and monitor chat history.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "telegram": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/telegram",
      "headers": {
        "x-telegram-bot-token": "your-bot-token"
      }
    }
  }
}
```

## How to get Credentials

1. **BotFather**: Message [@BotFather](https://t.me/botfather) on Telegram.
2. **Create Bot**: Use the `/newbot` command and follow the instructions.
3. **API Token**: Copy the API token provided at the end of the process.

## Tools

### Messaging
- `send_message`: Send a text message to a chat or channel.
- `send_photo`: Send an image with an optional caption.

### Bot & Chat Info
- `whoami`: Get information about the bot.
- `get_chat_info`: Get details about a specific chat or channel.
- `get_updates`: Fetch recent incoming messages and updates.
