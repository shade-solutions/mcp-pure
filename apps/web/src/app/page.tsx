import React from 'react';
import Link from 'next/link';
import { getAllMcpDocs } from '@/lib/docs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, ExternalLink, ShieldCheck, Zap, Box } from 'lucide-react';

export default async function Home() {
  const servers = await getAllMcpDocs();

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-blue-500/30 text-slate-200">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10 pointer-events-none" />

      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold font-outfit tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span>MCP Pure</span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <Link href="/docs/clients" className="hover:text-white transition-colors">Setup</Link>
            <Link href="/docs/development" className="hover:text-white transition-colors">Deploy</Link>
          </div>
          <Separator orientation="vertical" className="h-4 bg-white/10 hidden md:block" />
          <a href="https://github.com/shade-solutions/mcppure" className="text-slate-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-32 pb-24 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
          <ShieldCheck className="w-3.5 h-3.5" />
          Enterprise Grade Hub
        </div>
        <h1 className="text-6xl md:text-8xl font-bold font-outfit tracking-tighter text-white mb-8 leading-[0.9] max-w-4xl">
          Supercharge your AI with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Pure Protocol.</span>
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl max-w-2xl leading-relaxed mb-12">
          Managed, high-performance MCP servers for Cursor, Claude, and LobeHub. Open source and deployed on the edge.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 h-14 text-lg">
            Get Started Free
          </Button>
          <img src="https://visitor-badge.laobi.icu/badge?page_id=shade-solutions.mcppure&color=blue" alt="Visitors" className="h-10 opacity-80" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-40">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Ready to use Servers</h2>
          <Separator className="flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.slug} className="bg-slate-900/40 border-white/5 hover:border-blue-500/40 transition-all duration-300 group overflow-hidden">
              <CardHeader className="pb-4">
                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {server.frontmatter.icon}
                </div>
                <CardTitle className="text-xl font-bold font-outfit text-white flex items-center justify-between">
                  {server.frontmatter.title}
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase tracking-widest">Active</Badge>
                </CardTitle>
                <CardDescription className="text-slate-400 text-sm leading-relaxed pt-2">
                  {server.frontmatter.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">SSE ENDPOINT</span>
                  <code className="text-[11px] text-blue-400 font-mono block truncate">
                    ...{server.frontmatter.route}
                  </code>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full justify-between text-slate-400 hover:text-white hover:bg-white/5 group" asChild>
                  <Link href={`/mcp/${server.slug}`}>
                    Documentation
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">Edge Performance</h3>
              <p className="text-slate-400 leading-relaxed">Deployed on Cloudflare Workers globally, ensuring sub-100ms response times for your AI agents.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Box className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 font-outfit">Protocol First</h3>
              <p className="text-slate-400 leading-relaxed">Built from the ground up to follow the official Model Context Protocol (MCP) specification.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
        <div className="flex items-center gap-4">
          <p>© 2026 MCP Pure. Powered by Shade Solutions.</p>
        </div>
        <div className="flex gap-8">
          <a href="https://github.com/shade-solutions/mcppure" className="hover:text-white transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
        </div>
      </footer>
    </div>
  );
}
