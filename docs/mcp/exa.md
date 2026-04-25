---
title: Exa AI Search MCP
description: AI-optimized web search and content extraction for grounded agent responses.
icon: 🔍
route: /mcp-server/exa
---

# Exa AI Search MCP Server

The Exa MCP server enables AI agents to perform high-quality web research using neural search optimized for LLMs.

## Features

- **Neural Search**: Find relevant web pages using semantic queries.
- **Similar Discovery**: Find pages that are conceptually similar to a given URL.
- **Content Extraction**: Get cleaned text and highlights from web pages, perfect for RAG and grounding.
- **Autoprompt**: Automatically optimize queries for the Exa search engine.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "exa": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/exa",
      "headers": {
        "x-exa-api-key": "your-api-key"
      }
    }
  }
}
```

## How to get Credentials

1. **Exa Dashboard**: Visit the [Exa Dashboard](https://dashboard.exa.ai/).
2. **API Key**: Create a new API Key from the "API Keys" section.

## Tools

### Search
- `search`: Perform a semantic or keyword search across the web.
- `find_similar`: Find conceptual matches for a specific URL.

### Content
- `get_contents`: Extract text and highlights from document IDs or URLs.
