import { BskyAgent, RichText } from '@atproto/api';

export type BlueskyEnv = {
  BLUESKY_IDENTIFIER?: string;
  BLUESKY_APP_PASSWORD?: string;
  BLUESKY_PASSWORD?: string;
  BLUESKY_PDS_URL?: string;
  BLUESKY_SERVICE_URL?: string;
};

export type UploadInput = {
  data: string;
  mimeType?: string;
  alt?: string;
};

export type PostInput = {
  text: string;
  images?: UploadInput[];
  reply?: {
    rootUri: string;
    rootCid: string;
    parentUri: string;
    parentCid: string;
  };
  quote?: {
    uri: string;
    cid: string;
  };
};

type ListRecordsResult = {
  records?: Array<{ uri: string; cid?: string; value?: Record<string, unknown> }>;
  cursor?: string;
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function decodeBase64(data: string): Uint8Array {
  const clean = data.includes(',') ? data.slice(data.indexOf(',') + 1) : data;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function recordKeyFromUri(uri: string): string {
  const parts = uri.split('/').filter(Boolean);
  const key = parts.at(-1);
  if (!key) {
    throw new Error(`Invalid AT Protocol record URI: ${uri}`);
  }
  return key;
}

function isDid(value: string): boolean {
  return value.startsWith('did:');
}

function summarizeValue(value: unknown): unknown {
  if (value && typeof value === 'object') {
    return value;
  }
  return null;
}

function makeSummaryText(header: string, payload: unknown): string {
  return `${header}\n${JSON.stringify(payload, null, 2)}`;
}

export class BlueskyService {
  private readonly serviceUrl: string;
  private readonly publicAgent: BskyAgent;
  private authedAgentPromise: Promise<BskyAgent> | null = null;

  constructor(private readonly env: BlueskyEnv) {
    this.serviceUrl = trimTrailingSlash(
      env.BLUESKY_SERVICE_URL ?? env.BLUESKY_PDS_URL ?? 'https://bsky.social',
    );
    this.publicAgent = new BskyAgent({ service: this.serviceUrl });
  }

  get config() {
    return {
      serviceUrl: this.serviceUrl,
      hasIdentifier: Boolean(this.env.BLUESKY_IDENTIFIER),
      hasPassword: Boolean(this.password),
    };
  }

  private get identifier(): string | undefined {
    return this.env.BLUESKY_IDENTIFIER?.trim();
  }

  private get password(): string | undefined {
    return this.env.BLUESKY_APP_PASSWORD?.trim() ?? this.env.BLUESKY_PASSWORD?.trim();
  }

  private hasAuth(): boolean {
    return Boolean(this.identifier && this.password);
  }

  private async login(): Promise<BskyAgent> {
    const identifier = this.identifier;
    const password = this.password;

    if (!identifier || !password) {
      throw new Error(
        'Missing Bluesky credentials. Set BLUESKY_IDENTIFIER plus BLUESKY_APP_PASSWORD or BLUESKY_PASSWORD.',
      );
    }

    const agent = new BskyAgent({ service: this.serviceUrl });
    await agent.login({ identifier, password });
    return agent;
  }

  async ensureAuthedAgent(): Promise<BskyAgent> {
    if (!this.hasAuth()) {
      throw new Error(
        'This operation requires authentication. Set BLUESKY_IDENTIFIER and BLUESKY_APP_PASSWORD or BLUESKY_PASSWORD.',
      );
    }

    if (!this.authedAgentPromise) {
      this.authedAgentPromise = this.login();
    }

    return this.authedAgentPromise;
  }

  async getReadAgent(): Promise<BskyAgent> {
    if (this.hasAuth()) {
      return this.ensureAuthedAgent();
    }

    return this.publicAgent;
  }

  async getWriteAgent(): Promise<BskyAgent> {
    return this.ensureAuthedAgent();
  }

  async whoami() {
    if (!this.hasAuth()) {
      return {
        authenticated: false,
        serviceUrl: this.serviceUrl,
        identifier: this.identifier ?? null,
      };
    }

    const agent = await this.ensureAuthedAgent();
    const profile = agent.session;
    return {
      authenticated: true,
      serviceUrl: this.serviceUrl,
      handle: profile?.handle ?? null,
      did: profile?.did ?? null,
      accessJwtPresent: Boolean(profile?.accessJwt),
    };
  }

  async resolveHandle(handle: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.com.atproto.identity.resolveHandle({ handle });
    return response.data;
  }

  async resolveActor(actor: string): Promise<string> {
    if (isDid(actor)) {
      return actor;
    }

    const resolved = await this.resolveHandle(actor);
    if (!resolved.did) {
      throw new Error(`Could not resolve actor handle: ${actor}`);
    }

    return resolved.did;
  }

  async getProfile(actor: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.actor.getProfile({ actor });
    return response.data;
  }

  async searchUsers(query: string, limit = 10) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.actor.searchActors({ q: query, limit });
    return response.data;
  }

  async searchPosts(query: string, limit = 10, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.feed.searchPosts({ q: query, limit, cursor });
    return response.data;
  }

  async getTimeline(limit = 20, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.feed.getTimeline({ limit, cursor });
    return response.data;
  }

  async getAuthorFeed(actor: string, limit = 20, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.feed.getAuthorFeed({ actor, limit, cursor });
    return response.data;
  }

  async getThread(uri: string, depth = 2, parentHeight = 0) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.feed.getPostThread({ uri, depth, parentHeight });
    return response.data;
  }

  async getFollowers(actor: string, limit = 50, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.graph.getFollowers({ actor, limit, cursor });
    return response.data;
  }

  async getFollows(actor: string, limit = 50, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.graph.getFollows({ actor, limit, cursor });
    return response.data;
  }

  async getNotifications(limit = 50, cursor?: string) {
    const agent = await this.getReadAgent();
    const response = await agent.api.app.bsky.notification.listNotifications({ limit, cursor });
    return response.data;
  }

  async listMyRecords(collection: string, limit = 50, cursor?: string) {
    const agent = await this.getWriteAgent();
    const did = agent.session?.did;
    if (!did) {
      throw new Error('Authenticated session does not include a DID.');
    }

    const response = await agent.api.com.atproto.repo.listRecords({
      repo: did,
      collection,
      limit,
      cursor,
    });

    return response.data as ListRecordsResult;
  }

  async uploadBlob(input: UploadInput) {
    const agent = await this.getWriteAgent();
    const mimeType = input.mimeType ?? 'image/jpeg';
    const bytes = decodeBase64(input.data);
    const payload = new Uint8Array(bytes.length);
    payload.set(bytes);
    const blob = new Blob([payload], { type: mimeType });
    const response = await agent.uploadBlob(blob);
    return {
      ...response.data,
      mimeType,
      alt: input.alt ?? null,
    };
  }

  private async buildPostRecord(input: PostInput) {
    const agent = await this.getWriteAgent();
    const text = new RichText({ text: input.text });
    await text.detectFacets(agent);

    const record: Record<string, unknown> = {
      $type: 'app.bsky.feed.post',
      text: text.text,
      facets: text.facets,
      createdAt: new Date().toISOString(),
    };

    if (input.reply) {
      record.reply = {
        root: { uri: input.reply.rootUri, cid: input.reply.rootCid },
        parent: { uri: input.reply.parentUri, cid: input.reply.parentCid },
      };
    }

    if (input.quote) {
      record.embed = {
        $type: 'app.bsky.embed.record',
        record: {
          uri: input.quote.uri,
          cid: input.quote.cid,
        },
      };
    }

    if (input.images && input.images.length > 0) {
      const uploads = [] as Array<{ alt: string; image: unknown }>;
      for (const image of input.images) {
        const uploaded = await this.uploadBlob(image);
        uploads.push({
          alt: image.alt ?? '',
          image: uploaded.blob,
        });
      }

      record.embed = {
        $type: 'app.bsky.embed.images',
        images: uploads,
      };
    }

    return { agent, record };
  }

  async createPost(input: PostInput) {
    const { agent, record } = await this.buildPostRecord(input);
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.feed.post',
      record,
    });

    return response.data;
  }

  async deletePost(uri: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const response = await agent.api.com.atproto.repo.deleteRecord({
      repo,
      collection: 'app.bsky.feed.post',
      rkey: recordKeyFromUri(uri),
    });

    return response.data;
  }

  async replyToPost(input: Omit<PostInput, 'quote' | 'images'>) {
    return this.createPost({
      text: input.text,
      reply: input.reply,
    });
  }

  async quotePost(input: Omit<PostInput, 'reply' | 'images'>) {
    return this.createPost({
      text: input.text,
      quote: input.quote,
    });
  }

  async likePost(uri: string, cid: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.feed.like',
      record: {
        $type: 'app.bsky.feed.like',
        subject: { uri, cid },
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async repostPost(uri: string, cid: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.feed.repost',
      record: {
        $type: 'app.bsky.feed.repost',
        subject: { uri, cid },
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async followUser(actor: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const did = await this.resolveActor(actor);
    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.graph.follow',
      record: {
        $type: 'app.bsky.graph.follow',
        subject: did,
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async muteUser(actor: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const did = await this.resolveActor(actor);
    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.graph.muteActor',
      record: {
        $type: 'app.bsky.graph.muteActor',
        subject: did,
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  async blockUser(actor: string) {
    const agent = await this.getWriteAgent();
    const repo = agent.session?.did;
    if (!repo) {
      throw new Error('Authenticated session is missing a DID.');
    }

    const did = await this.resolveActor(actor);
    const response = await agent.api.com.atproto.repo.createRecord({
      repo,
      collection: 'app.bsky.graph.block',
      record: {
        $type: 'app.bsky.graph.block',
        subject: did,
        createdAt: new Date().toISOString(),
      },
    });

    return response.data;
  }

  private async deleteBySubject(collection: string, subjectUri: string, subjectField = 'subject') {
    const agent = await this.getWriteAgent();
    const did = agent.session?.did;
    if (!did) {
      throw new Error('Authenticated session is missing a DID.');
    }

    let cursor: string | undefined;

    for (let page = 0; page < 10; page += 1) {
      const response = await agent.api.com.atproto.repo.listRecords({
        repo: did,
        collection,
        limit: 100,
        cursor,
      });
      const data = response.data as ListRecordsResult;

      const match = data.records?.find((record) => {
        const value = record.value as Record<string, unknown> | undefined;
        if (!value) {
          return false;
        }

        const subject = value[subjectField];
        if (typeof subject === 'string') {
          return subject === subjectUri;
        }

        if (subject && typeof subject === 'object') {
          const maybeUri = (subject as Record<string, unknown>).uri;
          return maybeUri === subjectUri;
        }

        return false;
      });

      if (match) {
        await agent.api.com.atproto.repo.deleteRecord({
          repo: did,
          collection,
          rkey: recordKeyFromUri(match.uri),
        });
        return {
          deleted: true,
          uri: match.uri,
        };
      }

      if (!data.cursor) {
        break;
      }

      cursor = data.cursor;
    }

    return {
      deleted: false,
      uri: subjectUri,
      reason: `No matching record found in ${collection}`,
    };
  }

  async unlikePost(uri: string) {
    return this.deleteBySubject('app.bsky.feed.like', uri);
  }

  async unrepostPost(uri: string) {
    return this.deleteBySubject('app.bsky.feed.repost', uri);
  }

  async unfollowUser(actor: string) {
    const did = await this.resolveActor(actor);
    return this.deleteBySubject('app.bsky.graph.follow', did);
  }

  async unmuteUser(actor: string) {
    const did = await this.resolveActor(actor);
    return this.deleteBySubject('app.bsky.graph.muteActor', did);
  }

  async unblockUser(actor: string) {
    const did = await this.resolveActor(actor);
    return this.deleteBySubject('app.bsky.graph.block', did);
  }

  private getChatApi(agent: BskyAgent): Record<string, any> {
    const api = agent.api as Record<string, any>;
    return (
      api.chat?.bsky?.convo ??
      api.chat?.bsky?.conversation ??
      api.app?.bsky?.chat?.convo ??
      api.app?.bsky?.chat?.conversation ??
      api.chat?.convo ??
      api.app?.chat?.convo ??
      null
    );
  }

  async listConversations(limit = 20, cursor?: string) {
    const agent = await this.getWriteAgent();
    const chatApi = this.getChatApi(agent);
    if (!chatApi) {
      throw new Error('Chat APIs are not available in the installed @atproto/api version.');
    }

    const method = chatApi.listConvos ?? chatApi.listConversations;
    if (typeof method !== 'function') {
      throw new Error('The chat conversation listing method was not found.');
    }

    const response = await method.call(chatApi, { limit, cursor });
    return response.data ?? response;
  }

  async getConversation(conversationId: string, limit = 25, cursor?: string) {
    const agent = await this.getWriteAgent();
    const chatApi = this.getChatApi(agent);
    if (!chatApi) {
      throw new Error('Chat APIs are not available in the installed @atproto/api version.');
    }

    const method = chatApi.getConvo ?? chatApi.getConversation;
    if (typeof method !== 'function') {
      throw new Error('The chat conversation fetch method was not found.');
    }

    const response = await method.call(chatApi, { convoId: conversationId, limit, cursor });
    return response.data ?? response;
  }

  async createConversation(recipients: string[], message?: string) {
    const agent = await this.getWriteAgent();
    const chatApi = this.getChatApi(agent);
    if (!chatApi) {
      throw new Error('Chat APIs are not available in the installed @atproto/api version.');
    }

    const method = chatApi.getConvoForMembers ?? chatApi.createConvo ?? chatApi.createConversation;
    if (typeof method !== 'function') {
      throw new Error('The chat conversation creation method was not found.');
    }

    const convo = await method.call(chatApi, { members: recipients });

    if (message) {
      const convoId = convo?.data?.convo?.id ?? convo?.convo?.id;
      if (!convoId) {
        throw new Error('Unable to determine the conversation ID for the new chat.');
      }

      await this.sendMessage(convoId, message);
    }

    return convo.data ?? convo;
  }

  async sendMessage(conversationId: string, text: string) {
    const agent = await this.getWriteAgent();
    const chatApi = this.getChatApi(agent);
    if (!chatApi) {
      throw new Error('Chat APIs are not available in the installed @atproto/api version.');
    }

    const method = chatApi.sendMessage ?? chatApi.createMessage;
    if (typeof method !== 'function') {
      throw new Error('The chat send-message method was not found.');
    }

    const response = await method.call(chatApi, {
      convoId: conversationId,
      message: { text },
    });
    return response.data ?? response;
  }
}

export function toToolText(title: string, payload: unknown): string {
  return `${title}\n${JSON.stringify(payload, null, 2)}`;
}
