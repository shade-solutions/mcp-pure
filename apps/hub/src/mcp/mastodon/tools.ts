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

  server.registerTool(
    'favourite_status',
    {
      description: 'Add a status to your favourites.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to favourite'),
      }),
    },
    async ({ id }) => {
      const results = await service.favouriteStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'unfavourite_status',
    {
      description: 'Remove a status from your favourites.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to unfavourite'),
      }),
    },
    async ({ id }) => {
      const results = await service.unfavouriteStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'bookmark_status',
    {
      description: 'Add a status to your bookmarks.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to bookmark'),
      }),
    },
    async ({ id }) => {
      const results = await service.bookmarkStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'unbookmark_status',
    {
      description: 'Remove a status from your bookmarks.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to unbookmark'),
      }),
    },
    async ({ id }) => {
      const results = await service.unbookmarkStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'boost_status',
    {
      description: 'Boost (repost) a status to your followers.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to boost'),
      }),
    },
    async ({ id }) => {
      const results = await service.boostStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'unboost_status',
    {
      description: 'Remove a boost from a status.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to unboost'),
      }),
    },
    async ({ id }) => {
      const results = await service.unboostStatus(id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_status',
    {
      description: 'Delete one of your own statuses.',
      inputSchema: z.object({
        id: z.string().describe('The ID of the status to delete'),
      }),
    },
    async ({ id }) => {
      const results = await service.deleteStatus(id);
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

  server.registerTool(
    'get_conversations',
    {
      description: 'View your direct conversations (DMs).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of conversations to retrieve'),
      }),
    },
    async ({ limit }) => {
      const results = await service.getConversations(limit);
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

  // Account Tools
  server.registerTool(
    'follow_account',
    {
      description: 'Follow a specific account.',
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
    'mute_account',
    {
      description: 'Mute a specific account.',
      inputSchema: z.object({
        account_id: z.string().describe('The ID of the account to mute'),
        notifications: z.boolean().optional().default(true).describe('Whether to also mute notifications'),
        duration: z.number().optional().default(0).describe('Duration of mute in seconds (0 for indefinite)'),
      }),
    },
    async ({ account_id, notifications, duration }) => {
      const results = await service.muteAccount(account_id, notifications, duration);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'report_account',
    {
      description: 'Report an account for rules violation.',
      inputSchema: z.object({
        account_id: z.string().describe('The ID of the account to report'),
        category: z.enum(['spam', 'violation', 'other']).describe('Category of the report'),
        comment: z.string().describe('Reason for the report'),
        status_ids: z.array(z.string()).optional().describe('IDs of statuses as evidence'),
      }),
    },
    async (args) => {
      const results = await service.reportAccount(args.account_id, args.category, args.comment, args.status_ids);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Personal Tools
  server.registerTool(
    'get_notifications',
    {
      description: 'List your recent notifications.',
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

  server.registerTool(
    'get_favourites',
    {
      description: 'List your favourited statuses.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(40).default(20).describe('Number of favourites to retrieve'),
      }),
    },
    async ({ limit }) => {
      const results = await service.getFavourites(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_lists',
    {
      description: 'Get your custom Mastodon lists.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getLists();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'whoami',
    {
      description: "Get the authenticated user's account details.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.verifyCredentials();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      description: "Alias for whoami. Get the authenticated user's account details.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.verifyCredentials();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
