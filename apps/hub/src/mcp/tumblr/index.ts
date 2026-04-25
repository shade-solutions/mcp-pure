import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { TumblrService, type TumblrEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = TumblrEnv;

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

function envFromHeaders(headers: Headers): Partial<TumblrEnv> {
  return {
    TUMBLR_ACCESS_TOKEN: pickHeader(headers, ['x-tumblr-access-token', 'tumblr-access-token']),
    TUMBLR_CONSUMER_KEY: pickHeader(headers, ['x-tumblr-consumer-key', 'tumblr-consumer-key']),
    TUMBLR_CONSUMER_SECRET: pickHeader(headers, ['x-tumblr-consumer-secret', 'tumblr-consumer-secret']),
    TUMBLR_TOKEN: pickHeader(headers, ['x-tumblr-token', 'tumblr-token']),
    TUMBLR_TOKEN_SECRET: pickHeader(headers, ['x-tumblr-token-secret', 'tumblr-token-secret']),
  };
}

app.all('/', async (c) => {
  const headerEnv = envFromHeaders(c.req.raw.headers);
  const requestEnv: TumblrEnv = {
    ...c.env,
    ...Object.fromEntries(
      Object.entries(headerEnv).filter(([, value]) => typeof value === 'string' && value.length > 0)
    ),
  };

  const service = new TumblrService(requestEnv);
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
