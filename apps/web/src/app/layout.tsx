import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MCP Pure | High-Performance MCP Hub",
  description: "A centralized, open-source hub for managed Model Context Protocol servers. Deploying the best AI tools to the edge.",
  keywords: ["MCP", "Model Context Protocol", "AI Tools", "Cloudflare Workers", "Bluesky", "GitHub", "Reddit"],
  authors: [{ name: "Shaswat Raj" }],
  openGraph: {
    title: "MCP Pure | High-Performance MCP Hub",
    description: "Managed Model Context Protocol servers for AI agents.",
    url: "https://mcppure.shraj.workers.dev",
    siteName: "MCP Pure",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-slate-950 text-slate-50 font-sans">
        {children}
      </body>
    </html>
  );
}
