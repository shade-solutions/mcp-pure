import { z } from "zod";

export const TOOLS = {
  post_status: {
    description: "Post a new status (toot) to Mastodon",
    schema: z.object({
      status: z.string().describe("The text content of the status"),
      visibility: z.enum(["public", "unlisted", "private", "direct"]).optional().describe("Visibility of the status"),
      spoiler_text: z.string().optional().describe("Text to be shown as a warning before the status content"),
      sensitive: z.boolean().optional().describe("Whether the status should be marked as sensitive/NSFW"),
    }),
  },
  search: {
    description: "Search for accounts, statuses, or hashtags",
    schema: z.object({
      query: z.string().describe("The search query"),
      type: z.enum(["accounts", "statuses", "hashtags"]).optional().describe("The type of results to return"),
      limit: z.number().int().min(1).max(40).default(20).describe("Maximum number of results per type"),
    }),
  },
  get_home_timeline: {
    description: "View statuses from people you follow",
    schema: z.object({
      limit: z.number().int().min(1).max(40).default(20).describe("Number of statuses to retrieve"),
    }),
  },
  get_public_timeline: {
    description: "View the public timeline",
    schema: z.object({
      limit: z.number().int().min(1).max(40).default(20).describe("Number of statuses to retrieve"),
      local: z.boolean().optional().describe("Only show statuses from this instance"),
    }),
  },
  get_notifications: {
    description: "List recent notifications",
    schema: z.object({
      limit: z.number().int().min(1).max(40).default(20).describe("Number of notifications to retrieve"),
    }),
  },
  get_bookmarks: {
    description: "List your bookmarked statuses",
    schema: z.object({
      limit: z.number().int().min(1).max(40).default(20).describe("Number of bookmarks to retrieve"),
    }),
  },
  follow_account: {
    description: "Follow a specific account",
    schema: z.object({
      account_id: z.string().describe("The ID of the account to follow"),
    }),
  },
  block_account: {
    description: "Block a specific account",
    schema: z.object({
      account_id: z.string().describe("The ID of the account to block"),
    }),
  },
  get_account: {
    description: "Get detailed information about an account",
    schema: z.object({
      account_id: z.string().describe("The ID of the account"),
    }),
  },
};
