import { Hono } from 'hono';
import { TelegramService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

// Per-request service initialization
const getService = (c: any) => {
  const token = c.req.header('x-telegram-bot-token');
  return new TelegramService({
    TELEGRAM_BOT_TOKEN: token
  });
};

app.get('/', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/telegram/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  await server.connect(transport);
  
  // Keep connection alive
  return new Promise(() => {});
});

app.post('/message', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/telegram/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  // This part is handled by the SDK transport logic
  // but we need to ensure the headers are passed if needed
  await transport.handlePostMessage(c.req.raw, c.res.raw);
});

export default app;
