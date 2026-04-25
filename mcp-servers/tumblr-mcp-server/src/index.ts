import { Hono } from "hono";
import { TumblrService } from "./service";
import { TOOLS } from "./tools";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "tumblr-mcp-server",
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
  const accessToken = c.req.header("x-tumblr-access-token");

  if (!accessToken) {
    return c.json({ error: "Missing x-tumblr-access-token header" }, 401);
  }

  const { name, arguments: args } = await c.req.json();
  const service = new TumblrService({
    TUMBLR_ACCESS_TOKEN: accessToken,
  });

  try {
    let result;
    switch (name) {
      case "create_post":
        result = await service.createPost(args.blog_identifier, args.content, args.tags, args.state);
        break;
      case "get_dashboard":
        result = await service.getDashboard(args.limit, args.type);
        break;
      case "get_blog_posts":
        result = await service.getBlogPosts(args.blog_identifier, args.limit);
        break;
      case "like_post":
        result = await service.likePost(args.post_id, args.reblog_key);
        break;
      case "follow_blog":
        result = await service.followBlog(args.blog_identifier);
        break;
      case "search_tagged":
        result = await service.searchTagged(args.tag, args.limit);
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
