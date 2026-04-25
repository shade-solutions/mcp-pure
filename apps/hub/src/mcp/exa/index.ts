import { Hono } from 'hono';
import { ExaService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

// Per-request service initialization
const getService = (c: any) => {
  const token = c.req.header('x-exa-api-key');
  return new ExaService({
    EXA_API_KEY: token
  });
};

app.get('/', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/exa/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  await server.connect(transport);
  
  // Keep connection alive
  return new Promise(() => {});
});

app.post('/message', async (c) => {
  const transport = new SSEServerTransport('/mcp-server/exa/message', c.res);
  const service = getService(c);
  const server = buildMcpServer(service);
  
  await transport.handlePostMessage(c.req.raw, c.res.raw);
});

export default app;
