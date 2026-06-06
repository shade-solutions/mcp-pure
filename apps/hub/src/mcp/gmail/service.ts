export type GmailEnv = {
  GMAIL_ACCESS_TOKEN?: string;
  GMAIL_REFRESH_TOKEN?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
};

export class GmailService {
  private readonly accessToken: string;
  private readonly refreshToken: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private readonly env: GmailEnv) {
    this.accessToken = env.GMAIL_ACCESS_TOKEN || "";
    this.refreshToken = env.GMAIL_REFRESH_TOKEN || "";
    this.clientId = env.GMAIL_CLIENT_ID || "";
    this.clientSecret = env.GMAIL_CLIENT_SECRET || "";
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error("Gmail access token missing. Please provide x-gmail-access-token header.");
    }

    const url = `https://www.googleapis.com/gmail/v1${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async getProfile() {
    return this.request('/users/me/profile');
  }

  async listMessages(query?: string, maxResults = 10) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('maxResults', maxResults.toString());
    
    return this.request(`/users/me/messages?${params.toString()}`);
  }

  async getMessage(messageId: string, format: 'full' | 'metadata' | 'minimal' = 'full') {
    return this.request(`/users/me/messages/${messageId}?format=${format}`);
  }

  async sendMessage(to: string, subject: string, body: string, cc?: string[], bcc?: string[]) {
    const headers = [
      `From: <{from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
    ];

    if (cc && cc.length > 0) {
      headers.push(`Cc: ${cc.join(', ')}`);
    }
    if (bcc && bcc.length > 0) {
      headers.push(`Bcc: ${bcc.join(', ')}`);
    }

    const email = [
      headers.join('\r\n'),
      '',
      body,
    ].join('\r\n');

    const base64Email = btoa(unescape(encodeURIComponent(email)));

    return this.request('/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({
        raw: base64Email,
      }),
    });
  }

  async createDraft(to: string, subject: string, body: string) {
    const headers = [
      `From: <{from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
    ].join('\r\n');

    const email = [
      headers,
      '',
      body,
    ].join('\r\n');

    const base64Email = btoa(unescape(encodeURIComponent(email)));

    return this.request('/users/me/drafts', {
      method: 'POST',
      body: JSON.stringify({
        message: {
          raw: base64Email,
        },
      }),
    });
  }

  async trash(messageId: string) {
    return this.request(`/users/me/messages/${messageId}/trash`, {
      method: 'POST',
    });
  }

  async delete(messageId: string) {
    return this.request(`/users/me/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async modify(messageId: string, addLabels?: string[], removeLabels?: string[]) {
    return this.request(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        addLabelIds: addLabels,
        removeLabelIds: removeLabels,
      }),
    });
  }

  async listLabels() {
    return this.request('/users/me/labels');
  }

  async getLabel(labelId: string) {
    return this.request(`/users/me/labels/${labelId}`);
  }

  async createLabel(name: string, labelListVisibility: 'labelShow' | 'labelHide' = 'labelShow') {
    return this.request('/users/me/labels', {
      method: 'POST',
      body: JSON.stringify({
        name,
        labelListVisibility,
      }),
    });
  }

  async markAsRead(messageId: string) {
    return this.request(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        removeLabelIds: ['UNREAD'],
      }),
    });
  }

  async markAsUnread(messageId: string) {
    return this.request(`/users/me/messages/${messageId}/modify`, {
      method: 'POST',
      body: JSON.stringify({
        addLabelIds: ['UNREAD'],
      }),
    });
  }

  async listThreads(query?: string, maxResults = 10) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    params.append('maxResults', maxResults.toString());
    
    return this.request(`/users/me/threads?${params.toString()}`);
  }

  async getThread(threadId: string, format: 'full' | 'metadata' | 'minimal' = 'full') {
    return this.request(`/users/me/threads/${threadId}?format=${format}`);
  }
}
