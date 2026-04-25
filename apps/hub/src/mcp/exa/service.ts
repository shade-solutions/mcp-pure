export interface ExaEnv {
  EXA_API_KEY?: string;
}

export class ExaService {
  private apiKey: string;
  private baseUrl = "https://api.exa.ai";

  constructor(env: ExaEnv) {
    this.apiKey = env.EXA_API_KEY || "";
  }

  private async fetch(endpoint: string, body: any = {}, options: RequestInit = {}) {
    if (!this.apiKey) {
      throw new Error("Exa API Key missing. Please provide x-exa-api-key header.");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      ...options,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(`Exa API Error: ${JSON.stringify(data.error || data)}`);
    }

    return data;
  }

  async search(query: string, options: {
    useAutoprompt?: boolean;
    type?: "keyword" | "neural";
    numResults?: number;
    includeDomains?: string[];
    excludeDomains?: string[];
    startCrawlDate?: string;
    endCrawlDate?: string;
    startPublishedDate?: string;
    endPublishedDate?: string;
  } = {}) {
    return this.fetch("/search", {
      query,
      ...options,
    });
  }

  async findSimilar(url: string, options: {
    numResults?: number;
    includeDomains?: string[];
    excludeDomains?: string[];
  } = {}) {
    return this.fetch("/findSimilar", {
      url,
      ...options,
    });
  }

  async getContents(ids: string[], options: {
    text?: boolean;
    highlights?: boolean;
  } = {}) {
    return this.fetch("/contents", {
      ids,
      ...options,
    });
  }
}
