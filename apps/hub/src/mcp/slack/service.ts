export interface SlackEnv {
  SLACK_BOT_TOKEN?: string;
}

export class SlackService {
  private botToken: string;
  private baseUrl = "https://slack.com/api";

  constructor(env: SlackEnv) {
    this.botToken = env.SLACK_BOT_TOKEN || "";
  }

  private async fetch(method: string, body: any = {}, options: RequestInit = {}) {
    if (!this.botToken) {
      throw new Error("Slack Bot Token missing. Please provide x-slack-bot-token header.");
    }

    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: "POST",
      ...options,
      headers: {
        "Authorization": `Bearer ${this.botToken}`,
        "Content-Type": "application/json; charset=utf-8",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    const data: any = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(`Slack API Error: ${JSON.stringify(data.error || data)}`);
    }

    return data;
  }

  async whoami() {
    return this.fetch("auth.test");
  }

  async postMessage(channelId: string, text: string, blocks?: any[]) {
    return this.fetch("chat.postMessage", {
      channel: channelId,
      text,
      blocks,
    });
  }

  async listChannels(types = "public_channel,private_channel", limit = 100) {
    return this.fetch("conversations.list", {
      types,
      limit,
    });
  }

  async getUserInfo(userId: string) {
    // Note: conversations.info/users.info usually take params in URL or body
    // Slack's JSON body support for users.info is consistent in modern API
    return this.fetch("users.info", { user: userId });
  }

  async listUsers(limit = 100) {
    return this.fetch("users.list", { limit });
  }

  async getChannelHistory(channelId: string, limit = 20) {
    return this.fetch("conversations.history", { channel: channelId, limit });
  }
}
