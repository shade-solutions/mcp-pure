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
    <div className="relative group rounded-xl overflow-hidden border border-white/10 my-6 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{language}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 text-slate-400 hover:text-white hover:bg-white/10"
          onClick={onCopy}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
