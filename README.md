# MCP Pure 🧊

A central, open-source hub for high-performance Model Context Protocol (MCP) servers. Built with **Hono** and **Bun**, and deployed on **Cloudflare Workers**.

## 🚀 Mission

MCP Pure aims to provide a single, managed domain for various MCP servers, making it easier for AI agents to access external services without managing dozens of separate deployments.

## 🛠 Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [Hono](https://hono.dev)
- **Platform**: [Cloudflare Workers](https://workers.cloudflare.com)
- **Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io)

## 🌐 Deployed Servers

All servers are hosted under `mcppure.shraj.workers.dev`:

| Service | Route | Description |
| :--- | :--- | :--- |
| **Bluesky** | `/mcp/bluesky` | Full integration for Bluesky social network. |
| **Reddit** | `/mcp/reddit` | *Coming Soon* |

## 📖 Documentation

- [Agent Research Guide](agents.md) - How we research and select tools for new MCP servers.
- [Development Guide](docs/development.md) - How to add a new server.

## 🛠 Local Development

1.  Install dependencies:
    ```bash
    bun install
    ```
2.  Run locally:
    ```bash
    bun dev
    ```
3.  Deploy:
    ```bash
    bun run deploy
    ```

## 📝 Configuration

Each MCP server can be configured via Environment Variables or Request Headers.

### Bluesky Configuration
- `BLUESKY_IDENTIFIER`: Your Bluesky handle.
- `BLUESKY_APP_PASSWORD`: Your App Password.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) and use the [Agent Research Guide](agents.md) to propose new tools.

---
Managed by [shade-solutions](https://github.com/shade-solutions)
