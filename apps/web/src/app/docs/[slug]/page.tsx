import React from 'react';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDoc, getAllDocs } from '@/lib/general-docs';
import Link from 'next/link';
import { CodeBlock } from '@/components/code-block';
import { ChevronLeft, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <nav className="max-w-3xl mx-auto px-6 py-10 flex justify-between items-center">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-none">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Hub
          </Link>
        </Button>
        <div className="flex items-center gap-4">
          <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.mcppure&color=000000" alt="Visitors" className="h-6 grayscale contrast-125" />
          <a href="https://github.com/shaswatraj/mcppure" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 mb-16">
        <Separator />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none">
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
                <code className="bg-muted px-1.5 py-0.5 rounded-none font-bold text-primary" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </main>

      <footer className="py-24 border-t border-border text-center">
        <p className="text-muted-foreground text-xs tracking-[0.3em] font-bold uppercase mb-4">Pure Protocol • Shade Solutions</p>
      </footer>
    </div>
  );
}
