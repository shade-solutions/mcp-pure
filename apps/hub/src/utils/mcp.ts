import { Context } from 'hono';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function pickHeader(headers: Headers, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = headers.get(key);
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export async function handleMcpRequest(c: Context, buildServer: (env: any) => McpServer, envMapper: (headers: Headers) => any) {
  const rawRequest = c.req.raw;
  const headers = new Headers(rawRequest.headers);
  
  // Ensure Accept header includes both for WebStandardStreamableHTTPServerTransport compatibility
  const accept = headers.get('Accept') || '';
  if (!accept.includes('application/json') || !accept.includes('text/event-stream')) {
    headers.set('Accept', 'application/json, text/event-stream');
  }

  // Support Authorization: Bearer <token> for standard clients
  const auth = headers.get('Authorization');
  if (auth && (auth.startsWith('Bearer ') || auth.startsWith('token '))) {
    // If we have an Authorization header, we treat it as the primary token
    // Mapping will happen in envMapper
  }

  const modifiedRequest = new Request(rawRequest.url, {
    method: rawRequest.method,
    headers: headers,
    body: rawRequest.body,
    duplex: 'half'
  } as any);

  const env = {
    ...c.env,
    ...envMapper(headers)
  };

  const server = buildServer(env);
  const transport = new WebStandardStreamableHTTPServerTransport();

  await server.connect(transport);
  
  let parsedBody: any;
  try {
    parsedBody = await c.req.json();
  } catch {
    parsedBody = undefined;
  }

  return transport.handleRequest(modifiedRequest, { parsedBody });
}
