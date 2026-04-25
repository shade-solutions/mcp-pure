---
title: Apollo.io MCP
description: Professional lead generation, people search, and organization enrichment via the Apollo API.
icon: 🎯
route: /mcp-server/apollo
---

# Apollo.io MCP Server

The Apollo.io MCP server provides powerful tools for lead research and professional outreach automation.

## Features

- **People Search**: Find leads by keywords, job titles, and locations.
- **Organization Search**: Find companies by tags, location, and employee count.
- **Enrichment**: Get full contact and company details from a single email address.
- **Campaigns**: List outreach sequences and check health.

## Configuration

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "apollo": {
      "url": "https://mcppure.shraj.workers.dev/mcp-server/apollo",
      "headers": {
        "x-apollo-api-key": "your-api-key"
      }
    }
  }
}
```

## How to get Credentials

1. **Apollo Settings**: Log in to your [Apollo.io](https://app.apollo.io/) account.
2. **API Settings**: Go to **Settings > Integrations > API**.
3. **API Key**: Create a new API Key and copy it.

## Tools

### Lead Generation
- `search_people`: Find leads with complex job title and location filters.
- `search_organizations`: Find companies matching specific criteria.
- `enrich_person`: Fetch complete profile data for an email address.

### Outreach
- `list_sequences`: View all marketing and sales sequences in your account.
