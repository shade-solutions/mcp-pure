import { z } from "zod";

export const TOOLS = {
  create_post: {
    description: "Create a new post on Tumblr using the New Post Format (NPF)",
    schema: z.object({
      blog_identifier: z.string().describe("The blog name (e.g. 'myblog.tumblr.com' or just 'myblog')"),
      content: z.array(z.object({
        type: z.enum(["text", "image", "link", "video", "audio"]),
        text: z.string().optional().describe("For text blocks"),
        url: z.string().optional().describe("For link/image/video/audio blocks"),
        alt_text: z.string().optional().describe("For image blocks"),
      })).describe("Array of content blocks (e.g. [{type: 'text', text: 'Hello world'}])"),
      tags: z.array(z.string()).optional().describe("Array of tags for the post"),
      state: z.enum(["published", "queue", "draft", "private"]).optional().default("published").describe("Initial state of the post"),
    }),
  },
  get_dashboard: {
    description: "Get the user's dashboard posts",
    schema: z.object({
      limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
      type: z.enum(["text", "photo", "quote", "link", "chat", "audio", "video"]).optional().describe("Filter by post type"),
    }),
  },
  get_blog_posts: {
    description: "Get posts from a specific blog",
    schema: z.object({
      blog_identifier: z.string().describe("The blog identifier"),
      limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
    }),
  },
  like_post: {
    description: "Like a Tumblr post",
    schema: z.object({
      post_id: z.string().describe("The ID of the post"),
      reblog_key: z.string().describe("The reblog key of the post (required for liking)"),
    }),
  },
  follow_blog: {
    description: "Follow a Tumblr blog",
    schema: z.object({
      blog_identifier: z.string().describe("The blog identifier or URL to follow"),
    }),
  },
  search_tagged: {
    description: "Search for posts with a specific tag",
    schema: z.object({
      tag: z.string().describe("The tag to search for"),
      limit: z.number().int().min(1).max(20).default(20).describe("Number of posts to retrieve"),
    }),
  },
};
