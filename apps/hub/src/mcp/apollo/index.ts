import { Hono } from 'hono';
import { ApolloService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    APOLLO_API_KEY: pickHeader(headers, ['x-apollo-api-key', 'apollo-api-key']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new ApolloService(env)),
    envFromHeaders
  );
});

export default app;
