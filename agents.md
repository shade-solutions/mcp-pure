# MCP Agent Research Guide

This document outlines the process for researching and selecting tools before creating a new MCP (Model Context Protocol) server.

## Research Process

1.  **Identify the Target Service**: Define exactly which API or service you want to integrate (e.g., Reddit, Bluesky, GitHub).
2.  **API Audit**:
    *   Search for the official API documentation.
    *   Check for SDKs (especially for Node.js/Bun).
    *   Identify authentication methods (OAuth, API Keys, etc.).
    *   List key endpoints that would be useful for an AI agent (Search, Read, Write, Action).
3.  **Tool Selection**:
    *   Map API endpoints to MCP "Tools".
    *   A tool should have a clear name, description, and input schema (Zod).
    *   Prioritize tools that provide "knowledge" or "action" that the agent cannot easily do itself.
4.  **Implementation Plan**:
    *   Outline the Hono routes.
    *   Define the MCP server structure.
    *   Specify environment variables needed.

## Research Queries for New MCPs

Before building, use the following search queries:
- `[Service Name] API documentation for developers`
- `[Service Name] Node.js SDK`
- `MCP server for [Service Name] github` (check if it already exists to avoid duplication or for inspiration)
- `How to authenticate with [Service Name] API in a worker`

## Checklist for Adding a New Server to MCP Pure

- [ ] Run research query.
- [ ] Define tools in `src/mcp/[name]/tools.ts`.
- [ ] Implement service logic in `src/mcp/[name]/service.ts`.
- [ ] Register route in `src/index.ts`.
- [ ] Add documentation in `README.md`.
- [ ] Test locally using `bun dev`.
- [ ] Deploy to Cloudflare.

## Research Findings: Reddit MCP

### API Details
- **Base URL**: `https://www.reddit.com/dev/api/`
- **Auth**: OAuth2 (Client ID, Client Secret, Username, Password).
- **Rate Limits**: Strict (60 requests per minute).

### Candidate Tools
1. `search_reddit`: Search for posts or subreddits.
2. `get_subreddit_posts`: List top/hot/new posts in a subreddit.
3. `get_post_details`: Get comments and content of a specific post.
4. `create_post`: Submit a new post (Write access required).
5. `reply_to_comment`: Reply to a specific comment (Write access required).

### Implementation Plan for Reddit MCP
- Use `snoowrap` or raw `fetch` for API calls.
- Mount at `/mcp/reddit`.
- Requires `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`.
