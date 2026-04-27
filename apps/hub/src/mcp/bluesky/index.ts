import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { BlueskyService, type BlueskyEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = BlueskyEnv;

type Variables = {
  parsedBody?: unknown;
};

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers): Partial<BlueskyEnv> {
  return {
    BLUESKY_IDENTIFIER: pickHeader(headers, ['x-bluesky-identifier', 'bluesky-identifier']),
    BLUESKY_APP_PASSWORD: pickHeader(headers, [
      'x-bluesky-app-password',
      'bluesky-app-password',
    ]),
    BLUESKY_PASSWORD: pickHeader(headers, ['x-bluesky-password', 'bluesky-password']),
    BLUESKY_SERVICE_URL: pickHeader(headers, ['x-bluesky-service-url', 'bluesky-service-url']),
    BLUESKY_PDS_URL: pickHeader(headers, ['x-bluesky-pds-url', 'bluesky-pds-url']),
  };
}

const app = new Hono<{ Bindings: Bindings }>();

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new BlueskyService(env)),
    envFromHeaders
  );
});

export default app;
