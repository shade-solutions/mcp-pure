import React from 'react';
import Link from 'next/link';
import { getAllMcpDocs } from '@/lib/docs';

export default async function Home() {
  const servers = await getAllMcpDocs();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold font-outfit tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm">🧊</span>
          MCP Pure
        </Link>
        <div className="flex gap-6 text-sm font-medium text-slate-400">
          <Link href="/docs/clients" className="hover:text-white transition-colors">Setup</Link>
          <Link href="/docs/development" className="hover:text-white transition-colors">Deploy</Link>
          <a href="https://github.com/shaswatraj/mcppure" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-6 pt-32 pb-40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          Live on Cloudflare Edge
        </div>
        <h1 className="text-6xl md:text-8xl font-bold font-outfit tracking-tighter text-white mb-8 max-w-4xl leading-[0.9]">
          The Purest Hub for <br/> <span className="text-slate-500">AI Tooling.</span>
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl max-w-2xl leading-relaxed">
          Managed, open-source Model Context Protocol servers. <br className="hidden md:block" />
          Built for speed, reliability, and zero friction.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-40">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-12">Available Servers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Link 
              key={server.slug} 
              href={`/mcp/${server.slug}`}
              className="group relative p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 hover:bg-slate-900/60 transition-all duration-300"
            >
              <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">
                {server.frontmatter.icon}
              </div>
              <h3 className="text-xl font-bold font-outfit text-white mb-3 flex items-center justify-between">
                {server.frontmatter.title}
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {server.frontmatter.description}
              </p>
              <div className="pt-6 border-t border-slate-800/50">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2">SSE Endpoint</span>
                <code className="text-[11px] text-blue-400/80 font-mono break-all bg-blue-500/5 px-2 py-1 rounded">
                  ...{server.frontmatter.route}
                </code>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-40 p-12 rounded-[32px] bg-blue-600 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold font-outfit text-white mb-6">Ready to scale your AI?</h2>
            <p className="text-blue-100 text-xl max-w-xl mb-10 leading-relaxed">
              Connect our managed endpoints to Cursor, Claude, or LobeHub in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/docs/clients" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Setup Guide
              </Link>
              <a href="https://github.com/shaswatraj/mcppure" className="px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors border border-blue-500/50">
                Star on GitHub
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
        <p>© 2026 MCP Pure. A Shade Solutions project.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Discord</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
