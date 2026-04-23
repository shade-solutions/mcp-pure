import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { BlueskyService, type BlueskyEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = BlueskyEnv;

type Variables = {
  parsedBody?: unknown;
};

function pickHeader(headers: Headers, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = headers.get(key);
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

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

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', async (c, next) => {
  if (c.req.method === 'POST' || c.req.method === 'PUT' || c.req.method === 'PATCH') {
    try {
      c.set('parsedBody', await c.req.json());
    } catch {
      c.set('parsedBody', undefined);
    }
  }

  await next();
});

app.all('/', async (c) => {
  const headerEnv = envFromHeaders(c.req.raw.headers);
  const requestEnv: BlueskyEnv = {
    ...c.env,
    ...Object.fromEntries(
      Object.entries(headerEnv).filter(([, value]) => typeof value === 'string' && value.length > 0),
    ),
  };

  const service = new BlueskyService(requestEnv);
  const server = buildMcpServer(service);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(c.req.raw, {
    parsedBody: c.get('parsedBody'),
  });
});

export default app;
