import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { GmailService } from './service.js';

export function buildMcpServer(service: GmailService) {
  const server = new McpServer({
    name: 'gmail-mcp-server',
    version: '0.1.0',
  });

  server.registerTool(
    'get_profile',
    {
      title: 'Get Gmail Profile',
      description: 'Get the Gmail profile information for the authenticated user.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getProfile();
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_messages',
    {
      title: 'List Messages',
      description: 'List email messages from the authenticated user\'s mailbox.',
      inputSchema: z.object({
        query: z.string().optional().describe('Gmail search query (e.g., "from:user@example.com", "is:unread")'),
        maxResults: z.number().int().min(1).max(100).default(10).describe('Maximum number of messages to return'),
      }),
    },
    async ({ query, maxResults }) => {
      const results = await service.listMessages(query, maxResults);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_message',
    {
      title: 'Get Message',
      description: 'Get the full content of a specific email message.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to retrieve'),
        format: z.enum(['full', 'metadata', 'minimal']).default('full').describe('The format to return the message in'),
      }),
    },
    async ({ messageId, format }) => {
      const results = await service.getMessage(messageId, format);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'send_message',
    {
      title: 'Send Message',
      description: 'Send an email message.',
      inputSchema: z.object({
        to: z.string().describe('Recipient email address'),
        subject: z.string().describe('Email subject'),
        body: z.string().describe('Email body (plain text or HTML)'),
        cc: z.array(z.string()).optional().describe('CC recipients'),
        bcc: z.array(z.string()).optional().describe('BCC recipients'),
      }),
    },
    async ({ to, subject, body, cc, bcc }) => {
      const results = await service.sendMessage(to, subject, body, cc, bcc);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'create_draft',
    {
      title: 'Create Draft',
      description: 'Create a draft email message.',
      inputSchema: z.object({
        to: z.string().describe('Recipient email address'),
        subject: z.string().describe('Email subject'),
        body: z.string().describe('Email body'),
      }),
    },
    async ({ to, subject, body }) => {
      const results = await service.createDraft(to, subject, body);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'trash_message',
    {
      title: 'Trash Message',
      description: 'Move an email message to trash.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to trash'),
      }),
    },
    async ({ messageId }) => {
      const results = await service.trash(messageId);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'delete_message',
    {
      title: 'Delete Message',
      description: 'Permanently delete an email message.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to delete'),
      }),
    },
    async ({ messageId }) => {
      await service.delete(messageId);
      return {
        content: [{ type: 'text', text: 'Message deleted successfully' }],
      };
    }
  );

  server.registerTool(
    'modify_message',
    {
      title: 'Modify Message',
      description: 'Modify an email message by adding or removing labels.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to modify'),
        addLabels: z.array(z.string()).optional().describe('Label IDs to add to the message'),
        removeLabels: z.array(z.string()).optional().describe('Label IDs to remove from the message'),
      }),
    },
    async ({ messageId, addLabels, removeLabels }) => {
      const results = await service.modify(messageId, addLabels, removeLabels);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'mark_as_read',
    {
      title: 'Mark as Read',
      description: 'Mark an email message as read.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to mark as read'),
      }),
    },
    async ({ messageId }) => {
      const results = await service.markAsRead(messageId);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'mark_as_unread',
    {
      title: 'Mark as Unread',
      description: 'Mark an email message as unread.',
      inputSchema: z.object({
        messageId: z.string().describe('The ID of the message to mark as unread'),
      }),
    },
    async ({ messageId }) => {
      const results = await service.markAsUnread(messageId);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_labels',
    {
      title: 'List Labels',
      description: 'List all labels in the authenticated user\'s Gmail account.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.listLabels();
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_label',
    {
      title: 'Get Label',
      description: 'Get information about a specific Gmail label.',
      inputSchema: z.object({
        labelId: z.string().describe('The ID of the label'),
      }),
    },
    async ({ labelId }) => {
      const results = await service.getLabel(labelId);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'create_label',
    {
      title: 'Create Label',
      description: 'Create a new label in the authenticated user\'s Gmail account.',
      inputSchema: z.object({
        name: z.string().describe('The name of the label to create'),
        visibility: z.enum(['labelShow', 'labelHide']).default('labelShow').describe('Whether the label should be visible in the label list'),
      }),
    },
    async ({ name, visibility }) => {
      const results = await service.createLabel(name, visibility);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_threads',
    {
      title: 'List Threads',
      description: 'List email threads from the authenticated user\'s mailbox.',
      inputSchema: z.object({
        query: z.string().optional().describe('Gmail search query'),
        maxResults: z.number().int().min(1).max(100).default(10).describe('Maximum number of threads to return'),
      }),
    },
    async ({ query, maxResults }) => {
      const results = await service.listThreads(query, maxResults);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_thread',
    {
      title: 'Get Thread',
      description: 'Get the full content of a specific email thread.',
      inputSchema: z.object({
        threadId: z.string().describe('The ID of the thread to retrieve'),
        format: z.enum(['full', 'metadata', 'minimal']).default('full').describe('The format to return the thread in'),
      }),
    },
    async ({ threadId, format }) => {
      const results = await service.getThread(threadId, format);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  return server;
}
