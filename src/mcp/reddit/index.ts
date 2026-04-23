import { Hono } from 'hono';

const app = new Hono();

app.all('/', (c) => {
  return c.json({
    message: "Reddit MCP server is coming soon to MCP Pure!",
    status: "planned"
  });
});

export default app;
