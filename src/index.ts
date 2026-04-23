import { Hono } from "hono";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Base health check
app.get("/health", (c) => c.json({ ok: true, service: "mcppure" }));

// Placeholder for central documentation or landing page
app.get("/", (c) => {
  return c.html(`
    <html>
      <head>
        <title>MCP Pure - Central Hub</title>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: white; }
          h1 { color: #38bdf8; }
          .servers { display: flex; gap: 20px; }
          .server { border: 1px solid #334155; padding: 20px; border-radius: 8px; background: #1e293b; }
        </style>
      </head>
      <body>
        <h1>MCP Pure</h1>
        <p>A central hub for managed MCP servers on Cloudflare Workers.</p>
        <div class="servers">
          <div class="server">
            <h3>Bluesky</h3>
            <p>Route: <code>/mcp/bluesky</code></p>
          </div>
          <div class="server">
            <h3>Reddit (Soon)</h3>
            <p>Route: <code>/mcp/reddit</code></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Import and mount servers
import bluesky from "./mcp/bluesky";
import reddit from "./mcp/reddit";
app.route("/mcp/bluesky", bluesky);
app.route("/mcp/reddit", reddit);

export default app;
