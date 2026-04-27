import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { TumblrService, type TumblrEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = TumblrEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

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
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new TumblrService(env)),
    envFromHeaders
  );
});

export default app;
