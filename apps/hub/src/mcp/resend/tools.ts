import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { ResendService } from './service.js';

export function buildMcpServer(service: ResendService) {
  const server = new McpServer({
    name: 'resend-mcp-server',
    version: '1.0.0',
  });

  // Email Tools
  server.registerTool(
    'send_email',
    {
      description: 'Send a single email via Resend.',
      inputSchema: z.object({
        from: z.string().describe('Sender email address (e.g. "onboarding@resend.dev")'),
        to: z.union([z.string(), z.array(z.string())]).describe('Recipient email address(es)'),
        subject: z.string().describe('Email subject line'),
        html: z.string().optional().describe('HTML content of the email'),
        text: z.string().optional().describe('Plain text content of the email'),
        reply_to: z.string().optional().describe('Reply-to email address'),
        cc: z.union([z.string(), z.array(z.string())]).optional().describe('CC recipient(s)'),
        bcc: z.union([z.string(), z.array(z.string())]).optional().describe('BCC recipient(s)'),
      }),
    },
    async (args) => {
      const results = await service.sendEmail(args);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'batch_send_emails',
    {
      description: 'Send up to 100 emails in a single request.',
      inputSchema: z.object({
        emails: z.array(z.object({
          from: z.string(),
          to: z.union([z.string(), z.array(z.string())]),
          subject: z.string(),
          html: z.string().optional(),
          text: z.string().optional(),
        })).max(100).describe('Array of email objects to send'),
      }),
    },
    async ({ emails }) => {
      const results = await service.batchSendEmails(emails);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_email',
    {
      description: 'Get details and status of a sent email.',
      inputSchema: z.object({
        email_id: z.string().describe('The unique ID of the email'),
      }),
    },
    async ({ email_id }) => {
      const results = await service.getEmail(email_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Domain Tools
  server.registerTool(
    'list_domains',
    {
      description: 'List all registered domains.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.listDomains();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'create_domain',
    {
      description: 'Register a new domain for sending emails.',
      inputSchema: z.object({
        name: z.string().describe('The domain name (e.g. "example.com")'),
      }),
    },
    async (args) => {
      const results = await service.createDomain(args);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_domain',
    {
      description: 'Get details/verification status for a specific domain.',
      inputSchema: z.object({
        domain_id: z.string().describe('The unique ID of the domain'),
      }),
    },
    async ({ domain_id }) => {
      const results = await service.getDomain(domain_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_domain',
    {
      description: 'Remove a domain from your account.',
      inputSchema: z.object({
        domain_id: z.string().describe('The unique ID of the domain'),
      }),
    },
    async ({ domain_id }) => {
      const results = await service.deleteDomain(domain_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Audience Tools
  server.registerTool(
    'list_audiences',
    {
      description: 'List all email audiences.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.listAudiences();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'create_audience',
    {
      description: 'Create a new audience group.',
      inputSchema: z.object({
        name: z.string().describe('Name of the audience'),
      }),
    },
    async ({ name }) => {
      const results = await service.createAudience(name);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_audience',
    {
      description: 'Delete an audience and all its contacts.',
      inputSchema: z.object({
        audience_id: z.string().describe('The unique ID of the audience'),
      }),
    },
    async ({ audience_id }) => {
      const results = await service.deleteAudience(audience_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Contact Tools
  server.registerTool(
    'list_contacts',
    {
      description: 'List all contacts in a specific audience.',
      inputSchema: z.object({
        audience_id: z.string().describe('The unique ID of the audience'),
      }),
    },
    async ({ audience_id }) => {
      const results = await service.listContacts(audience_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'create_contact',
    {
      description: 'Add a contact to an audience.',
      inputSchema: z.object({
        audience_id: z.string().describe('The unique ID of the audience'),
        email: z.string().describe('Contact email address'),
        first_name: z.string().optional().describe('Contact first name'),
        last_name: z.string().optional().describe('Contact last name'),
        unsubscribed: z.boolean().optional().describe('Subscription status'),
      }),
    },
    async ({ audience_id, ...data }) => {
      const results = await service.createContact(audience_id, data);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_contact',
    {
      description: 'Get details for a specific contact.',
      inputSchema: z.object({
        audience_id: z.string().describe('The unique ID of the audience'),
        id_or_email: z.string().describe('The unique ID or email of the contact'),
      }),
    },
    async ({ audience_id, id_or_email }) => {
      const results = await service.getContact(audience_id, id_or_email);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_contact',
    {
      description: 'Remove a contact from an audience.',
      inputSchema: z.object({
        audience_id: z.string().describe('The unique ID of the audience'),
        id_or_email: z.string().describe('The unique ID or email of the contact'),
      }),
    },
    async ({ audience_id, id_or_email }) => {
      const results = await service.deleteContact(audience_id, id_or_email);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
