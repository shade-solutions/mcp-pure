---
title: Resend MCP
description: Send high-deliverability emails, manage audiences, contacts, and verify domains with the Resend email API.
icon: ✉️
route: /mcp-server/resend
---

# Resend MCP Server

The Resend MCP server allows AI agents to send emails (single or batch), manage audiences and contacts, and handle domain registrations.

## Features

- **Email Delivery**: Send transactional or marketing emails with high deliverability.
- **Batch Sending**: Send up to 100 emails in a single request for efficiency.
- **Audience Management**: Create and manage email lists/audiences.
- **Contact CRM**: Add, list, and manage contacts within your audiences.
- **Domain Verification**: List and manage sending domains with DNS status tracking.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "resend": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/resend",
      "headers": {
        "x-resend-api-key": "your-resend-api-key"
      }
    }
  }
}
```

## How to get Credentials

To use the Resend MCP server, you need an API key from your Resend dashboard.

1. **Sign Up/Login**: Go to [resend.com](https://resend.com) and log in.
2. **API Keys**: Click on **"API Keys"** in the left sidebar.
3. **Create API Key**: Click **"Create API Key"**.
   - **Name**: Give it a name (e.g., `mcp-pure`).
   - **Permission**: Select **"Full Access"** if you want to use domain/audience management tools, or **"Sending Access"** for just sending emails.
   - **Domain**: Select a specific domain or "All Domains".
4. **Copy Key**: Copy the key immediately (starts with `re_`) and add it to your configuration.

## Tools

### Email Tools
- `send_email`: Send a single email (supports HTML, text, attachments).
- `batch_send_emails`: Send up to 100 emails at once.
- `get_email`: Get delivery status and details of a sent email.

### Domain Tools
- `list_domains`: List all registered domains and their verification status.
- `create_domain`: Register a new domain for sending.
- `get_domain`: Get detailed DNS records and status for a specific domain.
- `delete_domain`: Remove a domain from your account.

### Audience & Contact Tools
- `create_audience`: Create a new audience (email list).
- `list_audiences`: List all available audiences.
- `create_contact`: Add a subscriber to an audience.
- `list_contacts`: View all contacts in an audience.
- `get_contact`: Get details for a specific contact.
- `delete_contact`: Remove a contact from an audience.
