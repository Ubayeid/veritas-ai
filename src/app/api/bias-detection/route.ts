import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
export const runtime = 'nodejs';

interface BiasAnalysis {
  detectedBiases: string[];
  biasTypes: ('gender' | 'racial' | 'socioeconomic' | 'geographic' | 'temporal' | 'confirmation')[];
  severityLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigationStrategies: string[];
  fairnessScore: number; // 0-100
  recommendations: string[];
}

const createOpenAI = (): OpenAI => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  return new OpenAI({ apiKey: key, dangerouslyAllowBrowser: true });
};

export async function POST(req: NextRequest) {
  try {
    const { legalContent, analysisType } = await req.json();
    if (!legalContent) return NextResponse.json({ error: 'Legal content required' }, { status: 400 });

    const openai = createOpenAI();

    const prompt = `You are an expert in AI ethics and legal bias detection. Analyze this legal content for potential biases:

LEGAL CONTENT: "${legalContent}"
ANALYSIS TYPE: "${analysisType || 'comprehensive'}"

Perform a comprehensive bias analysis including:

1. BIAS DETECTION:
   - Identify any gender, racial, socioeconomic, geographic, or temporal biases
   - Look for confirmation bias, anchoring bias, or availability heuristic
   - Assess language patterns that may indicate bias
   - Check for statistical bias in data representation

2. BIAS SEVERITY ASSESSMENT:
   - Rate severity: low, medium, high, or critical
   - Evaluate potential impact on legal outcomes
   - Assess fairness implications
   - Consider ethical implications

3. FAIRNESS SCORING:
   - Provide a fairness score (0-100)
   - Explain scoring rationale
   - Compare against legal standards
   - Assess compliance with anti-discrimination laws

4. MITIGATION STRATEGIES:
   - Specific steps to reduce identified biases
   - Alternative approaches or language
   - Data diversification recommendations
   - Process improvements

5. RECOMMENDATIONS:
   - Immediate actions to take
   - Long-term bias prevention measures
   - Monitoring and review processes
   - Training and awareness suggestions

Format your response as a structured bias analysis report that legal professionals can use to ensure fair and unbiased legal processes.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 2000,
    });

    const analysis = response.choices[0]?.message?.content || 'No bias analysis available';

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString(),
      content: legalContent,
      analysisType: analysisType || 'comprehensive'
    });

  } catch (err) {
    console.error('Bias detection error:', err);
    return NextResponse.json({ error: 'Bias analysis failed' }, { status: 500 });
  }
}
