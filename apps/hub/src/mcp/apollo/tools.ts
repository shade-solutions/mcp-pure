import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { ApolloService } from './service.js';

export function buildMcpServer(service: ApolloService) {
  const server = new McpServer({
    name: 'apollo-mcp-server',
    version: '1.0.0',
  });

  server.registerTool(
    'search_people',
    {
      description: 'Search for people/leads on Apollo.io.',
      inputSchema: z.object({
        keywords: z.string().optional().describe('Keywords to search for (name, title, company)'),
        titles: z.array(z.string()).optional().describe('Filter by job titles'),
        locations: z.array(z.string()).optional().describe('Filter by locations (e.g. "United States", "San Francisco")'),
        page: z.number().int().min(1).default(1).optional(),
        per_page: z.number().int().min(1).max(100).default(10).optional(),
      }),
    },
    async (args) => {
      const results = await service.searchPeople({
        q_keywords: args.keywords,
        title_filter: args.titles,
        person_locations: args.locations,
        page: args.page,
        per_page: args.per_page,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'search_organizations',
    {
      description: 'Search for companies on Apollo.io.',
      inputSchema: z.object({
        tags: z.array(z.string()).optional().describe('Filter by organization tags or keywords'),
        locations: z.array(z.string()).optional().describe('Filter by company locations'),
        employee_ranges: z.array(z.string()).optional().describe('Filter by number of employees (e.g. "1,10", "11,20")'),
        page: z.number().int().min(1).default(1).optional(),
        per_page: z.number().int().min(1).max(100).default(10).optional(),
      }),
    },
    async (args) => {
      const results = await service.searchOrganizations({
        q_organization_keyword_tags: args.tags,
        organization_locations: args.locations,
        organization_num_employees_ranges: args.employee_ranges,
        page: args.page,
        per_page: args.per_page,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'enrich_person',
    {
      description: 'Get detailed information about a person using their email address.',
      inputSchema: z.object({
        email: z.string().email().describe('The email address of the person to enrich'),
      }),
    },
    async ({ email }) => {
      const results = await service.enrichPerson(email);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'list_sequences',
    {
      description: 'List all outreach sequences (campaigns) in your Apollo account.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.listSequences();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
