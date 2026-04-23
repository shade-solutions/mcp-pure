# Development Guide

How to add a new MCP server to the MCP Pure hub.

## Step 1: Research
Follow the [Agent Research Guide](../agents.md) to identify the service and tools.

## Step 2: Create Server Directory
Create a new folder in `apps/hub/src/mcp/[name]`.

```bash
mkdir -p apps/hub/src/mcp/reddit
```

## Step 3: Implement Logic
We follow a standard pattern:
- `service.ts`: Handles API calls to the target service.
- `tools.ts`: Defines MCP tools and registers them to a server instance.
- `index.ts`: The Hono sub-app that handles SSE transport.

## Step 4: Register Route
Update `apps/hub/src/index.ts` to mount your new sub-app:

```typescript
import yourService from "./mcp/yourService";
app.route("/mcp/yourService", yourService);
```

## Step 5: Test and Deploy Hub
1. Run `bun run dev:hub` and use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test.
2. Run `bun run deploy:hub` to push to Cloudflare.

## Step 6: Deploy Frontend (Cloudflare Pages)
The frontend in `apps/web` is a Next.js application optimized for Cloudflare Pages.

1.  Go to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select the `mcppure` repository.
4.  Set **Build command**: `cd apps/web && bun run pages:build`
5.  Set **Build output directory**: `apps/web/.next-on-pages`
6.  Add compatibility flag: `nodejs_compat`
7.  Deploy!
