import { Hono } from 'hono';
import { SlackService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    SLACK_BOT_TOKEN: pickHeader(headers, ['x-slack-bot-token', 'slack-bot-token']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new SlackService(env)),
    envFromHeaders
  );
});

export default app;
