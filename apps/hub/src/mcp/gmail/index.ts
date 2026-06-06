import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { GmailService, type GmailEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = GmailEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers): Partial<GmailEnv> {
  return {
    GMAIL_ACCESS_TOKEN: pickHeader(headers, ['x-gmail-access-token', 'gmail-access-token']),
    GMAIL_REFRESH_TOKEN: pickHeader(headers, ['x-gmail-refresh-token', 'gmail-refresh-token']),
    GMAIL_CLIENT_ID: pickHeader(headers, ['x-gmail-client-id', 'gmail-client-id']),
    GMAIL_CLIENT_SECRET: pickHeader(headers, ['x-gmail-client-secret', 'gmail-client-secret']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new GmailService(env)),
    envFromHeaders
  );
});

export default app;
