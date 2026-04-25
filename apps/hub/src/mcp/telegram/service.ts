export interface TelegramEnv {
  TELEGRAM_BOT_TOKEN?: string;
}

export class TelegramService {
  private botToken: string;
  private baseUrl: string;

  constructor(env: TelegramEnv) {
    this.botToken = env.TELEGRAM_BOT_TOKEN || "";
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  private async fetch(method: string, options: RequestInit = {}) {
    if (!this.botToken) {
      throw new Error("Telegram Bot Token missing. Please provide x-telegram-bot-token header.");
    }

    const response = await fetch(`${this.baseUrl}/${method}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data: any = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(`Telegram API Error: ${JSON.stringify(data.description || data)}`);
    }

    return data.result;
  }

  async getMe() {
    return this.fetch("getMe");
  }

  async sendMessage(chatId: string | number, text: string, parseMode?: "MarkdownV2" | "HTML") {
    return this.fetch("sendMessage", {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });
  }

  async sendPhoto(chatId: string | number, photo: string, caption?: string) {
    return this.fetch("sendPhoto", {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
        photo,
        caption,
      }),
    });
  }

  async getUpdates(limit = 100, offset?: number) {
    return this.fetch("getUpdates", {
      method: "POST",
      body: JSON.stringify({
        limit,
        offset,
      }),
    });
  }

  async getChat(chatId: string | number) {
    return this.fetch("getChat", {
      method: "POST",
      body: JSON.stringify({
        chat_id: chatId,
      }),
    });
  }
}
