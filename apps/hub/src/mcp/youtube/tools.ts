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

  server.registerTool(
    'list_my_youtube_videos',
    {
      description: "List the authenticated user's YouTube videos.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(10).describe('Maximum number of results to return'),
      }),
    },
    async ({ limit }) => {
      const results = await service.listMyVideos(limit);
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

  server.registerTool(
    'upload_youtube_video',
    {
      description: 'Upload a video to YouTube from a public URL.',
      inputSchema: z.object({
        video_url: z.string().url().describe('The public URL of the video file to upload'),
        title: z.string().describe('The title of the video'),
        description: z.string().optional().describe('The description of the video'),
        tags: z.array(z.string()).optional().describe('Tags for the video'),
        privacy_status: z.enum(['public', 'private', 'unlisted']).optional().default('private').describe('The privacy status of the video'),
        category_id: z.string().optional().describe('The YouTube video category ID'),
      }),
    },
    async ({ video_url, title, description, tags, privacy_status, category_id }) => {
      const snippet = { title, description, tags, categoryId: category_id };
      const status = { privacyStatus: privacy_status };
      const results = await service.uploadVideo(video_url, snippet, status);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'set_video_thumbnail',
    {
      description: 'Set a custom thumbnail for a video from a public URL.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
        thumbnail_url: z.string().url().describe('The public URL of the thumbnail image'),
      }),
    },
    async ({ video_id, thumbnail_url }) => {
      const results = await service.setThumbnail(video_id, thumbnail_url);
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

  server.registerTool(
    'list_playlist_items',
    {
      description: 'List items in a specific YouTube playlist.',
      inputSchema: z.object({
        playlist_id: z.string().describe('The YouTube playlist ID'),
        limit: z.number().int().min(1).max(50).default(20).describe('Maximum number of results to return'),
      }),
    },
    async ({ playlist_id, limit }) => {
      const results = await service.listPlaylistItems(playlist_id, limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'remove_from_playlist',
    {
      description: 'Remove a video from a playlist using its playlist item ID.',
      inputSchema: z.object({
        playlist_item_id: z.string().describe('The ID of the playlist item to remove'),
      }),
    },
    async ({ playlist_item_id }) => {
      const results = await service.removeFromPlaylist(playlist_item_id);
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

  server.registerTool(
    'get_channel_details',
    {
      description: 'Get detailed information about a specific YouTube channel.',
      inputSchema: z.object({
        channel_id: z.string().describe('The YouTube channel ID'),
      }),
    },
    async ({ channel_id }) => {
      const results = await service.getChannelDetails(channel_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Analytics Tools
  server.registerTool(
    'get_youtube_analytics',
    {
      description: 'Get analytics reports for your YouTube channel or videos.',
      inputSchema: z.object({
        ids: z.string().default('channel==MINE').describe('The ID of the channel or video to get analytics for (e.g., channel==MINE or video==VIDEO_ID)'),
        start_date: z.string().describe('The start date for the report (YYYY-MM-DD)'),
        end_date: z.string().describe('The end date for the report (YYYY-MM-DD)'),
        metrics: z.string().default('views,comments,likes,dislikes,estimatedMinutesWatched,averageViewDuration').describe('Comma-separated list of metrics to retrieve'),
        dimensions: z.string().optional().describe('Comma-separated list of dimensions (e.g., day, country, deviceType)'),
        filters: z.string().optional().describe('Filters for the report'),
        sort: z.string().optional().describe('Dimensions/metrics to sort by'),
      }),
    },
    async (params) => {
      const results = await service.getReports({
        ids: params.ids,
        startDate: params.start_date,
        endDate: params.end_date,
        metrics: params.metrics,
        dimensions: params.dimensions,
        filters: params.filters,
        sort: params.sort,
      });
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Activity Tools
  server.registerTool(
    'list_my_youtube_activities',
    {
      description: 'List recent activities (uploads, likes, etc.) for the authenticated user.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(50).default(20).describe('Maximum results to return'),
      }),
    },
    async ({ limit }) => {
      const results = await service.listMyActivities(limit);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // Caption & Transcript Tools
  server.registerTool(
    'list_video_captions',
    {
      description: 'List available caption tracks for a specific video.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
      }),
    },
    async ({ video_id }) => {
      const results = await service.listCaptions(video_id);
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  server.registerTool(
    'get_video_transcript',
    {
      description: 'Get the transcript/captions for a video. Note: Requires appropriate permissions or public captions.',
      inputSchema: z.object({
        video_id: z.string().describe('The YouTube video ID'),
        lang: z.string().default('en').describe('Preferred language code for captions'),
      }),
    },
    async ({ video_id, lang }) => {
      const captions = await service.listCaptions(video_id);
      const track = captions.items?.find((i: any) => i.snippet.language === lang) || captions.items?.[0];
      
      if (!track) {
        return { content: [{ type: 'text', text: 'No captions found for this video.' }] };
      }

      try {
        const text = await service.getCaption(track.id);
        return { content: [{ type: 'text', text }] };
      } catch (e: any) {
        return { content: [{ type: 'text', text: `Failed to fetch transcript: ${e.message}. Note: You may need specific OAuth scopes to download captions.` }] };
      }
    }
  );

  return server;
}
