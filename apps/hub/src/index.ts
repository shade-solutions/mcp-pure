import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Base health check
app.get("/health", (c) => c.json({ ok: true, service: "mcppure" }));

// Import and mount servers
import bluesky from "./mcp/bluesky";
import reddit from "./mcp/reddit";
import github from "./mcp/github";
app.route("/mcp/bluesky", bluesky);
app.route("/mcp/reddit", reddit);
app.route("/mcp/github", github);

export default app;
