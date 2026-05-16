import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDoc, getAllDocs } from '@/lib/general-docs';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { ChevronLeft, Github, Search } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  return {
    title: `${doc.slug.charAt(0).toUpperCase() + doc.slug.slice(1)} | MCP Pure`,
    description: `Documentation for ${doc.slug} on MCP Pure.`,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllDocs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getDoc(slug);

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
        <section className="py-[96px] bg-canvas">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-24">
            <div>
              <Link href="/" className="text-label-uppercase text-muted flex items-center gap-2 mb-12 hover:text-on-dark transition-colors">
                <ChevronLeft className="w-4 h-4" /> BACK TO HUB
              </Link>
              <div className="prose prose-invert max-w-none prose-headings:text-display-md prose-headings:font-bold prose-headings:uppercase prose-p:font-light prose-p:text-body-strong prose-code:text-m-blue-light prose-code:bg-surface-soft prose-code:px-1 prose-code:rounded-none prose-pre:bg-surface-card prose-pre:rounded-none prose-pre:border prose-pre:border-hairline">
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
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-[100px]">
                <div className="m-stripe w-12 mb-8" />
                <h4 className="text-label-uppercase mb-8 text-on-dark">DOCS</h4>
                <ul className="flex flex-col gap-4">
                  <li><Link href="/docs/clients" className={`text-[14px] font-light transition-colors ${slug === 'clients' ? 'text-on-dark font-bold' : 'text-muted hover:text-on-dark'}`}>Client Setup</Link></li>
                  <li><Link href="/docs/development" className={`text-[14px] font-light transition-colors ${slug === 'development' ? 'text-on-dark font-bold' : 'text-muted hover:text-on-dark'}`}>Server Development</Link></li>
                </ul>

                <div className="mt-16 p-8 bg-surface-card border border-hairline">
                  <p className="text-[12px] font-bold uppercase tracking-tight mb-4 text-m-blue-light">CONTRIBUTE</p>
                  <p className="text-[14px] font-light text-body leading-relaxed mb-6">
                    Help us improve the Pure Protocol ecosystem by contributing to our documentation.
                  </p>
                  <a href="https://github.com/shade-solutions/mcp-pure" target="_blank" rel="noreferrer" className="text-label-uppercase text-[12px] flex items-center gap-2 hover:text-on-dark transition-colors">
                    VIEW ON GITHUB
                  </a>
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
          <div className="text-muted text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-12">
            <span>© 2026 SHADE SOLUTIONS</span>
            <span>OPEN SOURCE</span>
            <a href="https://github.com/shade-solutions/mcp-pure" target="_blank" rel="noreferrer" className="hover:text-on-dark transition-colors">GITHUB</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
