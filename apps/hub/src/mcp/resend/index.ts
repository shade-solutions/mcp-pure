import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { ResendService, type ResendEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = ResendEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers): Partial<ResendEnv> {
  return {
    RESEND_API_KEY: pickHeader(headers, ['x-resend-api-key', 'resend-api-key']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new ResendService(env)),
    envFromHeaders
  );
});

export default app;
