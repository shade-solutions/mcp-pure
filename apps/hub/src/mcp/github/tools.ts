import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { GitHubService } from './service.js';

export function buildMcpServer(service: GitHubService) {
  const server = new McpServer({
    name: 'github-mcp-server',
    version: '0.1.0',
  });

  server.registerTool(
    'get_user_info',
    {
      title: 'Get User Info',
      description: 'Get information about the authenticated user or a specific GitHub user.',
      inputSchema: z.object({
        username: z.string().optional().describe('Username to fetch info for (omit for current user)'),
      }),
    },
    async ({ username }) => {
      const results = await service.getUserInfo(username);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'whoami',
    {
      title: 'Who Am I',
      description: 'Get information about the authenticated GitHub user.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getUserInfo();
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      title: 'Fetch My Account Details',
      description: 'Alias for whoami. Get information about the authenticated GitHub user.',
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getUserInfo();
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_repositories',
    {
      title: 'List Repositories',
      description: 'List repositories for the authenticated user or a specific GitHub user.',
      inputSchema: z.object({
        username: z.string().optional(),
        type: z.enum(['all', 'owner', 'member']).default('owner'),
        limit: z.number().int().min(1).max(100).default(30),
      }),
    },
    async ({ username, type, limit }) => {
      const results = await service.listRepositories(username, type, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_repository',
    {
      title: 'Get Repository',
      description: 'Get detailed information about a specific GitHub repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
      }),
    },
    async ({ owner, repo }) => {
      const results = await service.getRepository(owner, repo);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'search_repositories',
    {
      title: 'Search Repositories',
      description: 'Search for GitHub repositories by query.',
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    },
    async ({ query, limit }) => {
      const results = await service.searchRepositories(query, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_issues',
    {
      title: 'List Issues',
      description: 'List issues in a specific repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        state: z.enum(['open', 'closed', 'all']).default('open'),
        limit: z.number().int().min(1).max(100).default(30),
      }),
    },
    async ({ owner, repo, state, limit }) => {
      const results = await service.listIssues(owner, repo, state, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'create_issue',
    {
      title: 'Create Issue',
      description: 'Create a new issue in a specific repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        title: z.string().min(1),
        body: z.string().optional(),
        labels: z.array(z.string()).optional(),
      }),
    },
    async ({ owner, repo, title, body, labels }) => {
      const results = await service.createIssue(owner, repo, title, body, labels);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_issue',
    {
      title: 'Get Issue',
      description: 'Get detailed information and comments for a specific issue.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        issueNumber: z.number().int().min(1),
      }),
    },
    async ({ owner, repo, issueNumber }) => {
      const results = await service.getIssue(owner, repo, issueNumber);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_pull_requests',
    {
      title: 'List Pull Requests',
      description: 'List pull requests in a specific repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        state: z.enum(['open', 'closed', 'all']).default('open'),
        limit: z.number().int().min(1).max(100).default(30),
      }),
    },
    async ({ owner, repo, state, limit }) => {
      const results = await service.listPullRequests(owner, repo, state, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_file_contents',
    {
      title: 'Get File Contents',
      description: 'Get the content of a specific file in a repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        path: z.string().min(1),
        ref: z.string().optional(),
      }),
    },
    async ({ owner, repo, path, ref }) => {
      const results = await service.getFileContents(owner, repo, path, ref);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'list_files',
    {
      title: 'List Files',
      description: 'List files in a specific directory of a repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        path: z.string().default(''),
        ref: z.string().optional(),
      }),
    },
    async ({ owner, repo, path, ref }) => {
      const results = await service.listFiles(owner, repo, path, ref);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'create_or_update_file',
    {
      title: 'Create or Update File',
      description: 'Create or update the content of a file in a repository.',
      inputSchema: z.object({
        owner: z.string().min(1),
        repo: z.string().min(1),
        path: z.string().min(1),
        message: z.string().min(1),
        content: z.string().min(1),
        sha: z.string().optional(),
        branch: z.string().optional(),
      }),
    },
    async ({ owner, repo, path, message, content, sha, branch }) => {
      const results = await service.createOrUpdateFile(owner, repo, path, message, content, sha, branch);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'search_code',
    {
      title: 'Search Code',
      description: 'Search for code snippets across GitHub repositories.',
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    },
    async ({ query, limit }) => {
      const results = await service.searchCode(query, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  return server;
}
