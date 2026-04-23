import React from 'react';

const servers = [
  {
    name: 'Bluesky',
    icon: '🧊',
    description: 'Full integration with the AT Protocol for social networking.',
    url: 'https://mcppure.shraj.workers.dev/mcp/bluesky',
    status: 'Active',
  },
  {
    name: 'Reddit',
    icon: '🔥',
    description: 'Interact with subreddits, search posts, and read comments.',
    url: 'https://mcppure.shraj.workers.dev/mcp/reddit',
    status: 'Active',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-sky-500/30">
      <header className="py-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full -z-10" />
        <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-semibold mb-6 tracking-wide">
          OPEN SOURCE • MANAGED • PURE
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-fill-transparent">
          MCP Pure
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl px-6">
          A high-performance hub for Model Context Protocol servers. Deploying the best AI tools to the edge.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servers.map((server) => (
            <div key={server.name} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-sky-500/50 transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{server.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold">{server.name}</h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-wider">
                    {server.status}
                  </span>
                </div>
              </div>
              <p className="text-slate-400 mb-8 text-lg">
                {server.description}
              </p>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">SSE Endpoint</span>
                  <div className="bg-black/40 p-4 rounded-xl font-mono text-sm border border-slate-800 flex justify-between items-center text-sky-400">
                    <span className="truncate">{server.url}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-32 p-12 rounded-[40px] bg-gradient-to-br from-sky-500 to-indigo-600 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-32 -mt-32 rounded-full" />
          <h2 className="text-4xl font-bold mb-6">Add to Your Client</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl leading-relaxed">
            MCP Pure works seamlessly with Cursor, Claude Desktop, LobeHub, and Cline. Just copy the SSE URL and paste it into your settings.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/docs/clients" className="px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:scale-105 transition-transform">
              View Setup Guide
            </a>
            <a href="https://github.com/shaswatraj/mcppure" className="px-8 py-4 bg-black/20 text-white font-bold rounded-2xl hover:bg-black/30 transition-all border border-white/20 backdrop-blur-sm">
              Source Code
            </a>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-900 text-center text-slate-500">
        <p>© 2026 MCP Pure. Part of the Shade Solutions ecosystem.</p>
      </footer>
    </div>
  );
}
