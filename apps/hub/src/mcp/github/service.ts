export type GitHubEnv = {
  GITHUB_TOKEN?: string;
  GITHUB_USER_AGENT?: string;
};

export class GitHubService {
  private readonly token: string;
  private readonly userAgent: string;

  constructor(private readonly env: GitHubEnv) {
    this.token = env.GITHUB_TOKEN || "";
    this.userAgent = env.GITHUB_USER_AGENT || 'MCP-Pure/0.1.0';
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    if (!this.token) {
      throw new Error("GitHub token missing. Please provide x-github-token header.");
    }

    const url = `https://api.github.com${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${this.token}`,
        'User-Agent': this.userAgent,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async getUserInfo(username?: string) {
    return this.request(username ? `/users/${username}` : '/user');
  }

  async listRepositories(username?: string, type: 'all' | 'owner' | 'member' = 'owner', limit = 30) {
    const path = username ? `/users/${username}/repos` : '/user/repos';
    return this.request(`${path}?type=${type}&per_page=${limit}`);
  }

  async getRepository(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}`);
  }

  async searchRepositories(query: string, limit = 10) {
    return this.request(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`);
  }

  async listIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', limit = 30) {
    return this.request(`/repos/${owner}/${repo}/issues?state=${state}&per_page=${limit}`);
  }

  async createIssue(owner: string, repo: string, title: string, body?: string, labels?: string[]) {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({ title, body, labels }),
    });
  }

  async getIssue(owner: string, repo: string, issueNumber: number) {
    return this.request(`/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  async listPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open', limit = 30) {
    return this.request(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=${limit}`);
  }

  async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body?: string) {
    return this.request(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({ title, head, base, body }),
    });
  }

  async getFileContents(owner: string, repo: string, path: string, ref?: string) {
    const url = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ''}`;
    const data = await this.request(url);
    if (data.encoding === 'base64') {
      data.decodedContent = atob(data.content);
    }
    return data;
  }

  async listFiles(owner: string, repo: string, path: string = '', ref?: string) {
    const url = `/repos/${owner}/${repo}/contents/${path}${ref ? `?ref=${ref}` : ''}`;
    return this.request(url);
  }

  async createOrUpdateFile(owner: string, repo: string, path: string, message: string, content: string, sha?: string, branch?: string) {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(content),
        sha,
        branch,
      }),
    });
  }

  async listCommits(owner: string, repo: string, sha?: string, limit = 30) {
    const url = `/repos/${owner}/${repo}/commits?${sha ? `sha=${sha}&` : ''}per_page=${limit}`;
    return this.request(url);
  }

  async searchCode(query: string, limit = 10) {
    return this.request(`/search/code?q=${encodeURIComponent(query)}&per_page=${limit}`);
  }
}
