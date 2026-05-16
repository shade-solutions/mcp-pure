import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MCP Pure | High-Performance MCP Hub",
  description: "A centralized, open-source hub for managed Model Context Protocol servers. Deploying the best AI tools to the edge.",
  keywords: ["MCP", "Model Context Protocol", "AI Tools", "Cloudflare Workers", "Bluesky", "GitHub", "Reddit"],
  authors: [{ name: "Shaswat Raj" }],
  metadataBase: new URL("https://mcppure.shraj.workers.dev"),
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "MCP Pure | High-Performance MCP Hub",
    description: "Managed Model Context Protocol servers for AI agents.",
    url: "https://mcppure.shraj.workers.dev",
    siteName: "MCP Pure",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MCP Pure - High-Performance MCP Hub",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Pure | High-Performance MCP Hub",
    description: "Managed Model Context Protocol servers for AI agents.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="antialiased min-h-screen bg-canvas">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
