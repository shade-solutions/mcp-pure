import { Hono } from 'hono';
import { YouTubeService } from './service.js';
import { buildMcpServer } from './tools.ts';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    YOUTUBE_ACCESS_TOKEN: pickHeader(headers, ['x-youtube-access-token', 'youtube-access-token']),
    YOUTUBE_API_KEY: pickHeader(headers, ['x-youtube-api-key', 'youtube-api-key']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new YouTubeService(env)),
    envFromHeaders
  );
});

export default app;
