'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Citation, CitationAttachment } from '@/types/chat';
import { Send } from 'lucide-react';

interface Message {
  readonly type: 'user' | 'assistant';
  readonly content: string;
}

interface Props {
  readonly onCitationsChange: (citations: CitationAttachment[]) => void;
  readonly onChatCreated?: (chatId: string, title: string) => void;
  readonly initialQuery?: string;
}

type StreamEvent =
  | { readonly type: 'status'; readonly content: string }
  | { readonly type: 'text'; readonly content: string }
  | {
      readonly type: 'citation';
      readonly key: string;
      readonly citation: Citation;
      readonly inText: string;
      readonly reference: string;
    }
  | { readonly type: 'complete' }
  | { readonly type: 'error'; readonly content: string };

const EXAMPLES = [
  'Find case law on employment discrimination in tech companies',
  'Analyze recent Supreme Court decisions on First Amendment rights',
  'Research precedents for breach of contract damages',
  'Compare state vs federal jurisdiction in intellectual property disputes'
];

// Smart paragraph grouping - mimics ChatGPT/Claude behavior
const formatWithParagraphs = (text: string): string => {
  // Split into sentences
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z])/);
  
  const paragraphs: string[] = [];
  let currentParagraph: string[] = [];
  
  sentences.forEach((sentence, i) => {
    currentParagraph.push(sentence);
    
    // Detect transition words that indicate new paragraph
    const hasTransition = /^(however|in contrast|additionally|furthermore|moreover|meanwhile|conversely|on the other hand|nevertheless|nonetheless)/i.test(sentence);
    
    // Create paragraph break logic
    const shouldBreak = 
      currentParagraph.length >= 5 || // Force break after 5 sentences
      (currentParagraph.length >= 3 && hasTransition) || // Break on transition if 3+ sentences
      (currentParagraph.length >= 4 && i < sentences.length - 2); // Break after 4 if not near end
    
    if (shouldBreak && i < sentences.length - 1) {
      paragraphs.push(currentParagraph.join(' '));
      currentParagraph = [];
    }
  });
  
  // Add remaining sentences as final paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }
  
  return paragraphs.join('\n\n').trim();
};

export default function ChatInterface({ onCitationsChange, onChatCreated, initialQuery }: Props) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiBuffer, setAiBuffer] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  // Handle initial query
  useEffect(() => {
    if (initialQuery && !messages.length) {
      setQuery(initialQuery);
      // Auto-submit the initial query
      setTimeout(() => {
        const form = document.createElement('form');
        const event = new Event('submit', { bubbles: true, cancelable: true }) as any;
        event.preventDefault = () => {};
        handleSubmit(event);
      }, 100);
    }
  }, [initialQuery, messages.length]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const citRef = useRef<CitationAttachment[]>([]);
  const citMapRef = useRef<Map<string, string>>(new Map());
  const textRef = useRef<HTMLTextAreaElement>(null);

  const scroll = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scroll();
  }, [messages, aiBuffer, scroll]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = `${textRef.current.scrollHeight}px`;
    }
  }, [query]);

  const resetCitations = () => {
    citRef.current = [];
    citMapRef.current = new Map();
    onCitationsChange([]);
  };

  const handleCitationClick = (key: string) => {
    const element = document.getElementById(`citation-${key}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-blue-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-blue-500');
      }, 2000);
    }
  };

  const replaceCitationsWithAPA = (text: string): string => {
    // First format with smart paragraph grouping
    const formatted = formatWithParagraphs(text);
    
    // Then replace citations and convert newlines to HTML
    return formatted
      .replace(/\[\[C(\d+)\]\]/g, (match, num) => {
        const key = `C${num}`;
        const apaText = citMapRef.current.get(key) || match;
        return `<a href="#citation-${key}" class="citation-link" data-citation="${key}" onclick="event.preventDefault(); document.dispatchEvent(new CustomEvent('citation-click', { detail: '${key}' }));">${apaText}</a>`;
      })
      .replace(/\n\n/g, '</p><p>')  // Convert double newlines to paragraph breaks
      .replace(/^/, '<p>')  // Add opening <p> tag
      .replace(/$/, '</p>');  // Add closing </p> tag
  };

  useEffect(() => {
    const handleCitationClickEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      handleCitationClick(customEvent.detail);
    };
    document.addEventListener('citation-click', handleCitationClickEvent);
    return () => document.removeEventListener('citation-click', handleCitationClickEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userQuery = query.trim();
    setQuery('');
    setLoading(true);
    setAiBuffer('');
    setStatus('Initializing...');
    resetCitations();

    // Auto-create chat on first message
    if (!currentChatId && messages.length === 0) {
      try {
        const chatRes = await fetch('/api/chats', {
          method: 'POST',
        });
        if (chatRes.ok) {
          const chatData = await chatRes.json();
          const newChatId = chatData?.chat?.id;
          if (newChatId) {
            setCurrentChatId(newChatId);
            if (onChatCreated) {
              onChatCreated(newChatId, userQuery);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to create chat:', err);
      }
    }

    setMessages(prev => [...prev, { type: 'user', content: userQuery }]);

    try {
      const res = await fetch('/api/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!res.ok) throw new Error('API error');
      if (!res.body) throw new Error('No response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let ai = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const raw of events) {
          const trim = raw.trim();
          if (!trim.startsWith('data: ')) continue;

          const payload = trim.slice(6);
          if (!payload || payload === '[DONE]') continue;

          let data: StreamEvent;
          try {
            data = JSON.parse(payload) as StreamEvent;
          } catch {
            continue;
          }

          switch (data.type) {
            case 'status':
              setStatus(data.content);
              break;
            case 'citation': {
              const exists = citRef.current.some(c => c.key === data.key);
              if (!exists) {
                const attachment: CitationAttachment = {
                  key: data.key,
                  citation: { ...data.citation, authors: [...data.citation.authors] },
                  inText: data.inText,
                  reference: data.reference,
                };
                citRef.current = [...citRef.current, attachment];
                citMapRef.current.set(data.key, data.inText);
                onCitationsChange(citRef.current);
              }
              break;
            }
            case 'text':
              ai += data.content;
              setAiBuffer(ai);
              break;
            case 'error':
              setStatus(null);
              setMessages(prev => [...prev, { type: 'assistant', content: data.content || 'Error' }]);
              return;
            case 'complete':
              if (ai) setMessages(prev => [...prev, { type: 'assistant', content: ai }]);
              setAiBuffer('');
              setStatus(null);
              return;
          }
        }
      }

      if (ai) {
        setMessages(prev => [...prev, { type: 'assistant', content: ai }]);
        setAiBuffer('');
      }
      setStatus(null);
    } catch (err) {
      console.error('Error:', err);
      setStatus(null);
      setMessages(prev => [...prev, { type: 'assistant', content: 'Error processing request' }]);
    } finally {
      setLoading(false);
      setAiBuffer('');
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-900">

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-1">
          {messages.length === 0 && !loading ? (
            <div className="text-center">
              <div className="mx-auto mb-1 flex h-8 w-12 items-center justify-center">
                <Link href="/">
                  <Image src="/logo-1.png" alt="VeritasAI" width={1012} height={1012} className="rounded-full cursor-pointer hover:opacity-80 transition-opacity" />
                </Link>
              </div>
              <h2 className="mb-1 text-xl font-bold text-white">Legal Research Assistant</h2>
              <p className="mb-2 text-gray-400 text-sm">Find case law, analyze precedents, and generate legal insights</p>
              
              {/* Trust & Transparency Notice - Compact */}
              <div className="mb-2 p-2 bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <p className="font-medium text-white text-xs">AI Safety & Trust Features</p>
                  </div>
                  <p className="text-gray-300 text-xs mb-1">
                    Built with bias detection, privacy protection, and transparency.
                  </p>
                  <Link 
                    href="/trust-safety" 
                    className="text-blue-400 hover:text-blue-300 text-xs font-medium underline"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {EXAMPLES.map((q, index) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="group rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-left text-sm text-gray-300 hover:border-blue-500/50 hover:bg-gray-800/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 backdrop-blur-sm hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="group-hover:text-white transition-colors duration-300">{q}</span>
                  </button>
                ))}
              </div>
              
              {/* Legal Research Tools - Minimized */}
              <div className="mt-1 pt-1 border-t border-gray-700">
                <div className="flex flex-wrap gap-1 justify-center">
                  <button
                    onClick={() => setQuery('Find recent Supreme Court decisions on [topic]')}
                    className="group px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-full hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                    title="Supreme Court - Recent decisions"
                  >
                    <span className="group-hover:font-semibold transition-all duration-300">SC</span>
                  </button>
                  <button
                    onClick={() => setQuery('Analyze case law precedents for [legal issue]')}
                    className="group px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-full hover:bg-purple-600 hover:text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                    title="Case Law - Precedent analysis"
                  >
                    <span className="group-hover:font-semibold transition-all duration-300">CL</span>
                  </button>
                  <button
                    onClick={() => setQuery('Compare federal vs state law on [issue]')}
                    className="group px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-full hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
                    title="Federal vs State - Jurisdiction analysis"
                  >
                    <span className="group-hover:font-semibold transition-all duration-300">F/S</span>
                  </button>
                  <button
                    onClick={() => setQuery('Generate legal brief on [topic] with citations')}
                    className="group px-3 py-1 text-sm bg-gray-800/50 text-gray-300 rounded-full hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
                    title="Legal Brief - With citations"
                  >
                    <span className="group-hover:font-semibold transition-all duration-300">LB</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => {
                if (msg.type === 'user') {
                  const aiResponse = messages[i + 1];
                  return (
                    <div key={i} className="space-y-4">
                      <h2 className="text-2xl font-bold text-white">{msg.content}</h2>
                      {aiResponse && aiResponse.type === 'assistant' && (
                        <div 
                          className="prose prose-p:my-4 max-w-none" 
                          dangerouslySetInnerHTML={{ 
                            __html: replaceCitationsWithAPA(aiResponse.content)
                          }} 
                        />
                      )}
                    </div>
                  );
                }
                return null;
              }).filter(Boolean)}

              {aiBuffer && (
                <div className="space-y-4">
                  <div 
                    className="prose prose-p:my-3 max-w-none" 
                    dangerouslySetInnerHTML={{ 
                      __html: replaceCitationsWithAPA(aiBuffer)
                    }} 
                  />
                  <span className="ml-1 inline-block h-4 w-2 animate-pulse rounded bg-gray-400" />
                </div>
              )}

              {status && (
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-blue-500" />
                  <span className="font-medium">Legal Research:</span>
                  <span>{status}</span>
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl p-2">
          <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-3 rounded-2xl border border-gray-600 bg-gray-800/50 p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <textarea
                ref={textRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask about case law, legal precedents, or legal analysis..."
                disabled={loading}
                className="flex-1 resize-none bg-transparent py-2 pl-2 outline-none text-white placeholder-gray-400"
                rows={1}
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-600 transition-all"
              >
                {loading ? (
                  <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </form>
          
          {/* Trust & Safety Footer */}
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Bias Detection Active</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Privacy Protected</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>AIID Compliant</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}