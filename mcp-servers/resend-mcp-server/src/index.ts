import { Hono } from "hono";
import { ResendService } from "./service";
import { TOOLS } from "./tools";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "resend-mcp-server",
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
  const apiKey = c.req.header("x-resend-api-key");
  if (!apiKey) {
    return c.json({ error: "Missing x-resend-api-key header" }, 401);
  }

  const { name, arguments: args } = await c.req.json();
  const service = new ResendService(apiKey);

  try {
    let result;
    switch (name) {
      case "send_email":
        result = await service.sendEmail(args);
        break;
      case "batch_send_emails":
        result = await service.batchSendEmails(args.emails);
        break;
      case "get_email":
        result = await service.getEmail(args.email_id);
        break;
      case "list_domains":
        result = await service.listDomains();
        break;
      case "create_domain":
        result = await service.createDomain(args);
        break;
      case "delete_domain":
        result = await service.deleteDomain(args.domain_id);
        break;
      case "list_audiences":
        result = await service.listAudiences();
        break;
      case "create_audience":
        result = await service.createAudience(args.name);
        break;
      case "delete_audience":
        result = await service.deleteAudience(args.audience_id);
        break;
      case "create_contact":
        result = await service.createContact(args.audience_id, args);
        break;
      case "list_contacts":
        result = await service.listContacts(args.audience_id);
        break;
      case "delete_contact":
        result = await service.deleteContact(args.audience_id, args.id_or_email);
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
