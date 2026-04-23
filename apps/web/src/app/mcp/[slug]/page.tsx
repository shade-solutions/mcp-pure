import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMcpDoc, getAllMcpDocs } from '@/lib/docs';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/code-block';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Github, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      <nav className="max-w-4xl mx-auto px-6 py-10 flex justify-between items-center">
        <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" />
          Back to Hub
        </Link>
        <div className="flex items-center gap-4">
          <img src="https://visitor-badge.laobi.icu/badge?page_id=shade-solutions.mcppure&color=blue" alt="Visitors" className="h-6 opacity-60" />
          <a href="https://github.com/shade-solutions/mcppure" className="text-slate-500 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{doc.frontmatter.icon}</span>
          <h1 className="text-5xl font-bold font-outfit text-white tracking-tight">{doc.frontmatter.title}</h1>
        </div>
        <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mb-10">
          {doc.frontmatter.description}
        </p>

        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">SSE PROTOCOL URL</span>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] h-4">STABLE</Badge>
            </div>
            <code className="text-sm text-blue-400 font-mono font-bold tracking-tight bg-blue-500/5 px-2 py-1 rounded-md">
              https://mcppure.shraj.workers.dev{doc.frontmatter.route}
            </code>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center">
              <Info className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight max-w-[140px]">
              Use this URL in your MCP client settings (SSE transport).
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        <Separator className="bg-white/5" />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-invert prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:text-white prose-headings:tracking-tight prose-p:text-slate-400 prose-strong:text-white prose-a:text-blue-400 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none">
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
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </main>

      <footer className="py-24 border-t border-white/5 text-center">
        <p className="text-slate-600 text-xs tracking-[0.3em] font-bold uppercase mb-4">Pure Protocol • Shade Solutions</p>
        <p className="text-slate-700 text-[10px]">Open source under MIT License</p>
      </footer>
    </div>
  );
}
