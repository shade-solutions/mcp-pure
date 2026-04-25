import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { YouTubeService } from './service.js';

export function buildMcpServer(service: YouTubeService) {
  const server = new McpServer({
    name: 'youtube-mcp-server',
    version: '1.0.0',
  });

  // Search Tools
  server.registerTool(
    'search_youtube',
    {
      description: 'Search for videos, channels, or playlists on YouTube.',
      inputSchema: z.object({
        query: z.string().describe('Search query term'),
        type: z.enum(['video', 'channel', 'playlist']).optional().default('video').describe('Type of resource to search for'),
        limit: z.number().int().min(1).max(50).default(10).describe('Maximum number of results to return'),
      }),
    },
    async ({ query, type, limit }) => {
      const results = await service.search(query, type, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Video Tools
  server.registerTool(
    'get_video_details',
    {
      description: 'Get detailed information about a specific YouTube video.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
      }),
    },
    async ({ video_id }) => {
      const results = await service.getVideoDetails(video_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'rate_video',
    {
      description: 'Like, dislike, or remove rating from a video.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
        rating: z.enum(['like', 'dislike', 'none']).describe('The rating to apply'),
      }),
    },
    async ({ video_id, rating }) => {
      const results = await service.rateVideo(video_id, rating);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'update_video',
    {
      description: 'Update metadata for a video you own (title, description, tags, etc.).',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
        snippet: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          tags: z.array(z.string()).optional(),
          categoryId: z.string().optional(),
          defaultLanguage: z.string().optional(),
        }).describe('The video snippet metadata'),
        status: z.object({
          privacyStatus: z.enum(['public', 'private', 'unlisted']).optional(),
          selfDeclaredMadeForKids: z.boolean().optional(),
        }).optional().describe('The video status settings'),
      }),
    },
    async ({ video_id, snippet, status }) => {
      const results = await service.updateVideo(video_id, snippet, status);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'delete_video',
    {
      description: 'Delete a video you own from YouTube.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
      }),
    },
    async ({ video_id }) => {
      const results = await service.deleteVideo(video_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Playlist Tools
  server.registerTool(
    'list_playlists',
    {
      description: 'List playlists for a specific channel or the authenticated user.',
      inputSchema: z.object({
        channel_id: z.string().optional().describe('The channel ID to list playlists for (omit for authenticated user)'),
        limit: z.number().int().min(1).max(50).default(10).describe('Maximum results to return'),
      }),
    },
    async ({ channel_id, limit }) => {
      const results = await service.listPlaylists(channel_id, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'create_playlist',
    {
      description: 'Create a new playlist in your YouTube channel.',
      inputSchema: z.object({
        title: z.string().describe('The title of the playlist'),
        description: z.string().optional().describe('The description of the playlist'),
        privacy_status: z.enum(['public', 'private', 'unlisted']).optional().default('public').describe('The privacy status of the playlist'),
      }),
    },
    async ({ title, description, privacy_status }) => {
      const results = await service.createPlaylist(title, description, privacy_status);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'add_to_playlist',
    {
      description: 'Add a video to an existing playlist.',
      inputSchema: z.object({
        playlist_id: z.string().describe('The ID of the playlist'),
        video_id: z.string().describe('The ID of the video to add'),
      }),
    },
    async ({ playlist_id, video_id }) => {
      const results = await service.addVideoToPlaylist(playlist_id, video_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Comment Tools
  server.registerTool(
    'list_video_comments',
    {
      description: 'List comment threads for a specific video.',
      inputSchema: z.object({
        video_id: z.string().describe('The ID of the video'),
        limit: z.number().int().min(1).max(100).default(20).describe('Maximum results to return'),
      }),
    },
    async ({ video_id, limit }) => {
      const results = await service.listComments(video_id, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'post_comment',
    {
      description: 'Post a new top-level comment on a video.',
      inputSchema: z.object({
        video_id: z.string().describe('The ID of the video'),
        text: z.string().describe('The comment text'),
      }),
    },
    async ({ video_id, text }) => {
      const results = await service.postComment(videoId, text);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Subscription Tools
  server.registerTool(
    'list_subscriptions',
    {
      description: 'List channels the authenticated user is subscribed to.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(20).describe('Maximum results to return'),
      }),
    },
    async ({ limit }) => {
      const results = await service.listSubscriptions(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'subscribe_to_channel',
    {
      description: 'Subscribe to a specific YouTube channel.',
      inputSchema: z.object({
        channel_id: z.string().describe('The ID of the channel to subscribe to'),
      }),
    },
    async ({ channel_id }) => {
      const results = await service.subscribe(channel_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Identity Tools
  server.registerTool(
    'whoami',
    {
      description: "Get information about the authenticated user's YouTube channel.",
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
      description: "Alias for whoami. Get information about the authenticated user's YouTube channel.",
      inputSchema: z.object({}),
    },
    async () => {
      const results = await service.whoami();
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  return server;
}
