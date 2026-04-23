import React from 'react';
import Link from 'next/link';
import { getAllMcpDocs } from '@/lib/docs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, ExternalLink, ShieldCheck, Zap, Box } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default async function Home() {
  const servers = await getAllMcpDocs();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-none flex items-center justify-center shadow-sm">
            <Box className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading">MCP Pure</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/docs/clients" className="hover:text-foreground transition-colors">Setup</Link>
            <Link href="/docs/development" className="hover:text-foreground transition-colors">Deploy</Link>
          </div>
          <Separator orientation="vertical" className="h-4 hidden md:block" />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <a href="https://github.com/shade-solutions/mcp-pure" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-muted border border-border text-muted-foreground text-xs font-bold uppercase tracking-widest mb-8">
          <ShieldCheck className="w-3.5 h-3.5" />
          Pure Protocol Hub
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9] max-w-4xl font-heading uppercase italic">
          The Purest Hub for <br /> <span className="text-primary not-italic">AI Tooling.</span>
        </h1>
        <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl leading-relaxed mb-12 font-sans font-medium">
          High-performance MCP servers for AI agents. Open source, edge-native, and zero friction.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Button size="lg" className="rounded-none px-12 h-16 text-lg shadow-md font-bold uppercase tracking-widest" asChild>
            <Link href="/docs/clients text-white">Get Started</Link>
          </Button>
          <div className="flex items-center gap-4">
            <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.mcppure&color=000000" alt="Visitors" className="h-10 grayscale contrast-125 dark:invert" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-40">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.4em]">Ready to use Servers</h2>
          <Separator className="flex-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {servers.map((server) => (
            <Card key={server.slug} className="rounded-none border-border hover:shadow-xl transition-all duration-300 group bg-card shadow-sm">
              <CardHeader className="pb-4">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0">
                  {server.frontmatter.icon}
                </div>
                <CardTitle className="text-2xl font-bold font-heading flex items-center justify-between uppercase tracking-tight">
                  {server.frontmatter.title}
                  <Badge variant="outline" className="rounded-none text-[10px] uppercase tracking-widest border-primary/20 text-primary">Active</Badge>
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed pt-2 font-sans font-medium">
                  {server.frontmatter.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-none p-4 border border-border shadow-inner">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">SSE ENDPOINT</span>
                  <code className="text-[11px] text-primary font-mono block truncate font-bold bg-background p-1 border border-border">
                    ...{server.frontmatter.route}
                  </code>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full justify-between rounded-none group font-bold uppercase tracking-widest text-xs h-12" asChild>
                  <Link href={`/mcp/${server.slug}`}>
                    Documentation
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-48 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex gap-8 items-start p-8 border border-border bg-card shadow-sm">
            <div className="w-16 h-16 bg-accent rounded-none border border-border flex items-center justify-center shrink-0 shadow-md">
              <Zap className="w-8 h-8 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 font-heading uppercase">Edge Speed</h3>
              <p className="text-muted-foreground leading-relaxed font-sans font-medium italic">Deployed on Cloudflare Workers globally, ensuring sub-100ms response times for your AI agents.</p>
            </div>
          </div>
          <div className="flex gap-8 items-start p-8 border border-border bg-card shadow-sm">
            <div className="w-16 h-16 bg-secondary rounded-none border border-border flex items-center justify-center shrink-0 shadow-md">
              <Box className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 font-heading uppercase">Pure Code</h3>
              <p className="text-muted-foreground leading-relaxed font-sans font-medium italic">Built from the ground up to follow the official Model Context Protocol (MCP) specification with zero dependencies.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-24 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground text-sm font-sans font-bold uppercase tracking-widest">
        <p>© 2026 MCP Pure • Shade Solutions</p>
        <div className="flex gap-12">
          <a href="https://github.com/shade-solutions/mcp-pure" className="hover:text-foreground transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" />
            Source
          </a>
          <Link href="/docs/clients" className="hover:text-foreground transition-colors text-primary">Setup</Link>
          {/* <a href="#" className="hover:text-foreground transition-colors">Discord</a> */}
        </div>
      </footer>
    </div>
  );
}
