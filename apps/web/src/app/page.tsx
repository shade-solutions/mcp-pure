import React from 'react';
import Link from 'next/link';
import { getAllMcpDocs } from '@/lib/docs';
import { Github, ArrowRight, Activity, Zap, Shield, Search } from 'lucide-react';

export default async function Home() {
  const servers = await getAllMcpDocs();

  return (
    <div className="flex flex-col min-h-screen bg-canvas selection:bg-m-blue-light/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-[64px] bg-canvas/80 backdrop-blur-md border-b border-hairline z-[100] px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col gap-[2px]">
              <div className="m-stripe w-12 h-[3px]" />
              <span className="text-[18px] font-bold tracking-tight uppercase">MCP PURE</span>
            </div>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/docs/clients" className="text-[14px] font-light hover:text-on-dark transition-colors text-body">SETUP</Link>
            <Link href="/docs/development" className="text-[14px] font-light hover:text-on-dark transition-colors text-body">DEPLOY</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 text-muted">
            <Search className="w-4 h-4 cursor-pointer hover:text-on-dark transition-colors" />
            <a href="https://github.com/shade-solutions/mcp-pure" target="_blank" rel="noreferrer" className="hover:text-on-dark transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
          <Link href="/docs/clients" className="btn-primary flex items-center justify-center">
            GET STARTED
          </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero.png" 
              alt="High Performance Engineering" 
              className="w-full h-full object-cover grayscale brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent" />
          </div>
          
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 pb-[96px]">
            <div className="max-w-4xl">
              <div className="m-stripe w-24 mb-8" />
              <h1 className="text-display-xl mb-4 text-on-dark leading-[0.9]">
                The Ultimate <br /> <span className="text-on-dark">AI Tooling.</span>
              </h1>
              <p className="text-[20px] font-light text-body-strong mb-10 max-w-2xl leading-relaxed">
                High-performance, edge-native Model Context Protocol servers. Engineered for precision, speed, and zero friction.
              </p>
              <div className="flex gap-4">
                <Link href="/docs/clients" className="btn-primary">
                  EXPLORE MODELS
                </Link>
                <Link href="/docs/development" className="btn-outline">
                  DOCUMENTATION
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Spec Cells */}
        <section className="bg-canvas border-y border-hairline py-[96px]">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-[1px] bg-hairline">
            {[
              { label: 'PERFORMANCE', value: 'SUB-100MS', icon: <Zap className="w-5 h-5 text-m-blue-light" /> },
              { label: 'RELIABILITY', value: '99.9% UPTIME', icon: <Activity className="w-5 h-5 text-m-red" /> },
              { label: 'SECURITY', value: 'EDGE-NATIVE', icon: <Shield className="w-5 h-5 text-m-blue-dark" /> },
              { label: 'PROTOCOLS', value: 'MCP PURE', icon: <div className="m-stripe w-5 h-1" /> },
            ].map((stat, idx) => (
              <div key={idx} className="bg-canvas p-10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-label-uppercase text-muted">{stat.label}</span>
                  {stat.icon}
                </div>
                <span className="text-display-sm text-[32px] font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ready to Use Servers */}
        <section className="py-[96px] bg-canvas">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex items-end justify-between mb-16 border-b border-hairline pb-8">
              <div>
                <span className="text-label-uppercase text-m-blue-light mb-4 block">AVAILABLE TOOLS</span>
                <h2 className="text-display-lg">READY TO USE SERVERS</h2>
              </div>
              <Link href="/docs/clients" className="text-label-uppercase flex items-center gap-2 hover:text-on-dark transition-colors text-body">
                VIEW ALL MODELS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servers.map((server) => (
                <Link 
                  key={server.slug} 
                  href={`/mcp/${server.slug}`}
                  className="group bg-surface-card border border-hairline hover:border-on-dark transition-all duration-500 overflow-hidden"
                >
                  <div className="h-[240px] bg-surface-soft flex items-center justify-center relative overflow-hidden">
                    <div className="text-[64px] grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                      {server.frontmatter.icon}
                    </div>
                    <div className="absolute top-4 right-4 bg-canvas/50 backdrop-blur-sm border border-hairline px-3 py-1">
                      <span className="text-[10px] font-bold tracking-[1.5px] text-on-dark">ACTIVE</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="text-label-uppercase text-muted mb-2 block">{server.slug}</span>
                    <h3 className="text-title-lg text-[24px] mb-4 group-hover:text-on-dark transition-colors">
                      {server.frontmatter.title}
                    </h3>
                    <p className="text-body text-[16px] font-light leading-relaxed mb-8 line-clamp-2">
                      {server.frontmatter.description}
                    </p>
                    <div className="flex items-center gap-2 text-label-uppercase text-[12px]">
                      EXPLORE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Band */}
        <section className="relative h-[60vh] flex items-center overflow-hidden border-y border-hairline">
          <div className="absolute inset-0 z-0">
            <img 
              src="/tech.png" 
              alt="High Performance Technology" 
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-canvas/30" />
          </div>
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6">
            <div className="max-w-2xl bg-canvas/40 backdrop-blur-xl p-12 border border-hairline">
              <h2 className="text-display-md mb-6">ENGINEERED FOR THE EDGE</h2>
              <p className="text-body-strong text-[18px] font-light leading-relaxed mb-8">
                Built from the ground up to follow the official Model Context Protocol (MCP) specification with zero dependencies. Deployed globally on Cloudflare Workers.
              </p>
              <Link href="/docs/development" className="btn-outline inline-flex items-center">
                LEARN MORE
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-hairline py-[96px]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div>
              <div className="m-stripe w-12 h-[3px] mb-4" />
              <h4 className="text-label-uppercase mb-8">MCP PURE</h4>
              <p className="text-muted text-[14px] font-light leading-relaxed">
                The centralized hub for managed Model Context Protocol servers. Deploying the best AI tools to the edge.
              </p>
            </div>
            <div>
              <h4 className="text-label-uppercase mb-8 text-on-dark">MODELS</h4>
              <ul className="flex flex-col gap-4">
                {servers.slice(0, 4).map(s => (
                  <li key={s.slug}>
                    <Link href={`/mcp/${s.slug}`} className="text-muted hover:text-on-dark transition-colors text-[14px] font-light">{s.frontmatter.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-label-uppercase mb-8 text-on-dark">RESOURCES</h4>
              <ul className="flex flex-col gap-4">
                <li><Link href="/docs/clients" className="text-muted hover:text-on-dark transition-colors text-[14px] font-light">Client Setup</Link></li>
                <li><Link href="/docs/development" className="text-muted hover:text-on-dark transition-colors text-[14px] font-light">Server Development</Link></li>
                <li><a href="https://github.com/shade-solutions/mcp-pure" className="text-muted hover:text-on-dark transition-colors text-[14px] font-light">GitHub Repository</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-label-uppercase mb-8 text-on-dark">COMPANY</h4>
              <ul className="flex flex-col gap-4">
                <li><span className="text-muted text-[14px] font-light">© 2026 Shade Solutions</span></li>
                <li><span className="text-muted text-[14px] font-light">Privacy Policy</span></li>
                <li><span className="text-muted text-[14px] font-light">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-hairline gap-8">
            <div className="flex gap-12 text-muted text-[12px] font-bold uppercase tracking-widest">
              <span>DESIGNED BY ANTIGRAVITY</span>
              <span>POWERED BY CLOUDFLARE</span>
            </div>
            <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.mcppure&color=000000" alt="Visitors" className="h-8 grayscale contrast-125 invert" />
          </div>
        </div>
      </footer>
    </div>
  );
}
