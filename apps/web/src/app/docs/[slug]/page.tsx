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
import { ModeToggle } from '@/components/mode-toggle';

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
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-none uppercase font-bold text-xs tracking-widest">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Hub
          </Link>
        </Button>
        <div className="flex items-center gap-6">
          <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.mcppure&color=000000" alt="Visitors" className="h-6 grayscale contrast-125 dark:invert" />
          <ModeToggle />
          <a href="https://github.com/shade-solutions/mcp-pure" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 mb-16">
        <Separator className="bg-border" />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 prose prose-slate prose-lg dark:prose-invert prose-headings:font-heading prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-muted-foreground prose-p:font-medium prose-strong:text-foreground prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-code:font-bold">
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
                <code className="font-bold text-primary bg-muted px-1" {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {doc.content}
        </ReactMarkdown>
      </main>

      <footer className="py-24 border-t border-border text-center font-bold uppercase tracking-[0.4em] text-muted-foreground">
        <p className="text-xs mb-4 text-primary">Pure Protocol Hub</p>
      </footer>
    </div>
  );
}
