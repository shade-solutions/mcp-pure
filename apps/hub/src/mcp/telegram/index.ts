import { Hono } from 'hono';
import { TelegramService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    TELEGRAM_BOT_TOKEN: pickHeader(headers, ['x-telegram-bot-token', 'telegram-bot-token']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new TelegramService(env)),
    envFromHeaders
  );
});

export default app;
