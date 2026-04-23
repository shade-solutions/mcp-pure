import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { RedditService, type RedditEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = RedditEnv;

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

function envFromHeaders(headers: Headers): Partial<RedditEnv> {
  return {
    REDDIT_CLIENT_ID: pickHeader(headers, ['x-reddit-client-id', 'reddit-client-id']),
    REDDIT_CLIENT_SECRET: pickHeader(headers, ['x-reddit-client-secret', 'reddit-client-secret']),
    REDDIT_USERNAME: pickHeader(headers, ['x-reddit-username', 'reddit-username']),
    REDDIT_PASSWORD: pickHeader(headers, ['x-reddit-password', 'reddit-password']),
    REDDIT_USER_AGENT: pickHeader(headers, ['x-reddit-user-agent', 'reddit-user-agent']),
  };
}

app.all('/', async (c) => {
  const headerEnv = envFromHeaders(c.req.raw.headers);
  const requestEnv: RedditEnv = {
    ...c.env,
    ...Object.fromEntries(
      Object.entries(headerEnv).filter(([, value]) => typeof value === 'string' && value.length > 0)
    ),
  };

  const service = new RedditService(requestEnv);
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
