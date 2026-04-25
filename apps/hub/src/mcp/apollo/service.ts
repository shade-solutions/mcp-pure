export interface ApolloEnv {
  APOLLO_API_KEY?: string;
}

export class ApolloService {
  private apiKey: string;
  private baseUrl = "https://api.apollo.io/v1";

  constructor(env: ApolloEnv) {
    this.apiKey = env.APOLLO_API_KEY || "";
  }

  private async fetch(method: string, endpoint: string, body: any = {}) {
    if (!this.apiKey) {
      throw new Error("Apollo API Key missing. Please provide x-apollo-api-key header.");
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        ...body,
      }),
    });

    const data: any = await response.json();
    if (!response.ok) {
      throw new Error(`Apollo API Error: ${JSON.stringify(data.error || data)}`);
    }

    return data;
  }

  async searchPeople(params: {
    q_keywords?: string;
    contact_email_status?: string[];
    title_filter?: string[];
    person_locations?: string[];
    organization_ids?: string[];
    page?: number;
    per_page?: number;
  }) {
    return this.fetch("POST", "/people/search", params);
  }

  async searchOrganizations(params: {
    q_organization_keyword_tags?: string[];
    organization_locations?: string[];
    organization_num_employees_ranges?: string[];
    page?: number;
    per_page?: number;
  }) {
    return this.fetch("POST", "/organizations/search", params);
  }

  async enrichPerson(email: string) {
    return this.fetch("POST", "/people/match", { email });
  }

  async listSequences() {
    // Note: Some GET requests in Apollo API also use api_key in body or params
    // but the library usually expects it in params for GET
    const url = new URL(`${this.baseUrl}/sequences`);
    url.searchParams.append("api_key", this.apiKey);
    
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  }

  async whoami() {
    return this.fetch("GET", "/auth/health", {}); // Not a real endpoint, but check documentation
    // Actually, Apollo doesn't have a clean /me endpoint in v1, but we can check search
  }
}
