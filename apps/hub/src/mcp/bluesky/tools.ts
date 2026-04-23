import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod';
import { BlueskyService, toToolText } from './service.js';

function registerJsonTool<T extends z.ZodTypeAny>(
  server: McpServer,
  name: string,
  title: string,
  description: string,
  inputSchema: T,
  handler: (input: z.infer<T>) => Promise<unknown>,
) {
  server.registerTool(
    name,
    {
      title,
      description,
      inputSchema,
    },
    (async (input: z.infer<T>) => {
      const payload = await handler(input as z.infer<T>);
      return {
        content: [{ type: 'text', text: toToolText(title, payload) }],
        structuredContent: payload as Record<string, unknown>,
      };
    }) as any,
  );
}

export function buildMcpServer(service: BlueskyService) {
  const server = new McpServer({
    name: 'bluesky-mcp-server',
    version: '0.1.0',
  });

  registerJsonTool(
    server,
    'whoami',
    'Who Am I',
    'Describe the active Bluesky session and configured service URL.',
    z.object({}),
    async () => service.whoami(),
  );

  registerJsonTool(
    server,
    'resolve_handle',
    'Resolve Handle',
    'Resolve a Bluesky handle to a DID.',
    z.object({ handle: z.string().min(1) }),
    async ({ handle }) => service.resolveHandle(handle),
  );

  registerJsonTool(
    server,
    'get_profile',
    'Get Profile',
    'Fetch a Bluesky profile by handle or DID.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.getProfile(actor),
  );

  registerJsonTool(
    server,
    'search_users',
    'Search Users',
    'Search for actors on Bluesky.',
    z.object({ query: z.string().min(1), limit: z.number().int().min(1).max(100).default(10) }),
    async ({ query, limit }) => service.searchUsers(query, limit),
  );

  registerJsonTool(
    server,
    'search_posts',
    'Search Posts',
    'Search posts and replies across Bluesky.',
    z.object({
      query: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }),
    async ({ query, limit, cursor }) => service.searchPosts(query, limit, cursor),
  );

  registerJsonTool(
    server,
    'get_timeline',
    'Get Timeline',
    'Fetch the home timeline for the authenticated account.',
    z.object({
      limit: z.number().int().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }),
    async ({ limit, cursor }) => service.getTimeline(limit, cursor),
  );

  registerJsonTool(
    server,
    'get_author_feed',
    'Get Author Feed',
    'Fetch a user feed by handle or DID.',
    z.object({
      actor: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }),
    async ({ actor, limit, cursor }) => service.getAuthorFeed(actor, limit, cursor),
  );

  registerJsonTool(
    server,
    'get_thread',
    'Get Thread',
    'Fetch a post thread by URI.',
    z.object({
      uri: z.string().min(1),
      depth: z.number().int().min(0).max(100).default(2),
      parentHeight: z.number().int().min(0).max(100).default(0),
    }),
    async ({ uri, depth, parentHeight }) => service.getThread(uri, depth, parentHeight),
  );

  registerJsonTool(
    server,
    'get_followers',
    'Get Followers',
    'List followers for a user.',
    z.object({
      actor: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }),
    async ({ actor, limit, cursor }) => service.getFollowers(actor, limit, cursor),
  );

  registerJsonTool(
    server,
    'get_follows',
    'Get Follows',
    'List accounts followed by a user.',
    z.object({
      actor: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }),
    async ({ actor, limit, cursor }) => service.getFollows(actor, limit, cursor),
  );

  registerJsonTool(
    server,
    'get_notifications',
    'Get Notifications',
    'Fetch the authenticated account notifications.',
    z.object({
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }),
    async ({ limit, cursor }) => service.getNotifications(limit, cursor),
  );

  registerJsonTool(
    server,
    'list_my_records',
    'List My Records',
    'Inspect records in the authenticated account repo.',
    z.object({
      collection: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(50),
      cursor: z.string().optional(),
    }),
    async ({ collection, limit, cursor }) => service.listMyRecords(collection, limit, cursor),
  );

  registerJsonTool(
    server,
    'upload_blob',
    'Upload Blob',
    'Upload a base64-encoded blob to Bluesky.',
    z.object({
      data: z.string().min(1),
      mimeType: z.string().optional(),
      alt: z.string().optional(),
    }),
    async (input) => service.uploadBlob(input),
  );

  registerJsonTool(
    server,
    'create_post',
    'Create Post',
    'Create a new Bluesky post with optional images.',
    z.object({
      text: z.string().min(1),
      images: z
        .array(
          z.object({
            data: z.string().min(1),
            mimeType: z.string().optional(),
            alt: z.string().optional(),
          }),
        )
        .optional(),
    }),
    async ({ text, images }) => service.createPost({ text, images }),
  );

  registerJsonTool(
    server,
    'reply_to_post',
    'Reply to Post',
    'Reply to a post using root and parent record references.',
    z.object({
      text: z.string().min(1),
      rootUri: z.string().min(1),
      rootCid: z.string().min(1),
      parentUri: z.string().min(1),
      parentCid: z.string().min(1),
    }),
    async ({ text, rootUri, rootCid, parentUri, parentCid }) =>
      service.replyToPost({
        text,
        reply: { rootUri, rootCid, parentUri, parentCid },
      }),
  );

  registerJsonTool(
    server,
    'quote_post',
    'Quote Post',
    'Quote a post in a new post.',
    z.object({
      text: z.string().min(1),
      quoteUri: z.string().min(1),
      quoteCid: z.string().min(1),
    }),
    async ({ text, quoteUri, quoteCid }) =>
      service.quotePost({
        text,
        quote: { uri: quoteUri, cid: quoteCid },
      }),
  );

  registerJsonTool(
    server,
    'delete_post',
    'Delete Post',
    'Delete a post by URI.',
    z.object({ uri: z.string().min(1) }),
    async ({ uri }) => service.deletePost(uri),
  );

  registerJsonTool(
    server,
    'like_post',
    'Like Post',
    'Like a post by URI and CID.',
    z.object({ uri: z.string().min(1), cid: z.string().min(1) }),
    async ({ uri, cid }) => service.likePost(uri, cid),
  );

  registerJsonTool(
    server,
    'unlike_post',
    'Unlike Post',
    'Remove the authenticated account like for a post.',
    z.object({ uri: z.string().min(1) }),
    async ({ uri }) => service.unlikePost(uri),
  );

  registerJsonTool(
    server,
    'repost_post',
    'Repost Post',
    'Repost a post by URI and CID.',
    z.object({ uri: z.string().min(1), cid: z.string().min(1) }),
    async ({ uri, cid }) => service.repostPost(uri, cid),
  );

  registerJsonTool(
    server,
    'unrepost_post',
    'Unrepost Post',
    'Remove the authenticated account repost for a post.',
    z.object({ uri: z.string().min(1) }),
    async ({ uri }) => service.unrepostPost(uri),
  );

  registerJsonTool(
    server,
    'follow_user',
    'Follow User',
    'Follow a user by handle or DID.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.followUser(actor),
  );

  registerJsonTool(
    server,
    'unfollow_user',
    'Unfollow User',
    'Remove a follow edge for a user.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.unfollowUser(actor),
  );

  registerJsonTool(
    server,
    'mute_user',
    'Mute User',
    'Mute a user by handle or DID.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.muteUser(actor),
  );

  registerJsonTool(
    server,
    'unmute_user',
    'Unmute User',
    'Remove a mute for a user.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.unmuteUser(actor),
  );

  registerJsonTool(
    server,
    'block_user',
    'Block User',
    'Block a user by handle or DID.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.blockUser(actor),
  );

  registerJsonTool(
    server,
    'unblock_user',
    'Unblock User',
    'Remove a block for a user.',
    z.object({ actor: z.string().min(1) }),
    async ({ actor }) => service.unblockUser(actor),
  );

  registerJsonTool(
    server,
    'list_conversations',
    'List Conversations',
    'List Bluesky chat conversations for the authenticated account.',
    z.object({
      limit: z.number().int().min(1).max(100).default(20),
      cursor: z.string().optional(),
    }),
    async ({ limit, cursor }) => service.listConversations(limit, cursor),
  );

  registerJsonTool(
    server,
    'get_conversation',
    'Get Conversation',
    'Fetch a Bluesky chat conversation by conversation ID.',
    z.object({
      conversationId: z.string().min(1),
      limit: z.number().int().min(1).max(100).default(25),
      cursor: z.string().optional(),
    }),
    async ({ conversationId, limit, cursor }) =>
      service.getConversation(conversationId, limit, cursor),
  );

  registerJsonTool(
    server,
    'create_conversation',
    'Create Conversation',
    'Start a new Bluesky chat conversation.',
    z.object({
      recipients: z.array(z.string().min(1)).min(1),
      message: z.string().optional(),
    }),
    async ({ recipients, message }) => service.createConversation(recipients, message),
  );

  registerJsonTool(
    server,
    'send_message',
    'Send Message',
    'Send a message into a Bluesky chat conversation.',
    z.object({
      conversationId: z.string().min(1),
      text: z.string().min(1),
    }),
    async ({ conversationId, text }) => service.sendMessage(conversationId, text),
  );

  return server;
}
