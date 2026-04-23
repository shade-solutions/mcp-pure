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
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <nav className="max-w-4xl mx-auto px-6 py-10 flex justify-between items-center">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground rounded-none uppercase font-bold text-xs tracking-widest">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Hub
          </Link>
        </Button>
        <div className="flex items-center gap-6">
          <img src="https://visitor-badge.laobi.icu/badge?page_id=shaswatraj.mcppure&color=000000" alt="Visitors" className="h-6 grayscale contrast-125 dark:invert" />
          <ModeToggle />
          <a href="https://github.com/shaswatraj/mcppure" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </nav>

      <header className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-6xl grayscale">{doc.frontmatter.icon}</span>
          <h1 className="text-6xl font-bold font-heading tracking-tighter uppercase italic">{doc.frontmatter.title}</h1>
        </div>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mb-12 font-medium italic">
          {doc.frontmatter.description}
        </p>
        
        <div className="p-8 bg-card border border-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">SSE PROTOCOL URL</span>
              <Badge variant="outline" className="rounded-none border-primary/50 text-primary text-[9px] h-4 font-bold uppercase tracking-widest">Stable</Badge>
            </div>
            <code className="text-sm text-primary font-mono font-bold tracking-tight bg-muted p-3 border border-border shadow-inner">
              https://mcppure.shraj.workers.dev{doc.frontmatter.route}
            </code>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-accent border border-border flex items-center justify-center shadow-sm">
               <Info className="w-6 h-6 text-accent-foreground" />
             </div>
             <p className="text-[11px] text-muted-foreground leading-snug max-w-[160px] font-bold uppercase tracking-tight">
               Use this URL in your MCP client settings (SSE transport).
             </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        <Separator className="bg-border" />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-muted-foreground prose-p:font-medium prose-strong:text-foreground prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded-none prose-code:font-bold">
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
        <p className="text-[10px] opacity-50 italic">Managed by Shade Solutions</p>
      </footer>
    </div>
  );
}
