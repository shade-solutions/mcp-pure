# MCP Pure 🧊

A central, open-source hub for high-performance Model Context Protocol (MCP) servers. Built with **Hono** and **Bun**, and deployed on **Cloudflare Workers**.

## 🚀 Deployed Instance
**URL**: [https://mcppure.shraj.workers.dev](https://mcppure.shraj.workers.dev)

## 📖 Documentation
- [Setup Guide for Clients](docs/clients.md) (Cursor, Claude, LobeHub, Cline, etc.)
- [Agent Research Guide](agents.md) - How we research and select tools.
- [Development Guide](docs/development.md) - How to add a new server.

## 🛠 Tech Stack
- **Monorepo**: Bun Workspaces
- **Hub (API)**: Hono + Cloudflare Workers
- **Frontend**: Next.js + Cloudflare Pages (Coming Soon)
- **Runtime**: Bun

## 🌐 Available Servers

| Service | Route | Status |
| :--- | :--- | :--- |
| **Bluesky** | `/mcp-server/bluesky` | ✅ Active |
| **Reddit** | `/mcp-server/reddit` | ✅ Active |
| **GitHub** | `/mcp-server/github` | ✅ Active |
| **Resend** | `/mcp-server/resend` | ✅ Active |
| **Mastodon** | `/mcp-server/mastodon` | ✅ Active |
| **Tumblr** | `/mcp-server/tumblr` | ✅ Active |
| **Telegram** | `/mcp-server/telegram` | ✅ Active |
| **Slack** | `/mcp-server/slack` | ✅ Active |
| **YouTube** | `/mcp-server/youtube` | ✅ Active |

## 🛠 Local Development

1.  Install dependencies:
    ```bash
    bun install
    ```
2.  Run the Hub:
    ```bash
    bun run dev:hub
    ```
3.  Run the Frontend:
    ```bash
    bun run dev:web
    ```

## 🤝 Contributing
We welcome contributions! Please see our [Development Guide](docs/development.md).

---
Managed by [shade-solutions](https://github.com/shade-solutions)
