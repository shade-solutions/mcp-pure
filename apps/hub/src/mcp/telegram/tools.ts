import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { TelegramService } from './service.js';

export function buildMcpServer(service: TelegramService) {
  const server = new McpServer({
    name: 'telegram-mcp-server',
    version: '1.0.0',
  });

  server.registerTool(
    'send_message',
    {
      description: 'Send a text message to a Telegram chat or user.',
      inputSchema: z.object({
        chat_id: z.union([z.string(), z.number()]).describe('Unique identifier for the target chat or username of the target channel (in the format @channelusername)'),
        text: z.string().describe('Text of the message to be sent'),
        parse_mode: z.enum(['MarkdownV2', 'HTML']).optional().describe('Mode for parsing entities in the message text'),
      }),
    },
    async (args) => {
      const results = await service.sendMessage(args.chat_id, args.text, args.parse_mode);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'send_photo',
    {
      description: 'Send a photo to a Telegram chat.',
      inputSchema: z.object({
        chat_id: z.union([z.string(), z.number()]).describe('Unique identifier for the target chat'),
        photo: z.string().describe('Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet'),
        caption: z.string().optional().describe('Photo caption'),
      }),
    },
    async (args) => {
      const results = await service.sendPhoto(args.chat_id, args.photo, args.caption);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_updates',
    {
      description: 'Receive incoming updates from Telegram (long polling).',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(100).optional().describe('Limits the number of updates to be retrieved'),
        offset: z.number().int().optional().describe('Identifier of the first update to be returned'),
      }),
    },
    async (args) => {
      const results = await service.getUpdates(args.limit, args.offset);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_chat_info',
    {
      description: 'Get up to date information about a chat.',
      inputSchema: z.object({
        chat_id: z.union([z.string(), z.number()]).describe('Unique identifier for the target chat'),
      }),
    },
    async ({ chat_id }) => {
      const results = await service.getChat(chat_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'whoami',
    {
      description: 'Get basic information about the bot in form of a User object.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getMe();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      description: 'Alias for whoami. Get basic information about the bot.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getMe();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
