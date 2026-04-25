import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

import { cors } from 'hono/cors';
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-resend-api-key', 'x-github-token', 'x-reddit-client-id', 'x-reddit-client-secret', 'x-reddit-username', 'x-reddit-password', 'x-mastodon-access-token', 'x-mastodon-instance-url', 'x-tumblr-access-token', 'x-tumblr-consumer-key', 'x-tumblr-consumer-secret', 'x-tumblr-token', 'x-tumblr-token-secret', 'x-telegram-bot-token', 'x-slack-bot-token', 'x-youtube-access-token', 'x-youtube-api-key', 'x-apollo-api-key', 'x-exa-api-key'],
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
import telegram from "./mcp/telegram";
import slack from "./mcp/slack";
import youtube from "./mcp/youtube";
import apollo from "./mcp/apollo";
import exa from "./mcp/exa";

app.route("/mcp-server/bluesky", bluesky);
app.route("/mcp-server/reddit", reddit);
app.route("/mcp-server/github", github);
app.route("/mcp-server/resend", resend);
app.route("/mcp-server/mastodon", mastodon);
app.route("/mcp-server/tumblr", tumblr);
app.route("/mcp-server/telegram", telegram);
app.route("/mcp-server/slack", slack);
app.route("/mcp-server/youtube", youtube);
app.route("/mcp-server/apollo", apollo);
app.route("/mcp-server/exa", exa);

export default app;
