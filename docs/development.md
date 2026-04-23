# Development Guide

How to add a new MCP server to the MCP Pure hub.

## Step 1: Research
Follow the [Agent Research Guide](../agents.md) to identify the service and tools.

## Step 2: Create Server Directory
Create a new folder in `src/mcp/[name]`.

```bash
mkdir -p src/mcp/reddit
```

## Step 3: Implement Logic
We follow a standard pattern:
- `service.ts`: Handles API calls to the target service.
- `tools.ts`: Defines MCP tools and registers them to a server instance.
- `index.ts`: The Hono sub-app that handles SSE transport.

## Step 4: Register Route
Update `src/index.ts` to mount your new sub-app:

```typescript
import yourService from "./mcp/yourService";
app.route("/mcp/yourService", yourService);
```

## Step 5: Test and Deploy
1. Run `bun dev` and use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test.
2. Run `bun run deploy` to push to Cloudflare.
