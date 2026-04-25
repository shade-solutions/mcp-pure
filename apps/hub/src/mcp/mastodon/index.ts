import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { MastodonService, type MastodonEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = MastodonEnv;

const app = new Hono<{ Bindings: Bindings }>();

function pickHeader(headers: Headers, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = headers.get(key);
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function envFromHeaders(headers: Headers): Partial<MastodonEnv> {
  return {
    MASTODON_ACCESS_TOKEN: pickHeader(headers, ['x-mastodon-access-token', 'mastodon-access-token']),
    MASTODON_INSTANCE_URL: pickHeader(headers, ['x-mastodon-instance-url', 'mastodon-instance-url']),
  };
}

app.all('/', async (c) => {
  const headerEnv = envFromHeaders(c.req.raw.headers);
  const requestEnv: MastodonEnv = {
    ...c.env,
    ...Object.fromEntries(
      Object.entries(headerEnv).filter(([, value]) => typeof value === 'string' && value.length > 0)
    ),
  };

  const service = new MastodonService(requestEnv);
  const server = buildMcpServer(service);
  const transport = new WebStandardStreamableHTTPServerTransport();

  await server.connect(transport);
  
  let parsedBody: any;
  try {
    parsedBody = await c.req.json();
  } catch {
    parsedBody = undefined;
  }

  return transport.handleRequest(c.req.raw, { parsedBody });
});

export default app;
