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

      <header className="max-w-4xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl grayscale">{doc.frontmatter.icon}</span>
          <h1 className="text-5xl font-bold font-heading tracking-tight">{doc.frontmatter.title}</h1>
        </div>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mb-10">
          {doc.frontmatter.description}
        </p>
        
        <div className="p-8 bg-card border border-border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">SSE PROTOCOL URL</span>
              <Badge variant="outline" className="rounded-none border-primary/50 text-primary text-[9px] h-4">STABLE</Badge>
            </div>
            <code className="text-sm text-primary font-mono font-bold tracking-tight bg-muted p-2 border border-border">
              https://mcppure.shraj.workers.dev{doc.frontmatter.route}
            </code>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-accent border border-border flex items-center justify-center shadow-sm">
               <Info className="w-5 h-5 text-accent-foreground" />
             </div>
             <p className="text-[11px] text-muted-foreground leading-tight max-w-[140px] font-medium">
               Use this URL in your MCP client settings (SSE transport).
             </p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        <Separator />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-slate prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none">
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
        <p className="text-muted-foreground/50 text-[10px]">Open source under MIT License</p>
      </footer>
    </div>
  );
}
