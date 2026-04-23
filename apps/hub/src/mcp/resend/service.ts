export interface ResendEnv {
  RESEND_API_KEY?: string;
}

export class ResendService {
  private apiKey: string;
  private baseUrl = "https://api.resend.com";

  constructor(env: ResendEnv) {
    if (!env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is required");
    }
    this.apiKey = env.RESEND_API_KEY;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Resend API Error: ${JSON.stringify(error)}`);
    }

    return response.status === 204 ? { success: true } : response.json();
  }

  // Email Tools
  async sendEmail(data: any) {
    return this.fetch("/emails", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async batchSendEmails(emails: any[]) {
    return this.fetch("/emails/batch", {
      method: "POST",
      body: JSON.stringify(emails),
    });
  }

  async getEmail(id: string) {
    return this.fetch(`/emails/${id}`);
  }

  // Domain Tools
  async listDomains() {
    return this.fetch("/domains");
  }

  async createDomain(data: any) {
    return this.fetch("/domains", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getDomain(id: string) {
    return this.fetch(`/domains/${id}`);
  }

  async deleteDomain(id: string) {
    return this.fetch(`/domains/${id}`, {
      method: "DELETE",
    });
  }

  // Audience Tools
  async listAudiences() {
    return this.fetch("/audiences");
  }

  async createAudience(name: string) {
    return this.fetch("/audiences", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async deleteAudience(id: string) {
    return this.fetch(`/audiences/${id}`, {
      method: "DELETE",
    });
  }

  // Contact Tools
  async listContacts(audienceId: string) {
    return this.fetch(`/audiences/${audienceId}/contacts`);
  }

  async createContact(audienceId: string, data: any) {
    return this.fetch(`/audiences/${audienceId}/contacts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getContact(audienceId: string, idOrEmail: string) {
    return this.fetch(`/audiences/${audienceId}/contacts/${idOrEmail}`);
  }

  async deleteContact(audienceId: string, idOrEmail: string) {
    return this.fetch(`/audiences/${audienceId}/contacts/${idOrEmail}`, {
      method: "DELETE",
    });
  }
}
