import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { GitHubService, type GitHubEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = GitHubEnv;

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

function envFromHeaders(headers: Headers): Partial<GitHubEnv> {
  let token = pickHeader(headers, ['x-github-token', 'github-token', 'github_personal_access_token', 'authorization']);
  if (token?.startsWith('Bearer ')) {
    token = token.substring(7);
  } else if (token?.startsWith('token ')) {
    token = token.substring(6);
  }

  return {
    GITHUB_TOKEN: token,
    GITHUB_USER_AGENT: pickHeader(headers, ['x-github-user-agent', 'github-user-agent']),
  };
}

app.all('/', async (c) => {
  // Clone request to modify headers if needed for transport compatibility
  const rawRequest = c.req.raw;
  const headers = new Headers(rawRequest.headers);
  
  // Ensure Accept header includes both for WebStandardStreamableHTTPServerTransport
  const accept = headers.get('Accept') || '';
  if (!accept.includes('application/json') || !accept.includes('text/event-stream')) {
    headers.set('Accept', 'application/json, text/event-stream');
  }

  const modifiedRequest = new Request(rawRequest.url, {
    method: rawRequest.method,
    headers: headers,
    body: rawRequest.body,
    duplex: 'half'
  } as any);

  const headerEnv = envFromHeaders(headers);
  const requestEnv: GitHubEnv = {
    ...c.env,
    ...Object.fromEntries(
      Object.entries(headerEnv).filter(([, value]) => typeof value === 'string' && value.length > 0)
    ),
  };

  const service = new GitHubService(requestEnv);
  const server = buildMcpServer(service);
  const transport = new WebStandardStreamableHTTPServerTransport();

  await server.connect(transport);
  
  let parsedBody: any;
  try {
    // We need to read from the original request or a clone if we want to pass it to transport
    parsedBody = await c.req.json();
  } catch {
    parsedBody = undefined;
  }

  return transport.handleRequest(modifiedRequest, { parsedBody });
});

export default app;
