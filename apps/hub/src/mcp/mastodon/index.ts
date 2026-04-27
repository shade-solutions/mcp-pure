import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { MastodonService, type MastodonEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = MastodonEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers): Partial<MastodonEnv> {
  return {
    MASTODON_ACCESS_TOKEN: pickHeader(headers, ['x-mastodon-access-token', 'mastodon-access-token']),
    MASTODON_INSTANCE_URL: pickHeader(headers, ['x-mastodon-instance-url', 'mastodon-instance-url']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new MastodonService(env)),
    envFromHeaders
  );
});

export default app;
