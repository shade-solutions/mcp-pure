import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { RedditService } from './service.js';

export function buildMcpServer(service: RedditService) {
  const server = new McpServer({
    name: 'reddit-mcp-server',
    version: '0.1.0',
  });

  server.registerTool(
    'search_reddit',
    {
      title: 'Search Reddit',
      description: 'Search for posts or subreddits on Reddit.',
      inputSchema: z.object({
        query: z.string().min(1),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    },
    async ({ query, limit }) => {
      const results = await service.search(query, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_subreddit_posts',
    {
      title: 'Get Subreddit Posts',
      description: 'List hot, new, or top posts in a specific subreddit.',
      inputSchema: z.object({
        subreddit: z.string().min(1),
        type: z.enum(['hot', 'new', 'top']).default('hot'),
        limit: z.number().int().min(1).max(100).default(10),
      }),
    },
    async ({ subreddit, type, limit }) => {
      const results = await service.getSubredditPosts(subreddit, type, limit);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'get_post_details',
    {
      title: 'Get Post Details',
      description: 'Get comments and content of a specific Reddit post.',
      inputSchema: z.object({
        postId: z.string().min(1),
      }),
    },
    async ({ postId }) => {
      const results = await service.getPostDetails(postId);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'create_post',
    {
      title: 'Create Post',
      description: 'Submit a new post to a subreddit.',
      inputSchema: z.object({
        subreddit: z.string().min(1),
        title: z.string().min(1),
        text: z.string().optional(),
        url: z.string().url().optional(),
      }),
    },
    async ({ subreddit, title, text, url }) => {
      const results = await service.submitPost(subreddit, title, text, url);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  server.registerTool(
    'reply_to_comment',
    {
      title: 'Reply to Comment',
      description: 'Reply to a specific comment or post on Reddit.',
      inputSchema: z.object({
        parentId: z.string().min(1),
        text: z.string().min(1),
      }),
    },
    async ({ parentId, text }) => {
      const results = await service.reply(parentId, text);
      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      };
    }
  );

  return server;
}
