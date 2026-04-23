---
title: GitHub MCP
description: Manage repositories, issues, PRs, and explore code via the GitHub API.
icon: 🐙
route: /mcp-server/github
---

# GitHub MCP Server

The GitHub MCP server provides a powerful set of tools for managing GitHub resources and exploring code repositories.

## Features

- **Repository Management**: List, get, and search repositories.
- **Issue Tracking**: Full lifecycle for issues (list, create, get).
- **Pull Requests**: List and create PRs.
- **Code & Files**: Read file contents, list directory structures, and push updates.
- **Search**: Search code across repositories.
- **Commit History**: List and inspect commits.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "github": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/github",
      "headers": {
        "x-github-token": "your-personal-access-token"
      }
    }
  }
}
```

## Tools

### Repositories
- `list_repositories`: List repos for a user/org.
- `get_repository`: Get repo details.
- `search_repositories`: Search repos.

### Issues & PRs
- `list_issues`, `create_issue`, `get_issue`
- `list_pull_requests`, `create_pull_request`

### Files & Content
- `get_file_contents`: Get file content.
- `list_files`: List directory content.
- `create_or_update_file`: Push changes to a file.

### Search & commits
- `search_code`: Search code across repos.
- `list_commits`: List commit history.
- `get_user_info`: Get GitHub user info.
