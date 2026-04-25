import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { MastodonService } from './service.js';

export function buildMcpServer(service: MastodonService) {
  const server = new McpServer({
    name: 'mastodon-mcp-server',
    version: '1.0.0',
  });

  // Status Tools
  server.registerTool(
    'post_status',
    {
      description: 'Post a new status (toot) to Mastodon.',
      inputSchema: z.object({
        status: z.string().describe('The text content of the status'),
        visibility: z.enum(['public', 'unlisted', 'private', 'direct']).optional().describe('Visibility of the status'),
        spoiler_text: z.string().optional().describe('Text to be shown as a warning before the status content'),
        sensitive: z.boolean().optional().describe('Whether the status should be marked as sensitive/NSFW'),
      }),
    },
    async (args) => {
      const results = await service.postStatus(args);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Search Tool
  server.registerTool(
    'search',
    {
      description: 'Search for accounts, statuses, or hashtags on Mastodon.',
      inputSchema: z.object({
        query: z.string().describe('The search query'),
        type: z.enum(['accounts', 'statuses', 'hashtags']).optional().describe('The type of results to return'),
        limit: z.number().int().min(1).max(40).default(20).describe('Maximum number of results per type'),
      }),
    },
    async ({ query, type, limit }) => {
      const results = await service.search(query, type, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Timeline Tools
  server.registerTool(
    'get_home_timeline',
    {
      description: 'View statuses from people you follow (Home timeline).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of statuses to retrieve'),
      }),
    },
    async ({ limit }) => {
      const results = await service.getHomeTimeline(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_public_timeline',
    {
      description: 'View the public timeline (Federated or Local).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of statuses to retrieve'),
        local: z.boolean().optional().describe('Only show statuses from this instance'),
      }),
    },
    async ({ limit, local }) => {
      const results = await service.getPublicTimeline(limit, local);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Account Tools
  server.registerTool(
    'follow_account',
    {
      description: 'Follow a specific account by its ID.',
      inputSchema: z.object({
        account_id: z.string().describe('The ID of the account to follow'),
      }),
    },
    async ({ account_id }) => {
      const results = await service.followAccount(account_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'block_account',
    {
      description: 'Block a specific account by its ID.',
      inputSchema: z.object({
        account_id: z.string().describe('The ID of the account to block'),
      }),
    },
    async ({ account_id }) => {
      const results = await service.blockAccount(account_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_account',
    {
      description: 'Get detailed profile information about an account.',
      inputSchema: z.object({
        account_id: z.string().describe('The ID of the account'),
      }),
    },
    async ({ account_id }) => {
      const results = await service.getAccount(account_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Notifications & Bookmarks
  server.registerTool(
    'get_notifications',
    {
      description: 'List your recent notifications (mentions, follows, reblogs, likes).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of notifications to retrieve'),
      }),
    },
    async ({ limit }) => {
      const results = await service.getNotifications(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_bookmarks',
    {
      description: 'List your bookmarked statuses.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of bookmarks to retrieve'),
      }),
    },
    async ({ limit }) => {
      const results = await service.getBookmarks(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
