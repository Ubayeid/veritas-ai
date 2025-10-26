import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface ExplainableAnalysis {
  reasoningChain: string[];
  evidenceWeight: { [key: string]: number };
  confidenceFactors: string[];
  alternativeInterpretations: string[];
  decisionPath: string;
  uncertaintyAreas: string[];
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { legalQuery, analysisType } = await req.json();
    if (!legalQuery) return NextResponse.json({ error: 'Legal query required' }, { status: 400 });

    const openai = createOpenAI();

    const prompt = `You are an expert in explainable AI for legal applications. Provide a transparent, step-by-step explanation of your legal analysis:

LEGAL QUERY: "${legalQuery}"
ANALYSIS TYPE: "${analysisType || 'comprehensive'}"

Provide a completely transparent analysis including:

1. REASONING CHAIN:
   - Step-by-step logical progression
   - Each decision point and rationale
   - How conclusions were reached
   - Logical connections between points

2. EVIDENCE WEIGHTING:
   - Weight assigned to each piece of evidence
   - Why certain evidence is more important
   - How evidence supports conclusions
   - Confidence levels for each piece of evidence

3. CONFIDENCE FACTORS:
   - What makes you confident in this analysis
   - Strongest supporting arguments
   - Most reliable evidence sources
   - Legal precedents that strongly support conclusions

4. ALTERNATIVE INTERPRETATIONS:
   - Other possible interpretations of the law
   - Competing legal theories
   - Alternative case outcomes
   - Different strategic approaches

5. DECISION PATH:
   - Clear path from question to conclusion
   - Key decision points along the way
   - Why certain paths were chosen over others
   - Logical flow of reasoning

6. UNCERTAINTY AREAS:
   - Where the law is unclear or ambiguous
   - Areas requiring further research
   - Potential weaknesses in the analysis
   - Questions that need additional investigation

7. TRANSPARENCY METRICS:
   - Confidence score (0-100)
   - Certainty level in conclusions
   - Areas of highest/lowest confidence
   - Recommendations for additional research

Format your response as a transparent, explainable analysis that legal professionals can fully understand and verify.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 3000,
    });

    const analysis = response.choices[0]?.message?.content || 'No explainable analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      query: legalQuery,
      analysisType: analysisType || 'comprehensive'
    });

  } catch (err) {
    console.error('Explainable AI analysis error:', err);
    return NextResponse.json({ error: 'Explainable analysis failed' }, { status: 500 });
  }
}
