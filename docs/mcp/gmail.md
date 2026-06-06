# Gmail MCP

The Gmail MCP (Model Context Protocol) server provides access to Gmail functionality through an MCP interface.

## Features

- **Profile Management**: Get Gmail account information
- **Message Management**: List, read, send, and manage email messages
- **Thread Management**: Access and manage email threads
- **Label Management**: Create, list, and manage Gmail labels
- **Draft Creation**: Create email drafts
- **Message Actions**: Mark as read/unread, trash, delete messages

## Authentication

The Gmail MCP requires OAuth2 access tokens. You'll need to authenticate with Google to get an access token.

### Required Headers

- `x-gmail-access-token`: Gmail OAuth2 access token (required)
- `x-gmail-refresh-token`: Gmail refresh token (optional)
- `x-gmail-client-id`: Google OAuth2 client ID (optional)
- `x-gmail-client-secret`: Google OAuth2 client secret (optional)

## Tools

### Profile Management

#### `get_profile`
Get the Gmail profile information for the authenticated user.

**Parameters**: None

**Returns**: User profile including email, message count, and other account details.

### Message Management

#### `list_messages`
List email messages from the mailbox.

**Parameters**:
- `query` (optional): Gmail search query (e.g., "from:user@example.com", "is:unread")
- `maxResults` (optional): Maximum number of messages (1-100, default: 10)

**Returns**: List of messages matching the query.

#### `get_message`
Get the full content of a specific email message.

**Parameters**:
- `messageId`: The ID of the message to retrieve
- `format` (optional): Response format ('full', 'metadata', 'minimal', default: 'full')

**Returns**: Message content with headers, body, and attachments.

#### `send_message`
Send an email message.

**Parameters**:
- `to`: Recipient email address
- `subject`: Email subject
- `body`: Email body (plain text or HTML)
- `cc` (optional): Array of CC recipients
- `bcc` (optional): Array of BCC recipients

**Returns**: Sent message details.

#### `create_draft`
Create a draft email message.

**Parameters**:
- `to`: Recipient email address
- `subject`: Email subject
- `body`: Email body

**Returns**: Draft message details.

#### `trash_message`
Move an email message to trash.

**Parameters**:
- `messageId`: The ID of the message to trash

**Returns**: Message details.

#### `delete_message`
Permanently delete an email message.

**Parameters**:
- `messageId`: The ID of the message to delete

**Returns**: Confirmation message.

#### `mark_as_read`
Mark an email message as read.

**Parameters**:
- `messageId`: The ID of the message to mark as read

**Returns**: Message details.

#### `mark_as_unread`
Mark an email message as unread.

**Parameters**:
- `messageId`: The ID of the message to mark as unread

**Returns**: Message details.

#### `modify_message`
Modify an email message by adding or removing labels.

**Parameters**:
- `messageId`: The ID of the message to modify
- `addLabels` (optional): Array of label IDs to add
- `removeLabels` (optional): Array of label IDs to remove

**Returns**: Modified message details.

### Label Management

#### `list_labels`
List all labels in the Gmail account.

**Parameters**: None

**Returns**: List of all labels.

#### `get_label`
Get information about a specific Gmail label.

**Parameters**:
- `labelId`: The ID of the label

**Returns**: Label details including name and visibility.

#### `create_label`
Create a new label in the Gmail account.

**Parameters**:
- `name`: The name of the label to create
- `visibility` (optional): Whether the label should be visible ('labelShow' or 'labelHide', default: 'labelShow')

**Returns**: Created label details.

### Thread Management

#### `list_threads`
List email threads from the mailbox.

**Parameters**:
- `query` (optional): Gmail search query
- `maxResults` (optional): Maximum number of threads (1-100, default: 10)

**Returns**: List of threads matching the query.

#### `get_thread`
Get the full content of a specific email thread.

**Parameters**:
- `threadId`: The ID of the thread to retrieve
- `format` (optional): Response format ('full', 'metadata', 'minimal', default: 'full')

**Returns**: Thread content with all messages in the thread.

## Setup

To use the Gmail MCP, you need:

1. A Google account with Gmail enabled
2. Google OAuth2 credentials (Client ID and Client Secret)
3. A valid OAuth2 access token for Gmail API access

## Usage Example

```bash
curl -X POST http://localhost:8080/mcp-server/gmail \
  -H "Content-Type: application/json" \
  -H "x-gmail-access-token: YOUR_ACCESS_TOKEN" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_profile",
      "arguments": {}
    },
    "id": 1
  }'
```

## Error Handling

The Gmail MCP returns detailed error messages for common issues:
- Missing or invalid access token
- Invalid message or thread IDs
- API rate limiting
- Malformed requests

## References

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Gmail API Scopes](https://developers.google.com/gmail/api/auth/scopes)
