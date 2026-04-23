import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

import { cors } from 'hono/cors';
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-resend-api-key', 'x-github-token', 'x-reddit-client-id', 'x-reddit-client-secret', 'x-reddit-username', 'x-reddit-password'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

// Base health check
app.get("/health", (c) => c.json({ ok: true, service: "mcppure" }));

// Import and mount servers
import bluesky from "./mcp/bluesky";
import reddit from "./mcp/reddit";
import github from "./mcp/github";
import resend from "./mcp/resend";
app.route("/mcp/bluesky", bluesky);
app.route("/mcp/reddit", reddit);
app.route("/mcp/github", github);
app.route("/mcp/resend", resend);

export default app;
