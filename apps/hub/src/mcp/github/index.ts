import { Hono } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { GitHubService, type GitHubEnv } from './service.js';
import { buildMcpServer } from './tools.js';

type Bindings = GitHubEnv;

const app = new Hono<{ Bindings: Bindings }>();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

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
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new GitHubService(env)),
    envFromHeaders
  );
});

export default app;
