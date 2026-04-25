import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { SlackService } from './service.js';

export function buildMcpServer(service: SlackService) {
  const server = new McpServer({
    name: 'slack-mcp-server',
    version: '1.0.0',
  });

  server.registerTool(
    'post_message',
    {
      description: 'Post a message to a Slack channel.',
      inputSchema: z.object({
        channel_id: z.string().describe('Channel, private group, or IM channel to send message to'),
        text: z.string().describe('The text of the message to send'),
        blocks: z.array(z.any()).optional().describe('A JSON-based array of structured blocks'),
      }),
    },
    async (args) => {
      const results = await service.postMessage(args.channel_id, args.text, args.blocks);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'list_channels',
    {
      description: 'Lists all channels in a Slack team.',
      inputSchema: z.object({
        types: z.string().optional().default('public_channel,private_channel').describe('Mix and match channel types by providing a comma-separated list of any of public_channel, private_channel, mpim, im'),
        limit: z.number().int().min(1).max(1000).default(100).optional().describe('The maximum number of items to return'),
      }),
    },
    async (args) => {
      const results = await service.listChannels(args.types, args.limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_user_info',
    {
      description: 'Gets information about a Slack user.',
      inputSchema: z.object({
        user_id: z.string().describe('User to get info on'),
      }),
    },
    async ({ user_id }) => {
      const results = await service.getUserInfo(user_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'list_users',
    {
      description: 'Lists all users in a Slack team.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(1000).default(100).optional().describe('The maximum number of items to return'),
      }),
    },
    async (args) => {
      const results = await service.listUsers(args.limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_channel_history',
    {
      description: 'Fetches a sequence of messages or events from a conversation.',
      inputSchema: z.object({
        channel_id: z.string().describe('Conversation ID to fetch history for'),
        limit: z.number().int().min(1).max(100).default(20).optional().describe('The maximum number of items to return'),
      }),
    },
    async (args) => {
      const results = await service.getChannelHistory(args.channel_id, args.limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'whoami',
    {
      description: 'Checks authentication & identity and returns user info.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.whoami();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      description: 'Alias for whoami. Checks authentication & identity.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.whoami();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
