import { Hono } from 'hono';
import { InstagramService } from './service.js';
import { buildMcpServer } from './tools.ts';

const app = new Hono();

import { pickHeader, handleMcpRequest } from '../../utils/mcp.js';

function envFromHeaders(headers: Headers) {
  return {
    INSTAGRAM_ACCESS_TOKEN: pickHeader(headers, ['x-instagram-access-token', 'instagram-access-token']),
    INSTAGRAM_USER_ID: pickHeader(headers, ['x-instagram-user-id', 'instagram-user-id']),
  };
}

app.all('/', async (c) => {
  return handleMcpRequest(
    c,
    (env) => buildMcpServer(new InstagramService(env)),
    envFromHeaders
  );
});

export default app;
