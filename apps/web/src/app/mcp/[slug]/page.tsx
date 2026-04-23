import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMcpDoc, getAllMcpDocs } from '@/lib/docs';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      <nav className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
          ← Back to Hub
        </Link>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">{doc.frontmatter.icon}</span>
          <h1 className="text-5xl font-bold font-outfit text-white tracking-tight">{doc.frontmatter.title}</h1>
        </div>
        <p className="text-slate-400 text-xl leading-relaxed max-w-2xl">
          {doc.frontmatter.description}
        </p>
        <div className="mt-10 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">SSE URL</span>
            <code className="text-sm text-blue-400 font-mono">https://mcppure.shraj.workers.dev{doc.frontmatter.route}</code>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 border-t border-slate-900 prose prose-invert prose-slate prose-lg prose-headings:font-outfit prose-headings:text-white prose-a:text-blue-400 prose-code:text-blue-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {doc.content}
        </ReactMarkdown>
      </main>

      <footer className="py-20 border-t border-slate-900 text-center text-slate-600 text-xs tracking-widest uppercase font-bold">
        <p>Managed by Shade Solutions</p>
      </footer>
    </div>
  );
}
