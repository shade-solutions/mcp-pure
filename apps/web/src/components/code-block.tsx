'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CodeBlock({ language, children }: { language: string, children: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-none overflow-hidden border border-hairline my-8 bg-surface-card shadow-none">
      <div className="flex items-center justify-between px-4 py-2 bg-canvas border-b border-hairline">
        <div className="flex items-center gap-3">
          <div className="m-stripe w-8 h-[2px]" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{language}</span>
        </div>
        <button 
          className="text-muted hover:text-on-dark transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          onClick={onCopy}
        >
          {copied ? (
            <>COPIED <Check className="w-3 h-3" /></>
          ) : (
            <>COPY <Copy className="w-3 h-3" /></>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '2rem',
          fontSize: '13px',
          backgroundColor: 'transparent',
          lineHeight: '1.6',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
