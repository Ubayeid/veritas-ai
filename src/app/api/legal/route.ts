import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { formatInTextCitation, formatReferenceAPA } from '@/lib/citationFormatter';
import type { Citation } from '@/types/chat';
import * as cheerio from 'cheerio';
import { aiidProcessor } from '@/lib/ai-safety/aiid-processor';
import { initializeAIIDData, isAIIDInitialized } from '@/lib/ai-safety/init-aiid';
export const runtime = 'nodejs';

interface LegalCase {
  readonly caseId: string;
  readonly title: string;
  readonly summary: string | null;
  readonly court: string | null;
  readonly year: number | null;
  readonly citation: string | null;
  readonly url?: string;
  readonly jurisdiction?: string;
  readonly areaOfLaw?: string;
}

interface LegalResponse { readonly data: ReadonlyArray<LegalCase>; }

interface CitationToken {
  readonly key: string;
  readonly citation: Citation;
  readonly inText: string;
  readonly reference: string;
  readonly summary: string;
}

interface QueryAnalysis {
  readonly caseCount: number;
  readonly searchVariations: number;
}

interface ScoredCase { readonly case: LegalCase; readonly score: number; }

const CONFIG = {
  legal: {
    // Court Listener API integration
    baseUrl: 'https://www.courtlistener.com/api/rest/v3',
    rateDelay: 500,
    maxRetries: 3,
  },
  googleScholar: {
    baseUrl: 'https://scholar.google.com/scholar',
    rateDelay: 1000, // Be respectful to Google Scholar
    maxRetries: 2,
  },
  openai: {
    model: 'gpt-4o-mini',
    maxTokens: 8000,
  },
  topCourts: ['U.S. Supreme Court', 'U.S. Court of Appeals', 'U.S. District Court', 'State Supreme Court'],
};

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

let lastRequest = 0;

const waitRateLimit = async (): Promise<void> => {
  const elapsed = Date.now() - lastRequest;
  if (elapsed < CONFIG.legal.rateDelay) {
    await new Promise(r => setTimeout(r, CONFIG.legal.rateDelay - elapsed));
  }
  lastRequest = Date.now();
};


const searchLegalCases = async (query: string, limit: number): Promise<LegalCase[]> => {
  const apiKey = process.env.COURTLISTENER_API_KEY;
  
  console.log('Searching legal cases for query:', query);
  
  // Try Court Listener API first if key is available
  if (apiKey) {
    try {
      await waitRateLimit();
      
      const params = new URLSearchParams({
        q: query.trim(),
        format: 'json',
        order_by: 'score desc',
        stat_Precedential: 'on',
        stat_Errata: 'off',
        stat_Non_Precedential: 'off',
        type: 'o',
      });

      const response = await fetch(`${CONFIG.legal.baseUrl}/search/?${params}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'User-Agent': 'LegalAI-Beta/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const results = data.results || [];
        
        if (results.length > 0) {
          console.log(`Found ${results.length} real cases from Court Listener API`);
          
          const legalCases: LegalCase[] = results.slice(0, limit).map((result: any) => ({
            caseId: result.resource_uri || result.id?.toString() || '',
            title: result.caseName || result.case_name || 'Unknown Case',
            summary: result.snippet || result.absolute_url || null,
            court: result.court || null,
            year: result.date_filed ? new Date(result.date_filed).getFullYear() : null,
            citation: result.citation || null,
            url: result.absolute_url || null,
            jurisdiction: result.court || null,
            areaOfLaw: result.area_of_law || null
          }));
          
          return legalCases;
        }
      }
    } catch (error) {
      console.warn('Court Listener API failed:', error);
    }
  }
  
  // No fallback to mock data - return empty if no API key
  console.log('No Court Listener API key available - returning empty results');
  return [];
};

const searchGoogleScholarLegal = async (query: string, limit: number): Promise<LegalCase[]> => {
  console.log('Searching Google Scholar Legal for query:', query);
  
  try {
    await waitRateLimit();
    
    // Construct Google Scholar Legal search URL
    const searchParams = new URLSearchParams({
      q: `${query} legal case law`,
      hl: 'en',
      as_sdt: '0,5', // Legal documents and patents
      as_ylo: '2020', // Recent years
      as_yhi: new Date().getFullYear().toString(),
    });
    
    const searchUrl = `${CONFIG.googleScholar.baseUrl}?${searchParams}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      const legalCases: LegalCase[] = [];
      
      // Parse Google Scholar results using Cheerio
      $('.gs_rt').each((index, element) => {
        if (legalCases.length >= limit) return false;
        
        const $element = $(element);
        const $link = $element.find('a').first();
        const title = $link.text().trim();
        const href = $link.attr('href');
        
        if (title && href) {
          // Get snippet from the next sibling with class gs_rs
          const $snippet = $element.next('.gs_rs');
          const summary = $snippet.text().trim() || null;
          
          // Get citation info from the next sibling with class gs_a
          const $citation = $element.nextAll('.gs_a').first();
          const citationText = $citation.text().trim();
          
          // Extract year from citation
          const yearMatch = citationText.match(/(\d{4})/);
          const year = yearMatch ? parseInt(yearMatch[1]) : null;
          
          // Extract court from citation
          const courtMatch = citationText.match(/(Supreme Court|Court of Appeals|District Court|Circuit Court|Federal Court|State Court)/i);
          const court = courtMatch ? courtMatch[1] : 'Legal Document';
          
          // Determine if it's a legal case or academic paper
          const isLegalCase = /case|court|decision|ruling|judgment/i.test(title) || 
                             /case|court|decision|ruling|judgment/i.test(citationText);
          
          if (isLegalCase || title.toLowerCase().includes('legal')) {
            legalCases.push({
              caseId: `gs_${Date.now()}_${index}`,
              title: title,
              summary: summary,
              court: court,
              year: year,
              citation: citationText || null,
              url: href.startsWith('http') ? href : `https://scholar.google.com${href}`,
              jurisdiction: 'Academic/Legal',
              areaOfLaw: 'Legal Research'
            });
          }
        }
      });
      
      if (legalCases.length > 0) {
        console.log(`Found ${legalCases.length} legal documents from Google Scholar Legal`);
        return legalCases;
      }
    }
  } catch (error) {
    console.warn('Google Scholar Legal search failed:', error);
  }
  
  // No fallback to mock data - return empty if Google Scholar fails
  console.log('Google Scholar Legal search failed - returning empty results');
  return [];
};


// Helper functions for Unique AI Legal Capabilities
const analyzeEmotionalIntelligence = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Analyze the emotional and interpersonal dynamics in this legal research query and the related cases:

QUERY: "${query}"
RELATED CASES: ${cases.slice(0, 3).map(c => `- ${c.title}: ${c.summary}`).join('\n')}

Provide a brief emotional intelligence analysis focusing on:
1. Emotional tone of the legal situation
2. Interpersonal dynamics that may affect outcomes
3. Strategic recommendations for handling emotional aspects

Format as: "Our emotional intelligence analysis reveals [insight]. This unique capability helps [benefit] by [explanation]."

Keep it concise (2-3 sentences) and highlight the unique AI capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Emotional intelligence analysis failed:', error);
    return '';
  }
};

const detectBias = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Analyze this legal research for potential biases:

QUERY: "${query}"
CASE SUMMARIES: ${cases.slice(0, 3).map(c => c.summary).join(' ')}

Identify any potential biases in:
1. Gender, racial, or socioeconomic bias
2. Geographic or temporal bias
3. Confirmation bias in case selection

Format as: "Our advanced bias detection system identified [bias type]. This unique AI capability ensures [benefit] by [explanation]."

Provide a brief bias assessment (1-2 sentences) highlighting the unique capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 150,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Bias detection failed:', error);
    return '';
  }
};

const generatePredictiveAnalysis = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Provide predictive legal analysis for this query:

QUERY: "${query}"
CASE TRENDS: ${cases.slice(0, 5).map(c => `${c.title} (${c.year})`).join(', ')}

Analyze:
1. Likely legal trends and outcomes
2. Risk factors and probabilities
3. Strategic recommendations based on patterns

Format as: "Our predictive analytics engine forecasts [prediction]. This advanced capability provides [benefit] by [explanation]."

Keep it concise (2-3 sentences) and highlight the unique predictive capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Predictive analysis failed:', error);
    return '';
  }
};

const provideTransparentReasoning = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Explain the reasoning behind this legal research analysis:

QUERY: "${query}"
SELECTED CASES: ${cases.slice(0, 3).map(c => c.title).join(', ')}

Provide transparent reasoning for:
1. Why these specific cases were selected
2. How they relate to the query
3. The logical connections and legal principles

Format as: "Our transparent AI reasoning shows [explanation]. This unique explainable AI capability provides [benefit] by [explanation]."

Keep it concise (2-3 sentences) and highlight the transparent AI capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Transparent reasoning failed:', error);
    return '';
  }
};

const analyzeMultiDocument = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Perform multi-document cross-analysis for this legal research:

QUERY: "${query}"
DOCUMENTS: ${cases.map(c => `${c.title}: ${c.summary}`).join('\n')}

Analyze:
1. Cross-document patterns and relationships
2. Contradictions or conflicts between sources
3. Comprehensive synthesis of findings

Format as: "Our multi-document analysis reveals [pattern]. This unique cross-referencing capability provides [benefit] by [explanation]."

Keep it concise (2-3 sentences) and highlight the multi-document capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Multi-document analysis failed:', error);
    return '';
  }
};

const applyAdaptiveLearning = async (query: string, cases: LegalCase[]): Promise<string> => {
  try {
    const openai = createOpenAI();
    const prompt = `Apply adaptive learning to this novel legal scenario:

LEGAL SCENARIO: "${query}"
EXISTING PATTERNS: ${cases.slice(0, 3).map(c => c.title).join(', ')}
CONTEXT: ${cases.slice(0, 2).map(c => c.summary).join(' ')}

Analyze:
1. Novel aspects of this legal situation
2. How existing patterns apply or don't apply
3. Adaptive strategies for unprecedented scenarios

Format as: "Our adaptive learning system identified [novel aspect]. This unique capability handles [benefit] by [explanation]."

Keep it concise (2-3 sentences) and highlight the adaptive learning capability.`;

    const response = await openai.chat.completions.create({
      model: CONFIG.openai.model,
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 200,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.warn('Adaptive learning failed:', error);
    return '';
  }
};

const analyzeQuery = (q: string): QueryAnalysis => {
  const words = q.trim().split(/\s+/).length;
  const hasRecent = /\b(recent|latest|new|current|2024|2025)\b/i.test(q);
  const hasCompare = /\b(compar|versus|vs|difference|better)\b/i.test(q);
  const hasComprehensive = /\b(comprehensive|detailed|thorough|deep dive)\b/i.test(q);
  
  let caseCount = 15;
  if (hasRecent) caseCount = 20;
  if (hasCompare) caseCount = 25;
  if (hasComprehensive) caseCount = 30;
  if (words <= 3) caseCount = 10;
  
  let searchVariations = 1;
  if (hasRecent || hasCompare) searchVariations = 2;
  if (hasComprehensive) searchVariations = 3;
  
  return { caseCount, searchVariations };
};

const buildSearchQueries = (q: string, variations: number): string[] => {
  const queries = [q];
  if (variations >= 2) queries.push(`${q} case law`);
  if (variations >= 3) queries.push(`${q} precedent`);
  return queries;
};

const multiSearch = async (q: string, analysis: QueryAnalysis): Promise<LegalCase[]> => {
  const queries = buildSearchQueries(q, analysis.searchVariations);
  const limitPerQuery = Math.ceil(analysis.caseCount / queries.length);
  
  // Search both Court Listener and Google Scholar Legal in parallel
  const courtListenerResults = await Promise.all(queries.map(query => searchLegalCases(query, limitPerQuery)));
  const googleScholarResults = await searchGoogleScholarLegal(q, Math.min(10, analysis.caseCount));
  
  // Combine results from both sources
  const allResults = [...courtListenerResults.flat(), ...googleScholarResults];
  
  console.log(`Combined results: ${courtListenerResults.flat().length} from Court Listener, ${googleScholarResults.length} from Google Scholar Legal`);
  
  return allResults;
};

const dedupe = (cases: LegalCase[]): LegalCase[] => {
  const seen = new Set<string>();
  return cases.filter(c => {
    if (seen.has(c.caseId)) return false;
    seen.add(c.caseId);
    return true;
  });
};

const scoreCourt = (court: string | null): number => {
  if (!court) return 0.3;
  return CONFIG.topCourts.some(tc => court.includes(tc)) ? 1.0 : 0.5;
};

const scoreCase = (c: LegalCase): number => {
  const year = c.year || 1900;
  const age = new Date().getFullYear() - year;
  const recScore = Math.exp(-age / 20); // Legal cases age more slowly
  const courtScore = scoreCourt(c.court);
  const summaryScore = c.summary?.length || 0 > 100 ? 1.0 : 0.5;
  
  return 0.40 * recScore + 0.35 * courtScore + 0.25 * summaryScore;
};

const selectDiverse = (scored: ScoredCase[], target: number): LegalCase[] => {
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const selected: LegalCase[] = [];
  const courts = new Set<string>();
  const years = new Map<number, number>();
  
  for (const { case: legalCase } of sorted) {
    if (selected.length >= target) break;
    
    const court = legalCase.court || 'Unknown';
    const year = legalCase.year || 0;
    const yCount = years.get(year) || 0;
    
    if (courts.has(court)) {
      if (selected.filter(c => c.court === court).length >= 2) continue;
    }
    
    if (yCount >= 3) continue;
    
    selected.push(legalCase);
    courts.add(court);
    years.set(year, yCount + 1);
  }
  
  return selected;
};

const selectOptimal = (cases: LegalCase[], target: number): LegalCase[] => {
  const unique = dedupe(cases);
  const scored = unique.map(c => ({ case: c, score: scoreCase(c) }));
  return selectDiverse(scored, Math.min(target, 20));
};

const prepareCitations = (cases: LegalCase[]): CitationToken[] =>
  cases.map((c, i) => {
    const cit: Citation = {
      id: c.caseId,
      title: c.title,
      authors: [c.court || 'Unknown Court'],
      year: c.year,
      journal: c.citation,
      url: c.url,
      citationType: 'case',
      court: c.court,
    };

    return {
      key: `C${i + 1}`,
      citation: cit,
      inText: formatInTextCitation(cit),
      reference: formatReferenceAPA(cit),
      summary: c.summary || 'No summary available.',
    };
  });

const deduplicateCitations = (text: string): string => {
  const citationMap = new Map<string, number>();
  let citationCounter = 1;
  
  return text.replace(/\[\[C(\d+)\]\]/g, (match, originalNum) => {
    const key = `C${originalNum}`;
    
    if (!citationMap.has(key)) {
      citationMap.set(key, citationCounter);
      citationCounter++;
    }
    
    const newNum = citationMap.get(key);
    return `[[C${newNum}]]`;
  });
};

const buildPrompt = (q: string, sources: CitationToken[], aiInsights: {
  emotional: string;
  bias: string;
  predictive: string;
  transparent: string;
  multiDoc: string;
  adaptive: string;
}): string => {
  const context = sources.map(s => [
    `[[${s.key}]] ${s.citation.title}`,
    `Court: ${s.citation.authors[0] || 'Unknown'}`,
    `Year: ${s.citation.year ?? 'n.d.'} | Citation: ${s.citation.journal ?? 'Unknown'}`,
    `Summary: ${s.summary}`,
  ].join('\n')).join('\n\n---\n\n');

  const map = sources.map(s => `[[${s.key}]] -> ${s.inText}`).join('\n');

  return `Query: "${q}"

RESPONSE FORMAT:
- Write naturally in complete thoughts (3-5 sentences per idea)
- Use transition words when shifting topics (However, Additionally, In contrast, Moreover, etc.)
- NO markdown symbols (no ##, **, or bullets)
- Plain text with natural conversational flow
- Cite with [[C#]] tokens immediately after claims

CONTENT APPROACH:
- Focus on legal precedents and case law
- Explain legal principles clearly
- Highlight relevant court decisions
- Analyze legal trends and patterns
- Provide strategic legal insights
- Naturally showcase unique AI capabilities when applicable
- Make responses more comprehensive than expected

CITATION RULES:
- Use [[C#]] after claims: "This principle was established [[C1]]."
- Multiple sources: "This is supported by [[C1]][[C3]]."
- Cite frequently to support every major legal claim
- Use each citation number only once per response
- Distribute citations evenly throughout the analysis
- Avoid repeating the same citation number multiple times

WRITING STYLE:
- Professional legal analysis
- Natural topic transitions with transition words
- Each complete idea = 3-5 sentences
- Clear and scannable
- Start directly with content (no preamble)

AVAILABLE LEGAL SOURCES:
${context}

CITATION MAPPING:
${map}

UNIQUE AI INSIGHTS TO INTEGRATE:
${aiInsights.emotional ? `EMOTIONAL INTELLIGENCE: ${aiInsights.emotional}` : ''}
${aiInsights.bias ? `BIAS DETECTION: ${aiInsights.bias}` : ''}
${aiInsights.predictive ? `PREDICTIVE ANALYSIS: ${aiInsights.predictive}` : ''}
${aiInsights.transparent ? `TRANSPARENT REASONING: ${aiInsights.transparent}` : ''}
${aiInsights.multiDoc ? `MULTI-DOCUMENT ANALYSIS: ${aiInsights.multiDoc}` : ''}
${aiInsights.adaptive ? `ADAPTIVE LEARNING: ${aiInsights.adaptive}` : ''}

RESPONSE ENHANCEMENT GUIDELINES:
- When emotional intelligence insights are available, mention how interpersonal dynamics affect legal outcomes
- When bias detection reveals issues, highlight this as a unique capability: "Our AI bias detection reveals..."
- When predictive analysis is available, showcase future trends: "Advanced predictive analytics suggest..."
- When transparent reasoning is provided, explain the "why" behind recommendations
- When multi-document analysis shows patterns, emphasize cross-referencing capabilities
- When adaptive learning applies, mention handling novel scenarios: "For this unprecedented situation..."
- Make responses more impressive by going beyond basic legal research
- Showcase what makes this AI system unique compared to traditional legal research tools

UNIQUE FEATURES INTEGRATION REQUIREMENTS:
- At the beginning of your response, explicitly state which unique AI capabilities are being applied
- Use format: "This analysis leverages [X] unique AI capabilities: [list applicable features]"
- Throughout your response, naturally reference how each capability enhances the analysis
- Explain the specific value each capability provides for this legal scenario
- Use phrases like "Through [capability name], I can..." or "The [capability name] analysis reveals..."
- Make the AI's advanced capabilities transparent and valuable to the user

TRUST & SAFETY INTEGRATION:
- Naturally mention bias detection and mitigation: "Our bias detection system ensures..."
- Reference privacy protection: "All analysis is conducted with privacy protection..."
- Mention AI safety standards: "Following AIID safety standards..."
- Highlight transparency: "Our transparent AI reasoning shows..."
- Address misinformation prevention: "To prevent misinformation, our system..."
- Show security measures: "With built-in security measures..."

Provide comprehensive legal analysis that integrates these AI insights naturally and showcases unique capabilities:`;
};

export async function POST(req: NextRequest) {
  try {
        const { query } = await req.json();
        if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });

        // Initialize AIID data if not already done
        if (!isAIIDInitialized()) {
          await initializeAIIDData();
        }

        // AI Safety Analysis
        const safetyAnalysis = aiidProcessor.analyzeQuerySafety(query);
        if (safetyAnalysis.riskLevel === 'critical') {
          return NextResponse.json({ 
            error: 'Query blocked due to high safety risk',
            details: safetyAnalysis.warnings,
            recommendations: safetyAnalysis.recommendations
          }, { status: 400 });
        }

        const enc = new TextEncoder();
        const stream = new ReadableStream({
          async start(ctrl) {
            try {
              const analysis = analyzeQuery(query);
          
              ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                type: 'status', 
                content: `Searching ${analysis.caseCount} legal cases across ${analysis.searchVariations} queries...` 
              })}\n\n`));

              // Add safety warnings if any risks detected
              if (safetyAnalysis.warnings.length > 0) {
                ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                  type: 'warning', 
                  content: `AI Safety Alert: ${safetyAnalysis.warnings.join('; ')}` 
                })}\n\n`));
              }

          const allCases = await multiSearch(query, analysis);
          
          if (!allCases.length) {
            ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
              type: 'error', 
              content: 'No legal cases found. This may be because:\n• No API keys are configured (Court Listener, Google Scholar)\n• The search query didn\'t match any available data\n• The APIs are temporarily unavailable\n\nTo get real data, add your API keys to .env.local:\n• COURTLISTENER_API_KEY for case law\n• The system will attempt Google Scholar Legal automatically' 
            })}\n\n`));
            ctrl.close();
            return;
          }

          const selected = selectOptimal(allCases, analysis.caseCount);
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
            content: `Analyzing ${selected.length} relevant legal cases with AI capabilities...` 
          })}\n\n`));

          // Generate AI insights using all 6 unique capabilities
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            content: `Applying emotional intelligence, bias detection, and predictive analytics...` 
          })}\n\n`));

          const [emotional, bias, predictive, transparent, multiDoc, adaptive] = await Promise.all([
            analyzeEmotionalIntelligence(query, selected),
            detectBias(query, selected),
            generatePredictiveAnalysis(query, selected),
            provideTransparentReasoning(query, selected),
            analyzeMultiDocument(query, selected),
            applyAdaptiveLearning(query, selected)
          ]);

          const aiInsights = {
            emotional,
            bias,
            predictive,
            transparent,
            multiDoc,
            adaptive
          };

          const openai = createOpenAI();
          const prompt = buildPrompt(query, tokens, aiInsights);

          const res = await openai.chat.completions.create({
            model: CONFIG.openai.model,
            messages: [{ role: 'user', content: prompt }],
            max_completion_tokens: CONFIG.openai.maxTokens,
            stream: true,
          });

              let hasContent = false;
              let fullResponse = '';
              for await (const chunk of res) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                  hasContent = true;
                  fullResponse += content;
                  try {
                    if (ctrl.desiredSize !== null) {
                      ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'text', content })}\n\n`));
                    } else {
                      console.warn('Controller is closed, stopping stream');
                      break;
                    }
                  } catch (error) {
                    console.warn('Stream error, stopping:', error);
                    break;
                  }
                }
              }

              // GOLD STANDARD: Validate complete response against AIID safety standards
              if (hasContent && fullResponse) {
                // Deduplicate citations to prevent repeated references
                const deduplicatedResponse = deduplicateCitations(fullResponse);
                
                const responseValidation = aiidProcessor.analyzeResponseSafety(deduplicatedResponse);
                
                if (!responseValidation.isSafe) {
                  try {
                    if (ctrl.desiredSize !== null) {
                      ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                        type: 'warning', 
                        content: `⚠️ AIID Safety Alert: ${responseValidation.issues.join('; ')}` 
                      })}\n\n`));
                    }
                  } catch (error) {
                    console.warn('Error enqueueing safety warning:', error);
                  }
                }

                if (responseValidation.suggestions.length > 0) {
                  try {
                    if (ctrl.desiredSize !== null) {
                      ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                        type: 'info', 
                        content: `ℹ️ AIID Quality Check: ${responseValidation.suggestions.join('; ')}` 
                      })}\n\n`));
                    }
                  } catch (error) {
                    console.warn('Error enqueueing quality check:', error);
                  }
                }
              }

          if (!hasContent) {
            try {
              if (ctrl.desiredSize !== null) {
                ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                  type: 'text', 
                  content: 'No response generated. Please try rephrasing your legal question.' 
                })}\n\n`));
              }
            } catch (error) {
              console.warn('Stream already closed:', error);
            }
          }

          try {
            if (ctrl.desiredSize !== null) {
              ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`));
            }
          } catch (error) {
            console.warn('Stream error during completion:', error);
          } finally {
            try {
              ctrl.close();
            } catch (error) {
              console.warn('Error closing stream:', error);
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          try {
            if (ctrl.desiredSize !== null) {
              ctrl.enqueue(enc.encode(`data: ${JSON.stringify({ 
                type: 'error', 
                content: err instanceof Error ? err.message : 'An error occurred' 
              })}\n\n`));
            }
          } catch (error) {
            console.warn('Stream already closed during error handling:', error);
          }
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
