import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { RedditService, type RedditEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = RedditEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

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
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new RedditService(env)),
    envFromHeaders
  );
});

export default app;
