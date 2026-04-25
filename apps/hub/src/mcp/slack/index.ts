import { Hono } from 'hono';
import { SlackService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

// Per-request service initialization
const getService = (c: any) => {
  const token = c.req.header('x-slack-bot-token');
  return new SlackService({
    SLACK_BOT_TOKEN: token
  });
};

app.get('/', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/slack/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  await server.connect(transport);
  
  // Keep connection alive
  return new Promise(() => {});
});

app.post('/message', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/slack/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  await transport.handlePostMessage(c.req.raw, c.res.raw);
});

export default app;
