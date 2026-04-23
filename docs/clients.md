# Setup Guide for MCP Clients

MCP Pure servers can be used with any MCP-compatible client. Here is how to configure the most popular ones.

## 🚀 Deployed Instance
**Base URL**: `https://mcppure.shraj.workers.dev`

### Routes:
- **Bluesky**: `https://mcppure.shraj.workers.dev/mcp/bluesky`
- **Reddit**: `https://mcppure.shraj.workers.dev/mcp/reddit`
- **GitHub**: `https://mcppure.shraj.workers.dev/mcp/github`

---

## 1. Cursor
To add an MCP server to Cursor:
1. Open **Settings** > **Cursor Settings**.
2. Go to **General** > **MCP**.
3. Click **+ Add New MCP Server**.
4. Set **Name** (e.g., `Bluesky`).
5. Set **Type** to `SSE`.
6. Set **URL** to `https://mcppure.shraj.workers.dev/mcp/bluesky`.
7. Add Headers if needed (e.g., `x-bluesky-identifier`, `x-bluesky-app-password`).

## 2. Claude Desktop
Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcppure-bluesky": {
      "url": "https://mcppure.shraj.workers.dev/mcp/bluesky",
      "headers": {
        "x-bluesky-identifier": "your-handle.bsky.social",
        "x-bluesky-app-password": "your-app-password"
      }
    }
  }
}
```

## 3. LobeHub
1. Go to **Settings** > **Plugins**.
2. Click **Add Custom Plugin**.
3. Select **MCP Server**.
4. Enter the SSE URL: `https://mcppure.shraj.workers.dev/mcp/bluesky`.

## 4. Cline (VS Code Extension)
1. Open Cline settings.
2. Under **MCP Servers**, add a new entry.
3. Choose **SSE** as the transport.
4. Provide the URL.

---

## 🛠 Deploy Your Own Instance

If you want to host your own instance of MCP Pure:

1. Clone the repo: `git clone https://github.com/shaswatraj/mcppure`
2. Install dependencies: `bun install`
3. Configure your secrets in Cloudflare:
   ```bash
   wrangler secret put BLUESKY_IDENTIFIER
   wrangler secret put BLUESKY_APP_PASSWORD
   # etc...
   ```
4. Deploy: `bun run deploy:hub`
