import { Hono } from "hono";
import { MastodonService } from "./service";
import { TOOLS } from "./tools";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "mastodon-mcp-server",
    version: "1.0.0",
    status: "active",
    endpoints: {
      mcp: "/mcp",
      health: "/health"
    }
  });
});

app.get("/health", (c) => c.json({ status: "ok" }));

// MCP List Tools
app.post("/mcp/tools/list", (c) => {
  const tools = Object.entries(TOOLS).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: {
      type: "object",
      properties: (tool.schema as any).shape,
      required: Object.keys((tool.schema as any).shape).filter(
        (key) => !(tool.schema as any).shape[key].isOptional()
      ),
    },
  }));

  return c.json({ tools });
});

// MCP Call Tool
app.post("/mcp/tools/call", async (c) => {
  const accessToken = c.req.header("x-mastodon-access-token");
  const instanceUrl = c.req.header("x-mastodon-instance-url");

  if (!accessToken || !instanceUrl) {
    return c.json({ error: "Missing x-mastodon-access-token or x-mastodon-instance-url header" }, 401);
  }

  const { name, arguments: args } = await c.req.json();
  const service = new MastodonService({
    MASTODON_ACCESS_TOKEN: accessToken,
    MASTODON_INSTANCE_URL: instanceUrl,
  });

  try {
    let result;
    switch (name) {
      case "post_status":
        result = await service.postStatus(args);
        break;
      case "search":
        result = await service.search(args.query, args.type, args.limit);
        break;
      case "get_home_timeline":
        result = await service.getHomeTimeline(args.limit);
        break;
      case "get_public_timeline":
        result = await service.getPublicTimeline(args.limit, args.local);
        break;
      case "get_notifications":
        result = await service.getNotifications(args.limit);
        break;
      case "get_bookmarks":
        result = await service.getBookmarks(args.limit);
        break;
      case "follow_account":
        result = await service.followAccount(args.account_id);
        break;
      case "block_account":
        result = await service.blockAccount(args.account_id);
        break;
      case "get_account":
        result = await service.getAccount(args.account_id);
        break;
      default:
        return c.json({ error: `Unknown tool: ${name}` }, 400);
    }

    return c.json({
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    });
  } catch (error: any) {
    return c.json({
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    });
  }
});

export default app;
