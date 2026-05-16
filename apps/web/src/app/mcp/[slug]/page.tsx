import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMcpDoc, getAllMcpDocs } from '@/lib/docs';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { ChevronLeft, Github, Info, Search, Activity, Zap } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getMcpDoc(slug);
  return {
    title: `${doc.frontmatter.title} | MCP Pure`,
    description: doc.frontmatter.description,
  };
}

export async function generateStaticParams() {
  const docs = await getAllMcpDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function McpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getMcpDoc(slug);

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

      <main className="flex-1 pt-[64px]">
        {/* Hero Section for Server */}
        <section className="bg-canvas pt-[96px] pb-[64px] border-b border-hairline">
          <div className="max-w-[1440px] mx-auto px-6">
            <Link href="/" className="text-label-uppercase text-muted flex items-center gap-2 mb-12 hover:text-on-dark transition-colors">
              <ChevronLeft className="w-4 h-4" /> BACK TO HUB
            </Link>
            
            <div className="flex items-center gap-8 mb-8">
              <div className="text-[80px] grayscale">{doc.frontmatter.icon}</div>
              <h1 className="text-display-lg">{doc.frontmatter.title}</h1>
            </div>
            <p className="text-display-sm text-[24px] font-light text-body-strong mb-12 max-w-3xl leading-relaxed">
              {doc.frontmatter.description}
            </p>

            <div className="bg-surface-card border border-hairline p-1 flex flex-col md:flex-row gap-[1px] bg-hairline">
              <div className="bg-canvas p-8 flex-1 flex flex-col gap-4">
                <span className="text-label-uppercase text-muted">SSE ENDPOINT URL</span>
                <code className="text-[14px] font-bold text-m-blue-light break-all select-all">
                  https://mcppure.shraj.workers.dev{doc.frontmatter.route}
                </code>
              </div>
              <div className="bg-canvas p-8 flex-1 flex flex-col gap-4">
                <span className="text-label-uppercase text-muted">STATUS</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#0fa336] animate-pulse" />
                    <span className="text-[14px] font-bold text-on-dark uppercase">STABLE</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Activity className="w-4 h-4 text-m-red" />
                    <span className="text-[14px] font-bold text-on-dark uppercase">ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Zap className="w-4 h-4 text-m-blue-light" />
                    <span className="text-[14px] font-bold text-on-dark uppercase">HIGH SPEED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Content */}
        <section className="py-[96px] bg-canvas">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24">
            <div className="prose prose-invert max-w-none prose-headings:text-display-sm prose-headings:font-bold prose-headings:uppercase prose-p:font-light prose-p:text-body-strong prose-code:text-m-blue-light prose-code:bg-surface-soft prose-code:px-1 prose-code:rounded-none prose-pre:bg-surface-card prose-pre:rounded-none prose-pre:border prose-pre:border-hairline">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <CodeBlock language={match[1]}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    ) : (
                      <code className="font-bold text-m-blue-light bg-surface-soft px-1" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {doc.content}
              </ReactMarkdown>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-[100px]">
                <div className="m-stripe w-12 mb-8" />
                <h4 className="text-label-uppercase mb-8">QUICK START</h4>
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center border border-hairline text-[12px] font-bold">01</div>
                    <p className="text-[14px] font-light text-body leading-relaxed">Copy the SSE Endpoint URL provided above.</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center border border-hairline text-[12px] font-bold">02</div>
                    <p className="text-[14px] font-light text-body leading-relaxed">Configure your MCP client (Claude, Cursor, etc.).</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 flex items-center justify-center border border-hairline text-[12px] font-bold">03</div>
                    <p className="text-[14px] font-light text-body leading-relaxed">Grant necessary permissions to the AI agent.</p>
                  </div>
                </div>

                <div className="mt-16 p-8 bg-surface-card border border-hairline">
                  <Info className="w-6 h-6 text-m-blue-light mb-4" />
                  <p className="text-[12px] font-bold uppercase tracking-tight mb-4">NOTE</p>
                  <p className="text-[14px] font-light text-body leading-relaxed">
                    This server is hosted on Cloudflare Workers and is optimized for low-latency edge execution.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-canvas border-t border-hairline py-[96px]">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <div className="m-stripe w-24 h-[3px] mx-auto mb-12" />
          <h2 className="text-display-md mb-8">START BUILDING WITH PURE PROTOCOL</h2>
          <Link href="/docs/development" className="btn-primary inline-flex items-center justify-center">
            LEARN TO DEPLOY
          </Link>
          <div className="mt-[96px] text-muted text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-12">
            <span>© 2026 SHADE SOLUTIONS</span>
            <span>OPEN SOURCE</span>
            <a href="https://github.com/shade-solutions/mcp-pure" target="_blank" rel="noreferrer" className="hover:text-on-dark transition-colors">GITHUB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
