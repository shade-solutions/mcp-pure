import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { ExaService } from './service.js';

export function buildMcpServer(service: ExaService) {
  const server = new McpServer({
    name: 'exa-mcp-server',
    version: '1.0.0',
  });

  server.registerTool(
    'search',
    {
      description: 'Search for high-quality web pages using Exa AI search.',
      inputSchema: z.object({
        query: z.string().describe('The search query'),
        use_autoprompt: z.boolean().optional().default(true).describe('If true, your query will be converted to an Exa-optimized prompt'),
        type: z.enum(['keyword', 'neural']).optional().default('neural').describe('The type of search to perform'),
        num_results: z.number().int().min(1).max(100).default(10).optional(),
        include_domains: z.array(z.string()).optional(),
        exclude_domains: z.array(z.string()).optional(),
      }),
    },
    async (args) => {
      const results = await service.search(args.query, {
        useAutoprompt: args.use_autoprompt,
        type: args.type,
        numResults: args.num_results,
        includeDomains: args.include_domains,
        excludeDomains: args.exclude_domains,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'find_similar',
    {
      description: 'Find pages similar to a given URL.',
      inputSchema: z.object({
        url: z.string().url().describe('The URL to find similar pages for'),
        num_results: z.number().int().min(1).max(100).default(10).optional(),
        include_domains: z.array(z.string()).optional(),
        exclude_domains: z.array(z.string()).optional(),
      }),
    },
    async (args) => {
      const results = await service.findSimilar(args.url, {
        numResults: args.num_results,
        includeDomains: args.include_domains,
        excludeDomains: args.exclude_domains,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_contents',
    {
      description: 'Get cleaned text and highlights from specific web pages.',
      inputSchema: z.object({
        ids: z.array(z.string()).describe('The document IDs (usually URLs) to fetch contents for'),
        text: z.boolean().optional().default(true).describe('Whether to return the full text of the page'),
        highlights: z.boolean().optional().default(false).describe('Whether to return highlights/snippets from the page'),
      }),
    },
    async (args) => {
      const results = await service.getContents(args.ids, {
        text: args.text,
        highlights: args.highlights,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
