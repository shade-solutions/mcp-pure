import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDoc, getAllDocs } from '@/lib/general-docs';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { ChevronLeft, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-blue-500/30">
      <nav className="max-w-3xl mx-auto px-6 py-10 flex justify-between items-center">
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

      <div className="max-w-3xl mx-auto px-6 mb-16">
        <Separator className="bg-white/5" />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-slate prose-lg max-w-none prose-headings:font-outfit prose-headings:text-white prose-headings:tracking-tight prose-p:text-slate-400 prose-strong:text-white prose-a:text-blue-400 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none">
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
      </footer>
    </div>
  );
}
