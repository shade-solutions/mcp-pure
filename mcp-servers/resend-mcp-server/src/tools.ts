import { z } from "zod";

export const TOOLS = {
  send_email: {
    description: "Send a single email using Resend",
    schema: z.object({
      from: z.string().describe("Sender email address (e.g. 'onboarding@resend.dev')"),
      to: z.union([z.string(), z.array(z.string())]).describe("Recipient email address(es)"),
      subject: z.string().describe("Email subject line"),
      html: z.string().optional().describe("HTML content of the email"),
      text: z.string().optional().describe("Plain text content of the email"),
      reply_to: z.string().optional().describe("Reply-to email address"),
      cc: z.union([z.string(), z.array(z.string())]).optional().describe("CC recipient(s)"),
      bcc: z.union([z.string(), z.array(z.string())]).optional().describe("BCC recipient(s)"),
    }),
  },
  batch_send_emails: {
    description: "Send up to 100 emails in a single request",
    schema: z.object({
      emails: z.array(z.object({
        from: z.string(),
        to: z.union([z.string(), z.array(z.string())]),
        subject: z.string(),
        html: z.string().optional(),
        text: z.string().optional(),
      })).max(100).describe("Array of email objects to send"),
    }),
  },
  get_email: {
    description: "Get details and status of a sent email",
    schema: z.object({
      email_id: z.string().describe("The unique ID of the email"),
    }),
  },
  list_domains: {
    description: "List all registered domains in your Resend account",
    schema: z.object({}),
  },
  create_domain: {
    description: "Register a new domain for sending emails",
    schema: z.object({
      name: z.string().describe("The domain name (e.g. 'example.com')"),
    }),
  },
  delete_domain: {
    description: "Remove a domain from your Resend account",
    schema: z.object({
      domain_id: z.string().describe("The unique ID of the domain"),
    }),
  },
  list_audiences: {
    description: "List all email audiences",
    schema: z.object({}),
  },
  create_audience: {
    description: "Create a new audience group",
    schema: z.object({
      name: z.string().describe("Name of the audience"),
    }),
  },
  delete_audience: {
    description: "Delete an audience and all its contacts",
    schema: z.object({
      audience_id: z.string().describe("The unique ID of the audience"),
    }),
  },
  create_contact: {
    description: "Add a contact to an audience",
    schema: z.object({
      audience_id: z.string().describe("The unique ID of the audience"),
      email: z.string().describe("Contact email address"),
      first_name: z.string().optional().describe("Contact first name"),
      last_name: z.string().optional().describe("Contact last name"),
      unsubscribed: z.boolean().optional().describe("Subscription status"),
    }),
  },
  list_contacts: {
    description: "List all contacts in a specific audience",
    schema: z.object({
      audience_id: z.string().describe("The unique ID of the audience"),
    }),
  },
  delete_contact: {
    description: "Remove a contact from an audience",
    schema: z.object({
      audience_id: z.string().describe("The unique ID of the audience"),
      id_or_email: z.string().describe("The unique ID or email of the contact"),
    }),
  },
};
