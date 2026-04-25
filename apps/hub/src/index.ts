import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

import { cors } from 'hono/cors';
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-resend-api-key', 'x-github-token', 'x-reddit-client-id', 'x-reddit-client-secret', 'x-reddit-username', 'x-reddit-password', 'x-mastodon-access-token', 'x-mastodon-instance-url', 'x-tumblr-access-token'],
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
import mastodon from "./mcp/mastodon";
import tumblr from "./mcp/tumblr";
app.route("/mcp-server/bluesky", bluesky);
app.route("/mcp-server/reddit", reddit);
app.route("/mcp-server/github", github);
app.route("/mcp-server/resend", resend);
app.route("/mcp-server/mastodon", mastodon);
app.route("/mcp-server/tumblr", tumblr);

export default app;
