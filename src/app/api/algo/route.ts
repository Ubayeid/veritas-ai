import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatInTextCitation, formatReferenceAPA } from '@/lib/citationFormatter';
import type { Citation } from '@/types/chat';
export const runtime = 'nodejs';

interface Author { readonly name: string; }

interface Paper {
  readonly paperId: string;
  readonly title: string;
  readonly abstract: string | null;
  readonly authors: ReadonlyArray<Author>;
  readonly year: number | null;
  readonly citationCount: number;
  readonly venue: string | null;
  readonly url?: string;
  readonly tldr?: { readonly text: string } | null;
}

interface SemanticResponse { readonly data: ReadonlyArray<Paper>; }

interface CitationToken {
  readonly key: string;
  readonly citation: Citation;
  readonly inText: string;
  readonly reference: string;
  readonly summary: string;
}

interface QueryAnalysis {
  readonly paperCount: number;
  readonly searchVariations: number;
}

interface ScoredPaper { readonly paper: Paper; readonly score: number; }

const CONFIG = {
  semantic: {
    baseUrl: 'https://api.semanticscholar.org/graph/v1',
    rateDelay: 1100,
    maxRetries: 3,
  },
  openai: {
    model: 'gpt-4o-mini',
    maxTokens: 8000,
  },
  topVenues: ['NeurIPS', 'ICML', 'ICLR', 'ACL', 'EMNLP', 'CVPR', 'ICCV', 'Nature', 'Science', 'Cell', 'PNAS', 'JMLR'],
};

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

let lastRequest = 0;

const waitRateLimit = async (): Promise<void> => {
  const elapsed = Date.now() - lastRequest;
  if (elapsed < CONFIG.semantic.rateDelay) {
    await new Promise(r => setTimeout(r, CONFIG.semantic.rateDelay - elapsed));
  }
  lastRequest = Date.now();
};

const searchPapers = async (query: string, limit: number): Promise<Paper[]> => {
  const key = process.env.SEMANTIC_SCHOLAR_API_KEY;
  if (!key) throw new Error('SEMANTIC_SCHOLAR_API_KEY missing');

  await waitRateLimit();
  
  const params = new URLSearchParams({
    query: query.trim(),
    limit: String(limit),
    fields: 'paperId,title,abstract,authors,year,citationCount,venue,url,tldr',
  });

  for (let i = 0; i < CONFIG.semantic.maxRetries; i++) {
    try {
      const res = await fetch(`${CONFIG.semantic.baseUrl}/paper/search?${params}`, {
        headers: { 'x-api-key': key },
      });

      if (res.ok) {
        const data: SemanticResponse = await res.json();
        return [...(data.data || [])];
      }

      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }

      throw new Error(`API error: ${res.status}`);
    } catch (err) {
      if (i === CONFIG.semantic.maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  
  return [];
};

const analyzeQuery = (q: string): QueryAnalysis => {
  const words = q.trim().split(/\s+/).length;
  const hasLatest = /\b(latest|recent|new|current|2024|2025)\b/i.test(q);
  const hasCompare = /\b(compar|versus|vs|difference|better)\b/i.test(q);
  const hasDeep = /\b(comprehensive|detailed|thorough|deep dive)\b/i.test(q);
  
  let paperCount = 20;
  if (hasLatest) paperCount = 30;
  if (hasCompare) paperCount = 35;
  if (hasDeep) paperCount = 40;
  if (words <= 3) paperCount = 15;
  
  let searchVariations = 1;
  if (hasLatest || hasCompare) searchVariations = 2;
  if (hasDeep) searchVariations = 3;
  
  return { paperCount, searchVariations };
};

const buildSearchQueries = (q: string, variations: number): string[] => {
  const queries = [q];
  if (variations >= 2) queries.push(`${q} methods`);
  if (variations >= 3) queries.push(`${q} applications`);
  return queries;
};

const multiSearch = async (q: string, analysis: QueryAnalysis): Promise<Paper[]> => {
  const queries = buildSearchQueries(q, analysis.searchVariations);
  const limitPerQuery = Math.ceil(analysis.paperCount / queries.length);
  const results = await Promise.all(queries.map(query => searchPapers(query, limitPerQuery)));
  return results.flat();
};

const dedupe = (papers: Paper[]): Paper[] => {
  const seen = new Set<string>();
  return papers.filter(p => {
    if (seen.has(p.paperId)) return false;
    seen.add(p.paperId);
    return true;
  });
};

const scoreVenue = (v: string | null): number => {
  if (!v) return 0.3;
  return CONFIG.topVenues.some(tv => v.toUpperCase().includes(tv)) ? 1.0 : 0.5;
};

const scorePaper = (p: Paper): number => {
  const citScore = Math.log10((p.citationCount || 1) + 1) / 4;
  const age = new Date().getFullYear() - (p.year || 2000);
  const recScore = Math.exp(-age / 5);
  const venScore = scoreVenue(p.venue);
  const absScore = p.tldr ? 1.0 : (p.abstract?.length || 0) > 200 ? 0.7 : 0.3;
  
  return 0.30 * citScore + 0.25 * recScore + 0.25 * venScore + 0.20 * absScore;
};

const selectDiverse = (scored: ScoredPaper[], target: number): Paper[] => {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const selected: Paper[] = [];
  const authors = new Set<string>();
  const years = new Map<number, number>();
  
  for (const { paper } of sorted) {
    if (selected.length >= target) break;
    
    const author = paper.authors[0]?.name;
    const year = paper.year || 0;
    const yCount = years.get(year) || 0;
    
    if (author && authors.has(author)) {
      if (selected.filter(p => p.authors[0]?.name === author).length >= 2) continue;
    }
    
    if (yCount >= 5) continue;
    
    selected.push(paper);
    if (author) authors.add(author);
    years.set(year, yCount + 1);
  }
  
  return selected;
};

const selectOptimal = (papers: Paper[], target: number): Paper[] => {
  const unique = dedupe(papers);
  const scored = unique.map(p => ({ paper: p, score: scorePaper(p) }));
  return selectDiverse(scored, Math.min(target, 25));
};

const prepareCitations = (papers: Paper[]): CitationToken[] =>
  papers.map((p, i) => {
    const cit: Citation = {
      id: p.paperId,
      title: p.title,
      authors: p.authors.map(a => a.name),
      year: p.year,
      journal: p.venue,
      url: p.url,
    };

    return {
      key: `C${i + 1}`,
      citation: cit,
      inText: formatInTextCitation(cit),
      reference: formatReferenceAPA(cit),
      summary: p.tldr?.text ?? p.abstract?.slice(0, 400) ?? 'No abstract available.',
    };
  });

const buildPrompt = (q: string, sources: CitationToken[]): string => {
  const context = sources.map(s => [
    `[[${s.key}]] ${s.citation.title}`,
    `Authors: ${s.citation.authors.join(', ')}`,
    `Year: ${s.citation.year ?? 'n.d.'} | Venue: ${s.citation.journal ?? 'Unknown'}`,
    `Summary: ${s.summary}`,
  ].join('\n')).join('\n\n---\n\n');

  const map = sources.map(s => `[[${s.key}]] -> ${s.inText}`).join('\n');

  return `Research Query: "${q}"

RESPONSE FORMAT:
- Write naturally in complete thoughts (3-5 sentences per idea)
- Use transition words when shifting topics (However, Additionally, In contrast, Moreover, etc.)
- NO markdown symbols (no ##, **, or bullets)
- Plain text with natural conversational flow
- Cite with [[C#]] tokens immediately after claims

CONTENT APPROACH:
- Adapt structure to the question type
- Simple questions → 2-3 main ideas
- Comparisons → Clear contrasts between approaches
- Latest work → Focus on recent papers (2024-2025)
- Technical depth → Explain mechanisms clearly
- Analysis → Multiple themed ideas with smooth transitions

CITATION RULES:
- Use [[C#]] after claims: "This improves performance [[C1]]."
- Multiple sources: "This is established [[C1]][[C3]]."
- Cite frequently to support every major claim

WRITING STYLE:
- Conversational but professional
- Natural topic transitions with transition words
- Each complete idea = 3-5 sentences
- Clear and scannable
- Start directly with content (no preamble)

AVAILABLE SOURCES:
${context}

CITATION MAPPING:
${map}

Answer naturally:`;
};

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });

    const enc = new TextEncoder();
    const stream = new ReadableStream({
      async start(ctrl) {
        try {
          const analysis = analyzeQuery(query);
          
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            content: `Searching ${analysis.paperCount} papers across ${analysis.searchVariations} queries...` 
          })}\n\n`));

          const allPapers = await multiSearch(query, analysis);
          
          if (!allPapers.length) {
            ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              content: 'No papers found. Try rephrasing with different keywords.' 
            })}\n\n`));
            ctrl.close();
            return;
          }

          const selected = selectOptimal(allPapers, analysis.paperCount);
          const tokens = prepareCitations(selected);

          tokens.forEach((t, i) => {
            ctrl.enqueue(enc.encode(`data: ${JSON.stringify({
              type: 'citation',
              key: t.key,
              citation: t.citation,
              inText: t.inText,
              reference: t.reference,
              index: i + 1,
            })}\n\n`));
          });

          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            content: `Analyzing ${selected.length} high-quality papers...` 
          })}\n\n`));

          const openai = createOpenAI();
          const prompt = buildPrompt(query, tokens);

          const res = await openai.chat.completions.create({
            model: CONFIG.openai.model,
            messages: [{ role: 'user', content: prompt }],
            max_completion_tokens: CONFIG.openai.maxTokens,
            stream: true,
          });

          let hasContent = false;
          for await (const chunk of res) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              hasContent = true;
              ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'text', content })}\n\n`));
            }
          }

          if (!hasContent) {
            ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
              type: 'text', 
              content: 'No response generated. Please try rephrasing your question.' 
            })}\n\n`));
          }

          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
          ctrl.close();
        } catch (err) {
          console.error('Stream error:', err);
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            content: err instanceof Error ? err.message : 'An error occurred' 
          })}\n\n`));
          ctrl.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}