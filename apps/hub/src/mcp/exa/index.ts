import { Hono } from 'hono';
import { ExaService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    EXA_API_KEY: pickHeader(headers, ['x-exa-api-key', 'exa-api-key']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new ExaService(env)),
    envFromHeaders
  );
});

export default app;
