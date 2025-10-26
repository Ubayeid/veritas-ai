import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface PredictiveAnalysis {
  outcomeProbability: number; // 0-100
  confidenceLevel: 'low' | 'medium' | 'high';
  keyFactors: string[];
  riskFactors: string[];
  trendAnalysis: string;
  strategicRecommendations: string[];
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { caseDetails, jurisdiction, caseType } = await req.json();
    if (!caseDetails) return NextResponse.json({ error: 'Case details required' }, { status: 400 });

    const openai = createOpenAI();

    const prompt = `You are an expert legal data scientist and predictive analytics specialist. Analyze this legal case for outcome prediction:

CASE DETAILS: "${caseDetails}"
JURISDICTION: "${jurisdiction || 'Not specified'}"
CASE TYPE: "${caseType || 'Not specified'}"

Provide a comprehensive predictive analysis including:

1. OUTCOME PROBABILITY:
   - Calculate probability of success (0-100%)
   - Assess confidence level in prediction
   - Identify key success factors
   - Evaluate risk factors

2. HISTORICAL TREND ANALYSIS:
   - Analyze similar cases in the jurisdiction
   - Identify patterns in case outcomes
   - Assess judicial trends and preferences
   - Evaluate recent legal developments

3. KEY FACTORS ANALYSIS:
   - Legal precedents that favor the case
   - Statutory and regulatory factors
   - Jurisdictional considerations
   - Procedural advantages/disadvantages

4. RISK ASSESSMENT:
   - Potential legal obstacles
   - Procedural risks
   - Evidence challenges
   - Timeline considerations

5. STRATEGIC RECOMMENDATIONS:
   - Case strategy optimization
   - Evidence gathering priorities
   - Settlement considerations
   - Alternative dispute resolution options

6. TREND PREDICTIONS:
   - How this case fits into broader legal trends
   - Potential impact on future similar cases
   - Regulatory or legislative implications
   - Industry-specific considerations

Format your response as a structured predictive analysis that legal professionals can use for strategic case planning and client counseling.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 2500,
    });

    const analysis = response.choices[0]?.message?.content || 'No predictive analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      caseDetails,
      jurisdiction: jurisdiction || null,
      caseType: caseType || null
    });

  } catch (err) {
    console.error('Predictive legal analysis error:', err);
    return NextResponse.json({ error: 'Predictive analysis failed' }, { status: 500 });
  }
}
