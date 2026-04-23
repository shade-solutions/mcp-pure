import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDoc, getAllDocs } from '@/lib/general-docs';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      <nav className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/" className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
          ← Back to Hub
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-invert prose-slate prose-lg prose-headings:font-outfit prose-headings:text-white prose-a:text-blue-400 prose-code:text-blue-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
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
