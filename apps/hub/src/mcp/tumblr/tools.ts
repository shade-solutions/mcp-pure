import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { TumblrService } from './service.js';

export function buildMcpServer(service: TumblrService) {
  const server = new McpServer({
    name: 'tumblr-mcp-server',
    version: '1.0.0',
  });

  // Post Tools
  server.registerTool(
    'create_post',
    {
      description: 'Create a new post on Tumblr using the New Post Format (NPF).',
      inputSchema: z.object({
        blog_identifier: z.string().describe("The blog name (e.g. 'myblog.tumblr.com' or just 'myblog')"),
        content: z.array(z.object({
          type: z.enum(["text", "image", "link", "video", "audio"]),
          text: z.string().optional().describe("For text blocks"),
          url: z.string().optional().describe("For link/image/video/audio blocks"),
          alt_text: z.string().optional().describe("For image blocks"),
        })).describe("Array of content blocks (e.g. [{type: 'text', text: 'Hello world'}])"),
        tags: z.array(z.string()).optional().describe("Array of tags for the post"),
        state: z.enum(["published", "queue", "draft", "private"]).optional().default("published").describe("Initial state of the post"),
      }),
    },
    async ({ blog_identifier, content, tags, state }) => {
      const results = await service.createPost(blog_identifier, content, tags, state);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_blog_posts',
    {
      description: 'Get recent posts from a specific blog.',
      inputSchema: z.object({
        blog_identifier: z.string().describe("The blog identifier"),
        limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
      }),
    },
    async ({ blog_identifier, limit }) => {
      const results = await service.getBlogPosts(blog_identifier, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // User Tools
  server.registerTool(
    'get_dashboard',
    {
      description: "Get the authenticated user's dashboard posts.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
        type: z.enum(["text", "photo", "quote", "link", "chat", "audio", "video"]).optional().describe("Filter by post type"),
      }),
    },
    async ({ limit, type }) => {
      const results = await service.getDashboard(limit, type);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'like_post',
    {
      description: 'Like a post on Tumblr.',
      inputSchema: z.object({
        post_id: z.string().describe("The ID of the post"),
        reblog_key: z.string().describe("The reblog key of the post"),
      }),
    },
    async ({ post_id, reblog_key }) => {
      const results = await service.likePost(post_id, reblog_key);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'unlike_post',
    {
      description: 'Remove a like from a post on Tumblr.',
      inputSchema: z.object({
        post_id: z.string().describe("The ID of the post"),
        reblog_key: z.string().describe("The reblog key of the post"),
      }),
    },
    async ({ post_id, reblog_key }) => {
      const results = await service.unlikePost(post_id, reblog_key);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'reblog_post',
    {
      description: 'Reblog a post to your own blog.',
      inputSchema: z.object({
        blog_identifier: z.string().describe("The blog to reblog TO (e.g. 'myblog')"),
        post_id: z.string().describe("The ID of the post to reblog"),
        reblog_key: z.string().describe("The reblog key of the post"),
        comment: z.string().optional().describe("Optional comment/caption for the reblog"),
      }),
    },
    async ({ blog_identifier, post_id, reblog_key, comment }) => {
      const results = await service.reblogPost(blog_identifier, post_id, reblog_key, comment);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_post',
    {
      description: 'Delete one of your own posts or reblogs.',
      inputSchema: z.object({
        blog_identifier: z.string().describe("The blog identifier"),
        post_id: z.string().describe("The ID of the post to delete"),
      }),
    },
    async ({ blog_identifier, post_id }) => {
      const results = await service.deletePost(blog_identifier, post_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'follow_blog',
    {
      description: 'Follow a blog on Tumblr.',
      inputSchema: z.object({
        blog_identifier: z.string().describe("The blog identifier or URL to follow"),
      }),
    },
    async ({ blog_identifier }) => {
      const results = await service.followBlog(blog_identifier);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_user_info',
    {
      description: "Get the authenticated user's profile information and blogs.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getUserInfo();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'whoami',
    {
      description: "Alias for get_user_info. Get the authenticated user's profile information and blogs.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getUserInfo();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      description: "Alias for get_user_info. Get the authenticated user's profile information and blogs.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.getUserInfo();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Search Tool
  server.registerTool(
    'search_tagged',
    {
      description: 'Search for posts with a specific tag across Tumblr.',
      inputSchema: z.object({
        tag: z.string().describe("The tag to search for"),
        limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
      }),
    },
    async ({ tag, limit }) => {
      const results = await service.searchTagged(tag, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
