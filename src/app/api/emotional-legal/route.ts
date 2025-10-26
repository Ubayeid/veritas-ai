import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface EmotionalAnalysis {
  emotionalTone: 'cooperative' | 'adversarial' | 'neutral' | 'hostile';
  negotiationLeverage: 'high' | 'medium' | 'low';
  interpersonalDynamics: string[];
  strategicRecommendations: string[];
  riskAssessment: 'high' | 'medium' | 'low';
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { legalScenario, context } = await req.json();
    if (!legalScenario) return NextResponse.json({ error: 'Legal scenario required' }, { status: 400 });

    const openai = createOpenAI();

    const prompt = `You are an expert legal psychologist and negotiation strategist. Analyze the emotional and interpersonal dynamics in this legal scenario:

LEGAL SCENARIO: "${legalScenario}"
CONTEXT: "${context || 'No additional context provided'}"

Provide a comprehensive emotional and interpersonal analysis including:

1. EMOTIONAL TONE ANALYSIS:
   - Assess the emotional tone of the situation (cooperative, adversarial, neutral, hostile)
   - Identify underlying emotional drivers
   - Evaluate emotional intelligence factors

2. INTERPERSONAL DYNAMICS:
   - Power dynamics between parties
   - Communication patterns and styles
   - Trust levels and relationship factors
   - Cultural and social influences

3. NEGOTIATION LEVERAGE:
   - Assess each party's negotiation position
   - Identify leverage points and weaknesses
   - Evaluate BATNA (Best Alternative to Negotiated Agreement) for each side

4. STRATEGIC RECOMMENDATIONS:
   - Emotional regulation strategies
   - Communication techniques
   - Relationship building approaches
   - Conflict resolution methods

5. RISK ASSESSMENT:
   - Emotional escalation risks
   - Relationship damage potential
   - Legal and business consequences
   - Mitigation strategies

Format your response as a structured analysis that a legal professional can use to navigate the interpersonal aspects of this legal matter.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 2000,
    });

    const analysis = response.choices[0]?.message?.content || 'No analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      scenario: legalScenario,
      context: context || null
    });

  } catch (err) {
    console.error('Emotional legal analysis error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
