import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { InstagramService } from './service.js';

const ok = (data: any) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] });

export function buildMcpServer(service: InstagramService) {
  const server = new McpServer({
    name: 'instagram-mcp-server',
    version: '1.0.0',
  });

  // ----- Identity & Account -----
  server.registerTool(
    'whoami',
    {
      description: 'Get details about the authenticated Instagram Business/Creator account (username, bio, follower counts, media count).',
      inputSchema: z.object({}),
    },
    async () => ok(await service.whoami())
  );

  server.registerTool(
    'fetch_my_account_details',
    {
      description: 'Alias for whoami. Get details about the authenticated Instagram account.',
      inputSchema: z.object({}),
    },
    async () => ok(await service.whoami())
  );

  server.registerTool(
    'get_account_insights',
    {
      description: 'Get analytics/insights for the authenticated account (e.g. reach, impressions, profile_views).',
      inputSchema: z.object({
        metrics: z.string().describe('Comma-separated metrics, e.g. "reach,impressions,profile_views,follower_count"'),
        period: z.enum(['day', 'week', 'days_28', 'lifetime']).default('day').optional().describe('Aggregation period'),
      }),
    },
    async ({ metrics, period }) => ok(await service.getAccountInsights(metrics, period))
  );

  // ----- Media (read) -----
  server.registerTool(
    'list_my_media',
    {
      description: 'List recent media (posts/reels) published by the authenticated account.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ limit }) => ok(await service.listMyMedia(limit))
  );

  server.registerTool(
    'get_media_details',
    {
      description: 'Get full details for a single media object (caption, type, engagement, permalink).',
      inputSchema: z.object({
        media_id: z.string().describe('The media (post/reel) ID'),
      }),
    },
    async ({ media_id }) => ok(await service.getMediaDetails(media_id))
  );

  server.registerTool(
    'get_media_insights',
    {
      description: 'Get engagement insights for a specific media object (reach, likes, comments, saved, shares).',
      inputSchema: z.object({
        media_id: z.string().describe('The media (post/reel) ID'),
        metrics: z.string().default('reach,likes,comments,saved,shares').optional().describe('Comma-separated metric names'),
      }),
    },
    async ({ media_id, metrics }) => ok(await service.getMediaInsights(media_id, metrics))
  );

  // ----- Publishing -----
  server.registerTool(
    'publish_photo',
    {
      description: 'Publish a photo post to the feed. The image must be a publicly accessible URL (JPEG).',
      inputSchema: z.object({
        image_url: z.string().url().describe('Publicly accessible URL of the image'),
        caption: z.string().optional().describe('Caption text, may include hashtags and @mentions'),
      }),
    },
    async ({ image_url, caption }) => ok(await service.publishPhoto(image_url, caption))
  );

  server.registerTool(
    'publish_reel',
    {
      description: 'Publish a Reel (video). The video must be a publicly accessible URL meeting Reels specs.',
      inputSchema: z.object({
        video_url: z.string().url().describe('Publicly accessible URL of the video'),
        caption: z.string().optional().describe('Caption text'),
        cover_url: z.string().url().optional().describe('Optional cover image URL'),
      }),
    },
    async ({ video_url, caption, cover_url }) => ok(await service.publishReel(video_url, caption, cover_url))
  );

  server.registerTool(
    'publish_story',
    {
      description: 'Publish a Story (photo or video) to the authenticated account.',
      inputSchema: z.object({
        media_url: z.string().url().describe('Publicly accessible URL of the image or video'),
        is_video: z.boolean().default(false).optional().describe('Set true if the media_url is a video'),
      }),
    },
    async ({ media_url, is_video }) => ok(await service.publishStory(media_url, is_video))
  );

  server.registerTool(
    'get_publishing_limit',
    {
      description: 'Check how many posts remain in the rolling 24-hour content publishing quota.',
      inputSchema: z.object({}),
    },
    async () => ok(await service.getPublishingLimit())
  );

  // ----- Comments & Replies -----
  server.registerTool(
    'list_media_comments',
    {
      description: 'List comments (and nested replies) on a media object.',
      inputSchema: z.object({
        media_id: z.string().describe('The media (post/reel) ID'),
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ media_id, limit }) => ok(await service.listMediaComments(media_id, limit))
  );

  server.registerTool(
    'get_comment_replies',
    {
      description: 'List replies to a specific comment.',
      inputSchema: z.object({
        comment_id: z.string().describe('The parent comment ID'),
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ comment_id, limit }) => ok(await service.getCommentReplies(comment_id, limit))
  );

  server.registerTool(
    'create_comment',
    {
      description: 'Post a top-level comment on a media object.',
      inputSchema: z.object({
        media_id: z.string().describe('The media (post/reel) ID'),
        message: z.string().describe('Comment text'),
      }),
    },
    async ({ media_id, message }) => ok(await service.createComment(media_id, message))
  );

  server.registerTool(
    'reply_to_comment',
    {
      description: 'Reply to an existing comment on a media object.',
      inputSchema: z.object({
        comment_id: z.string().describe('The comment ID to reply to'),
        message: z.string().describe('Reply text'),
      }),
    },
    async ({ comment_id, message }) => ok(await service.replyToComment(comment_id, message))
  );

  server.registerTool(
    'hide_comment',
    {
      description: 'Hide or unhide a comment on the authenticated account\'s media.',
      inputSchema: z.object({
        comment_id: z.string().describe('The comment ID'),
        hide: z.boolean().default(true).optional().describe('true to hide, false to unhide'),
      }),
    },
    async ({ comment_id, hide }) => ok(await service.hideComment(comment_id, hide))
  );

  server.registerTool(
    'delete_comment',
    {
      description: 'Delete a comment owned by the authenticated account.',
      inputSchema: z.object({
        comment_id: z.string().describe('The comment ID to delete'),
      }),
    },
    async ({ comment_id }) => ok(await service.deleteComment(comment_id))
  );

  server.registerTool(
    'get_mentioned_media',
    {
      description: 'List media where the authenticated account was tagged/mentioned.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ limit }) => ok(await service.getMentionedMedia(limit))
  );

  // ----- Direct Messages -----
  server.registerTool(
    'list_conversations',
    {
      description: 'List Instagram Direct (DM) conversations for the authenticated account.',
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ limit }) => ok(await service.listConversations(limit))
  );

  server.registerTool(
    'get_conversation_messages',
    {
      description: 'Get the messages within a specific DM conversation.',
      inputSchema: z.object({
        conversation_id: z.string().describe('The conversation ID'),
        limit: z.number().int().min(1).max(100).default(25).optional(),
      }),
    },
    async ({ conversation_id, limit }) => ok(await service.getConversationMessages(conversation_id, limit))
  );

  server.registerTool(
    'send_direct_message',
    {
      description: 'Send a text Direct Message (DM) to a user. The recipient must be addressable per Instagram messaging policy (e.g. within the 24h window or has messaged you).',
      inputSchema: z.object({
        recipient_id: z.string().describe('The Instagram-scoped user ID (IGSID) of the recipient'),
        text: z.string().describe('Message text to send'),
      }),
    },
    async ({ recipient_id, text }) => ok(await service.sendDirectMessage(recipient_id, text))
  );

  server.registerTool(
    'send_direct_image',
    {
      description: 'Send an image attachment as a Direct Message.',
      inputSchema: z.object({
        recipient_id: z.string().describe('The Instagram-scoped user ID (IGSID) of the recipient'),
        image_url: z.string().url().describe('Publicly accessible image URL'),
      }),
    },
    async ({ recipient_id, image_url }) => ok(await service.sendDirectImage(recipient_id, image_url))
  );

  server.registerTool(
    'react_to_message',
    {
      description: 'Apply a reaction (e.g. "love") to a specific DM message.',
      inputSchema: z.object({
        recipient_id: z.string().describe('The IGSID of the conversation partner'),
        message_id: z.string().describe('The message ID to react to'),
        reaction: z.string().default('love').optional().describe('Reaction type, e.g. "love"'),
      }),
    },
    async ({ recipient_id, message_id, reaction }) => ok(await service.reactToMessage(recipient_id, message_id, reaction))
  );

  // ----- Search -----
  server.registerTool(
    'search_hashtag',
    {
      description: 'Resolve a hashtag name to its ID (required before fetching hashtag media).',
      inputSchema: z.object({
        query: z.string().describe('Hashtag text without the # symbol, e.g. "coffee"'),
      }),
    },
    async ({ query }) => ok(await service.searchHashtag(query))
  );

  server.registerTool(
    'get_hashtag_recent_media',
    {
      description: 'Get the most recent public media for a hashtag ID.',
      inputSchema: z.object({
        hashtag_id: z.string().describe('The hashtag ID (from search_hashtag)'),
        limit: z.number().int().min(1).max(50).default(25).optional(),
      }),
    },
    async ({ hashtag_id, limit }) => ok(await service.getHashtagRecentMedia(hashtag_id, limit))
  );

  server.registerTool(
    'get_hashtag_top_media',
    {
      description: 'Get the top/most-engaged public media for a hashtag ID.',
      inputSchema: z.object({
        hashtag_id: z.string().describe('The hashtag ID (from search_hashtag)'),
        limit: z.number().int().min(1).max(50).default(25).optional(),
      }),
    },
    async ({ hashtag_id, limit }) => ok(await service.getHashtagTopMedia(hashtag_id, limit))
  );

  // ----- Lead Generation -----
  server.registerTool(
    'discover_business_profile',
    {
      description: 'Look up any public Business/Creator profile by username (bio, follower counts, recent media engagement). Useful for qualifying a prospect.',
      inputSchema: z.object({
        username: z.string().describe('The public Instagram username to inspect (without @)'),
        media_limit: z.number().int().min(1).max(50).default(10).optional().describe('How many recent posts to include'),
      }),
    },
    async ({ username, media_limit }) => ok(await service.discoverBusinessProfile(username, media_limit))
  );

  server.registerTool(
    'find_leads_by_hashtag',
    {
      description: 'Find prospect leads by searching a hashtag and ranking the resulting posts by engagement. Returns media + author signals sorted by likes+comments.',
      inputSchema: z.object({
        query: z.string().describe('Hashtag text without the # symbol'),
        strategy: z.enum(['top', 'recent']).default('top').optional().describe('Pull top (most engaged) or recent media'),
        limit: z.number().int().min(1).max(50).default(25).optional(),
      }),
    },
    async ({ query, strategy, limit }) => ok(await service.findLeadsByHashtag(query, { strategy, limit }))
  );

  server.registerTool(
    'find_leads_from_commenters',
    {
      description: 'Find engaged-user leads by extracting and ranking the unique commenters on a given media object.',
      inputSchema: z.object({
        media_id: z.string().describe('The media (post/reel) ID to mine commenters from'),
        limit: z.number().int().min(1).max(100).default(50).optional(),
      }),
    },
    async ({ media_id, limit }) => ok(await service.findLeadsFromCommenters(media_id, limit))
  );

  return server;
}
